"use client";

import { usePlayer } from "@/components/player/PlayerProvider";
import { RingProgress } from "@/components/ui/RingProgress";
import { DAILY_GOAL_XP, dailyGoalProgress } from "@/lib/dashboard/insights";
import { Target, Zap } from "lucide-react";
import Link from "next/link";

export function DailyGoalCard() {
  const { player } = usePlayer();
  if (!player) return null;

  const goal = dailyGoalProgress(player);
  const pct = goal.ratio * 100;

  return (
    <article className="dash-daily relative overflow-hidden rounded-2xl border border-line bg-white p-5 sm:p-6">
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-amber-200/30 blur-3xl" aria-hidden />
      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-600">
            <Target size={12} />
            Today&apos;s goal
          </p>
          <h2 className="mt-2 text-xl font-bold tracking-tight">
            {goal.complete ? "Daily goal crushed!" : `Earn ${DAILY_GOAL_XP} XP today`}
          </h2>
          <p className="mt-1.5 text-sm text-muted">
            {goal.complete
              ? "You hit today's target. Extra XP still counts toward your level."
              : goal.earned > 0
                ? `${goal.remaining} XP to go — one lesson or challenge can finish it.`
                : "Start a lesson or arena fight to begin today's run."}
          </p>
          {!goal.complete ? (
            <Link
              href="/guides"
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
            >
              <Zap size={13} />
              Open guides
            </Link>
          ) : null}
        </div>

        <div className="flex items-center gap-4 self-center sm:self-auto">
          <RingProgress
            value={pct}
            size={92}
            stroke={7}
            trackColor="#fef3c7"
            fromColor="#f59e0b"
            toColor="#fbbf24"
          >
            <div className="text-center">
              <p className="text-lg font-extrabold leading-none tabular-nums text-amber-600">{goal.earned}</p>
              <p className="text-[8px] font-bold uppercase text-muted">/ {goal.target}</p>
            </div>
          </RingProgress>
        </div>
      </div>
    </article>
  );
}
