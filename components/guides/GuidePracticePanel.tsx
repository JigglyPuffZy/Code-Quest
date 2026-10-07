"use client";

import { CodeWorkspace } from "@/components/workspace/CodeWorkspace";
import { VisibleTestCases } from "@/components/workspace/VisibleTestCases";
import {
  GUIDE_PRACTICE_XP,
  getGuidePractice,
  guideHasPractice,
  guidePracticeCount,
} from "@/lib/guides/practice";
import { ShareCertificate } from "@/components/guides/ShareCertificate";
import { useDevyyyyy } from "@/components/support/DevyyyyyProvider";
import {
  isGuidePracticeComplete,
  markGuidePracticeQuestionPassed,
  passedGuidePracticeIndices,
} from "@/lib/guides/progress";
import { recordPracticeMistake } from "@/lib/learning/mistakes";
import type { GradeResponse, GradeTest } from "@/lib/types";
import { CheckCircle2, Code2, HelpCircle, Lightbulb, RefreshCw, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

function expectedTestCount(exercise: NonNullable<ReturnType<typeof getGuidePractice>>["exercise"]) {
  if (exercise.tests.type === "stdout") return 1;
  return exercise.tests.cases.length;
}

function pickQuestion(total: number, passed: number[], current: number | null) {
  const unused = Array.from({ length: total }, (_, index) => index).filter(
    (index) => !passed.includes(index) && index !== current,
  );
  if (unused.length > 0) {
    return unused[Math.floor(Math.random() * unused.length)]!;
  }
  const others = Array.from({ length: total }, (_, index) => index).filter((index) => index !== current);
  if (others.length > 0) {
    return others[Math.floor(Math.random() * others.length)]!;
  }
  return current ?? 0;
}

const HOW_TO_STEPS = [
  "Read the task below — it tells you exactly what your program should do.",
  "Write code in the editor. Start from the starter code and fill in the blanks.",
  "Click Run tests to check your work without submitting. Fix anything that fails.",
  "When every test passes, click Submit to complete the practice and earn XP.",
  "Still stuck? Click Try another question for a different beginner task on the same idea.",
];

function buildCoachMessage(
  topicId: string,
  slug: string,
  practice: NonNullable<ReturnType<typeof getGuidePractice>>,
  result: GradeResponse,
) {
  const failed = result.tests.filter((t) => !t.passed);
  const lines = failed.slice(0, 3).map((t) => {
    const got = t.actual || "(no output)";
    return `- Expected: ${t.expected ?? "?"} · Got: ${got}`;
  });
  return [
    `I failed a practice question on ${topicId}/${slug} (question ${practice.index + 1}).`,
    `Task: ${practice.exercise.prompt.split("\n")[0]}`,
    "Failed checks:",
    ...lines,
    "Explain what I did wrong in simple Taglish and how to fix it step by step. Don't give the full answer — guide me.",
  ].join("\n");
}

export function GuidePracticePanel({ topicId, slug }: { topicId: string; slug: string }) {
  const { openChat } = useDevyyyyy();
  const total = guideHasPractice(topicId, slug) ? guidePracticeCount(topicId, slug) : 0;
  const [questionIndex, setQuestionIndex] = useState(0);
  const [picked, setPicked] = useState(false);
  const [passedIndices, setPassedIndices] = useState<number[]>([]);
  const [lessonCleared, setLessonCleared] = useState(false);
  const [runResults, setRunResults] = useState<GradeTest[] | null>(null);
  const [runTestsRunning, setRunTestsRunning] = useState(false);
  const [hintsOpen, setHintsOpen] = useState(false);

  useEffect(() => {
    const passed = passedGuidePracticeIndices(topicId, slug);
    setPassedIndices(passed);
    setLessonCleared(isGuidePracticeComplete(topicId, slug));
    setQuestionIndex(pickQuestion(total, passed, null));
    setPicked(true);
    setRunResults(null);
    setHintsOpen(false);
  }, [topicId, slug, total]);

  const practice = useMemo(
    () => (total > 0 ? getGuidePractice(topicId, slug, questionIndex) : null),
    [topicId, slug, questionIndex, total],
  );

  if (total === 0) return null;
  if (!picked || !practice) {
    return (
      <section className="mt-14 scroll-mt-24" id="practice">
        <p className="text-sm text-muted">Loading a practice question…</p>
      </section>
    );
  }

  const passedThis = passedIndices.includes(questionIndex);
  const hints = practice.exercise.hints;

  function goToAnotherQuestion() {
    const next = pickQuestion(total, passedIndices, questionIndex);
    setQuestionIndex(next);
    setRunResults(null);
    setRunTestsRunning(false);
    setHintsOpen(false);
  }

  return (
    <section className="mt-14 scroll-mt-24" id="practice">
      <div className="mb-5 flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-line bg-surface shadow-sm">
          <Code2 size={18} className="text-primary" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">Try it yourself</p>
          <h2 className="mt-1 text-xl font-bold tracking-tight">Practice this lesson</h2>
          <p className="mt-1 text-sm leading-relaxed text-muted">
            Apply what you just read. No pressure — try another question until it clicks.
            {lessonCleared ? (
              <span className="ml-1 inline-flex items-center gap-1 font-medium text-ok">
                <CheckCircle2 size={14} />
                Practice complete
              </span>
            ) : (
              <span className="ml-1 font-medium text-primary">+{GUIDE_PRACTICE_XP} XP on first pass.</span>
            )}
          </p>
          <p className="mt-2 text-sm font-medium text-ink">
            Question {questionIndex + 1} of {total}
            {passedIndices.length > 0 ? (
              <span className="ml-2 font-normal text-muted">
                You&apos;ve got {passedIndices.length} of {total}
              </span>
            ) : null}
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

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted">
            {passedThis
              ? "You already passed this one. Try another to keep practicing."
              : "If this question is confusing, generate a different one — same lesson, new story."}
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() =>
                openChat({
                  message: `I'm on ${topicId} lesson "${slug}" and I don't get this practice yet. Explain the idea in simpler Taglish, then give me one tiny step to try.`,
                  autoSend: true,
                  mode: "simplify",
                })
              }
              className="inline-flex items-center gap-2 rounded-xl border border-primary-200 bg-primary-50 px-3.5 py-2 text-sm font-semibold text-primary"
            >
              <HelpCircle size={14} />
              I don&apos;t get this
            </button>
            <button
              type="button"
              onClick={goToAnotherQuestion}
              className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-3.5 py-2 text-sm font-semibold text-ink shadow-sm transition hover:border-ink"
            >
              <RefreshCw size={14} />
              {passedThis ? "Next question" : "Try another question"}
            </button>
          </div>
        </div>

        <article className="rounded-2xl border border-line bg-surface p-4 sm:p-5">
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
                    key={`${hint}-${index}`}
                    className="rounded-xl border border-amber-100 bg-surface/80 px-3 py-2.5 text-sm leading-relaxed text-amber-950"
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
              alreadyCleared={passedThis}
              onCleared={() => {
                const firstTime = markGuidePracticeQuestionPassed(topicId, slug, questionIndex);
                setPassedIndices(passedGuidePracticeIndices(topicId, slug));
                if (firstTime) setLessonCleared(true);
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
              onGradeResult={(result) => {
                if (result.passed) return;
                const failed = result.tests.filter((t) => !t.passed);
                const hint = failed[0]?.expected ? `Expected: ${failed[0].expected}` : undefined;
                recordPracticeMistake({
                  topicId,
                  slug,
                  questionIndex,
                  exerciseId: practice.exerciseId,
                  prompt: practice.exercise.prompt.split("\n")[0] ?? practice.exercise.prompt,
                  language: practice.language,
                  hint,
                });
                openChat({
                  message: buildCoachMessage(topicId, slug, practice, result),
                  autoSend: true,
                  mode: "coach",
                });
              }}
            />
          </div>
        </article>

        <ShareCertificate topicId={topicId} slug={slug} />
      </div>
    </section>
  );
}
