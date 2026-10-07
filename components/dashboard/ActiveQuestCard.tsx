"use client";

import { usePlayer } from "@/components/player/PlayerProvider";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { claimableQuestCount, featuredQuest } from "@/lib/dashboard/insights";
import { ArrowRight, Gift, Scroll } from "lucide-react";
import Link from "next/link";

export function ActiveQuestCard() {
  const { player, claimQuest } = usePlayer();
  if (!player) return null;

  const status = featuredQuest(player);
  const pendingClaims = claimableQuestCount(player);

  if (!status) {
    return (
      <article className="relative overflow-hidden rounded-2xl border border-line bg-surface-2 p-5 sm:p-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">Active quest</p>
        <h2 className="mt-2 text-lg font-bold">All quests cleared</h2>
        <p className="mt-1 text-sm text-muted">You claimed every mission. New ones may arrive soon.</p>
        <Link href="/quests" className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline">
          View quest log <ArrowRight size={13} />
        </Link>
      </article>
    );
  }

  const claimable = status.done && !status.claimed;
  const progress = (status.current / status.target) * 100;

  return (
    <article
      className={`relative overflow-hidden rounded-2xl border p-5 sm:p-6 ${
        claimable
          ? "border-primary-300 bg-gradient-to-br from-primary-50 via-surface to-violet-50 shadow-md shadow-primary/10"
          : "border-line bg-surface"
      }`}
    >
      {claimable ? (
        <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-primary/20 blur-3xl" aria-hidden />
      ) : null}

      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
            {claimable ? <Gift size={12} /> : <Scroll size={12} />}
            {claimable ? "Reward ready" : "Active quest"}
          </p>
          <h2 className="mt-2 text-xl font-bold tracking-tight">{status.quest.title}</h2>
          <p className="mt-1 text-sm text-muted">{status.quest.description}</p>
        </div>
        <span className="shrink-0 rounded-full bg-primary-50 px-2.5 py-1 text-xs font-bold text-primary">
          +{status.quest.xp} XP
        </span>
      </div>

      <ProgressBar className="mt-4" value={progress} label={status.quest.title} />
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs tabular-nums text-muted">
          {status.current}/{status.target}
          {pendingClaims > 1 ? ` · ${pendingClaims} ready to claim` : ""}
        </span>
        <div className="flex items-center gap-2">
          <Link href="/quests" className="text-xs font-semibold text-muted hover:text-primary">
            All quests
          </Link>
          {claimable ? (
            <Button className="px-3 py-2 text-xs" onClick={() => claimQuest(status.quest.id)}>
              Claim reward
            </Button>
          ) : (
            <span className="text-xs font-semibold text-muted">In progress</span>
          )}
        </div>
      </div>
    </article>
  );
}
