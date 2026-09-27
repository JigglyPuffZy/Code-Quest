import { normalizeSkillDifficulty } from "@/lib/difficulty";
import { parseGameTrack } from "@/lib/game/ids";
import type {
  BackendFrameworkId,
  BackendLanguage,
  FrontendFrameworkId,
  FrontendLanguage,
} from "@/lib/game/tracks";
import { totalXp } from "@/lib/gamification";
import type { Player, TimestampedId } from "@/lib/types";

export type ProfileRow = {
  id: string;
  username: string;
  email: string | null;
  avatar: string;
  xp: number;
  streak: number;
  best_streak: number;
  last_active: string | null;
  completed_lessons: TimestampedId[] | null;
  completed_challenges: TimestampedId[] | null;
  completed_game_levels: TimestampedId[] | null;
  claimed_quests: TimestampedId[] | null;
  unlocked_achievements: TimestampedId[] | null;
  last_lesson_id: string | null;
  skill_difficulty: string | null;
  game_track: string | null;
  frontend_framework: string | null;
  frontend_language: string | null;
  backend_framework: string | null;
  backend_language: string | null;
  created_at: string;
  updated_at: string;
};

function entries(value: TimestampedId[] | null | undefined): TimestampedId[] {
  if (!Array.isArray(value)) return [];
  return value.filter((entry) => entry && typeof entry.id === "string" && typeof entry.at === "string");
}

export function rowToPlayer(row: ProfileRow): Player {
  return {
    id: row.id,
    username: row.username || "Apprentice",
    avatar: row.avatar || "nova",
    streak: row.streak ?? 0,
    bestStreak: row.best_streak ?? row.streak ?? 0,
    lastActive: row.last_active,
    completedLessons: entries(row.completed_lessons),
    completedChallenges: entries(row.completed_challenges),
    completedGameLevels: entries(row.completed_game_levels),
    claimedQuests: entries(row.claimed_quests),
    unlockedAchievements: entries(row.unlocked_achievements),
    lastLessonId: row.last_lesson_id,
    skillDifficulty: normalizeSkillDifficulty(row.skill_difficulty),
    gameTrack: parseGameTrack(row.game_track),
    frontendFramework: (row.frontend_framework as FrontendFrameworkId) || "react",
    frontendLanguage: (row.frontend_language as FrontendLanguage) || "typescript",
    backendFramework: (row.backend_framework as BackendFrameworkId) || "express",
    backendLanguage: (row.backend_language as BackendLanguage) || "javascript",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function playerToRow(player: Player, email?: string | null) {
  return {
    id: player.id,
    username: player.username,
    email: email ?? null,
    avatar: player.avatar,
    xp: totalXp(player),
    streak: player.streak,
    best_streak: player.bestStreak,
    last_active: player.lastActive,
    completed_lessons: player.completedLessons,
    completed_challenges: player.completedChallenges,
    completed_game_levels: player.completedGameLevels,
    claimed_quests: player.claimedQuests,
    unlocked_achievements: player.unlockedAchievements,
    last_lesson_id: player.lastLessonId,
    skill_difficulty: player.skillDifficulty,
    game_track: player.gameTrack,
    frontend_framework: player.frontendFramework,
    frontend_language: player.frontendLanguage,
    backend_framework: player.backendFramework,
    backend_language: player.backendLanguage,
    created_at: player.createdAt,
    updated_at: player.updatedAt,
  };
}

export function missingTable(message: string) {
  return /profiles|schema cache|does not exist|relation/i.test(message);
}
