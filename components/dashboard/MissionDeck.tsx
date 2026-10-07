"use client";

import { achievements } from "@/lib/curriculum/achievements";
import { difficultyShort } from "@/lib/difficulty";
import { formatWhen } from "@/lib/dates";
import { isChallengeComplete, pickDailyChallenge } from "@/lib/progress";
import type { Player } from "@/lib/types";
import { cn } from "@/lib/cn";
import { ArrowRight, Medal, Play, Swords, Trophy } from "lucide-react";
import Link from "next/link";

export function MissionDeck({ player, embedded = false }: { player: Player; embedded?: boolean }) {
  const daily = pickDailyChallenge(player);
  const dailyCleared = isChallengeComplete(daily.id, player);
  const recent = [...player.unlockedAchievements]
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, 1)
    .map((e) => ({ e, a: achievements.find((i) => i.id === e.id) }))
    .filter((x) => x.a);

  const latest = recent[0];

  return (
    <section className="space-y-4">
      {!embedded ? (
        <div className="px-1">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-muted">Today</p>
          <h2 className="text-lg font-bold tracking-tight">Missions & rewards</h2>
        </div>
      ) : null}

      <div className={cn("grid gap-4", embedded ? "grid-cols-1" : "lg:grid-cols-5")}>
        {/* Daily battle */}
        <Link
          href={`/challenges/${daily.id}`}
          className={cn(
            "group relative overflow-hidden rounded-2xl border border-rose-200/70 bg-gradient-to-br from-rose-50/90 via-surface to-surface p-6 lg:p-7",
            !embedded && "lg:col-span-3",
          )}
        >
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-rose-200/40 blur-3xl" />
          <div className="relative">
            <p className="inline-flex items-center gap-1.5 rounded-full border border-rose-200/80 bg-surface/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-rose-600">
              <Swords size={11} />
              Daily battle
            </p>
            <h3 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">{daily.title}</h3>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">{daily.summary}</p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span
                className={cn(
                  "inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition",
                  dailyCleared
                    ? "border border-line bg-surface text-ink group-hover:bg-surface-2"
                    : "bg-primary text-primary-foreground group-hover:bg-primary-hover",
                )}
              >
                <Play size={15} />
                {dailyCleared ? "Replay challenge" : "Start battle"}
              </span>
              <span className="text-xs font-medium text-muted">
                +{daily.xp} XP · {difficultyShort(daily.difficulty)}
              </span>
            </div>
          </div>
        </Link>

        {/* Badge spotlight */}
        {latest ? (
          <div
            className={cn(
              "relative flex flex-col justify-between overflow-hidden rounded-2xl border border-line bg-surface-2 p-6",
              !embedded && "lg:col-span-2",
            )}
          >
            <div className="pointer-events-none absolute -bottom-6 -right-6 h-32 w-32 rounded-full bg-amber-200/30 blur-2xl" />
            <div className="relative">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted">Latest badge</p>
              <div className="mt-4 flex items-start gap-3">
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-amber-50 text-2xl ring-1 ring-amber-100">
                  🏅
                </span>
                <div className="min-w-0">
                  <h3 className="text-lg font-bold leading-tight">{latest.a?.title}</h3>
                  <p className="mt-1 text-xs text-muted">{formatWhen(latest.e.at)}</p>
                </div>
              </div>
            </div>
            <Link
              href="/achievements"
              className="relative mt-6 inline-flex items-center gap-1 text-sm font-semibold text-primary transition hover:gap-1.5"
            >
              View all badges <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div
            className={cn(
              "relative flex flex-col justify-between overflow-hidden rounded-2xl border border-dashed border-line bg-surface-2/50 p-6",
              !embedded && "lg:col-span-2",
            )}
          >
            <div className="pointer-events-none absolute -bottom-8 -right-8 h-36 w-36 rounded-full bg-primary-200/20 blur-3xl" />
            <div className="relative text-center sm:text-left">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-surface text-2xl ring-1 ring-line sm:mx-0">
                <Medal size={26} className="text-muted" strokeWidth={1.5} />
              </span>
              <h3 className="mt-4 text-lg font-bold">Earn your first badge</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Finish a lesson or clear a challenge to unlock achievements.
              </p>
            </div>
            <Link
              href="/guides"
              className="relative mt-6 inline-flex w-fit items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/20 transition hover:bg-primary-hover"
            >
              <Trophy size={15} />
              Read guides
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
