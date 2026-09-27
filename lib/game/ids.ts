import { normalizeSkillDifficulty, type SkillDifficulty } from "@/lib/difficulty";
import { MAX_GAME_LEVEL } from "@/lib/game/types";
import type { GameTrackId } from "@/lib/game/tracks";
import { isGameTrackId } from "@/lib/game/tracks";

export type GameLevelKey = {
  track: GameTrackId;
  difficulty: SkillDifficulty;
  level: number;
};

function clampLevel(level: number) {
  return Math.max(1, Math.min(MAX_GAME_LEVEL, Math.floor(level)));
}

export function gameLevelId(key: GameLevelKey) {
  const level = clampLevel(key.level);
  return `game-${key.track}-${key.difficulty}-${level}`;
}

export function parseGameLevelId(id: string): GameLevelKey | null {
  const modern = /^game-(core|frontend|backend)-(beginner|mid|expert|senior)-(\d+)$/.exec(id);
  if (modern) {
    const level = Number(modern[3]);
    if (!Number.isFinite(level) || level < 1 || level > MAX_GAME_LEVEL) return null;
    return {
      track: modern[1] as GameTrackId,
      difficulty: normalizeSkillDifficulty(modern[2]),
      level,
    };
  }

  const legacy = /^game-level-(\d+)$/.exec(id);
  if (legacy) {
    const level = Number(legacy[1]);
    if (!Number.isFinite(level) || level < 1 || level > MAX_GAME_LEVEL) return null;
    return { track: "core", difficulty: "mid", level };
  }

  return null;
}

export function isGameLevelId(id: string) {
  return parseGameLevelId(id) !== null;
}

export function gameLevelKey(
  track: GameTrackId,
  difficulty: SkillDifficulty,
  level: number,
): GameLevelKey {
  return { track, difficulty, level: clampLevel(level) };
}

export function parseGameTrack(value: unknown): GameTrackId {
  return isGameTrackId(value) ? value : "core";
}
