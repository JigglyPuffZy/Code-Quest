import { todayKey } from "@/lib/dates";
import { storageKey } from "@/lib/storage-keys";

const STORAGE_KEY = storageKey("practice-log");

export type PracticeLogEntry = {
  topicId: string;
  slug: string;
  index: number;
  at: string;
};

export function readLog(): PracticeLogEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as PracticeLogEntry[];
    return Array.isArray(parsed) ? parsed.filter((entry) => entry && typeof entry.topicId === "string" && typeof entry.slug === "string" && Number.isInteger(entry.index) && typeof entry.at === "string" && Number.isFinite(Date.parse(entry.at))) : [];
  } catch {
    return [];
  }
}

function writeLog(entries: PracticeLogEntry[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(0, 2000)));
}

export function logGuidePracticePass(topicId: string, slug: string, index: number) {
  const entry: PracticeLogEntry = {
    topicId,
    slug,
    index,
    at: new Date().toISOString(),
  };
  writeLog([entry, ...readLog()]);
  window.dispatchEvent(new CustomEvent("devladder:practice-log-updated"));
}

export function guidePracticePassesToday(dayKey = todayKey()) {
  return readLog().filter((entry) => todayKey(new Date(entry.at)) === dayKey).length;
}
