"use client";

import { ActiveQuestCard } from "@/components/dashboard/ActiveQuestCard";
import { CodeQuestIntro } from "@/components/dashboard/CodeQuestIntro";
import { DailyGoalCard } from "@/components/dashboard/DailyGoalCard";
import { DashboardZone } from "@/components/dashboard/DashboardZone";
import { JumpLane } from "@/components/dashboard/JumpLane";
import { MiniLeaderboard } from "@/components/dashboard/MiniLeaderboard";
import { MissionDeck } from "@/components/dashboard/MissionDeck";
import { ContinueGuideCard } from "@/components/dashboard/ContinueGuideCard";
import { PathDeck } from "@/components/dashboard/PathDeck";
import { SideQuestDeck } from "@/components/dashboard/SideQuestDeck";
import { StatsStrip } from "@/components/dashboard/StatsStrip";
import { GamePlayHero } from "@/components/game/GamePlayHero";
import { usePlayer } from "@/components/player/PlayerProvider";
import { RingProgress } from "@/components/ui/RingProgress";
import {
  ArrowRight,
  BookOpen,
  Flame,
  Gamepad2,
  Play,
} from "lucide-react";
import Link from "next/link";

export function DashboardView() {
  const { player, level, xp } = usePlayer();
  if (!player) return null;

  const xpPct = (level.into / level.needed) * 100;

  return (
    <div className="space-y-12">
      {/* Welcome + stats */}
      <section className="dash-hero relative overflow-hidden rounded-2xl border border-line bg-surface-2">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary-200/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 left-1/3 h-32 w-32 rounded-full bg-violet-200/20 blur-3xl" />

        <div className="relative p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <p className="inline-flex items-center rounded-full border border-line bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-muted">
                Your home base
              </p>
              <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Welcome back, <span className="text-primary">{player.username}</span>
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
                Start with <strong className="font-semibold text-ink">Step 1</strong> below, then check your daily goals and learning paths.
              </p>
            </div>

            <div className="flex items-center gap-4 sm:gap-5">
              <div className="rounded-xl border border-line bg-white px-4 py-3 text-center sm:px-5 sm:py-4">
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
              <div className="hidden rounded-xl border border-line bg-white px-4 py-3 text-center sm:block">
                <p className="text-lg font-bold tabular-nums text-ink">{xp.toLocaleString()}</p>
                <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-muted">total XP</p>
              </div>
            </div>
          </div>

          <div className="mt-2 border-t border-line/80 pt-5">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted">Your progress at a glance</p>
            <StatsStrip />
          </div>
        </div>
      </section>

      {/* 1 — Primary actions */}
      <DashboardZone
        step={1}
        title="Start here"
        hint="The fastest way forward: resume learning or jump into the game campaign."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <ContinueGuideCard />

          <div className="h-full">
            <p className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-muted">
              <Gamepad2 size={11} className="text-violet-600" />
              Game mode
            </p>
            <GamePlayHero />
          </div>
        </div>
      </DashboardZone>

      {/* 2 — Daily focus */}
      <DashboardZone
        step={2}
        title="Today's focus"
        hint="Track your daily XP goal and the main quest you're working on."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <DailyGoalCard />
          <ActiveQuestCard />
        </div>
      </DashboardZone>

      {/* 3 — Quick nav */}
      <DashboardZone
        step={3}
        title="Quick navigation"
        hint="Shortcuts to the main areas of CodeQuest. Hover the row to pause scrolling."
      >
        <JumpLane embedded />
      </DashboardZone>

      {/* 4 — Learning */}
      <DashboardZone
        step={4}
        title="Guides & progress"
        hint="Read guide courses — then practice in Arena or Game mode."
      >
        <PathDeck embedded />
      </DashboardZone>

      {/* 5 — Bonus */}
      <DashboardZone
        step={5}
        title="Bonus missions"
        hint="Optional side quests for extra XP — not required, but nice for a quick win."
      >
        <SideQuestDeck embedded />
      </DashboardZone>

      {/* 6 — Social & daily missions */}
      <DashboardZone
        step={6}
        title="Compete & collect"
        hint="Compare with others, tackle today's arena fight, and see recent rewards."
      >
        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <MissionDeck player={player} embedded />
          <MiniLeaderboard />
        </div>
      </DashboardZone>

      {/* Tour — bottom so it doesn't block action */}
      <DashboardZone
        title="How CodeQuest works"
        hint="New here? This quick tour explains Read → Write → Battle → Rank up."
        panel
      >
        <CodeQuestIntro playerId={player.id} username={player.username} />
      </DashboardZone>
    </div>
  );
}
