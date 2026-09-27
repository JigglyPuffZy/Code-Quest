"use client";

import { usePlayer } from "@/components/player/PlayerProvider";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { achievements } from "@/lib/curriculum/achievements";
import { formatWhen } from "@/lib/dates";
import { BookOpen, Crown, Flame, Globe, ScrollText, Sparkles, Star, Swords } from "lucide-react";

const ICONS = { spark: Sparkles, book: BookOpen, sword: Swords, flame: Flame, crown: Crown, globe: Globe, scroll: ScrollText, star: Star };

export function AchievementGrid() {
  const { player } = usePlayer();
  if (!player) return null;
  const owned = new Map(player.unlockedAchievements.map((e) => [e.id, e.at]));

  return (
    <div>
      <PageHeader
        eyebrow="Achievements"
        title="Badges"
        description={`${owned.size} of ${achievements.length} unlocked. Each badge awards XP once.`}
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {achievements.map((achievement) => {
          const at = owned.get(achievement.id);
          const Icon = ICONS[achievement.icon];
          return (
            <Card key={achievement.id} className={at ? "" : "opacity-50"}>
              <Icon className={at ? "text-primary" : "text-muted"} size={18} strokeWidth={1.5} />
              <h2 className="mt-3 text-sm font-semibold">{achievement.title}</h2>
              <p className="mt-1 text-xs leading-relaxed text-muted">{achievement.description}</p>
              <p className="mt-3 text-[10px] font-medium text-primary">
                {at ? `Unlocked ${formatWhen(at)} · +${achievement.xp} XP` : `+${achievement.xp} XP`}
              </p>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
