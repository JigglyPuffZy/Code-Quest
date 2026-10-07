import type { PracticeMistake } from "@/lib/learning/types";
import { migrateStorageKey, storageKey } from "@/lib/storage-keys";

const STORAGE_KEY = storageKey("practice-mistakes");
const MAX_MISTAKES = 10;

function readAll(): PracticeMistake[] {
  if (typeof window === "undefined") return [];
  migrateStorageKey([], STORAGE_KEY, ["devladder-practice-mistakes"]);
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as PracticeMistake[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(items: PracticeMistake[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, MAX_MISTAKES)));
}

export function recordPracticeMistake(entry: Omit<PracticeMistake, "id" | "failedAt">) {
  const mistake: PracticeMistake = {
    ...entry,
    id: `${entry.exerciseId}-${Date.now()}`,
    failedAt: new Date().toISOString(),
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
  return readAll();
}

export function removePracticeMistake(id: string) {
  writeAll(readAll().filter((item) => item.id !== id));
  window.dispatchEvent(new CustomEvent("devladder:mistakes-updated"));
}

export function clearPracticeMistakes() {
  writeAll([]);
  window.dispatchEvent(new CustomEvent("devladder:mistakes-updated"));
}
