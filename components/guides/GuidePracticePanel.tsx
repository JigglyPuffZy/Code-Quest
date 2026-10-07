"use client";

import { CodeWorkspace } from "@/components/workspace/CodeWorkspace";
import { VisibleTestCases } from "@/components/workspace/VisibleTestCases";
import {
  GUIDE_PRACTICE_XP,
  getGuidePractice,
  guideHasPractice,
} from "@/lib/guides/practice";
import {
  isGuidePracticeComplete,
  markGuidePracticeComplete,
} from "@/lib/guides/progress";
import type { GradeTest } from "@/lib/types";
import { CheckCircle2, Code2, Lightbulb, Sparkles } from "lucide-react";
import { useState } from "react";

function expectedTestCount(exercise: NonNullable<ReturnType<typeof getGuidePractice>>["exercise"]) {
  if (exercise.tests.type === "stdout") return 1;
  return exercise.tests.cases.length;
}

const HOW_TO_STEPS = [
  "Read the task below — it tells you exactly what your program should do.",
  "Write code in the editor. Start from the starter code and fill in the blanks.",
  "Click Run tests to check your work without submitting. Fix anything that fails.",
  "When every test passes, click Submit to complete the practice and earn XP.",
];

export function GuidePracticePanel({ topicId, slug }: { topicId: string; slug: string }) {
  const practice = guideHasPractice(topicId, slug) ? getGuidePractice(topicId, slug) : null;
  const [runResults, setRunResults] = useState<GradeTest[] | null>(null);
  const [runTestsRunning, setRunTestsRunning] = useState(false);
  const [hintsOpen, setHintsOpen] = useState(false);

  if (!practice) return null;

  const cleared = isGuidePracticeComplete(topicId, slug);
  const hints = practice.exercise.hints;

  return (
    <section className="mt-14 scroll-mt-24" id="practice">
      <div className="mb-5 flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-line bg-white shadow-sm">
          <Code2 size={18} className="text-primary" />
        </span>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">Try it yourself</p>
          <h2 className="mt-1 text-xl font-bold tracking-tight">Practice this lesson</h2>
          <p className="mt-1 text-sm leading-relaxed text-muted">
            Apply what you just read. No pressure — run tests as many times as you need.
            {cleared ? (
              <span className="ml-1 inline-flex items-center gap-1 font-medium text-ok">
                <CheckCircle2 size={14} />
                Practice complete
              </span>
            ) : (
              <span className="ml-1 font-medium text-primary">+{GUIDE_PRACTICE_XP} XP on first pass.</span>
            )}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <article className="rounded-2xl border border-line bg-surface-2/80 p-4 sm:p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">How to practice</p>
          <ol className="mt-3 list-decimal space-y-2 pl-5 marker:font-semibold marker:text-primary">
            {HOW_TO_STEPS.map((step) => (
              <li key={step} className="pl-1 text-sm leading-relaxed text-ink">{step}</li>
            ))}
          </ol>
        </article>

        <article className="rounded-2xl border border-line bg-white p-4 sm:p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">Your task</p>
          <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-ink">{practice.exercise.prompt}</p>
        </article>

        <VisibleTestCases
          exercise={practice.exercise}
          results={runResults}
          running={runTestsRunning}
        />

        {hints.length > 0 ? (
          <article className="rounded-2xl border border-amber-100 bg-amber-50/60 p-4 sm:p-5">
            <button
              type="button"
              onClick={() => setHintsOpen((open) => !open)}
              className="flex w-full items-center justify-between gap-2 text-left"
            >
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-800">
                <Lightbulb size={12} className="text-amber-500" />
                Stuck? View hints
              </span>
              <span className="text-xs font-medium text-amber-700">{hintsOpen ? "Hide" : "Show"}</span>
            </button>
            {hintsOpen ? (
              <ol className="mt-3 space-y-2">
                {hints.map((hint, index) => (
                  <li
                    key={hint}
                    className="rounded-xl border border-amber-100 bg-white/80 px-3 py-2.5 text-sm leading-relaxed text-amber-950"
                  >
                    <span className="font-bold text-amber-700">{index + 1}.</span> {hint}
                  </li>
                ))}
              </ol>
            ) : (
              <p className="mt-2 text-sm text-amber-900/80">
                Hints walk you through the solution step by step. Try the task first, then open hints if you need help.
              </p>
            )}
          </article>
        ) : null}

        <article className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-xl shadow-slate-900/10">
          <div className="flex items-center justify-between gap-3 border-b border-slate-800 px-3 py-3 sm:px-4">
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Code editor</p>
              <p className="text-sm font-semibold text-white">Write your code here</p>
            </div>
            <span className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-slate-800 px-2.5 py-1 font-mono text-[10px] font-bold uppercase text-cyan-300">
              <Sparkles size={10} />
              {practice.language}
            </span>
          </div>
          <div className="p-3 sm:p-5">
            <CodeWorkspace
              key={practice.exerciseId}
              language={practice.language}
              starterCode={practice.exercise.starterCode}
              kind="guide"
              exerciseId={practice.exerciseId}
              alreadyCleared={cleared}
              onCleared={() => {
                const firstTime = markGuidePracticeComplete(topicId, slug);
                return {
                  awarded: firstTime,
                  xp: firstTime ? GUIDE_PRACTICE_XP : 0,
                };
              }}
              expectedTests={expectedTestCount(practice.exercise)}
              tests={practice.exercise.tests}
              onRunStateChange={({ running, results }) => {
                setRunTestsRunning(running);
                setRunResults(results);
              }}
            />
          </div>
        </article>
      </div>
    </section>
  );
}
