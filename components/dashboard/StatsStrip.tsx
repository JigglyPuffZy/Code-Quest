"use client";

import { usePlayer } from "@/components/player/PlayerProvider";
import { playerStats } from "@/lib/dashboard/insights";
import { BookOpen, Medal, Scroll, Swords } from "lucide-react";

const ITEMS = [
  { key: "lessons" as const, label: "Lessons", hint: "completed", icon: BookOpen },
  { key: "challenges" as const, label: "Arena", hint: "cleared", icon: Swords },
  { key: "guides" as const, label: "Guides", hint: "read", icon: Scroll },
  { key: "quests" as const, label: "Quests", hint: "claimed", icon: Medal },
];

export function StatsStrip() {
  const { player } = usePlayer();
  if (!player) return null;

  const stats = playerStats(player);

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {ITEMS.map(({ key, label, hint, icon: Icon }) => (
        <div
          key={key}
          className="rounded-xl border border-line/80 bg-white/80 px-3 py-2.5 backdrop-blur-sm"
        >
          <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted">
            <Icon size={11} className="text-primary" />
            {label}
          </p>
          <p className="mt-1 text-lg font-extrabold tabular-nums text-ink">{stats[key]}</p>
          <p className="text-[10px] text-muted">{hint}</p>
        </div>
      ))}
    </div>
  );
}
