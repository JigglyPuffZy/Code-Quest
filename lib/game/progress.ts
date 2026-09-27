import type { SkillDifficulty } from "@/lib/difficulty";
import { buildGameLevelForPlayer, gameLevelId, parseGameLevelId } from "@/lib/game/generator";
import { MAX_GAME_LEVEL, type GameLevel } from "@/lib/game/types";
import type { GameTrackId } from "@/lib/game/tracks";
import type { Player } from "@/lib/types";

export { isGameLevelId, parseGameLevelId } from "@/lib/game/ids";

export function isGameLevelComplete(
  track: GameTrackId,
  difficulty: SkillDifficulty,
  level: number,
  player: Player,
) {
  const id = gameLevelId({ track, difficulty, level });
  return player.completedGameLevels.some((entry) => entry.id === id);
}

export function clearedLevelsForTrack(
  player: Player,
  track: GameTrackId,
  difficulty: SkillDifficulty,
) {
  return player.completedGameLevels.filter((entry) => {
    const key = parseGameLevelId(entry.id);
    return key?.track === track && key.difficulty === difficulty;
  }).length;
}

export function maxUnlockedGameLevel(
  player: Player,
  track: GameTrackId,
  difficulty: SkillDifficulty,
) {
  const cleared = player.completedGameLevels
    .map((entry) => parseGameLevelId(entry.id))
    .filter(
      (key): key is NonNullable<ReturnType<typeof parseGameLevelId>> =>
        Boolean(key && key.track === track && key.difficulty === difficulty),
    )
    .map((key) => key.level);

  if (!cleared.length) return 1;
  return Math.min(MAX_GAME_LEVEL, Math.max(...cleared) + 1);
}

export function isGameLevelUnlocked(
  track: GameTrackId,
  difficulty: SkillDifficulty,
  level: number,
  player: Player,
) {
  return (
    level >= 1 &&
    level <= MAX_GAME_LEVEL &&
    level <= maxUnlockedGameLevel(player, track, difficulty)
  );
}

export function gameProgressSummary(
  player: Player,
  track: GameTrackId = player.gameTrack,
  difficulty: SkillDifficulty = player.skillDifficulty,
) {
  const cleared = clearedLevelsForTrack(player, track, difficulty);
  const unlocked = maxUnlockedGameLevel(player, track, difficulty);
  const next = buildGameLevelForPlayer(player, track, Math.min(unlocked, MAX_GAME_LEVEL), difficulty);
  return { cleared, total: MAX_GAME_LEVEL, unlocked, next, track, difficulty };
}

export function currentGameLevel(
  player: Player,
  track: GameTrackId = player.gameTrack,
  difficulty: SkillDifficulty = player.skillDifficulty,
): GameLevel {
  const unlocked = maxUnlockedGameLevel(player, track, difficulty);
  const target =
    isGameLevelComplete(track, difficulty, unlocked, player) && unlocked < MAX_GAME_LEVEL
      ? unlocked + 1
      : unlocked;
  return buildGameLevelForPlayer(player, track, target, difficulty);
}
