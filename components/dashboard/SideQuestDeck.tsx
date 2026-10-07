"use client";

import { usePlayer } from "@/components/player/PlayerProvider";
import { Button } from "@/components/ui/Button";
import { MarqueeLane } from "@/components/ui/MarqueeLane";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { questPlayHref, questPlayLabel } from "@/lib/curriculum/quest-actions";
import { SIDE_QUEST_COUNT } from "@/lib/curriculum/side-quests";
import { cn } from "@/lib/cn";
import { sideQuestStatuses } from "@/lib/progress";
import { ArrowRight, Compass, Play } from "lucide-react";
import Link from "next/link";
import type { QuestStatus } from "@/lib/progress";
import type { Player } from "@/lib/types";

function SideQuestCard({
  status,
  player,
  onClaim,
}: {
  status: QuestStatus;
  player: Player;
  onClaim: (id: string) => void;
}) {
  const claimableNow = status.done && !status.claimed;
  const pct = (status.current / status.target) * 100;
  const playHref = questPlayHref(status.quest, player);
  const playLabel = questPlayLabel(status.quest);

  const body = (
    <article
      className={cn(
        "side-quest-card relative w-[272px] shrink-0 overflow-hidden rounded-2xl border p-4 transition",
        claimableNow
          ? "border-teal-300 bg-gradient-to-br from-teal-50 via-surface to-emerald-50/80 shadow-md shadow-teal-500/10"
          : "border-line bg-surface",
        !claimableNow && !status.claimed && "group-hover:-translate-y-0.5 group-hover:border-teal-200 group-hover:shadow-md",
      )}
    >
      {claimableNow ? (
        <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-teal-300/25 blur-2xl" aria-hidden />
      ) : null}

      <div className="relative flex items-start justify-between gap-2">
        <span className="inline-flex items-center rounded-full border border-teal-200/80 bg-teal-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.14em] text-teal-700">
          Side
        </span>
        <span className="text-xs font-bold text-primary">+{status.quest.xp} XP</span>
      </div>

      <h3 className="relative mt-3 font-bold leading-snug text-ink">{status.quest.title}</h3>
      <p className="relative mt-1 line-clamp-2 text-xs leading-relaxed text-muted">{status.quest.description}</p>

      <ProgressBar className="relative mt-3" value={pct} label={status.quest.title} />
      <div className="relative mt-2 flex items-center justify-between gap-2">
        <span className="text-[11px] tabular-nums text-muted">
          {status.current}/{status.target}
        </span>
        {status.claimed ? (
          <span className="text-[11px] font-semibold text-primary">Claimed</span>
        ) : claimableNow ? (
          <Button
            className="px-3 py-1.5 text-[11px]"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onClaim(status.quest.id);
            }}
          >
            Claim
          </Button>
        ) : (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-700">
            <Play size={11} />
            {playLabel}
            <ArrowRight size={11} className="transition group-hover:translate-x-0.5" />
          </span>
        )}
      </div>
    </article>
  );

  if (claimableNow) {
    return body;
  }

  return (
    <Link href={playHref} className="group block shrink-0">
      {body}
    </Link>
  );
}

export function SideQuestDeck({ embedded = false }: { embedded?: boolean }) {
  const { player, claimQuest } = usePlayer();
  if (!player) return null;

  const statuses = sideQuestStatuses(player).slice(0, SIDE_QUEST_COUNT);
  const claimable = statuses.filter((status) => status.done && !status.claimed).length;
  const active = statuses.filter((status) => !status.claimed);

  return (
    <section className="space-y-4">
      {!embedded ? (
        <div className="flex flex-wrap items-end justify-between gap-3 px-1">
          <div>
            <p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-teal-600">
              <Compass size={12} />
              Side quests
            </p>
            <h2 className="mt-1 text-lg font-bold tracking-tight">Optional bonus missions</h2>
            <p className="mt-1 text-xs text-muted">
              {SIDE_QUEST_COUNT} bonus missions — tap a card to jump in and play.
              {claimable > 0 ? (
                <span className="ml-1 font-semibold text-primary">{claimable} ready to claim</span>
              ) : null}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-[10px] text-muted sm:inline">
              <span className="md:hidden">Swipe to browse</span>
              <span className="hidden md:inline">Hover to pause</span>
            </span>
            <Link
              href="/quests"
              className="inline-flex items-center gap-1 rounded-full border border-line px-3 py-1.5 text-[10px] font-bold text-muted transition hover:border-teal-200 hover:text-teal-700"
            >
              All quests <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-2 px-1">
          <p className="text-xs text-muted">
            {SIDE_QUEST_COUNT} side quests · tap to play
            {claimable > 0 ? (
              <span className="ml-1 font-semibold text-primary">· {claimable} ready to claim</span>
            ) : null}
          </p>
          <Link
            href="/quests"
            className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 hover:underline"
          >
            All quests <ArrowRight size={12} />
          </Link>
        </div>
      )}

      <MarqueeLane trackClassName="side-quest-marquee-track">
        {[...active, ...active].map((status, index) => (
          <SideQuestCard
            key={`${status.quest.id}-${index}`}
            status={status}
            player={player}
            onClaim={claimQuest}
          />
        ))}
      </MarqueeLane>

      {active.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-line bg-surface-2 px-4 py-6 text-center text-sm text-muted">
          All {SIDE_QUEST_COUNT} side quests cleared. Check the quest board for main missions.
        </p>
      ) : null}
    </section>
  );
}
