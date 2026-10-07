import { todayKey } from "@/lib/dates";
import { storageKey } from "@/lib/storage-keys";

const STORAGE_KEY = storageKey("practice-log");

type PracticeLogEntry = {
  topicId: string;
  slug: string;
  index: number;
  at: string;
};

function readLog(): PracticeLogEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as PracticeLogEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLog(entries: PracticeLogEntry[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(-200)));
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
  return readLog().filter((entry) => entry.at.slice(0, 10) === dayKey).length;
}
