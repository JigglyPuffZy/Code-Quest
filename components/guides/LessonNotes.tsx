"use client";

import { getLessonNote, saveLessonNote } from "@/lib/learning/notes";
import { NotebookPen } from "lucide-react";
import { useEffect, useState } from "react";

export function LessonNotes({ topicId, slug }: { topicId: string; slug: string }) {
  const [text, setText] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setText(getLessonNote(topicId, slug));
  }, [topicId, slug]);

  useEffect(() => {
    if (!text && !getLessonNote(topicId, slug)) return;
    const timer = window.setTimeout(() => {
      saveLessonNote(topicId, slug, text);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 1500);
    }, 500);
    return () => window.clearTimeout(timer);
  }, [text, topicId, slug]);

  return (
    <section className="mt-10 rounded-2xl border border-line bg-surface-2/60 p-4 sm:p-5">
      <div className="flex items-center gap-2">
        <NotebookPen size={16} className="text-primary" />
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">Your notes</p>
        {saved ? <span className="text-[10px] font-semibold text-ok">Saved</span> : null}
      </div>
      <p className="mt-2 text-xs text-muted">Write in your own words — e.g. &quot;const = cannot change&quot;</p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        placeholder="My takeaway from this lesson…"
        className="mt-3 w-full resize-y rounded-xl border border-line bg-white px-3 py-2.5 text-sm leading-relaxed outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100"
      />
    </section>
  );
}
