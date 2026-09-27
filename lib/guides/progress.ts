import { guidesForTopic } from "@/lib/guides/index";
import type { GuideTopicId } from "@/lib/guides/types";
import { guidePaths } from "@/lib/curriculum/guide-paths";

const STORAGE_KEY = "codequest-guide-progress";

type GuideProgressStore = {
  read: Record<string, string[]>;
};

function readStore(): GuideProgressStore {
  if (typeof window === "undefined") return { read: {} };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { read: {} };
    const parsed = JSON.parse(raw) as GuideProgressStore;
    return parsed?.read ? parsed : { read: {} };
  } catch {
    return { read: {} };
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
