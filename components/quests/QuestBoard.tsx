"use client";

import { usePlayer } from "@/components/player/PlayerProvider";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { allQuestStatuses } from "@/lib/progress";

export function QuestBoard() {
  const { player, claimQuest } = usePlayer();
  if (!player) return null;
  const statuses = allQuestStatuses(player);

  return (
    <div>
      <PageHeader
        eyebrow="Quests"
        title="Bonus missions"
        description="Complete goals you've already been working on, then claim bonus XP."
      />
      <div className="grid gap-3 md:grid-cols-2">
        {statuses.map((status) => (
          <Card key={status.quest.id} glow={status.done && !status.claimed}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-semibold">{status.quest.title}</h2>
                <p className="mt-1 text-sm text-muted">{status.quest.description}</p>
              </div>
              <span className="shrink-0 text-xs font-medium text-primary">+{status.quest.xp} XP</span>
            </div>
            <ProgressBar className="mt-4" value={(status.current / status.target) * 100} label={status.quest.title} />
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs tabular-nums text-muted">{status.current}/{status.target}</span>
              {status.claimed ? (
                <span className="text-xs font-medium text-primary">Claimed</span>
              ) : (
                <Button variant={status.done ? "primary" : "ghost"} disabled={!status.done} onClick={() => claimQuest(status.quest.id)}>
                  {status.done ? "Claim" : "In progress"}
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
