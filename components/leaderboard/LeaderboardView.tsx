"use client";

import { Avatar } from "@/components/player/Avatar";
import { usePlayer } from "@/components/player/PlayerProvider";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/States";
import { DuelSetupModal } from "@/components/duels/DuelSetupModal";
import { createDemoDuel } from "@/lib/duels/demo";
import { inviteToDuel } from "@/lib/duels/client";
import type { DuelRules } from "@/lib/duels/rules";
import { isDemoRivalOnline, isOnline } from "@/lib/duels/presence";
import { totalXp } from "@/lib/gamification";
import { demoRivals, type BoardEntry } from "@/lib/leaderboard";
import { fetchLeaderboard, readLeaderboardCache } from "@/lib/leaderboard/fetch";
import { cn } from "@/lib/cn";
import { Crown, Loader2, Swords, Wifi, WifiOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function OnlineDot({ online }: { online: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex size-2.5 shrink-0 rounded-full ring-2 ring-white",
        online ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" : "bg-slate-300",
      )}
      title={online ? "Online" : "Offline"}
    />
  );
}

export function LeaderboardView() {
  const { player, supabaseEnabled, email } = usePlayer();
  const router = useRouter();
  const [rows, setRows] = useState<BoardEntry[] | null>(() => readLeaderboardCache());
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(() => supabaseEnabled && !readLeaderboardCache());
  const [duelBusy, setDuelBusy] = useState<string | null>(null);
  const [duelError, setDuelError] = useState("");
  const [setupTarget, setSetupTarget] = useState<BoardEntry | null>(null);

  useEffect(() => {
    if (!player) return;
    if (!supabaseEnabled) {
      const you: BoardEntry = {
        id: player.id,
        username: player.username,
        avatar: player.avatar,
        xp: totalXp(player),
        streak: player.streak,
        lastSeenAt: new Date().toISOString(),
      };
      setRows(
        [...demoRivals.filter((e) => e.id !== player.id), you].sort(
          (a, b) => b.xp - a.xp || a.username.localeCompare(b.username),
        ),
      );
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      if (!readLeaderboardCache()) setLoading(true);
      try {
        const data = await fetchLeaderboard(25, true);
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
    const refreshTimer = window.setInterval(() => {
      void fetchLeaderboard(25, true).then((data) => setRows(data)).catch(() => {});
    }, 45_000);
    return () => {
      cancelled = true;
      window.clearInterval(refreshTimer);
    };
  }, [player, supabaseEnabled]);

  function openSetup(entry: BoardEntry) {
    if (!player || entry.id === player.id) return;
    setDuelError("");
    setSetupTarget(entry);
  }

  async function sendInvite(entry: BoardEntry, rules: DuelRules) {
    setDuelBusy(entry.id);
    try {
      if (!supabaseEnabled || entry.id.startsWith("demo-")) {
        const duel = createDemoDuel(player!, entry.id, rules);
        setSetupTarget(null);
        router.push(`/duel/${duel.id}`);
        return;
      }
      if (!email) {
        setDuelError("Sign in to duel live players on the leaderboard.");
        return;
      }
      const { duelId } = await inviteToDuel(entry.id, rules);
      setSetupTarget(null);
      router.push(`/duel/${duelId}`);
    } catch (inviteError) {
      setDuelError(inviteError instanceof Error ? inviteError.message : "Could not start duel.");
    } finally {
      setDuelBusy(null);
    }
  }

  function entryOnline(entry: BoardEntry) {
    if (entry.id === player?.id) return true;
    if (!supabaseEnabled || entry.id.startsWith("demo-")) return isDemoRivalOnline(entry.id);
    return isOnline(entry.lastSeenAt);
  }

  if (!player) return null;

  const onlineCount = rows?.filter((entry) => entryOnline(entry) && entry.id !== player.id).length ?? 0;

  return (
    <div>
      <PageHeader
        eyebrow="Leaderboard"
        title="Top learners"
        description={
          supabaseEnabled
            ? "Green dot = online now. Challenge someone to a random code duel — first correct answer wins."
            : "Practice duels against sample rivals (demo mode). Sign in with Supabase for live PvP."
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-gradient-to-r from-rose-50/80 via-white to-violet-50/60 px-4 py-3">
        <span className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-rose-500 to-violet-500 text-white shadow-md">
          <Swords size={18} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-ink">Duel mode</p>
          <p className="text-xs text-muted">
            {onlineCount > 0
              ? `${onlineCount} player${onlineCount === 1 ? "" : "s"} online — tap Duel to invite`
              : "No rivals online right now — demo rivals are still available for practice"}
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase text-emerald-700">
          <Wifi size={11} />
          Live
        </span>
      </div>

      {loading ? <LoadingState label="Loading" /> : null}
      {error ? <ErrorState message={error} /> : null}
      {duelError ? <p className="mb-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-danger">{duelError}</p> : null}
      {!loading && rows?.length === 0 ? <EmptyState title="Empty board" body="Be the first to finish a lesson." /> : null}
      {!loading && rows && rows.length > 0 ? (
        <Card className="overflow-hidden p-0">
          <ol>
            {rows.map((entry, index) => {
              const you = entry.id === player.id;
              const online = entryOnline(entry);
              const canDuel = !you;
              return (
                <li
                  key={entry.id}
                  className={cn(
                    "flex items-center gap-3 border-b border-line px-4 py-3 last:border-b-0",
                    you ? "bg-primary/5" : "hover:bg-surface-2/60",
                  )}
                >
                  <span
                    className={cn(
                      "flex w-7 justify-center text-sm font-bold tabular-nums",
                      index === 0 ? "text-amber-500" : index < 3 ? "text-primary" : "text-muted",
                    )}
                  >
                    {index === 0 ? <Crown size={16} /> : index + 1}
                  </span>
                  <div className="relative">
                    <Avatar id={entry.avatar} size="sm" />
                    <span className="absolute -bottom-0.5 -right-0.5">
                      <OnlineDot online={online} />
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-2 truncate text-sm font-medium">
                      <span className="truncate">{entry.username}</span>
                      {you ? <span className="shrink-0 text-xs font-bold text-primary">you</span> : null}
                    </p>
                    <p className="flex items-center gap-1.5 text-xs text-muted">
                      {online ? (
                        <>
                          <Wifi size={11} className="text-emerald-500" />
                          Online · {entry.streak}d streak
                        </>
                      ) : (
                        <>
                          <WifiOff size={11} />
                          Offline · {entry.streak}d streak
                        </>
                      )}
                    </p>
                  </div>
                  <p className="hidden text-sm font-semibold tabular-nums text-primary sm:block">{entry.xp} XP</p>
                  {canDuel ? (
                    <Button
                      variant={online ? "primary" : "ghost"}
                      className={cn(
                        "shrink-0 px-3 py-2 text-xs shadow-none",
                        online && "shadow-md shadow-primary/20",
                      )}
                      disabled={duelBusy === entry.id}
                      onClick={() => openSetup(entry)}
                    >
                      {duelBusy === entry.id ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Swords size={14} />
                      )}
                      Duel
                    </Button>
                  ) : (
                    <span className="w-[4.5rem] shrink-0 text-center text-[10px] font-bold uppercase text-muted">—</span>
                  )}
                </li>
              );
            })}
          </ol>
        </Card>
      ) : null}
      {!supabaseEnabled ? <p className="mt-3 text-xs text-muted">Your total: {totalXp(player)} XP · demo duels use practice rivals</p> : null}
      {setupTarget ? (
        <DuelSetupModal
          opponent={setupTarget}
          demo={!supabaseEnabled || setupTarget.id.startsWith("demo-")}
          busy={duelBusy === setupTarget.id}
          onClose={() => setSetupTarget(null)}
          onConfirm={(rules) => void sendInvite(setupTarget, rules)}
        />
      ) : null}
    </div>
  );
}
