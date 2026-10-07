import type { LessonNote } from "@/lib/learning/types";
import { migrateStorageKey, storageKey } from "@/lib/storage-keys";

const STORAGE_KEY = storageKey("lesson-notes");

function noteKey(topicId: string, slug: string) {
  return `${topicId}::${slug}`;
}

function readAll(): Record<string, LessonNote> {
  if (typeof window === "undefined") return {};
  migrateStorageKey([], STORAGE_KEY, ["devladder-lesson-notes"]);
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, LessonNote>;
  } catch {
    return {};
  }
}

function writeAll(store: Record<string, LessonNote>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export function getLessonNote(topicId: string, slug: string) {
  return readAll()[noteKey(topicId, slug)]?.text ?? "";
}

export function saveLessonNote(topicId: string, slug: string, text: string) {
  const store = readAll();
  const key = noteKey(topicId, slug);
  if (!text.trim()) {
    delete store[key];
  } else {
    store[key] = { topicId, slug, text: text.trim(), updatedAt: new Date().toISOString() };
  }
  writeAll(store);
  window.dispatchEvent(new CustomEvent("devladder:notes-updated", { detail: { topicId, slug } }));
}

export function exportLessonNotes(): LessonNote[] {
  return Object.values(readAll());
}

export function importLessonNotes(notes: LessonNote[]) {
  const store = readAll();
  for (const note of notes) {
    store[noteKey(note.topicId, note.slug)] = note;
  }
  writeAll(store);
}
