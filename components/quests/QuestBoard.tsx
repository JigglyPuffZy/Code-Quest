"use client";

import { usePlayer } from "@/components/player/PlayerProvider";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { cn } from "@/lib/cn";
import { mainQuestStatuses, sideQuestStatuses } from "@/lib/progress";
import { Compass, Scroll } from "lucide-react";

function QuestSection({
  title,
  description,
  icon,
  accent,
  statuses,
  claimQuest,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  accent: string;
  statuses: ReturnType<typeof mainQuestStatuses>;
  claimQuest: (id: string) => { awarded: boolean; xp: number };
}) {
  return (
    <section className="space-y-4">
      <div className="px-1">
        <p className={cn("inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em]", accent)}>
          {icon}
          {title}
        </p>
        <p className="mt-1 text-sm text-muted">{description}</p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {statuses.map((status) => (
          <Card
            key={status.quest.id}
            glow={status.done && !status.claimed}
            className={status.quest.kind === "side" ? "border-teal-100" : undefined}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-semibold">{status.quest.title}</h2>
                  {status.quest.kind === "side" ? (
                    <span className="rounded-full bg-teal-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-teal-700">
                      Side
                    </span>
                  ) : null}
                </div>
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
                <Button
                  variant={status.done ? "primary" : "ghost"}
                  disabled={!status.done}
                  onClick={() => claimQuest(status.quest.id)}
                >
                  {status.done ? "Claim" : "In progress"}
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

export function QuestBoard() {
  const { player, claimQuest } = usePlayer();
  if (!player) return null;

  const main = mainQuestStatuses(player);
  const side = sideQuestStatuses(player);

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Quests"
        title="Main & side missions"
        description="Story quests reward big milestones. Side quests are optional bonuses — often daily or exploratory."
      />

      <QuestSection
        title="Main quests"
        description="Core academy goals tied to lessons, paths, and arena progress."
        icon={<Scroll size={12} />}
        accent="text-primary"
        statuses={main}
        claimQuest={claimQuest}
      />

      <QuestSection
        title="Side quests"
        description="Optional extras — check in, warm up, hop paths, and snag quick XP."
        icon={<Compass size={12} />}
        accent="text-teal-600"
        statuses={side}
        claimQuest={claimQuest}
      />
    </div>
  );
}
