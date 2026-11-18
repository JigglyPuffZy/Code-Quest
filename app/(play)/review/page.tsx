"use client";

import { useClientReady, useLearningClock } from "@/lib/learning/client";
import { useDevyyyyy } from "@/components/support/DevyyyyyProvider";
import { PageHero } from "@/components/ui/PageHero";
import { listPracticeMistakes, removePracticeMistake, reviewDueTime } from "@/lib/learning/mistakes";
import { BookOpen, CalendarClock, CheckCircle2, HelpCircle, ListChecks, RotateCcw, Sparkles, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ReviewPage() {
  const ready = useClientReady();
  return ready ? <ReviewContent /> : <p className="text-sm text-muted">Loading your reviews...</p>;
}

function ReviewContent() {
  const now = useLearningClock();
  const { openChat } = useDevyyyyy();
  const [mistakes, setMistakes] = useState(listPracticeMistakes);
  const [dueOnly, setDueOnly] = useState(false);

  useEffect(() => {
    function refresh() {
      setMistakes(listPracticeMistakes());
    }
    window.addEventListener("devladder:mistakes-updated", refresh);
    return () => window.removeEventListener("devladder:mistakes-updated", refresh);
  }, []);

  const dueCount = mistakes.filter((item) => reviewDueTime(item) <= now).length;
  const visible = mistakes.filter((item) => !dueOnly || reviewDueTime(item) <= now);
  const mastered = mistakes.reduce((sum, item) => sum + (item.reviewCount ?? 0), 0);

  return (
    <div>
      <PageHero
        icon={RotateCcw}
        eyebrow="Review"
        title="Turn mistakes into"
        accent="things you know."
        description="Questions you miss come back at the right time: after 1, 3, 7, 14, then 30 days. Pass one and it moves further away."
        stats={[
          { label: "due now", value: dueCount, icon: CalendarClock },
          { label: "saved", value: mistakes.length, icon: ListChecks },
          { label: "reviews passed", value: mastered, icon: CheckCircle2 },
        ]}
      />

      {mistakes.length === 0 ? (
        <article className="rv-empty">
          <span className="rv-empty-icon"><Sparkles size={30} aria-hidden /></span>
          <h2>Nothing to review yet</h2>
          <p>When a practice question goes wrong it is saved here automatically, and devyyyyy can explain it to you. Nothing missed means nothing to fix.</p>
          <div className="rv-steps" aria-label="How review works">
            <span>1. Miss a question</span>
            <span>2. It appears here</span>
            <span>3. Retry when it is due</span>
          </div>
          <Link href="/guides" className="workspace-button workspace-button-primary mt-6">
            <BookOpen size={15} />
            Open guides
          </Link>
        </article>
      ) : (
        <>
          <div className="pg-filters" role="group" aria-label="Filter reviews">
            <button type="button" aria-pressed={!dueOnly} className={!dueOnly ? "pg-pill is-active" : "pg-pill"} onClick={() => setDueOnly(false)}>
              All saved <small>{mistakes.length}</small>
            </button>
            <button type="button" aria-pressed={dueOnly} className={dueOnly ? "pg-pill is-active" : "pg-pill"} onClick={() => setDueOnly(true)}>
              Due now <small>{dueCount}</small>
            </button>
          </div>

          {dueOnly && dueCount === 0 ? (
            <article className="rv-empty">
              <span className="rv-empty-icon"><CheckCircle2 size={30} aria-hidden /></span>
              <h2>You are all caught up</h2>
              <p>Nothing is due right now. Come back when your next review is ready.</p>
              <button type="button" className="workspace-button mt-5" onClick={() => setDueOnly(false)}>Show all saved</button>
            </article>
          ) : (
            <ol className="rv-list">
              {visible.map((item) => {
                const due = reviewDueTime(item) <= now;
                return (
                  <li key={item.id} className={due ? "rv-card is-due" : "rv-card"}>
                    <div className="rv-card-head">
                      <div className="min-w-0">
                        <span className="pg-tag">{item.language} · {item.topicId}</span>
                        <p className="rv-prompt">{item.prompt}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removePracticeMistake(item.id)}
                        className="workspace-icon-button shrink-0"
                        aria-label="Remove this review"
                        title="Remove"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    {item.hint ? <p className="rv-hint">{item.hint}</p> : null}
                    <p className={due ? "rv-when is-due" : "rv-when"}>
                      <CalendarClock size={15} aria-hidden />
                      {due ? "Due now" : `Next review ${new Date(reviewDueTime(item)).toLocaleDateString()}`}
                      <span aria-hidden>·</span>
                      {item.reviewCount ?? 0} passed
                    </p>
                    <div className="rv-actions">
                      <Link
                        href={`/guides/${item.topicId}/${item.slug}?question=${item.questionIndex}#practice`}
                        className="workspace-button workspace-button-primary"
                      >
                        <RotateCcw size={15} />
                        Retry question
                      </Link>
                      <button
                        type="button"
                        className="workspace-button"
                        onClick={() =>
                          openChat({
                            message: `Help me understand this mistake: ${item.prompt}. ${item.hint ?? ""} Explain in Taglish.`,
                            autoSend: true,
                            mode: "coach",
                          })
                        }
                      >
                        <HelpCircle size={15} />
                        Ask devyyyyy
                      </button>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </>
      )}
    </div>
  );
}
