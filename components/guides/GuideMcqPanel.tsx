"use client";

import { useDevyyyyy } from "@/components/support/DevyyyyyProvider";
import { GUIDE_PRACTICE_XP } from "@/lib/guides/practice";
import {
  guideHasMcqPractice,
  mcqQuestionsForSlug,
  MCQ_PER_LESSON,
  type McqQuestion,
} from "@/lib/guides/practice/mcq";
import {
  isGuidePracticeComplete,
  markGuidePracticeQuestionPassed,
  passedGuidePracticeIndices,
} from "@/lib/guides/progress";
import { CheckCircle2, HelpCircle, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";

function pickMcq(total: number, passed: number[], current: number | null) {
  const unused = Array.from({ length: total }, (_, i) => i).filter(
    (i) => !passed.includes(i) && i !== current,
  );
  if (unused.length) return unused[Math.floor(Math.random() * unused.length)]!;
  const others = Array.from({ length: total }, (_, i) => i).filter((i) => i !== current);
  return others.length ? others[Math.floor(Math.random() * others.length)]! : current ?? 0;
}

export function GuideMcqPanel({ topicId, slug }: { topicId: string; slug: string }) {
  const questions = guideHasMcqPractice(topicId, slug) ? mcqQuestionsForSlug(slug) : null;
  const { openChat } = useDevyyyyy();
  const [index, setIndex] = useState(0);
  const [picked, setSelected] = useState<number | null>(null);
  const [passed, setPassed] = useState<number[]>([]);
  const [cleared, setCleared] = useState(false);
  const [showExplain, setShowExplain] = useState(false);

  useEffect(() => {
    const p = passedGuidePracticeIndices(topicId, slug);
    setPassed(p);
    setCleared(isGuidePracticeComplete(topicId, slug));
    setIndex(pickMcq(MCQ_PER_LESSON, p, null));
    setSelected(null);
    setShowExplain(false);
  }, [topicId, slug]);

  if (!questions?.length) return null;

  const q: McqQuestion = questions[index % questions.length]!;
  const correct = picked !== null && picked === q.correctIndex;
  const passedThis = passed.includes(index);

  function handlePick(optionIndex: number) {
    if (picked !== null) return;
    setSelected(optionIndex);
    setShowExplain(true);
    if (optionIndex === q.correctIndex) {
      const first = markGuidePracticeQuestionPassed(topicId, slug, index);
      setPassed(passedGuidePracticeIndices(topicId, slug));
      if (first) setCleared(true);
    }
  }

  function nextQuestion() {
    setIndex(pickMcq(MCQ_PER_LESSON, passed, index));
    setSelected(null);
    setShowExplain(false);
  }

  return (
    <section className="mt-14 scroll-mt-24" id="practice">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">Quick check</p>
          <h2 className="mt-1 text-xl font-bold tracking-tight">Spot-check this lesson</h2>
          <p className="mt-1 text-sm text-muted">
            Multiple choice — no code editor needed. Question {(index % questions.length) + 1} style ·{" "}
            {passed.length} passed
            {cleared ? (
              <span className="ml-1 inline-flex items-center gap-1 font-medium text-ok">
                <CheckCircle2 size={14} /> Done (+{GUIDE_PRACTICE_XP} XP on first pass)
              </span>
            ) : null}
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            openChat({
              message: `I'm on the ${slug} lesson and I don't fully get this MCQ: "${q.prompt}". Explain it simply in Taglish.`,
              autoSend: true,
              mode: "simplify",
            })
          }
          className="inline-flex items-center gap-2 rounded-xl border border-primary-200 bg-primary-50 px-3.5 py-2 text-sm font-semibold text-primary"
        >
          <HelpCircle size={15} />
          I don&apos;t get this
        </button>
      </div>

      <article className="rounded-2xl border border-line bg-white p-5">
        <p className="text-sm font-semibold leading-relaxed text-ink">{q.prompt}</p>
        <ul className="mt-4 space-y-2">
          {q.options.map((option, optionIndex) => {
            let style = "border-line hover:border-primary-200 hover:bg-primary-50/50";
            if (picked !== null) {
              if (optionIndex === q.correctIndex) style = "border-ok bg-emerald-50 text-ok";
              else if (optionIndex === picked) style = "border-danger bg-rose-50 text-danger";
              else style = "border-line opacity-60";
            }
            return (
              <li key={option}>
                <button
                  type="button"
                  disabled={picked !== null}
                  onClick={() => handlePick(optionIndex)}
                  className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition ${style}`}
                >
                  {option}
                </button>
              </li>
            );
          })}
        </ul>
        {showExplain ? (
          <p className={`mt-4 text-sm leading-relaxed ${correct ? "text-ok" : "text-muted"}`}>
            {correct ? "Correct! " : "Not quite. "}
            {q.explanation}
          </p>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={nextQuestion}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white"
          >
            <RefreshCw size={14} />
            Try another question
          </button>
        </div>
      </article>
    </section>
  );
}
