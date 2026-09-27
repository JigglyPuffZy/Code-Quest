import { achievements } from "@/lib/curriculum/achievements";
import { getChallenge, getLesson } from "@/lib/curriculum/index";
import { allQuests } from "@/lib/curriculum/quests";
import { parseGameLevelId, xpForGameLevel } from "@/lib/game";
import { parseGameTrack } from "@/lib/game/ids";
import { normalizeSkillDifficulty } from "@/lib/difficulty";
import { todayKey, yesterdayKey } from "@/lib/dates";
import { achievementUnlocked } from "@/lib/progress";
import type { Achievement, LevelInfo, Player, TimestampedId } from "@/lib/types";

const TITLES = [
  "Initiate",
  "Spark",
  "Apprentice",
  "Scout",
  "Caster",
  "Adept",
  "Warden",
  "Sage",
  "Archon",
  "Legend",
];

export function levelFromXp(xp: number): LevelInfo {
  let level = 1;
  let remaining = Math.max(0, xp);
  let needed = 80;

  while (remaining >= needed && level < 60) {
    remaining -= needed;
    level += 1;
    needed = 80 + (level - 1) * 40;
  }

  const title = TITLES[Math.min(level, TITLES.length) - 1] ?? "Legend";
  return { level, title, into: remaining, needed };
}

export function totalXp(player: Player) {
  const lessonXp = player.completedLessons.reduce(
    (sum, entry) => sum + (getLesson(entry.id)?.xp ?? 0),
    0,
  );
  const challengeXp = player.completedChallenges.reduce(
    (sum, entry) => sum + (getChallenge(entry.id)?.xp ?? 0),
    0,
  );
  const questXp = player.claimedQuests.reduce((sum, entry) => {
    return sum + (allQuests.find((quest) => quest.id === entry.id)?.xp ?? 0);
  }, 0);
  const achievementXp = player.unlockedAchievements.reduce((sum, entry) => {
    return sum + (achievements.find((item) => item.id === entry.id)?.xp ?? 0);
  }, 0);
  const gameXp = player.completedGameLevels.reduce((sum, entry) => {
    const key = parseGameLevelId(entry.id);
    return sum + (key ? xpForGameLevel(key.level, key.difficulty) : 0);
  }, 0);
  return lessonXp + challengeXp + questXp + achievementXp + gameXp;
}

export function touchStreak(player: Player, now = new Date()): Player {
  const today = todayKey(now);
  if (player.lastActive === today) return player;
  const streak = player.lastActive === yesterdayKey(now) ? player.streak + 1 : 1;
  return {
    ...player,
    streak,
    bestStreak: Math.max(player.bestStreak, streak),
    lastActive: today,
    updatedAt: new Date().toISOString(),
  };
}

function hasId(entries: TimestampedId[], id: string) {
  return entries.some((entry) => entry.id === id);
}

export function grantAchievements(player: Player, at = new Date().toISOString()) {
  const fresh: Achievement[] = [];
  const unlocked = [...player.unlockedAchievements];

  for (const achievement of achievements) {
    if (hasId(unlocked, achievement.id)) continue;
    if (!achievementUnlocked(achievement, player)) continue;
    unlocked.push({ id: achievement.id, at });
    fresh.push(achievement);
  }

  if (!fresh.length) return { player, fresh };
  return {
    player: { ...player, unlockedAchievements: unlocked, updatedAt: at },
    fresh,
  };
}

export function createPlayer(partial?: Partial<Player>): Player {
  const now = new Date().toISOString();
  const base: Player = {
    id: partial?.id ?? crypto.randomUUID(),
    username: partial?.username?.trim() || "Apprentice",
    avatar: partial?.avatar || "nova",
    streak: 1,
    bestStreak: 1,
    lastActive: todayKey(),
    completedLessons: [],
    completedChallenges: [],
    completedGameLevels: [],
    claimedQuests: [],
    unlockedAchievements: [],
    lastLessonId: null,
    skillDifficulty: normalizeSkillDifficulty(partial?.skillDifficulty),
    gameTrack: parseGameTrack(partial?.gameTrack),
    frontendFramework: partial?.frontendFramework ?? "react",
    frontendLanguage: partial?.frontendLanguage ?? "typescript",
    backendFramework: partial?.backendFramework ?? "express",
    backendLanguage: partial?.backendLanguage ?? "javascript",
    createdAt: now,
    updatedAt: now,
  };
  return grantAchievements(touchStreak({ ...base, ...partial, updatedAt: now })).player;
}

export function rememberLesson(player: Player, lessonId: string): Player {
  if (player.lastLessonId === lessonId) return player;
  return { ...player, lastLessonId: lessonId, updatedAt: new Date().toISOString() };
}

export function markLessonComplete(player: Player, lessonId: string) {
  if (!getLesson(lessonId) || hasId(player.completedLessons, lessonId)) {
    return { player, awarded: false, fresh: [] as Achievement[] };
  }
  const at = new Date().toISOString();
  const next: Player = {
    ...player,
    completedLessons: [...player.completedLessons, { id: lessonId, at }],
    lastLessonId: lessonId,
    updatedAt: at,
  };
  const granted = grantAchievements(next, at);
  return { player: granted.player, awarded: true, fresh: granted.fresh };
}

export function markChallengeComplete(player: Player, challengeId: string) {
  if (!getChallenge(challengeId) || hasId(player.completedChallenges, challengeId)) {
    return { player, awarded: false, fresh: [] as Achievement[] };
  }
  const at = new Date().toISOString();
  const next: Player = {
    ...player,
    completedChallenges: [...player.completedChallenges, { id: challengeId, at }],
    updatedAt: at,
  };
  const granted = grantAchievements(next, at);
  return { player: granted.player, awarded: true, fresh: granted.fresh };
}

export function markGameLevelComplete(player: Player, gameId: string) {
  const key = parseGameLevelId(gameId);
  if (!key || hasId(player.completedGameLevels, gameId)) {
    return { player, awarded: false, fresh: [] as Achievement[] };
  }
  const at = new Date().toISOString();
  const next: Player = {
    ...player,
    completedGameLevels: [...player.completedGameLevels, { id: gameId, at }],
    updatedAt: at,
  };
  const granted = grantAchievements(next, at);
  return { player: granted.player, awarded: true, fresh: granted.fresh };
}

export function markQuestClaimed(player: Player, questId: string) {
  const quest = allQuests.find((item) => item.id === questId);
  if (!quest || hasId(player.claimedQuests, questId)) {
    return { player, awarded: false, fresh: [] as Achievement[] };
  }
  const at = new Date().toISOString();
  const next: Player = {
    ...player,
    claimedQuests: [...player.claimedQuests, { id: questId, at }],
    updatedAt: at,
  };
  const granted = grantAchievements(next, at);
  return { player: granted.player, awarded: true, fresh: granted.fresh };
}

export function withProfile(
  player: Player,
  patch: {
    username?: string;
    avatar?: string;
    skillDifficulty?: Player["skillDifficulty"];
    gameTrack?: Player["gameTrack"];
    frontendFramework?: Player["frontendFramework"];
    frontendLanguage?: Player["frontendLanguage"];
    backendFramework?: Player["backendFramework"];
    backendLanguage?: Player["backendLanguage"];
  },
): Player {
  return {
    ...player,
    username: patch.username?.trim() || player.username,
    avatar: patch.avatar || player.avatar,
    skillDifficulty: patch.skillDifficulty
      ? normalizeSkillDifficulty(patch.skillDifficulty)
      : player.skillDifficulty,
    gameTrack: patch.gameTrack ? parseGameTrack(patch.gameTrack) : player.gameTrack,
    frontendFramework: patch.frontendFramework ?? player.frontendFramework,
    frontendLanguage: patch.frontendLanguage ?? player.frontendLanguage,
    backendFramework: patch.backendFramework ?? player.backendFramework,
    backendLanguage: patch.backendLanguage ?? player.backendLanguage,
    updatedAt: new Date().toISOString(),
  };
}

function earlier(entries: TimestampedId[]) {
  const map = new Map<string, TimestampedId>();
  for (const entry of entries) {
    const prev = map.get(entry.id);
    if (!prev || entry.at < prev.at) map.set(entry.id, entry);
  }
  return [...map.values()];
}

export function mergePlayers(local: Player, remote: Player): Player {
  const lastActive = [local.lastActive, remote.lastActive]
    .filter((value): value is string => Boolean(value))
    .sort()
    .at(-1) ?? null;

  return {
    ...remote,
    username: remote.username || local.username,
    avatar: remote.avatar || local.avatar,
    streak: Math.max(local.streak, remote.streak),
    bestStreak: Math.max(local.bestStreak, remote.bestStreak),
    lastActive,
    completedLessons: earlier([...local.completedLessons, ...remote.completedLessons]),
    completedChallenges: earlier([...local.completedChallenges, ...remote.completedChallenges]),
    claimedQuests: earlier([...local.claimedQuests, ...remote.claimedQuests]),
    completedGameLevels: earlier([...local.completedGameLevels, ...remote.completedGameLevels]),
    unlockedAchievements: earlier([
      ...local.unlockedAchievements,
      ...remote.unlockedAchievements,
    ]),
    lastLessonId: remote.lastLessonId ?? local.lastLessonId,
    skillDifficulty: remote.skillDifficulty || local.skillDifficulty || "mid",
    gameTrack: remote.gameTrack || local.gameTrack || "core",
    frontendFramework: remote.frontendFramework || local.frontendFramework || "react",
    frontendLanguage: remote.frontendLanguage || local.frontendLanguage || "typescript",
    backendFramework: remote.backendFramework || local.backendFramework || "express",
    backendLanguage: remote.backendLanguage || local.backendLanguage || "javascript",
    updatedAt: new Date().toISOString(),
  };
}
