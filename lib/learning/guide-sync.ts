import type { GuideProgressSync } from "@/lib/learning/types";
import { migrateStorageKey, storageKey } from "@/lib/storage-keys";

const STORAGE_KEY = storageKey("guide-progress");

export function readGuideProgressLocal(): GuideProgressSync {
  if (typeof window === "undefined") {
    return { read: {}, practiced: {}, passedByLesson: {} };
  }
  migrateStorageKey([], STORAGE_KEY, ["codequest-guide-progress", "DevLadder-guide-progress"]);
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { read: {}, practiced: {}, passedByLesson: {} };
    const parsed = JSON.parse(raw) as GuideProgressSync;
    return {
      read: parsed?.read ?? {},
      practiced: parsed?.practiced ?? {},
      passedByLesson: parsed?.passedByLesson ?? {},
    };
  } catch {
    return { read: {}, practiced: {}, passedByLesson: {} };
  }
}

export function writeGuideProgressLocal(store: GuideProgressSync) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

/** Merge remote (account) progress with local — union of read/practiced/passed indices. */
export function mergeGuideProgress(local: GuideProgressSync, remote: GuideProgressSync | null): GuideProgressSync {
  if (!remote) return local;
  const read: Record<string, string[]> = { ...remote.read };
  for (const [topicId, slugs] of Object.entries(local.read)) {
    read[topicId] = [...new Set([...(read[topicId] ?? []), ...slugs])];
  }
  const practiced: Record<string, string[]> = { ...remote.practiced };
  for (const [topicId, slugs] of Object.entries(local.practiced)) {
    practiced[topicId] = [...new Set([...(practiced[topicId] ?? []), ...slugs])];
  }
  const passedByLesson: Record<string, number[]> = { ...remote.passedByLesson };
  for (const [key, indices] of Object.entries(local.passedByLesson)) {
    passedByLesson[key] = [...new Set([...(passedByLesson[key] ?? []), ...indices])].sort((a, b) => a - b);
  }
  return { read, practiced, passedByLesson };
}
