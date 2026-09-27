"use client";

import { TechLogo, TechLogoBadge } from "@/components/icons/TechLogo";
import { usePlayer } from "@/components/player/PlayerProvider";
import { ErrorState, EmptyState } from "@/components/ui/States";
import { ExerciseView } from "@/components/workspace/ExerciseView";
import { cn } from "@/lib/cn";
import { challenges, getChallenge, languageInfo } from "@/lib/curriculum/index";
import {
  isChallengeComplete,
  isChallengeUnlocked,
  lessonCount,
  pickDailyChallenge,
} from "@/lib/progress";
import type { Challenge, LanguageId } from "@/lib/types";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Lock,
  Play,
  Sparkles,
  Swords,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const FILTERS = ["all", "python", "javascript", "typescript", "java"] as const;

const DIFFICULTY_STYLE: Record<
  Challenge["difficulty"],
  { soft: string; accent: string; bar: string; ring: string }
> = {
  Easy: {
    soft: "bg-emerald-50",
    accent: "text-emerald-600",
    bar: "bg-emerald-500",
    ring: "ring-emerald-100",
  },
  Medium: {
    soft: "bg-amber-50",
    accent: "text-amber-600",
    bar: "bg-amber-500",
    ring: "ring-amber-100",
  },
  Hard: {
    soft: "bg-rose-50",
    accent: "text-rose-600",
    bar: "bg-rose-500",
    ring: "ring-rose-100",
  },
};

const LANG_STYLE: Record<LanguageId, { soft: string; accent: string; ring: string }> = {
  python: { soft: "bg-emerald-50", accent: "text-emerald-600", ring: "ring-emerald-100" },
  javascript: { soft: "bg-amber-50", accent: "text-amber-600", ring: "ring-amber-100" },
  typescript: { soft: "bg-sky-50", accent: "text-sky-600", ring: "ring-sky-100" },
  java: { soft: "bg-orange-50", accent: "text-orange-600", ring: "ring-orange-100" },
};

function ChallengeCard({
  challenge,
  player,
  featured = false,
}: {
  challenge: Challenge;
  player: NonNullable<ReturnType<typeof usePlayer>["player"]>;
  featured?: boolean;
}) {
  const open = isChallengeUnlocked(challenge, player);
  const done = isChallengeComplete(challenge.id, player);
  const diff = DIFFICULTY_STYLE[challenge.difficulty];
  const lang = LANG_STYLE[challenge.language];

  const body = (
    <article
      className={cn(
        "group relative overflow-hidden rounded-2xl border bg-white transition-all duration-200",
        open
          ? "border-line hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-900/5"
          : "border-line/80 bg-surface-2/50",
        featured && "border-rose-200/70",
      )}
    >
      <div className={cn("absolute left-0 top-0 bottom-0 w-1", diff.bar)} aria-hidden />

      <div className="flex flex-col gap-4 p-5 pl-6 sm:flex-row sm:items-center">
        <div className="flex min-w-0 flex-1 items-start gap-4">
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
                className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ring-1",
                  diff.soft,
                  diff.accent,
                  diff.ring,
                )}
              >
                {challenge.difficulty}
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
                Unlock after {challenge.requiresLessons}{" "}
                {languageInfo(challenge.language).name} lessons (
                {lessonCount(player, challenge.language)} done)
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-end">
          <span className="inline-flex items-center gap-1 rounded-full bg-surface-2 px-3 py-1 text-xs font-bold text-primary">
            <Zap size={12} />
            +{challenge.xp} XP
          </span>

          {open ? (
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition",
                done
                  ? "border border-line text-muted group-hover:text-ink"
                  : "bg-primary text-primary-foreground group-hover:bg-primary-hover",
              )}
            >
              {done ? "Review" : "Enter"}
              <ArrowRight size={14} />
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-xl border border-line px-4 py-2 text-sm font-medium text-muted">
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
    <div className="space-y-8">
      {/* Arena hero */}
      <section className="arena-hero relative overflow-hidden rounded-2xl border border-line bg-surface-2">
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-rose-300/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 left-0 h-40 w-40 rounded-full bg-primary-300/15 blur-3xl" />

        <div className="relative flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <p className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-muted">
              <Swords size={12} className="text-rose-500" />
              Arena
            </p>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Coding battles</h1>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Standalone problems with instant checks. Harder fights unlock as you finish lessons.
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

      {/* Today's battle */}
      {(filter === "all" || filter === daily.language) && dailyOpen ? (
        <section>
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sparkles size={15} className="text-rose-500" />
              <h2 className="text-sm font-bold">Today&apos;s battle</h2>
            </div>
            {dailyDone ? (
              <span className="text-xs font-medium text-ok">Cleared — replay for practice</span>
            ) : null}
          </div>

          <Link href={`/challenges/${daily.id}`} className="group block">
            <article
              className="relative overflow-hidden rounded-2xl border border-rose-200/70 bg-gradient-to-br from-rose-50/80 via-white to-white p-6 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-rose-900/5 sm:p-7"
            >
              <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-rose-200/30 blur-2xl" />
              <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-rose-600">
                    Featured challenge
                  </p>
                  <h3 className="mt-2 text-2xl font-bold tracking-tight">{daily.title}</h3>
                  <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted">{daily.summary}</p>
                  <p className="mt-3 text-xs font-medium text-muted">
                    {languageInfo(daily.language).name} · {daily.difficulty} · +{daily.xp} XP
                  </p>
                </div>
                <span
                  className={cn(
                    "inline-flex w-fit shrink-0 items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition",
                    dailyDone
                      ? "border border-line bg-white text-ink group-hover:bg-surface-2"
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

      {/* Filters */}
      <div className="guide-tabs -mx-5 border-b border-line bg-white px-5 sm:-mx-8 sm:px-8">
        <div className="flex gap-1 overflow-x-auto py-2">
          {FILTERS.map((item) => {
            const active = filter === item;
            const lang = item !== "all" ? LANG_STYLE[item] : null;
            return (
              <button
                key={item}
                type="button"
                onClick={() => setFilter(item)}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition",
                  active
                    ? lang
                      ? `${lang.soft} ${lang.accent} ring-1 ring-black/5`
                      : "bg-surface-2 text-ink"
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

      {/* Challenge deck */}
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
  const { player } = usePlayer();
  if (!player) return null;
  const challenge = getChallenge(challengeId);
  if (!challenge) return <ErrorState message="Challenge not found." />;

  const open = isChallengeUnlocked(challenge, player);
  const cleared = isChallengeComplete(challenge.id, player);

  return (
    <ExerciseView
      backHref="/challenges"
      backLabel="Arena"
      eyebrow={`${languageInfo(challenge.language).name} · ${challenge.difficulty}`}
      title={challenge.title}
      meta={`${challenge.xp} XP · ${cleared ? "Cleared" : "Unsolved"}`}
      blocks={challenge.blocks}
      exercise={challenge.exercise}
      language={challenge.language as LanguageId}
      kind="challenge"
      exerciseId={challenge.id}
      alreadyCleared={cleared}
      locked={!open}
      lockMessage={`Clear ${challenge.requiresLessons} ${languageInfo(challenge.language).name} lessons first.`}
      footer={
        challenge.guideTopicId ? (
          <Link
            href={`/guides/${challenge.guideTopicId}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
          >
            <BookOpen size={14} />
            Read {languageInfo(challenge.language).name} guide
          </Link>
        ) : undefined
      }
    />
  );
}
