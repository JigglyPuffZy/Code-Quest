"use client";

import { Avatar } from "@/components/player/Avatar";
import { usePlayer } from "@/components/player/PlayerProvider";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/States";
import { totalXp } from "@/lib/gamification";
import { demoRivals, type BoardEntry } from "@/lib/leaderboard";
import { fetchLeaderboard, readLeaderboardCache } from "@/lib/leaderboard/fetch";
import { useEffect, useState } from "react";

export function LeaderboardView() {
  const { player, supabaseEnabled } = usePlayer();
  const [rows, setRows] = useState<BoardEntry[] | null>(() => readLeaderboardCache());
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(() => supabaseEnabled && !readLeaderboardCache());

  useEffect(() => {
    if (!player) return;
    if (!supabaseEnabled) {
      const you: BoardEntry = {
        id: player.id,
        username: player.username,
        avatar: player.avatar,
        xp: totalXp(player),
        streak: player.streak,
      };
      setRows([...demoRivals.filter((e) => e.id !== player.id), you].sort((a, b) => b.xp - a.xp || a.username.localeCompare(b.username)));
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      if (!readLeaderboardCache()) setLoading(true);
      try {
        const data = await fetchLeaderboard(25);
        if (!cancelled) setRows(data);
      } catch (queryError) {
        if (!cancelled) {
          setError(queryError instanceof Error ? queryError.message : "Could not load leaderboard.");
          setRows(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [player, supabaseEnabled]);

  if (!player) return null;

  return (
    <div>
      <PageHeader
        eyebrow="Leaderboard"
        title="Top learners"
        description={supabaseEnabled ? "Ranked by total XP from Supabase." : "Sample rivals mixed with your score. Connect Supabase for live ranks."}
      />
      {loading ? <LoadingState label="Loading" /> : null}
      {error ? <ErrorState message={error} /> : null}
      {!loading && rows?.length === 0 ? <EmptyState title="Empty board" body="Be the first to finish a lesson." /> : null}
      {!loading && rows && rows.length > 0 ? (
        <Card className="overflow-hidden p-0">
          <ol>
            {rows.map((entry, index) => {
              const you = entry.id === player.id;
              return (
                <li key={entry.id} className={`flex items-center gap-3 border-b border-line px-4 py-3 last:border-b-0 ${you ? "bg-primary/5" : ""}`}>
                  <span className={`w-6 text-sm font-medium tabular-nums ${index < 3 ? "text-primary" : "text-muted"}`}>{index + 1}</span>
                  <Avatar id={entry.avatar} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {entry.username}
                      {you ? <span className="ml-2 text-xs text-primary">you</span> : null}
                    </p>
                    <p className="text-xs text-muted">{entry.streak}d streak</p>
                  </div>
                  <p className="text-sm font-medium tabular-nums text-primary">{entry.xp}</p>
                </li>
              );
            })}
          </ol>
        </Card>
      ) : null}
      {!supabaseEnabled ? <p className="mt-3 text-xs text-muted">Your total: {totalXp(player)} XP</p> : null}
    </div>
  );
}
