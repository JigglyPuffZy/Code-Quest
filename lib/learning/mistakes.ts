import type { PracticeMistake } from "@/lib/learning/types";
import { migrateStorageKey, storageKey } from "@/lib/storage-keys";

const STORAGE_KEY = storageKey("practice-mistakes");
const MAX_MISTAKES = 200;

function readAll(): PracticeMistake[] {
  if (typeof window === "undefined") return [];
  try {
    migrateStorageKey([], STORAGE_KEY, ["devladder-practice-mistakes"]);
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as PracticeMistake[];
    return Array.isArray(parsed) ? parsed.filter((item) => item && typeof item.id === "string" && typeof item.exerciseId === "string" && typeof item.topicId === "string" && typeof item.slug === "string" && Number.isInteger(item.questionIndex)) : [];
  } catch {
    return [];
  }
}

function writeAll(items: PracticeMistake[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, MAX_MISTAKES)));
}

export function recordPracticeMistake(entry: Omit<PracticeMistake, "id" | "failedAt" | "dueAt" | "reviewCount">) {
  const mistake: PracticeMistake = {
    ...entry,
    id: `${entry.exerciseId}-${Date.now()}`,
    failedAt: new Date().toISOString(),
    dueAt: new Date().toISOString(),
    reviewCount: 0,
  };
  const next = [mistake, ...readAll().filter((item) => item.exerciseId !== entry.exerciseId)].slice(
    0,
    MAX_MISTAKES,
  );
  writeAll(next);
  window.dispatchEvent(new CustomEvent("devladder:mistakes-updated"));
  return mistake;
}

export function listPracticeMistakes() {
  return readAll().sort((a, b) => reviewDueTime(a) - reviewDueTime(b));
}

export function reviewDueTime(item: PracticeMistake) {
  const time = Date.parse(item.dueAt ?? item.failedAt);
  return Number.isFinite(time) ? time : 0;
}

/** Only verified practice passes advance the review schedule. */
export function recordReviewPass(topicId: string, slug: string, questionIndex: number) {
  const items = readAll().map((item) => {
    if (item.topicId !== topicId || item.slug !== slug || item.questionIndex !== questionIndex || reviewDueTime(item) > Date.now()) return item;
    const reviewCount = (item.reviewCount ?? 0) + 1;
    const days = [1, 3, 7, 14, 30][Math.min(reviewCount - 1, 4)];
    return { ...item, reviewCount, dueAt: new Date(Date.now() + days * 86400000).toISOString() };
  });
  writeAll(items);
  window.dispatchEvent(new CustomEvent("devladder:mistakes-updated"));
}

export function removePracticeMistake(id: string) {
  writeAll(readAll().filter((item) => item.id !== id));
  window.dispatchEvent(new CustomEvent("devladder:mistakes-updated"));
}

export function clearPracticeMistakes() {
  writeAll([]);
  window.dispatchEvent(new CustomEvent("devladder:mistakes-updated"));
}
