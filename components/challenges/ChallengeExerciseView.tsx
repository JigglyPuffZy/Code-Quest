"use client";

import { LessonCopy } from "@/components/code/CodeBlock";
import { usePlayer } from "@/components/player/PlayerProvider";
import { Button } from "@/components/ui/Button";
import { CodeWorkspace } from "@/components/workspace/CodeWorkspace";
import { VisibleTestCases } from "@/components/workspace/VisibleTestCases";
import { cn } from "@/lib/cn";
import { DifficultyStageCard, DifficultyStageChips } from "@/components/ui/DifficultyStageCard";
import {
  guidesAllowedForDifficulty,
  hintLimitLabel,
  hintsAllowedForDifficulty,
  type SkillDifficulty,
} from "@/lib/difficulty";
import { languageInfo } from "@/lib/curriculum/index";
import type { Challenge, GradeTest, LanguageId } from "@/lib/types";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Lightbulb,
  Swords,
  Target,
  Timer,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";

const STEPS = [
  { label: "Read the mission" },
  { label: "Write your code" },
  { label: "Run & submit" },
];

function expectedTestCount(exercise: Challenge["exercise"]) {
  if (exercise.tests.type === "stdout") return 1;
  const visible = exercise.tests.cases.length;
  const perf = exercise.performance?.cases.length ?? 0;
  return visible + perf;
}

export function ChallengeExerciseView({
  challenge,
  cleared,
  hintDifficulty,
  onChangeDifficulty,
  footer,
}: {
  challenge: Challenge;
  cleared: boolean;
  hintDifficulty: SkillDifficulty;
  onChangeDifficulty?: () => void;
  footer?: ReactNode;
}) {
  const { player, completeChallenge } = usePlayer();
  const [hints, setHints] = useState(0);
  const [step, setStep] = useState(1);
  const [runResults, setRunResults] = useState<GradeTest[] | null>(null);
  const [runTestsRunning, setRunTestsRunning] = useState(false);
  const maxHints = Math.min(hintsAllowedForDifficulty(hintDifficulty), challenge.exercise.hints.length);

  useEffect(() => {
    setHints(0);
    setStep(1);
    setRunResults(null);
    setRunTestsRunning(false);
  }, [challenge.id, hintDifficulty]);

  const briefing = challenge.blocks.flatMap((block) =>
    block.type === "ul" ? block.items : block.type === "p" ? [block.text] : [],
  );

  return (
    <div className="space-y-4 pb-4 sm:space-y-5 sm:pb-0">
      <section className="game-stage-header relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-primary-950 p-4 text-white sm:p-6">
        <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-primary/25 blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute -bottom-12 left-1/4 h-28 w-28 rounded-full bg-primary/20 blur-3xl" aria-hidden />

        <div className="relative space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link
              href="/challenges"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/90 transition hover:bg-white/15"
            >
              <ArrowLeft size={13} />
              Arena
            </Link>
            <div className="flex flex-wrap items-center gap-2">
              {cleared ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                  <CheckCircle2 size={12} />
                  Cleared
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white/80">
                  In progress
                </span>
              )}
              <span className="rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold text-primary-foreground">
                +{challenge.xp} XP
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
            <div className="min-w-0">
              <p className="inline-flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">
                <Swords size={11} />
                <span>{languageInfo(challenge.language).name}</span>
                <span className="text-white/30">·</span>
                <span>Arena battle</span>
              </p>
              <h1 className="mt-2 text-xl font-bold tracking-tight sm:text-3xl">{challenge.title}</h1>
              <p className="mt-1.5 text-sm leading-relaxed text-white/70">{challenge.summary}</p>
            </div>
            <DifficultyStageCard
              difficulty={hintDifficulty}
              onChange={onChangeDifficulty}
              className="w-full sm:w-auto"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <DifficultyStageChips difficulty={hintDifficulty} />
            {challenge.exercise.performance ? (
              <span className="inline-flex items-center gap-1 rounded-lg border border-amber-300/30 bg-amber-400/15 px-2.5 py-1 text-[10px] font-bold uppercase text-amber-200">
                <Timer size={11} />
                Target {challenge.exercise.performance.expectedComplexity}
              </span>
            ) : null}
          </div>
        </div>
      </section>

      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 snap-x snap-mandatory sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:pb-0">
        {STEPS.map((item, index) => {
          const active = step === index + 1;
          const done = step > index + 1;
          return (
            <button
              key={item.label}
              type="button"
              onClick={() => setStep(index + 1)}
              className={cn(
                "flex min-h-11 min-w-[min(88vw,280px)] shrink-0 snap-start items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition sm:min-h-0 sm:min-w-0",
                active && "border-primary-300 bg-primary-50 shadow-sm",
                done && !active && "border-emerald-200 bg-emerald-50/50",
                !active && !done && "border-line bg-white hover:bg-surface-2",
              )}
            >
              <span
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold",
                  active && "bg-primary text-primary-foreground",
                  done && !active && "bg-emerald-500 text-white",
                  !active && !done && "bg-surface-2 text-muted",
                )}
              >
                {done && !active ? <CheckCircle2 size={14} /> : index + 1}
              </span>
              <span className="min-w-0">
                <p className="text-xs font-bold text-ink">{item.label}</p>
                <p className="text-[10px] text-muted">Arena challenge</p>
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid gap-4 sm:gap-6 xl:grid-cols-2 xl:items-start">
        <div className="order-2 space-y-3 sm:space-y-4 xl:order-1 xl:max-h-[calc(100vh-11rem)] xl:overflow-y-auto xl:pr-1">
          <article className="overflow-hidden rounded-2xl border border-primary-200 bg-gradient-to-br from-primary-50 via-white to-white p-4 shadow-sm sm:p-5">
            <p className="inline-flex items-center gap-1.5 rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
              <Target size={11} />
              Your mission
            </p>
            <p className="mt-4 text-base font-semibold leading-relaxed text-ink sm:text-lg">
              {challenge.exercise.prompt}
            </p>
            <p className="mt-3 text-xs leading-relaxed text-muted">
              Pass every automated check to clear this battle and earn XP.
              {challenge.exercise.performance ? (
                <>
                  {" "}
                  Hidden large-input tests enforce{" "}
                  <strong className="font-semibold text-ink">
                    {challenge.exercise.performance.expectedComplexity}
                  </strong>
                  {guidesAllowedForDifficulty(hintDifficulty) ? (
                    <>
                      {" "}
                      — see{" "}
                      <Link href="/guides/python/time-complexity" className="font-semibold text-primary hover:underline">
                        Big O guide
                      </Link>
                    </>
                  ) : null}
                  .
                </>
              ) : null}
            </p>
          </article>

          <VisibleTestCases
            tests={challenge.exercise.tests}
            results={runResults}
            running={runTestsRunning}
          />

          {briefing.length > 0 ? (
            <article className="rounded-2xl border border-line bg-white p-4 sm:p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">Briefing</p>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted">
                {briefing.map((line) => (
                  <li key={line} className="flex gap-2">
                    <ChevronRight size={14} className="mt-0.5 shrink-0 text-primary" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </article>
          ) : (
            <article className="rounded-2xl border border-line bg-white p-4 sm:p-5">
              <LessonCopy blocks={challenge.blocks} />
            </article>
          )}

          {maxHints > 0 ? (
            <article className="rounded-2xl border border-line bg-white p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-muted">
                  <Lightbulb size={11} className="text-amber-500" />
                  Hints
                </p>
                <Button
                  variant="ghost"
                  className="px-2 py-1 text-xs"
                  onClick={() => setHints((count) => Math.min(maxHints, count + 1))}
                  disabled={hints >= maxHints}
                >
                  {hints >= maxHints ? "All revealed" : `Reveal hint ${hints + 1}`}
                </Button>
              </div>
              {hints > 0 ? (
                <ol className="mt-3 space-y-2">
                  {challenge.exercise.hints.slice(0, hints).map((hint, index) => (
                    <li
                      key={hint}
                      className="rounded-xl border border-amber-100 bg-amber-50/80 px-3 py-2.5 text-sm text-amber-950"
                    >
                      <span className="font-bold text-amber-700">{index + 1}.</span> {hint}
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="mt-3 text-sm text-muted">
                  {hintLimitLabel(hintDifficulty)} — reveal one at a time, no XP penalty.
                </p>
              )}
            </article>
          ) : null}

          {footer ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">{footer}</div>
          ) : null}
        </div>

        <div className="order-1 xl:order-2 xl:sticky xl:top-20">
          <article className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-xl shadow-slate-900/20">
            <div className="flex items-center justify-between gap-3 border-b border-slate-800 px-3 py-3 sm:px-4">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Code arena</p>
                <p className="text-sm font-semibold text-white">Write & test your solution</p>
              </div>
              <span className="shrink-0 rounded-lg bg-slate-800 px-2.5 py-1 font-mono text-[10px] font-bold uppercase text-cyan-300">
                {challenge.language}
              </span>
            </div>
            <div className="p-3 sm:p-5">
              <CodeWorkspace
                key={`${challenge.id}-${hintDifficulty}`}
                language={challenge.language as LanguageId}
                starterCode={challenge.exercise.starterCode}
                kind="challenge"
                exerciseId={challenge.id}
                alreadyCleared={cleared}
                theme="game"
                onCleared={() => completeChallenge(challenge.id)}
                skillDifficulty={hintDifficulty}
                expectedTests={expectedTestCount(challenge.exercise)}
                tests={challenge.exercise.tests}
                onRunStateChange={({ running, results }) => {
                  setRunTestsRunning(running);
                  setRunResults(results);
                }}
              />
            </div>
          </article>

          <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
            <Trophy size={12} className="text-primary" />
            Tip: click <strong className="font-semibold text-slate-700">Run</strong> to test, then{" "}
            <strong className="font-semibold text-slate-700">Submit</strong> when ready.
          </p>
        </div>
      </div>
    </div>
  );
}
