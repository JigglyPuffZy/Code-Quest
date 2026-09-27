"use client";

import { Avatar } from "@/components/player/Avatar";
import { usePlayer } from "@/components/player/PlayerProvider";
import { totalXp } from "@/lib/gamification";
import { demoRivals, type BoardEntry } from "@/lib/leaderboard";
import { createClient } from "@/lib/supabase/client";
import { ArrowRight, Crown } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export function MiniLeaderboard() {
  const { player, supabaseEnabled, xp } = usePlayer();
  const [rows, setRows] = useState<BoardEntry[] | null>(null);

  useEffect(() => {
    if (!player) return;
    if (!supabaseEnabled) {
      const you: BoardEntry = {
        id: player.id,
        username: player.username,
        avatar: player.avatar,
        xp,
        streak: player.streak,
      };
      setRows(
        [...demoRivals.filter((entry) => entry.id !== player.id), you].sort(
          (a, b) => b.xp - a.xp || a.username.localeCompare(b.username),
        ),
      );
      return;
    }

    let cancelled = false;
    (async () => {
      const { data } = await createClient()
        .from("profiles")
        .select("id, username, avatar, xp, streak")
        .order("xp", { ascending: false })
        .limit(8);
      if (!cancelled) setRows((data ?? []) as BoardEntry[]);
    })();

    return () => {
      cancelled = true;
    };
  }, [player, supabaseEnabled, xp]);

  const { top, rank } = useMemo(() => {
    if (!rows || !player) return { top: [], rank: null };
    const index = rows.findIndex((entry) => entry.id === player.id);
    return {
      top: rows.slice(0, 5),
      rank: index >= 0 ? index + 1 : null,
    };
  }, [rows, player]);

  if (!player || !rows) return null;

  return (
    <section className="rounded-2xl border border-line bg-white p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-muted">
            <Crown size={12} className="text-amber-500" />
            Leaderboard
          </p>
          <h2 className="mt-1 text-lg font-bold tracking-tight">Top learners</h2>
          {rank ? (
            <p className="mt-1 text-xs text-muted">
              You&apos;re <span className="font-bold text-primary">#{rank}</span> with {totalXp(player).toLocaleString()} XP
            </p>
          ) : null}
        </div>
        <Link
          href="/leaderboard"
          className="inline-flex items-center gap-1 rounded-full border border-line px-3 py-1.5 text-[10px] font-bold text-muted transition hover:border-primary-200 hover:text-primary"
        >
          Full board <ArrowRight size={12} />
        </Link>
      </div>

      <ol className="mt-4 space-y-2">
        {top.map((entry, index) => {
          const you = entry.id === player.id;
          return (
            <li
              key={entry.id}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 ${you ? "bg-primary-50 ring-1 ring-primary-100" : "bg-surface-2"}`}
            >
              <span
                className={`w-5 text-center text-xs font-bold tabular-nums ${index < 3 ? "text-primary" : "text-muted"}`}
              >
                {index + 1}
              </span>
              <Avatar id={entry.avatar} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">
                  {entry.username}
                  {you ? <span className="ml-1.5 text-[10px] font-bold text-primary">YOU</span> : null}
                </p>
                <p className="text-[10px] text-muted">{entry.streak}d streak</p>
              </div>
              <p className="text-sm font-bold tabular-nums text-primary">{entry.xp.toLocaleString()}</p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
