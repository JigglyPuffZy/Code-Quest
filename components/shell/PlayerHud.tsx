"use client";

import { Avatar } from "@/components/player/Avatar";
import { RingProgress } from "@/components/ui/RingProgress";
import { cn } from "@/lib/cn";
import type { LevelInfo, Player } from "@/lib/types";
import { Flame, LogOut } from "lucide-react";
import Link from "next/link";

type PlayerHudProps = {
  player: Player;
  level: LevelInfo;
  xpPct: number;
  compact?: boolean;
  onLogout: () => void;
  logoutPending?: boolean;
};

export function PlayerHud({
  player,
  level,
  xpPct,
  compact = false,
  onLogout,
  logoutPending = false,
}: PlayerHudProps) {
  if (compact) {
    return (
      <div className="flex items-center gap-1">
        <Link
          href="/profile"
          className="player-hud player-hud--compact flex items-center rounded-xl p-0.5 transition hover:shadow-md"
          aria-label={`${player.username}, level ${level.level}`}
        >
          <RingProgress value={xpPct} size={38} stroke={3}>
            <Avatar id={player.avatar} size="sm" className="h-7 w-7 rounded-lg border-0 text-[10px]" />
          </RingProgress>
        </Link>
        <button
          type="button"
          onClick={onLogout}
          disabled={logoutPending}
          className="grid h-9 w-9 place-items-center rounded-xl text-muted transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
          aria-label="Log out"
        >
          <LogOut size={15} />
        </button>
      </div>
    );
  }

  return (
    <div className="player-hud flex items-stretch overflow-hidden rounded-2xl">
      <Link
        href="/profile"
        className="flex min-w-0 flex-1 items-center gap-2.5 px-2.5 py-2 transition hover:bg-white/60 sm:gap-3 sm:px-3 sm:py-2.5"
      >
        <RingProgress value={xpPct} size={44} stroke={3.5}>
          <Avatar id={player.avatar} size="sm" className="h-8 w-8 rounded-lg border-0 text-xs" />
        </RingProgress>

        <div className="min-w-0">
          <p className="truncate text-sm font-bold leading-tight tracking-tight">{player.username}</p>
          <p className="mt-0.5 flex flex-wrap items-center gap-x-1.5 gap-y-0 text-[10px] font-semibold">
            <span className="inline-flex items-center gap-0.5 text-orange-500">
              <Flame size={10} strokeWidth={2.5} />
              {player.streak}d streak
            </span>
            <span className="text-line" aria-hidden>·</span>
            <span className="text-primary">Lv {level.level}</span>
            <span className="hidden text-muted sm:inline">· {level.title}</span>
          </p>
        </div>

        <div className="ml-auto hidden shrink-0 text-right sm:block">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted">XP</p>
          <p className="text-xs font-bold tabular-nums text-primary">{Math.round(xpPct)}%</p>
        </div>
      </Link>

      <div className="player-hud-divider hidden w-px self-stretch sm:block" aria-hidden />

      <button
        type="button"
        onClick={onLogout}
        disabled={logoutPending}
        className={cn(
          "grid w-10 shrink-0 place-items-center text-muted transition",
          "hover:bg-red-50 hover:text-red-600 disabled:opacity-50 sm:w-11",
        )}
        aria-label={logoutPending ? "Logging out" : "Log out"}
      >
        <LogOut size={15} />
      </button>
    </div>
  );
}
