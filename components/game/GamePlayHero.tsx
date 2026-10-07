"use client";

import { usePlayer } from "@/components/player/PlayerProvider";
import { DifficultyPicker } from "@/components/ui/DifficultyPicker";
import { SKILL_DIFFICULTIES } from "@/lib/difficulty";
import { GAME_MODES } from "@/lib/game/modes";
import { currentGameLevel, gameProgressSummary } from "@/lib/game/progress";
import { GAME_TRACKS, stackLabel } from "@/lib/game/tracks";
import { ArrowRight, Gamepad2, Layers, Play, Zap } from "lucide-react";
import Link from "next/link";

export function GamePlayHero() {
  const { player, setSkillDifficulty } = usePlayer();
  if (!player) return null;

  const track = GAME_TRACKS[player.gameTrack];
  const skill = SKILL_DIFFICULTIES[player.skillDifficulty];
  const summary = gameProgressSummary(player);
  const level = currentGameLevel(player);
  const mode = GAME_MODES[level.mode];
  const pct = Math.round((summary.cleared / summary.total) * 100);
  const playHref = `/game/${player.gameTrack}/${level.level}`;

  return (
    <article
      className="game-play-hero relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-violet-950 p-5 text-white shadow-xl shadow-violet-950/30 sm:p-6"
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-primary/30 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -bottom-14 left-1/3 h-28 w-28 rounded-full bg-cyan-400/15 blur-3xl" aria-hidden />

      <div className="relative space-y-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white/80">
              <Gamepad2 size={11} />
              Game mode
            </p>

            <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
              <span className="mr-1.5">{track.emoji}</span>
              {track.label}
            </h2>

            <p className="mt-1.5 text-sm font-semibold text-white/80">
              Level {level.level} · {mode.emoji} {mode.label}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 rounded-full border border-white/12 bg-white/8 px-2.5 py-1 text-[10px] font-bold text-white/85">
                <Layers size={10} />
                {stackLabel(player.gameTrack, player)}
              </span>
              <span className="inline-flex items-center rounded-full border border-white/12 bg-white/8 px-2.5 py-1 text-[10px] font-bold text-white/85">
                {skill.label}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-1 text-[10px] font-bold text-amber-200">
                <Zap size={10} />
                +{level.xp} XP
              </span>
            </div>
          </div>

          <Link
            href={playHref}
            className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-xl bg-surface px-5 py-3 text-sm font-bold text-ink shadow-lg shadow-black/20 transition hover:bg-primary-50 hover:shadow-xl"
          >
            <Play size={16} fill="currentColor" />
            Play L{level.level}
            <ArrowRight size={15} />
          </Link>
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between gap-2 text-[10px] font-bold uppercase tracking-wider text-white/50">
            <span>Campaign progress</span>
            <span className="tabular-nums">
              {summary.cleared}/{summary.total} · {pct}%
            </span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary via-violet-400 to-cyan-400 transition-all duration-700"
              style={{ width: `${Math.max(pct, summary.cleared > 0 ? 4 : 0)}%` }}
            />
          </div>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-semibold text-white/55">
            <span>{summary.unlocked} levels unlocked</span>
            <span>{mode.label} mini-game</span>
          </div>
        </div>

        <div
          className="rounded-xl border border-white/10 bg-white/5 p-3 sm:p-3.5"
          onClick={(event) => event.stopPropagation()}
          onKeyDown={(event) => event.stopPropagation()}
        >
          <DifficultyPicker
            variant="dark"
            layout="compact"
            value={player.skillDifficulty}
            onChange={setSkillDifficulty}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-white/45">
            Tap a difficulty to reveal its emoji
          </p>
          <Link
            href="/game"
            className="text-[11px] font-bold text-white/60 transition hover:text-white"
          >
            Campaign setup →
          </Link>
        </div>
      </div>
    </article>
  );
}
