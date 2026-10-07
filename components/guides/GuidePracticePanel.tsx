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
import { Code2, Sparkles } from "lucide-react";
import { useState } from "react";

function expectedTestCount(exercise: NonNullable<ReturnType<typeof getGuidePractice>>["exercise"]) {
  if (exercise.tests.type === "stdout") return 1;
  return exercise.tests.cases.length;
}

export function GuidePracticePanel({ topicId, slug }: { topicId: string; slug: string }) {
  const practice = guideHasPractice(topicId, slug) ? getGuidePractice(topicId, slug) : null;
  const [runResults, setRunResults] = useState<GradeTest[] | null>(null);
  const [runTestsRunning, setRunTestsRunning] = useState(false);

  if (!practice) return null;

  const cleared = isGuidePracticeComplete(topicId, slug);

  return (
    <section className="mt-14 scroll-mt-24" id="practice">
      <div className="mb-5 flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-line bg-white shadow-sm">
          <Code2 size={18} className="text-primary" />
        </span>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">Try it yourself</p>
          <h2 className="mt-1 text-xl font-bold tracking-tight">Practice this lesson</h2>
          <p className="mt-1 text-sm text-muted">
            Write code right here — run tests to check your work, then submit when every check passes.
            {cleared ? (
              <span className="ml-1 font-medium text-ok">Practice complete.</span>
            ) : (
              <span className="ml-1 font-medium text-primary">+{GUIDE_PRACTICE_XP} XP on first pass.</span>
            )}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <article className="rounded-2xl border border-line bg-white p-4 sm:p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">Your task</p>
          <p className="mt-3 text-sm leading-relaxed text-ink">{practice.exercise.prompt}</p>
        </article>

        <VisibleTestCases
          exercise={practice.exercise}
          results={runResults}
          running={runTestsRunning}
        />

        <article className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-xl shadow-slate-900/10">
          <div className="flex items-center justify-between gap-3 border-b border-slate-800 px-3 py-3 sm:px-4">
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Code editor</p>
              <p className="text-sm font-semibold text-white">Write & test your solution</p>
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
