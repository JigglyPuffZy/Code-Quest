"use client";

import { useDevyyyyy } from "@/components/support/DevyyyyyProvider";
import { listPracticeMistakes, removePracticeMistake } from "@/lib/learning/mistakes";
import { BookOpen, HelpCircle, RotateCcw, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ReviewPage() {
  const { openChat } = useDevyyyyy();
  const [mistakes, setMistakes] = useState(listPracticeMistakes());

  useEffect(() => {
    function refresh() {
      setMistakes(listPracticeMistakes());
    }
    window.addEventListener("devladder:mistakes-updated", refresh);
    return () => window.removeEventListener("devladder:mistakes-updated", refresh);
  }, []);

  return (
    <div className="mx-auto max-w-2xl">
      <header className="mb-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">Learning loop</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">Review mistakes</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Your last failed practice questions live here. Retry the lesson or ask devyyyyy to explain what went wrong.
        </p>
      </header>

      {mistakes.length === 0 ? (
        <article className="rounded-2xl border border-dashed border-line bg-surface-2/80 p-8 text-center">
          <p className="font-semibold text-ink">No mistakes saved yet</p>
          <p className="mt-2 text-sm text-muted">Fail a practice test and devyyyyy will coach you — it shows up here automatically.</p>
          <Link href="/guides" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline">
            <BookOpen size={14} />
            Open guides
          </Link>
        </article>
      ) : (
        <ol className="space-y-3">
          {mistakes.map((item) => (
            <li key={item.id} className="rounded-2xl border border-line bg-white p-4 sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-muted">
                    {item.language} · {item.topicId}/{item.slug}
                  </p>
                  <p className="mt-1 font-semibold text-ink">{item.prompt}</p>
                  {item.hint ? <p className="mt-1 text-sm text-muted">{item.hint}</p> : null}
                  <p className="mt-1 text-[10px] text-muted">
                    {new Date(item.failedAt).toLocaleString()}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removePracticeMistake(item.id)}
                  className="rounded-lg p-2 text-muted hover:bg-surface-2 hover:text-danger"
                  aria-label="Remove"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href={`/guides/${item.topicId}/${item.slug}#practice`}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-3.5 py-2 text-sm font-semibold text-white"
                >
                  <RotateCcw size={14} />
                  Retry lesson
                </Link>
                <button
                  type="button"
                  onClick={() =>
                    openChat({
                      message: `Help me understand this mistake: ${item.prompt}. ${item.hint ?? ""} Explain in Taglish.`,
                      autoSend: true,
                      mode: "coach",
                    })
                  }
                  className="inline-flex items-center gap-2 rounded-xl border border-line px-3.5 py-2 text-sm font-semibold"
                >
                  <HelpCircle size={14} />
                  Ask devyyyyy
                </button>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
