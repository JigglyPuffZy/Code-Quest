import { guidesForTopic } from "@/lib/guides/index";
import type { GuideTopicId } from "@/lib/guides/types";
import { guidePaths } from "@/lib/curriculum/guide-paths";

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

function readStore(): GuideProgressStore {
  if (typeof window === "undefined") return emptyStore();
  migrateStorageKey([], STORAGE_KEY, ["codequest-guide-progress", "DevLadder-guide-progress"]);
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyStore();
    const parsed = JSON.parse(raw) as GuideProgressStore;
    return {
      read: parsed?.read ?? {},
      practiced: parsed?.practiced ?? {},
      passedByLesson: parsed?.passedByLesson ?? {},
    };
  } catch {
    return emptyStore();
  }
}

function writeStore(store: GuideProgressStore) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
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
