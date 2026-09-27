"use client";

import { ChallengeEnterGate } from "@/components/challenges/ChallengeEnterGate";
import { ChallengeExerciseView } from "@/components/challenges/ChallengeExerciseView";
import { TechLogo, TechLogoBadge } from "@/components/icons/TechLogo";
import { usePlayer } from "@/components/player/PlayerProvider";
import { ErrorState, EmptyState } from "@/components/ui/States";
import { cn } from "@/lib/cn";
import { challenges, getChallenge, languageInfo } from "@/lib/curriculum/index";
import type { SkillDifficulty } from "@/lib/difficulty";
import { difficultyLabel } from "@/lib/difficulty";
import {
  challengeLockMessage,
  isChallengeComplete,
  isChallengeUnlocked,
  pickDailyChallenge,
} from "@/lib/progress";
import type { Challenge, LanguageId } from "@/lib/types";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Lock,
  Play,
  Swords,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const FILTERS = ["all", "python", "javascript", "typescript", "java"] as const;

const LANG_STYLE: Record<LanguageId, { soft: string; ring: string }> = {
  python: { soft: "bg-primary-50", ring: "ring-primary-100" },
  javascript: { soft: "bg-primary-50", ring: "ring-primary-100" },
  typescript: { soft: "bg-primary-50", ring: "ring-primary-100" },
  java: { soft: "bg-primary-50", ring: "ring-primary-100" },
};

function ChallengeCard({
  challenge,
  player,
}: {
  challenge: Challenge;
  player: NonNullable<ReturnType<typeof usePlayer>["player"]>;
}) {
  const open = isChallengeUnlocked(challenge, player);
  const done = isChallengeComplete(challenge.id, player);
  const lang = LANG_STYLE[challenge.language];

  const body = (
    <article
      className={cn(
        "group relative overflow-hidden rounded-2xl border bg-white transition-all duration-200",
        open
          ? "border-line hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-lg hover:shadow-primary/10"
          : "border-line/80 bg-surface-2/50",
      )}
    >
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" aria-hidden />

      <div className="flex flex-col gap-4 p-4 pl-5 sm:flex-row sm:items-center sm:p-5 sm:pl-6">
        <div className="flex min-w-0 flex-1 items-start gap-3 sm:gap-4">
          <TechLogoBadge
            topicId={challenge.language}
            name={languageInfo(challenge.language).name}
            size={22}
            soft={lang.soft}
            ring={lang.ring}
            className="shrink-0"
          />

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="rounded-full bg-primary-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary ring-1 ring-primary-100"
              >
                {difficultyLabel(challenge.difficulty)}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted">
                {languageInfo(challenge.language).name}
              </span>
              {done ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-ok">
                  <CheckCircle2 size={11} />
                  Cleared
                </span>
              ) : null}
            </div>

            <h2 className="mt-2 text-lg font-bold tracking-tight">{challenge.title}</h2>
            <p className="mt-1 text-sm leading-relaxed text-muted">{challenge.summary}</p>

            {!open ? (
              <p className="mt-3 flex items-center gap-1.5 text-xs text-muted">
                <Lock size={12} />
                {challengeLockMessage(challenge)}
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex w-full items-center justify-between gap-3 border-t border-line/60 pt-3 sm:w-auto sm:flex-col sm:items-end sm:border-0 sm:pt-0">
          <span className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-3 py-1.5 text-xs font-bold text-primary">
            <Zap size={12} />
            +{challenge.xp} XP
          </span>

          {open ? (
            <span
              className={cn(
                "inline-flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold transition sm:min-h-0 sm:flex-none sm:py-2",
                done
                  ? "border border-primary-200 text-primary group-hover:bg-primary-50"
                  : "bg-primary text-primary-foreground group-hover:bg-primary-hover",
              )}
            >
              {done ? "Review" : "Enter"}
              <ArrowRight size={14} />
            </span>
          ) : (
            <span className="inline-flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-xl border border-line px-4 py-2.5 text-sm font-medium text-muted sm:min-h-0 sm:flex-none sm:py-2">
              <Lock size={13} />
              Locked
            </span>
          )}
        </div>
      </div>
    </article>
  );

  if (!open) return body;
  return (
    <Link href={`/challenges/${challenge.id}`} className="block">
      {body}
    </Link>
  );
}

export function ChallengeList() {
  const { player } = usePlayer();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("all");
  if (!player) return null;

  const visible = challenges.filter((c) => filter === "all" || c.language === filter);
  const daily = pickDailyChallenge(player);
  const dailyDone = isChallengeComplete(daily.id, player);
  const dailyOpen = isChallengeUnlocked(daily, player);
  const cleared = challenges.filter((c) => isChallengeComplete(c.id, player)).length;
  const unlocked = challenges.filter((c) => isChallengeUnlocked(c, player)).length;
  const xpEarned = player.completedChallenges.reduce((sum, entry) => {
    const match = challenges.find((c) => c.id === entry.id);
    return sum + (match?.xp ?? 0);
  }, 0);

  const rest = visible.filter((c) => c.id !== daily.id);

  return (
    <div className="space-y-5 pb-2 sm:space-y-8 sm:pb-0">
      <section className="arena-hero relative overflow-hidden rounded-2xl border border-line bg-surface-2">
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-primary/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 left-0 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative flex flex-col gap-5 p-4 sm:gap-6 sm:p-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <p className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-primary sm:mb-3">
              <Swords size={12} />
              Arena
            </p>
            <h1 className="text-2xl font-bold tracking-tight sm:text-4xl">Coding battles</h1>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Clear battles in order — finish one challenge before the next unlocks. Tap{" "}
              <strong className="font-semibold text-ink">Enter</strong>, choose difficulty, then code.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {[
              { label: "Cleared", value: cleared },
              { label: "Unlocked", value: unlocked },
              { label: "XP won", value: xpEarned, accent: true },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-line bg-white px-3 py-3 text-center sm:px-5"
              >
                <p
                  className={cn(
                    "text-xl font-bold tabular-nums sm:text-2xl",
                    stat.accent ? "text-primary" : "text-ink",
                  )}
                >
                  {stat.value}
                </p>
                <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {(filter === "all" || filter === daily.language) && dailyOpen ? (
        <section>
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-sm font-bold">Today&apos;s battle</h2>
            {dailyDone ? (
              <span className="text-xs font-medium text-ok">Cleared — replay for practice</span>
            ) : null}
          </div>

          <Link href={`/challenges/${daily.id}`} className="group block">
            <article
              className="relative overflow-hidden rounded-2xl border border-primary-200 bg-gradient-to-br from-primary-50/80 via-white to-white p-4 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/10 sm:p-7"
            >
              <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/20 blur-2xl" />
              <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                    Featured challenge
                  </p>
                  <h3 className="mt-2 text-xl font-bold tracking-tight sm:text-2xl">{daily.title}</h3>
                  <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted">{daily.summary}</p>
                  <p className="mt-3 text-xs font-medium text-muted">
                    {languageInfo(daily.language).name} · {difficultyLabel(daily.difficulty)} · +{daily.xp} XP
                  </p>
                </div>
                <span
                  className={cn(
                    "inline-flex min-h-12 w-full shrink-0 items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition sm:min-h-0 sm:w-fit",
                    dailyDone
                      ? "border border-primary-200 bg-white text-primary group-hover:bg-primary-50"
                      : "bg-primary text-primary-foreground group-hover:bg-primary-hover",
                  )}
                >
                  <Play size={15} />
                  {dailyDone ? "Replay" : "Start battle"}
                </span>
              </div>
            </article>
          </Link>
        </section>
      ) : null}

      <div className="guide-tabs -mx-4 border-b border-line bg-white px-4 sm:-mx-8 sm:px-8">
        <div className="flex gap-1.5 overflow-x-auto py-2.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {FILTERS.map((item) => {
            const active = filter === item;
            return (
              <button
                key={item}
                type="button"
                onClick={() => setFilter(item)}
                className={cn(
                  "flex min-h-10 shrink-0 items-center gap-2 rounded-lg px-3.5 py-2.5 text-xs font-semibold transition",
                  active
                    ? "bg-primary-50 text-primary ring-1 ring-primary-100"
                    : "text-muted hover:bg-surface-2 hover:text-ink",
                )}
              >
                {item !== "all" ? <TechLogo topicId={item} size={14} /> : null}
                {item === "all" ? "All battles" : languageInfo(item).name}
              </button>
            );
          })}
        </div>
      </div>

      {visible.length === 0 ? (
        <EmptyState title="No challenges" body="Nothing here for this filter yet." />
      ) : (
        <section className="space-y-3">
          <div className="flex items-center justify-between gap-3 px-1">
            <h2 className="text-sm font-bold">All challenges</h2>
            <p className="text-xs text-muted">{visible.length} total</p>
          </div>
          {rest.map((challenge) => (
            <ChallengeCard key={challenge.id} challenge={challenge} player={player} />
          ))}
        </section>
      )}
    </div>
  );
}

export function ChallengePlayer({ challengeId }: { challengeId: string }) {
  const { player, setSkillDifficulty } = usePlayer();
  const [started, setStarted] = useState(false);
  const [sessionDifficulty, setSessionDifficulty] = useState<SkillDifficulty | null>(null);

  if (!player) return null;
  const challenge = getChallenge(challengeId);
  if (!challenge) return <ErrorState message="Challenge not found." />;

  const open = isChallengeUnlocked(challenge, player);
  const cleared = isChallengeComplete(challenge.id, player);
  const hintDifficulty = sessionDifficulty ?? player.skillDifficulty;

  const guideFooter = challenge.guideTopicId ? (
    <Link
      href={`/guides/${challenge.guideTopicId}`}
      className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
    >
      <BookOpen size={14} />
      Read {languageInfo(challenge.language).name} guide
    </Link>
  ) : undefined;

  if (!started) {
    return (
      <ChallengeEnterGate
        challenge={challenge}
        locked={!open}
        lockMessage={challengeLockMessage(challenge)}
        onStart={(difficulty) => {
          setSkillDifficulty(difficulty);
          setSessionDifficulty(difficulty);
          setStarted(true);
        }}
      />
    );
  }

  return (
    <ChallengeExerciseView
      challenge={challenge}
      cleared={cleared}
      hintDifficulty={hintDifficulty}
      onChangeDifficulty={() => setStarted(false)}
      footer={guideFooter}
    />
  );
}
