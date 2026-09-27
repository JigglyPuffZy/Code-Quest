"use client";

import { CodeQuestIntro } from "@/components/dashboard/CodeQuestIntro";
import { JumpLane } from "@/components/dashboard/JumpLane";
import { MissionDeck } from "@/components/dashboard/MissionDeck";
import { PathDeck } from "@/components/dashboard/PathDeck";
import { usePlayer } from "@/components/player/PlayerProvider";
import { RingProgress } from "@/components/ui/RingProgress";
import { languageInfo } from "@/lib/curriculum/index";
import { continueLesson } from "@/lib/progress";
import { ArrowRight, Flame, Play, Sparkles } from "lucide-react";
import Link from "next/link";

export function DashboardView() {
  const { player, level, xp } = usePlayer();
  if (!player) return null;

  const next = continueLesson(player);
  const xpPct = (level.into / level.needed) * 100;

  return (
    <div className="space-y-10">
      {/* Command center hero */}
      <section className="dash-hero relative overflow-hidden rounded-2xl border border-line bg-surface-2">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary-200/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 left-1/3 h-32 w-32 rounded-full bg-violet-200/20 blur-3xl" />

        <div className="relative flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <p className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-muted">
              <Sparkles size={11} className="text-primary" />
              Command center
            </p>
            <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Hey, <span className="text-primary">{player.username}</span>
            </h1>
            <p className="mt-2 text-sm text-muted">
              {level.title} rank · {xp.toLocaleString()} XP earned
            </p>
            <p className="mt-1 text-xs text-muted">
              {level.into} / {level.needed} XP to reach level {level.level + 1}
            </p>
          </div>

          <div className="flex items-center gap-5 sm:gap-6">
            <div className="rounded-xl border border-line bg-white px-5 py-4 text-center">
              <p className="flex items-center justify-center gap-1.5 text-2xl font-bold tabular-nums text-orange-500">
                <Flame size={22} strokeWidth={1.75} />
                {player.streak}
              </p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-muted">day streak</p>
            </div>
            <RingProgress value={xpPct} size={88} stroke={6}>
              <div className="text-center">
                <p className="text-xl font-bold leading-none text-primary">{level.level}</p>
                <p className="text-[8px] font-bold uppercase text-muted">level</p>
              </div>
            </RingProgress>
          </div>
        </div>
      </section>

      <CodeQuestIntro playerId={player.id} username={player.username} />

      {/* Continue lesson */}
      {next ? (
        <Link href={`/learn/${next.language}/${next.id}`} className="group block">
          <article
            className="relative overflow-hidden rounded-2xl border border-line bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-900/5 sm:p-7"
          >
            <div className="absolute inset-y-0 left-0 w-1 bg-primary" aria-hidden />
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0 flex-1 pl-2">
                <p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                  <Play size={12} />
                  Pick up where you left off
                </p>
                <h2 className="mt-2 text-2xl font-bold leading-tight tracking-tight sm:text-3xl">{next.title}</h2>
                <p className="mt-2 text-sm text-muted">
                  {languageInfo(next.language).name} · {next.minutes} min · +{next.xp} XP
                </p>
              </div>
              <span
                className="inline-flex w-fit shrink-0 items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/20 transition group-hover:bg-primary-hover"
              >
                Resume <ArrowRight size={16} />
              </span>
            </div>
          </article>
        </Link>
      ) : null}

      <JumpLane />
      <PathDeck player={player} />
      <MissionDeck player={player} />
    </div>
  );
}
