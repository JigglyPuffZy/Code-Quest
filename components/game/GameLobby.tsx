"use client";

import { StackPicker } from "@/components/game/StackPicker";
import { usePlayer } from "@/components/player/PlayerProvider";
import { DifficultyPicker } from "@/components/ui/DifficultyPicker";
import { cn } from "@/lib/cn";
import { SKILL_DIFFICULTIES } from "@/lib/difficulty";
import { GAME_TRACKS, stackLabel, type GameTrackId } from "@/lib/game/tracks";
import { clearedLevelsForTrack, maxUnlockedGameLevel } from "@/lib/game/progress";
import { MAX_GAME_LEVEL } from "@/lib/game/types";
import { ArrowRight, Gamepad2, Layers } from "lucide-react";
import Link from "next/link";

const TRACK_ORDER: GameTrackId[] = ["core", "frontend", "backend"];

export function GameLobby() {
  const { player, setGameTrack, setSkillDifficulty, setFrontendStack, setBackendStack } = usePlayer();

  if (!player) return null;

  const skill = SKILL_DIFFICULTIES[player.skillDifficulty];
  const unlocked = maxUnlockedGameLevel(player, player.gameTrack, player.skillDifficulty);

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-violet-950 p-6 text-white sm:p-8">
        <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-primary/25 blur-3xl" aria-hidden />
        <p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">
          <Gamepad2 size={12} />
          Game center
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Pick your campaign</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/75">
          Step 1: choose a track · Step 2: set difficulty & stack · Step 3: open the level map and play.
        </p>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">1</span>
          <div>
            <h2 className="text-lg font-bold">Choose a dev track</h2>
            <p className="text-sm text-muted">Each track has 100 levels per difficulty.</p>
          </div>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {TRACK_ORDER.map((trackId) => {
            const track = GAME_TRACKS[trackId];
            const active = player.gameTrack === trackId;
            const cleared = clearedLevelsForTrack(player, trackId, player.skillDifficulty);
            return (
              <button
                key={trackId}
                type="button"
                onClick={() => setGameTrack(trackId)}
                className={cn(
                  "rounded-2xl border p-5 text-left transition hover:-translate-y-0.5",
                  active
                    ? "border-primary-300 bg-gradient-to-br from-primary-50 to-white shadow-md shadow-primary/10 ring-1 ring-primary-100"
                    : "border-line bg-white hover:shadow-lg hover:shadow-slate-900/5",
                )}
              >
                <p className="text-3xl">{track.emoji}</p>
                <h3 className="mt-2 text-xl font-bold">{track.label}</h3>
                <p className="mt-1 text-sm text-muted">{track.blurb}</p>
                <p className="mt-4 text-xs font-semibold text-primary">
                  {cleared}/{MAX_GAME_LEVEL} cleared on {skill.label}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      <section className="space-y-5 overflow-hidden rounded-2xl border border-line bg-gradient-to-br from-white via-surface-2/40 to-primary-50/30 p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground shadow-sm shadow-primary/25">2</span>
          <div>
            <h2 className="text-lg font-bold">Set difficulty & stack</h2>
            <p className="text-sm text-muted">
              Questions change per difficulty — Senior is brutal, Beginner gives you a hand. 👀
            </p>
          </div>
        </div>
        <DifficultyPicker value={player.skillDifficulty} onChange={setSkillDifficulty} />
        <div className="border-t border-line/80 pt-5">
          <StackPicker
            track={player.gameTrack}
            frontendFramework={player.frontendFramework}
            frontendLanguage={player.frontendLanguage}
            backendFramework={player.backendFramework}
            backendLanguage={player.backendLanguage}
            onFrontendChange={setFrontendStack}
            onBackendChange={setBackendStack}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-primary-200 bg-gradient-to-r from-primary-50 via-white to-violet-50 p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">3</span>
            <div>
              <h2 className="text-lg font-bold">Ready to play</h2>
              <p className="mt-1 text-sm text-muted">
                <span className="font-semibold text-ink">{GAME_TRACKS[player.gameTrack].label}</span> ·{" "}
                {stackLabel(player.gameTrack, player)} · {skill.label} · level {unlocked} unlocked
              </p>
            </div>
          </div>
          <Link
            href={`/game/${player.gameTrack}`}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-md shadow-primary/20 transition hover:bg-primary-hover"
          >
            <Layers size={16} />
            Open level map
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
