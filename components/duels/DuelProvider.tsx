"use client";

import { usePlayer } from "@/components/player/PlayerProvider";
import { DuelRulesCard } from "@/components/duels/DuelRulesCard";
import { respondToDuel } from "@/lib/duels/client";
import { duelRulesSummary } from "@/lib/duels/rules";
import type { DuelSnapshot } from "@/lib/duels/types";
import { createClient } from "@/lib/supabase/client";
import { Swords, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

type DuelContextValue = {
  incoming: DuelSnapshot | null;
  busy: boolean;
  dismissIncoming: () => void;
};

const DuelContext = createContext<DuelContextValue>({
  incoming: null,
  busy: false,
  dismissIncoming: () => {},
});

export function useDuels() {
  return useContext(DuelContext);
}

export function DuelProvider({ children }: { children: React.ReactNode }) {
  const { player, supabaseEnabled, email } = usePlayer();
  const router = useRouter();
  const [incoming, setIncoming] = useState<DuelSnapshot | null>(null);
  const [busy, setBusy] = useState(false);
  const seenIdsRef = useRef<Set<string>>(new Set());

  const dismissIncoming = useCallback(() => setIncoming(null), []);

  useEffect(() => {
    if (!supabaseEnabled || !player || !email) return;

    const supabase = createClient();
    const channel = supabase
      .channel(`duel-invites-${player.id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "duel_rooms", filter: `opponent_id=eq.${player.id}` },
        async (payload) => {
          const row = payload.new as { id: string; status: string };
          if (row.status !== "pending" || seenIdsRef.current.has(row.id)) return;
          seenIdsRef.current.add(row.id);
          try {
            const response = await fetch(`/api/duels/${row.id}`);
            const data = await response.json();
            if (response.ok && data.duel?.status === "pending") {
              setIncoming(data.duel as DuelSnapshot);
            }
          } catch {
            // ignore fetch errors
          }
        },
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "duel_rooms", filter: `challenger_id=eq.${player.id}` },
        (payload) => {
          const row = payload.new as { id: string; status: string };
          if (row.status === "active") {
            router.push(`/duel/${row.id}`);
          }
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [supabaseEnabled, player, email, router]);

  async function acceptInvite() {
    if (!incoming) return;
    setBusy(true);
    try {
      const { duel } = await respondToDuel(incoming.id, true);
      setIncoming(null);
      if (duel.status === "active") router.push(`/duel/${duel.id}`);
    } catch {
      setIncoming(null);
    } finally {
      setBusy(false);
    }
  }

  async function declineInvite() {
    if (!incoming) return;
    setBusy(true);
    try {
      await respondToDuel(incoming.id, false);
    } finally {
      setIncoming(null);
      setBusy(false);
    }
  }

  return (
    <DuelContext.Provider value={{ incoming, busy, dismissIncoming }}>
      {children}
      {incoming ? (
        <div className="fixed inset-x-4 bottom-24 z-50 mx-auto max-w-md sm:bottom-6 sm:right-6 sm:left-auto">
          <div className="overflow-hidden rounded-2xl border border-rose-200 bg-surface shadow-2xl shadow-rose-500/20">
            <div className="bg-gradient-to-r from-rose-500 via-primary-500 to-violet-500 px-4 py-3 text-white">
              <div className="flex items-center justify-between gap-2">
                <p className="inline-flex items-center gap-2 text-sm font-bold">
                  <Swords size={16} />
                  Duel invite!
                </p>
                <button type="button" onClick={declineInvite} className="rounded-lg p-1 hover:bg-white/15" aria-label="Dismiss">
                  <X size={16} />
                </button>
              </div>
            </div>
            <div className="space-y-3 p-4">
              <p className="text-sm leading-relaxed text-ink">
                <strong>{incoming.challenger.username}</strong> challenged you to a code duel.
              </p>
              <DuelRulesCard
                rules={{
                  targetWins: incoming.targetWins,
                  roundTimerSec: incoming.roundTimerSec as 60 | 120 | 180 | 300,
                  skillDifficulty: incoming.skillDifficulty,
                }}
                hostName={incoming.challenger.username}
              />
              <p className="text-xs text-muted">
                {duelRulesSummary({
                  targetWins: incoming.targetWins,
                  roundTimerSec: incoming.roundTimerSec as 60 | 120 | 180 | 300,
                  skillDifficulty: incoming.skillDifficulty,
                })}{" "}
                · server checks every submit
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void acceptInvite()}
                  className="flex-1 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-md shadow-primary/30 disabled:opacity-60"
                >
                  Accept duel
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void declineInvite()}
                  className="rounded-xl border border-line px-4 py-2.5 text-sm font-semibold text-muted"
                >
                  Decline
                </button>
              </div>
              <Link href={`/duel/${incoming.id}`} className="block text-center text-xs font-semibold text-primary hover:underline">
                View invite details
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </DuelContext.Provider>
  );
}
