"use client";

import type { DuelSnapshot } from "@/lib/duels/types";
import { Crown, Swords } from "lucide-react";
import Link from "next/link";

export function DuelReplayCard({ duel }: { duel: DuelSnapshot }) {
  if (duel.status !== "completed") return null;

  const you = duel.youAre === "challenger" ? duel.challenger : duel.opponent;
  const foe = duel.youAre === "challenger" ? duel.opponent : duel.challenger;
  const youWon = duel.winnerId === you.id;

  return (
    <article className="rounded-2xl border border-line bg-white p-5 shadow-sm">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">Match replay</p>
      <h2 className="mt-2 text-lg font-bold">Final score</h2>
      <div className="mt-4 flex items-center justify-center gap-6">
        <div className="text-center">
          <p className="text-xs font-bold uppercase text-muted">{you.username}</p>
          <p className="text-3xl font-extrabold tabular-nums text-primary">{duel.challengerScore}</p>
          {youWon ? (
            <p className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-amber-600">
              <Crown size={12} /> Winner
            </p>
          ) : null}
        </div>
        <Swords className="size-5 text-muted" />
        <div className="text-center">
          <p className="text-xs font-bold uppercase text-muted">{foe.username}</p>
          <p className="text-3xl font-extrabold tabular-nums text-primary">{duel.opponentScore}</p>
          {!youWon && duel.winnerId === foe.id ? (
            <p className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-amber-600">
              <Crown size={12} /> Winner
            </p>
          ) : null}
        </div>
      </div>
      <p className="mt-4 text-center text-sm text-muted">
        Best of {duel.targetWins} · Round {duel.currentRound} · {duel.skillDifficulty} difficulty
      </p>
      {duel.endedAt ? (
        <p className="mt-1 text-center text-xs text-muted">
          Ended {new Date(duel.endedAt).toLocaleString()}
        </p>
      ) : null}
      <div className="mt-4 flex justify-center gap-2">
        <Link
          href="/leaderboard"
          className="rounded-xl border border-line px-4 py-2 text-sm font-semibold hover:bg-surface-2"
        >
          Find another duel
        </Link>
      </div>
    </article>
  );
}
