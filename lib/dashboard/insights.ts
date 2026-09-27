import { achievements } from "@/lib/curriculum/achievements";
import { getChallenge, getLesson, languages } from "@/lib/curriculum/index";
import { allQuests } from "@/lib/curriculum/quests";
import { todayKey } from "@/lib/dates";
import { totalGuidesRead } from "@/lib/guides/progress";
import { allQuestStatuses, languageProgress, lessonCount, type QuestStatus } from "@/lib/progress";
import type { LanguageId, Player } from "@/lib/types";

export const DAILY_GOAL_XP = 50;

function dayKeyFromIso(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return todayKey(date);
}

export function xpEarnedOnDay(player: Player, dayKey = todayKey()) {
  let xp = 0;

  for (const entry of player.completedLessons) {
    if (dayKeyFromIso(entry.at) !== dayKey) continue;
    xp += getLesson(entry.id)?.xp ?? 0;
  }
  for (const entry of player.completedChallenges) {
    if (dayKeyFromIso(entry.at) !== dayKey) continue;
    xp += getChallenge(entry.id)?.xp ?? 0;
  }
  for (const entry of player.claimedQuests) {
    if (dayKeyFromIso(entry.at) !== dayKey) continue;
    xp += allQuests.find((quest) => quest.id === entry.id)?.xp ?? 0;
  }
  for (const entry of player.unlockedAchievements) {
    if (dayKeyFromIso(entry.at) !== dayKey) continue;
    xp += achievements.find((item) => item.id === entry.id)?.xp ?? 0;
  }

  return xp;
}

export function dailyGoalProgress(player: Player, dayKey = todayKey()) {
  const earned = xpEarnedOnDay(player, dayKey);
  const target = DAILY_GOAL_XP;
  return {
    earned,
    target,
    remaining: Math.max(0, target - earned),
    ratio: Math.min(1, earned / target),
    complete: earned >= target,
  };
}

export function playerStats(player: Player) {
  return {
    lessons: lessonCount(player),
    challenges: player.completedChallenges.length,
    guides: totalGuidesRead(),
    quests: player.claimedQuests.length,
    achievements: player.unlockedAchievements.length,
  };
}

function questProgressRatio(status: QuestStatus) {
  if (status.target <= 0) return 0;
  return status.current / status.target;
}

export function featuredQuest(player: Player): QuestStatus | null {
  const statuses = allQuestStatuses(player);
  const claimable = statuses.filter((status) => status.done && !status.claimed);
  if (claimable.length > 0) return claimable[0];

  const inProgress = statuses
    .filter((status) => !status.claimed && !status.done)
    .sort((a, b) => {
      const ratioDiff = questProgressRatio(b) - questProgressRatio(a);
      if (ratioDiff !== 0) return ratioDiff;
      return a.target - b.target;
    });

  return inProgress[0] ?? null;
}

export function claimableQuestCount(player: Player) {
  return allQuestStatuses(player).filter((status) => status.done && !status.claimed).length;
}

export function skillMapEntries(player: Player) {
  return languages.map((language) => ({
    language,
    progress: languageProgress(language.id, player),
  }));
}
