import { guidePaths } from "@/lib/curriculum/guide-paths";
import { languages, lessonsFor } from "@/lib/curriculum/index";
import { guidesForTopic } from "@/lib/guides/index";
import { continueGuideHref } from "@/lib/guides/navigation";
import { isGuideRead } from "@/lib/guides/progress";
import type { GuideTopicId } from "@/lib/guides/types";
import { maxUnlockedGameLevel } from "@/lib/game/progress";
import {
  challengePlayHref,
  lessonCount,
  pickDailyChallenge,
} from "@/lib/progress";
import type { LanguageId, Player, Quest } from "@/lib/types";

function guidePlayHref(topicId?: GuideTopicId) {
  if (topicId && typeof window !== "undefined") {
    for (const guide of guidesForTopic(topicId)) {
      if (!isGuideRead(topicId, guide.slug)) {
        return `/guides/${topicId}/${guide.slug}`;
      }
    }
    const first = guidesForTopic(topicId)[0];
    return first ? `/guides/${topicId}/${first.slug}` : `/guides/${topicId}`;
  }
  return continueGuideHref();
}

function nextLanguageGuideHref(player: Player) {
  const untouched = languages.find((language) => lessonCount(player, language.id) === 0);
  const topicId = (untouched?.id ?? "python") as GuideTopicId;
  return guidePlayHref(topicId);
}

function gamePlayHref(player: Player) {
  const level = maxUnlockedGameLevel(player, player.gameTrack, player.skillDifficulty);
  return `/game/${player.gameTrack}/${level}`;
}

export function questPlayHref(quest: Quest, player: Player): string {
  const metric = quest.metric;

  switch (metric.type) {
    case "dailyChallenge":
      return `/challenges/${pickDailyChallenge(player).id}`;
    case "challengesToday":
    case "challenges":
      return challengePlayHref(player);
    case "guides":
    case "guideTopic":
      if (metric.type === "guideTopic") {
        return guidePlayHref(metric.topic as GuideTopicId);
      }
      return guidePlayHref();
    case "gameLevelsToday":
      return gamePlayHref(player);
    case "language":
      return guidePlayHref(metric.language as GuideTopicId);
    case "lessonsToday":
    case "lessons":
    case "world":
    case "activeToday":
      return continueGuideHref();
    case "languagesStarted":
    case "allLanguages":
      return nextLanguageGuideHref(player);
    default:
      return continueGuideHref();
  }
}

export function questPlayLabel(quest: Quest): string {
  const metric = quest.metric;

  switch (metric.type) {
    case "dailyChallenge":
    case "challengesToday":
    case "challenges":
      return "Start coding";
    case "guides":
    case "guideTopic":
      return "Read guide";
    case "gameLevelsToday":
      return "Start level";
    case "activeToday":
    case "lessonsToday":
    case "lessons":
    case "language":
    case "languagesStarted":
    case "allLanguages":
      return "Read guide";
    default:
      return "Play quest";
  }
}
