import { challenges } from "@/lib/curriculum/challenges";
import {
  chaptersFor,
  getLesson,
  languages,
  lessons,
  lessonsFor,
  lessonsForChapter,
  worlds,
  worldsFor,
} from "@/lib/curriculum/index";
import { allQuests, quests, sideQuests } from "@/lib/curriculum/quests";
import { SIDE_QUEST_COUNT } from "@/lib/curriculum/side-quests";
import { guidesReadForTopic, totalGuidesRead } from "@/lib/guides/progress";
import { guidePracticePassesToday } from "@/lib/learning/practice-log";
import { dayOfYear, todayKey } from "@/lib/dates";
import type {
  Achievement,
  Challenge,
  LanguageId,
  Lesson,
  Player,
  Quest,
} from "@/lib/types";

export function completedSet(entries: { id: string }[]) {
  return new Set(entries.map((entry) => entry.id));
}

function dayKeyFromIso(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return todayKey(date);
}

export function lessonsCompletedOnDay(player: Player, dayKey = todayKey()) {
  return player.completedLessons.filter((entry) => dayKeyFromIso(entry.at) === dayKey).length;
}

export function challengesCompletedOnDay(player: Player, dayKey = todayKey()) {
  return player.completedChallenges.filter((entry) => dayKeyFromIso(entry.at) === dayKey).length;
}

export function gameLevelsCompletedOnDay(player: Player, dayKey = todayKey()) {
  return player.completedGameLevels.filter((entry) => dayKeyFromIso(entry.at) === dayKey).length;
}

export function languagesStarted(player: Player) {
  return languages.filter((language) => lessonCount(player, language.id) >= 1).length;
}

export function lessonCount(player: Player, language?: LanguageId) {
  return player.completedLessons.filter((entry) => {
    const lesson = getLesson(entry.id);
    return lesson && (!language || lesson.language === language);
  }).length;
}

export function isLessonUnlocked(lesson: Lesson, player: Player) {
  const ordered = lessonsFor(lesson.language);
  const index = ordered.findIndex((item) => item.id === lesson.id);
  if (index <= 0) return true;
  const done = completedSet(player.completedLessons);
  return done.has(ordered[index - 1].id);
}

export function isLessonComplete(lessonId: string, player: Player) {
  return player.completedLessons.some((entry) => entry.id === lessonId);
}

export function worldLessons(worldId: string) {
  return lessons.filter((lesson) => lesson.worldId === worldId);
}

export function worldProgress(worldId: string, player: Player) {
  const items = worldLessons(worldId);
  const done = items.filter((lesson) => isLessonComplete(lesson.id, player)).length;
  return {
    done,
    total: items.length,
    ratio: items.length ? done / items.length : 0,
  };
}

export function languageProgress(language: LanguageId, player: Player) {
  const items = lessonsFor(language);
  const done = items.filter((lesson) => isLessonComplete(lesson.id, player)).length;
  return {
    done,
    total: items.length,
    ratio: items.length ? done / items.length : 0,
  };
}

export function chapterProgress(chapterId: string, player: Player) {
  const items = lessonsForChapter(chapterId);
  const done = items.filter((lesson) => isLessonComplete(lesson.id, player)).length;
  return { done, total: items.length, ratio: items.length ? done / items.length : 0 };
}

export function clearedWorldCount(player: Player) {
  return worlds.filter((world) => {
    const progress = worldProgress(world.id, player);
    return progress.total > 0 && progress.done === progress.total;
  }).length;
}

export function clearedChapterCount(player: Player) {
  const chapterIds = new Set(lessons.map((lesson) => lesson.chapterId));
  let count = 0;
  for (const chapterId of chapterIds) {
    const progress = chapterProgress(chapterId, player);
    if (progress.total > 0 && progress.done === progress.total) count += 1;
  }
  return count;
}

export function challengesForLanguage(language: LanguageId) {
  return challenges.filter((challenge) => challenge.language === language);
}

export function previousChallenge(challenge: Challenge): Challenge | null {
  const track = challengesForLanguage(challenge.language);
  const index = track.findIndex((item) => item.id === challenge.id);
  if (index <= 0) return null;
  return track[index - 1] ?? null;
}

export function isChallengeUnlocked(challenge: Challenge, player: Player) {
  const prev = previousChallenge(challenge);
  if (!prev) return true;
  return isChallengeComplete(prev.id, player);
}

export function challengeLockMessage(challenge: Challenge) {
  const prev = previousChallenge(challenge);
  if (!prev) return "This battle is not available yet.";
  return `Clear "${prev.title}" first to unlock this battle.`;
}

export function isChallengeComplete(challengeId: string, player: Player) {
  return player.completedChallenges.some((entry) => entry.id === challengeId);
}

export function pickDailyChallenge(player: Player, date = new Date()) {
  const start = dayOfYear(date) % challenges.length;
  const unlocked = challenges.filter((challenge) => isChallengeUnlocked(challenge, player));
  const pool = unlocked.length ? unlocked : challenges;
  for (let offset = 0; offset < pool.length; offset += 1) {
    const challenge = pool[(start + offset) % pool.length];
    if (!isChallengeComplete(challenge.id, player)) return challenge;
  }
  return pool[start % pool.length];
}

/** First unlocked arena challenge the player can open — goes straight to the coder. */
export function pickPlayableChallenge(player: Player) {
  for (const challenge of challenges) {
    if (!isChallengeUnlocked(challenge, player)) continue;
    if (!isChallengeComplete(challenge.id, player)) return challenge;
  }
  for (const challenge of challenges) {
    if (isChallengeUnlocked(challenge, player)) return challenge;
  }
  return challenges[0];
}

export function challengePlayHref(player: Player, challenge = pickPlayableChallenge(player)) {
  return `/challenges/${challenge.id}`;
}

export type QuestStatus = {
  quest: Quest;
  current: number;
  target: number;
  done: boolean;
  claimed: boolean;
};

export function questStatus(quest: Quest, player: Player): QuestStatus {
  let current = 0;
  let target = 1;
  const metric = quest.metric;

  if (metric.type === "lessons") {
    current = lessonCount(player);
    target = metric.count;
  } else if (metric.type === "language") {
    current = lessonCount(player, metric.language);
    target = metric.count;
  } else if (metric.type === "world") {
    current = clearedWorldCount(player);
    target = 1;
  } else if (metric.type === "challenges") {
    current = player.completedChallenges.length;
    target = metric.count;
  } else if (metric.type === "streak") {
    current = player.streak;
    target = metric.days;
  } else if (metric.type === "guides") {
    current = totalGuidesRead();
    target = metric.count;
  } else if (metric.type === "guideTopic") {
    current = guidesReadForTopic(metric.topic);
    target = metric.count;
  } else if (metric.type === "allLanguages") {
    const cleared = languages.filter((language) => lessonCount(player, language.id) >= 1).length;
    current = cleared;
    target = languages.length;
  } else if (metric.type === "lessonsToday") {
    current = lessonsCompletedOnDay(player);
    target = metric.count;
  } else if (metric.type === "challengesToday") {
    current = challengesCompletedOnDay(player);
    target = metric.count;
  } else if (metric.type === "activeToday") {
    current = player.lastActive === todayKey() ? 1 : 0;
    target = 1;
  } else if (metric.type === "dailyChallenge") {
    const daily = pickDailyChallenge(player);
    current = isChallengeComplete(daily.id, player) ? 1 : 0;
    target = 1;
  } else if (metric.type === "languagesStarted") {
    current = languagesStarted(player);
    target = metric.count;
  } else if (metric.type === "gameLevelsToday") {
    current = gameLevelsCompletedOnDay(player);
    target = metric.count;
  } else if (metric.type === "guidePracticeToday") {
    current = guidePracticePassesToday();
    target = metric.count;
  } else {
    const python = lessonCount(player, "python");
    const javascript = lessonCount(player, "javascript");
    current = python > 0 && javascript > 0 ? 1 : 0;
    target = 1;
  }

  return {
    quest,
    current: Math.min(current, target),
    target,
    done: current >= target,
    claimed: player.claimedQuests.some((entry) => entry.id === quest.id),
  };
}

export function allQuestStatuses(player: Player) {
  return allQuests.map((quest) => questStatus(quest, player));
}

export function mainQuestStatuses(player: Player) {
  return quests.map((quest) => questStatus(quest, player));
}

export function sideQuestStatuses(player: Player) {
  return sideQuests.slice(0, SIDE_QUEST_COUNT).map((quest) => questStatus(quest, player));
}

export function achievementUnlocked(achievement: Achievement, player: Player) {
  switch (achievement.id) {
    case "first-words":
      return lessonCount(player) >= 1;
    case "dedicated":
      return lessonCount(player) >= 5;
    case "scholar":
      return lessonCount(player) >= 12;
    case "world-warden":
      return clearedWorldCount(player) >= 1;
    case "duel-won":
      return player.completedChallenges.length >= 1;
    case "arena-regular":
      return player.completedChallenges.length >= 3;
    case "hot-streak":
      return player.bestStreak >= 3 || player.streak >= 3;
    case "week-flame":
      return player.bestStreak >= 7 || player.streak >= 7;
    case "polyglot":
      return lessonCount(player, "python") >= 1 && lessonCount(player, "javascript") >= 1;
    case "quest-hunter":
      return player.claimedQuests.length >= 3;
    default:
      return false;
  }
}

export function pathSnapshot(language: LanguageId, player: Player) {
  return worldsFor(language).map((world) => ({
    world,
    progress: worldProgress(world.id, player),
    chapters: chaptersFor(world.id).map((chapter) => ({
      chapter,
      progress: chapterProgress(chapter.id, player),
      lessons: lessonsForChapter(chapter.id),
    })),
  }));
}
