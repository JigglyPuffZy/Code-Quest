import { guidesForTopic } from "@/lib/guides/index";
import type { GuideTopicId } from "@/lib/guides/types";
import { guidePaths } from "@/lib/curriculum/guide-paths";
import { logGuidePracticePass } from "@/lib/learning/practice-log";
import { recordReviewPass } from "@/lib/learning/mistakes";
import type { GuideProgressSync } from "@/lib/learning/types";

import { migrateStorageKey, storageKey } from "@/lib/storage-keys";

const STORAGE_KEY = storageKey("guide-progress");

type GuideProgressStore = {
  read: Record<string, string[]>;
  practiced: Record<string, string[]>;
  passedByLesson: Record<string, number[]>;
};

function emptyStore(): GuideProgressStore {
  return { read: {}, practiced: {}, passedByLesson: {} };
}

function lessonQuestionKey(topicId: string, slug: string) {
  return `${topicId}::${slug}`;
}

function normalizeMap<T extends string | number>(value: unknown, valid: (item: unknown) => item is T): Record<string, T[]> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(Object.entries(value).filter(([, entries]) => Array.isArray(entries)).map(([key, entries]) => [key, [...new Set((entries as unknown[]).filter(valid))]]));
}

function readStore(): GuideProgressStore {
  if (typeof window === "undefined") return emptyStore();
  try {
    migrateStorageKey([], STORAGE_KEY, ["codequest-guide-progress", "DevLadder-guide-progress"]);
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyStore();
    const parsed = JSON.parse(raw) as GuideProgressStore;
    return {
      read: normalizeMap(parsed?.read, (item): item is string => typeof item === "string"),
      practiced: normalizeMap(parsed?.practiced, (item): item is string => typeof item === "string"),
      passedByLesson: normalizeMap(parsed?.passedByLesson, (item): item is number => typeof item === "number" && Number.isInteger(item) && item >= 0),
    };
  } catch {
    return emptyStore();
  }
}

function writeStore(store: GuideProgressStore) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  window.dispatchEvent(new CustomEvent("devladder:guide-progress-updated"));
}

export function exportGuideProgress(): GuideProgressSync {
  return readStore();
}

export function importGuideProgress(remote: GuideProgressSync) {
  const local = readStore();
  const merged: GuideProgressStore = {
    read: { ...remote.read },
    practiced: { ...remote.practiced },
    passedByLesson: { ...remote.passedByLesson },
  };
  for (const [topicId, slugs] of Object.entries(local.read)) {
    merged.read[topicId] = [...new Set([...(merged.read[topicId] ?? []), ...slugs])];
  }
  for (const [topicId, slugs] of Object.entries(local.practiced)) {
    merged.practiced[topicId] = [...new Set([...(merged.practiced[topicId] ?? []), ...slugs])];
  }
  for (const [key, indices] of Object.entries(local.passedByLesson)) {
    merged.passedByLesson[key] = [...new Set([...(merged.passedByLesson[key] ?? []), ...indices])].sort(
      (a, b) => a - b,
    );
  }
  writeStore(merged);
}

export function markGuideRead(topicId: string, slug: string) {
  const store = readStore();
  const slugs = new Set(store.read[topicId] ?? []);
  if (slugs.has(slug)) return;
  slugs.add(slug);
  store.read[topicId] = [...slugs];
  writeStore(store);
}

export function isGuideRead(topicId: string, slug: string) {
  const store = readStore();
  return (store.read[topicId] ?? []).includes(slug);
}

export function markGuidePracticeComplete(topicId: string, slug: string) {
  const store = readStore();
  const slugs = new Set(store.practiced[topicId] ?? []);
  if (slugs.has(slug)) return false;
  slugs.add(slug);
  store.practiced[topicId] = [...slugs];
  writeStore(store);
  return true;
}

export function isGuidePracticeComplete(topicId: string, slug: string) {
  const store = readStore();
  return (store.practiced[topicId] ?? []).includes(slug);
}

export function passedGuidePracticeIndices(topicId: string, slug: string) {
  const store = readStore();
  return store.passedByLesson[lessonQuestionKey(topicId, slug)] ?? [];
}

export function isGuidePracticeQuestionPassed(topicId: string, slug: string, index: number) {
  return passedGuidePracticeIndices(topicId, slug).includes(index);
}

/** Marks a question passed. Returns true if this is the first time the lesson is completed. */
export function markGuidePracticeQuestionPassed(topicId: string, slug: string, index: number) {
  const store = readStore();
  const key = lessonQuestionKey(topicId, slug);
  const passed = new Set(store.passedByLesson[key] ?? []);
  passed.add(index);
  store.passedByLesson[key] = [...passed].sort((a, b) => a - b);
  writeStore(store);
  logGuidePracticePass(topicId, slug, index);
  recordReviewPass(topicId, slug, index);
  return markGuidePracticeComplete(topicId, slug);
}

export function guidesReadForTopic(topicId: string) {
  return readStore().read[topicId]?.length ?? 0;
}

export function totalGuidesRead() {
  const store = readStore();
  return Object.values(store.read).reduce((sum, slugs) => sum + slugs.length, 0);
}

export function guideTopicProgress(topicId: GuideTopicId) {
  const total = guidesForTopic(topicId).length;
  const done = guidesReadForTopic(topicId);
  return {
    done,
    total,
    ratio: total ? done / total : 0,
  };
}

export function guidePathProgress(topicId: GuideTopicId) {
  const path = guidePaths.find((item) => item.topicId === topicId);
  if (!path) return { done: 0, total: 0, ratio: 0 };
  const total = guidesForTopic(topicId).length;
  const done = guidesReadForTopic(topicId);
  return { done, total, ratio: total ? done / total : 0 };
}

export function totalGuidePathProgress() {
  const totals = guidePaths.map((path) => guidePathProgress(path.topicId));
  const done = totals.reduce((sum, item) => sum + item.done, 0);
  const total = totals.reduce((sum, item) => sum + item.total, 0);
  return { done, total, ratio: total ? done / total : 0 };
}
