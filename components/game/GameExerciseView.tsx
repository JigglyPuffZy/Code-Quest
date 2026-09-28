"use client";

import { usePlayer } from "@/components/player/PlayerProvider";
import { Button } from "@/components/ui/Button";
import { CodeWorkspace } from "@/components/workspace/CodeWorkspace";
import { cn } from "@/lib/cn";
import {
  difficultyLabel,
  hintLimitLabel,
  hintsAllowedForDifficulty,
  SKILL_DIFFICULTIES,
} from "@/lib/difficulty";
import { playerStack } from "@/lib/game/generator";
import { GAME_MODES } from "@/lib/game/modes";
import { maxUnlockedGameLevel } from "@/lib/game/progress";
import { GAME_TRACKS, type GameTrackId } from "@/lib/game/tracks";
import type { GameLevel } from "@/lib/game/types";
import { MAX_GAME_LEVEL } from "@/lib/game/types";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Lightbulb,
  Lock,
  Target,
  Terminal,
  Trophy,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";

const STEPS = [
  { icon: Target, label: "Read the mission" },
  { icon: Terminal, label: "Write your code" },
  { icon: Zap, label: "Run & submit" },
];

export function GameExerciseView({
  track,
  record,
  cleared,
  locked,
  lockMessage,
  footer,
}: {
  track: GameTrackId;
  record: GameLevel;
  cleared: boolean;
  locked?: boolean;
  lockMessage?: string;
  footer?: ReactNode;
}) {
  const { player, completeGameLevel } = usePlayer();
  const [hints, setHints] = useState(0);
  const [step, setStep] = useState(1);

  useEffect(() => {
    setHints(0);
    setStep(1);
  }, [record.id]);

  const trackMeta = GAME_TRACKS[track];
  const modeMeta = GAME_MODES[record.mode];
  const skill = SKILL_DIFFICULTIES[record.difficulty];
  const unlocked = player ? maxUnlockedGameLevel(player, track, record.difficulty) : 1;
  const campaignPct = (record.level / MAX_GAME_LEVEL) * 100;
  const maxHints = Math.min(
    hintsAllowedForDifficulty(record.difficulty),
    record.exercise.hints.length,
  );

  if (locked) {
    return (
      <div className="flex min-h-[55vh] flex-col items-center justify-center rounded-2xl border border-line bg-gradient-to-b from-surface-2 to-white p-8 text-center">
        <div className="grid size-16 place-items-center rounded-2xl bg-slate-900 text-white shadow-lg">
          <Lock size={28} />
        </div>
        <h2 className="mt-5 text-2xl font-bold">Level locked</h2>
        <p className="mt-2 max-w-md text-sm text-muted">{lockMessage}</p>
        <Link
          href={`/game/${track}`}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground"
        >
          <ArrowLeft size={15} />
          Back to level map
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Game header */}
      <section className="game-stage-header relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-violet-950 p-5 text-white sm:p-6">
        <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-primary/30 blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute -bottom-12 left-1/4 h-28 w-28 rounded-full bg-cyan-400/15 blur-3xl" aria-hidden />

        <div className="relative space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link
              href={`/game/${track}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/90 transition hover:bg-white/15"
            >
              <ArrowLeft size={13} />
              {trackMeta.label} map
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
                +{record.xp} XP
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="min-w-0">
              <p className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">
                <span>{trackMeta.emoji}</span>
                <span>{modeMeta.emoji} {modeMeta.label}</span>
                <span className="text-white/30">·</span>
                <span>{record.stackLabel}</span>
              </p>
              <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">{record.title}</h1>
              <p className="mt-1.5 text-sm text-white/70">
                Level {record.level} of {MAX_GAME_LEVEL} · {difficultyLabel(record.difficulty)} · {record.tier} tier
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-center">
              <p className="text-[10px] font-bold uppercase tracking-wider text-white/50">Campaign</p>
              <p className="text-lg font-bold tabular-nums">{Math.round(campaignPct)}%</p>
            </div>
          </div>

          <div>
            <div className="mb-1.5 flex justify-between text-[10px] font-semibold uppercase tracking-wider text-white/50">
              <span>Level {record.level}</span>
              <span>{unlocked} unlocked</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-cyan-400 transition-all"
                style={{ width: `${campaignPct}%` }}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className={cn("rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase", skill.soft, skill.accent)}>
              {skill.label}
            </span>
            <span className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-bold uppercase text-white/70">
              {modeMeta.blurb}
            </span>
          </div>
        </div>
      </section>

      {/* Steps */}
      <div className="grid gap-2 sm:grid-cols-3">
        {STEPS.map((item, index) => {
          const active = step === index + 1;
          const done = step > index + 1;
          return (
            <button
              key={item.label}
              type="button"
              onClick={() => setStep(index + 1)}
              className={cn(
                "flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition",
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
                <p className="text-[10px] text-muted">{modeMeta.label} challenge</p>
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-2 xl:items-start">
        {/* Mission panel */}
        <div className="order-2 space-y-4 xl:order-1 xl:max-h-[calc(100vh-11rem)] xl:overflow-y-auto xl:pr-1">
          <article className="overflow-hidden rounded-2xl border border-primary-200 bg-gradient-to-br from-primary-50 via-white to-violet-50/40 p-5 shadow-sm">
            <p className="inline-flex items-center gap-1.5 rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
              <Target size={11} />
              Your mission
            </p>
            <p className="mt-4 text-base font-semibold leading-relaxed text-ink sm:text-lg">{record.exercise.prompt}</p>
            <p className="mt-3 text-xs leading-relaxed text-muted">
              Pass every automated check to clear this level and unlock the next one.
            </p>
          </article>

          <article className="rounded-2xl border border-line bg-white p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">Briefing</p>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted">
              {record.blocks
                .flatMap((block) => (block.type === "ul" ? block.items : block.type === "p" ? [block.text] : []))
                .map((line) => (
                  <li key={line} className="flex gap-2">
                    <ChevronRight size={14} className="mt-0.5 shrink-0 text-primary" />
                    <span>{line}</span>
                  </li>
                ))}
            </ul>
          </article>

          <article className="rounded-2xl border border-line bg-white p-5">
            <div className="flex items-center justify-between gap-2">
              <p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-muted">
                <Lightbulb size={11} className="text-amber-500" />
                Hints
              </p>
              {maxHints > 0 ? (
                <Button
                  variant="ghost"
                  className="px-2 py-1 text-xs"
                  onClick={() => setHints((count) => Math.min(maxHints, count + 1))}
                  disabled={hints >= maxHints}
                >
                  {hints >= maxHints ? "All revealed" : `Reveal hint ${hints + 1}`}
                </Button>
              ) : null}
            </div>
            {hints > 0 ? (
              <ol className="mt-3 space-y-2">
                {record.exercise.hints.slice(0, hints).map((hint, index) => (
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
                {maxHints > 0
                  ? `${hintLimitLabel(record.difficulty)} — reveal one at a time, no XP penalty.`
                  : hintLimitLabel(record.difficulty)}
              </p>
            )}
          </article>

          {footer ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">{footer}</div>
          ) : null}
        </div>

        {/* Code panel */}
        <div className="order-1 xl:order-2 xl:sticky xl:top-20">
          <article className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-xl shadow-slate-900/20">
            <div className="flex items-center justify-between gap-3 border-b border-slate-800 px-4 py-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Code arena</p>
                <p className="text-sm font-semibold text-white">Write & test your solution</p>
              </div>
              <span className="rounded-lg bg-slate-800 px-2.5 py-1 font-mono text-[10px] font-bold uppercase text-cyan-300">
                {record.language}
              </span>
            </div>
            <div className="p-4 sm:p-5">
              <CodeWorkspace
                key={record.id}
                language={record.language}
                starterCode={record.exercise.starterCode}
                kind="game"
                exerciseId={record.id}
                alreadyCleared={cleared}
                theme="game"
                onCleared={() => completeGameLevel(record.id)}
                skillDifficulty={record.difficulty}
                gameStack={player ? playerStack(player) : undefined}
                expectedTests={
                  record.exercise.tests.type === "stdout"
                    ? 1
                    : record.exercise.tests.cases.length + (record.exercise.performance?.cases.length ?? 0)
                }
              />
            </div>
          </article>

          <p className="mt-3 flex items-center gap-1.5 text-xs text-muted">
            <Trophy size={12} className="text-primary" />
            Tip: click <strong className="font-semibold text-ink">Run</strong> to test, then <strong className="font-semibold text-ink">Submit</strong> when ready.
          </p>
        </div>
      </div>
    </div>
  );
}
