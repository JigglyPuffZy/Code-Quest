"use client";

import { StackPicker } from "@/components/game/StackPicker";
import { usePlayer } from "@/components/player/PlayerProvider";
import { DifficultyPicker } from "@/components/ui/DifficultyPicker";
import { ErrorState } from "@/components/ui/States";
import { cn } from "@/lib/cn";
import { SKILL_DIFFICULTIES } from "@/lib/difficulty";
import { buildGameLevelForPlayer } from "@/lib/game";
import { GAME_MODES, tierForLevel } from "@/lib/game/modes";
import {
  gameProgressSummary,
  isGameLevelComplete,
  isGameLevelUnlocked,
  maxUnlockedGameLevel,
} from "@/lib/game/progress";
import { GAME_TRACKS, stackLabel, type GameTrackId } from "@/lib/game/tracks";
import { MAX_GAME_LEVEL } from "@/lib/game/types";
import { CheckCircle2, ChevronLeft, Gamepad2, Lock, Play } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const PAGE_SIZE = 25;

export function GameHub({ track }: { track: GameTrackId }) {
  const {
    player,
    setSkillDifficulty,
    setGameTrack,
    setFrontendStack,
    setBackendStack,
  } = usePlayer();
  const [page, setPage] = useState(0);

  useEffect(() => {
    if (player && player.gameTrack !== track) setGameTrack(track);
  }, [track, player, setGameTrack]);

  if (!player) return null;
  if (!GAME_TRACKS[track]) {
    return <ErrorState message="Unknown game track." />;
  }

  const meta = GAME_TRACKS[track];
  const summary = gameProgressSummary(player, track, player.skillDifficulty);
  const unlocked = maxUnlockedGameLevel(player, track, player.skillDifficulty);
  const current = buildGameLevelForPlayer(player, track, Math.min(unlocked, MAX_GAME_LEVEL));
  const mode = GAME_MODES[current.mode];

  const pages = Math.ceil(MAX_GAME_LEVEL / PAGE_SIZE);
  const start = page * PAGE_SIZE + 1;
  const end = Math.min(MAX_GAME_LEVEL, start + PAGE_SIZE - 1);
  const levels = Array.from({ length: end - start + 1 }, (_, index) => start + index);

  return (
    <div className="space-y-8">
      <Link href="/game" className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline">
        <ChevronLeft size={14} />
        All tracks
      </Link>

      <section className="relative overflow-hidden rounded-2xl border border-line bg-gradient-to-br from-slate-900 via-slate-900 to-violet-950 p-6 text-white sm:p-8">
        <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-primary/25 blur-3xl" aria-hidden />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">
              <Gamepad2 size={12} />
              {meta.emoji} {meta.label}
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">100 levels · separate per difficulty</h1>
            <p className="mt-2 max-w-2xl text-sm text-white/75">{meta.blurb}</p>
            <p className="mt-2 text-sm font-semibold text-white/80">{stackLabel(track, player)}</p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-white/55">
              {summary.cleared} cleared · level {unlocked} unlocked · {tierForLevel(unlocked)} ·{" "}
              {SKILL_DIFFICULTIES[player.skillDifficulty].label}
            </p>
            <div className="mt-5 max-w-2xl">
              <DifficultyPicker
                variant="dark"
                value={player.skillDifficulty}
                onChange={setSkillDifficulty}
              />
            </div>
          </div>
          <Link
            href={`/game/${track}/${current.level}`}
            className="inline-flex w-fit items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-900 shadow-lg transition hover:bg-primary-50"
          >
            <Play size={16} fill="currentColor" />
            Play level {current.level}
          </Link>
        </div>
      </section>

      <section className="rounded-2xl border border-line bg-white p-5 sm:p-6">
        <StackPicker
          track={track}
          frontendFramework={player.frontendFramework}
          frontendLanguage={player.frontendLanguage}
          backendFramework={player.backendFramework}
          backendLanguage={player.backendLanguage}
          onFrontendChange={setFrontendStack}
          onBackendChange={setBackendStack}
        />
      </section>

      <section className="space-y-4 rounded-2xl border border-line bg-white p-5 sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold">Level map</h2>
            <p className="mt-1 text-sm text-muted">
              {SKILL_DIFFICULTIES[player.skillDifficulty].label} difficulty · tap a level to play
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-lg border border-line px-3 py-1.5 text-xs font-bold disabled:opacity-40"
              disabled={page === 0}
              onClick={() => setPage((value) => Math.max(0, value - 1))}
            >
              Prev
            </button>
            <span className="text-xs text-muted">{start}–{end} of {MAX_GAME_LEVEL}</span>
            <button
              type="button"
              className="rounded-lg border border-line px-3 py-1.5 text-xs font-bold disabled:opacity-40"
              disabled={page >= pages - 1}
              onClick={() => setPage((value) => Math.min(pages - 1, value + 1))}
            >
              Next
            </button>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-2 sm:grid-cols-8 md:grid-cols-10">
          {levels.map((level) => {
            const record = buildGameLevelForPlayer(player, track, level);
            const modeMeta = GAME_MODES[record.mode];
            const open = isGameLevelUnlocked(track, player.skillDifficulty, level, player);
            const done = isGameLevelComplete(track, player.skillDifficulty, level, player);
            const active = level === unlocked && !done;

            const tile = (
              <div
                className={cn(
                  "relative flex aspect-square flex-col items-center justify-center rounded-xl border text-center transition",
                  done && "border-emerald-200 bg-emerald-50 text-emerald-700",
                  active && "border-primary-300 bg-primary-50 text-primary shadow-md shadow-primary/10",
                  open && !done && !active && "border-line bg-white hover:-translate-y-0.5 hover:shadow-md",
                  !open && "border-line bg-surface-2 text-muted",
                )}
              >
                <span className="text-[10px] leading-none opacity-70">{modeMeta.emoji}</span>
                <span className="mt-0.5 text-sm font-bold tabular-nums">{level}</span>
                {done ? (
                  <CheckCircle2 className="absolute right-1 top-1 size-3 text-emerald-500" />
                ) : !open ? (
                  <Lock className="absolute right-1 top-1 size-3 opacity-50" />
                ) : null}
              </div>
            );

            if (!open) {
              return (
                <div key={level} title={`Level ${level} locked`} className="cursor-not-allowed">
                  {tile}
                </div>
              );
            }

            return (
              <Link key={level} href={`/game/${track}/${level}`} title={`${modeMeta.label} · level ${level}`}>
                {tile}
              </Link>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-3 border-t border-line pt-4 text-[10px] font-semibold uppercase tracking-wider text-muted">
          <span className="inline-flex items-center gap-1.5">
            <span className="size-3 rounded border border-primary-300 bg-primary-50" />
            Current
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="size-3 rounded border border-emerald-200 bg-emerald-50" />
            Cleared
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="size-3 rounded border border-line bg-surface-2" />
            Locked
          </span>
        </div>
      </section>
    </div>
  );
}
