import { difficultyLabel, SKILL_DIFFICULTIES, type SkillDifficulty } from "@/lib/difficulty";
import { buildTrackQuestion, type GameStackPrefs } from "@/lib/game/banks";
import { gameLevelId, parseGameLevelId, type GameLevelKey } from "@/lib/game/ids";
import { GAME_MODES, gameModeForLevel, tierForLevel, xpForGameLevel } from "@/lib/game/modes";
import { stackLabel, trackLanguage, type GameTrackId } from "@/lib/game/tracks";
import type { GameLevel } from "@/lib/game/types";
import { MAX_GAME_LEVEL } from "@/lib/game/types";
import type { Player } from "@/lib/types";

function clampLevel(level: number) {
  return Math.max(1, Math.min(MAX_GAME_LEVEL, Math.floor(level)));
}

export function playerStack(player: Player): GameStackPrefs {
  return {
    frontendFramework: player.frontendFramework,
    frontendLanguage: player.frontendLanguage,
    backendFramework: player.backendFramework,
    backendLanguage: player.backendLanguage,
  };
}

export function buildGameLevel(
  track: GameTrackId,
  level: number,
  difficulty: SkillDifficulty,
  stack: GameStackPrefs,
): GameLevel {
  const n = clampLevel(level);
  const mode = gameModeForLevel(n);
  const meta = GAME_MODES[mode];
  const skill = SKILL_DIFFICULTIES[difficulty];
  const exercise = buildTrackQuestion(track, difficulty, mode, n, stack);
  const language = trackLanguage(track, {
    frontendLanguage: stack.frontendLanguage,
    backendLanguage: stack.backendLanguage,
  });
  const stackText = stackLabel(track, stack);

  return {
    track,
    difficulty,
    level: n,
    id: gameLevelId({ track, difficulty, level: n }),
    mode,
    title: `${meta.label} ${n}`,
    subtitle: `${skill.label} · ${stackText}`,
    tier: tierForLevel(n),
    xp: xpForGameLevel(n, difficulty),
    language,
    stackLabel: stackText,
    blocks: [
      {
        type: "p",
        text: `${stackText} · level ${n} · ${meta.label} · ${difficultyLabel(difficulty)}. Each difficulty has its own 100-level question set.`,
      },
      {
        type: "ul",
        items: [
          `${skill.label} (${skill.rank}) — ${skill.blurb}`,
          track === "frontend"
            ? "Frontend track — framework-flavored UI logic puzzles."
            : track === "backend"
              ? "Backend track — API and server-style logic puzzles."
              : "Core track — Python fundamentals.",
          "Pass every check to unlock the next level.",
        ],
      },
    ],
    exercise,
  };
}

export function buildGameLevelForPlayer(
  player: Player,
  track: GameTrackId = player.gameTrack,
  level: number,
  difficulty: SkillDifficulty = player.skillDifficulty,
) {
  return buildGameLevel(track, level, difficulty, playerStack(player));
}

export function buildGameLevelFromId(id: string, stack: GameStackPrefs) {
  const key = parseGameLevelId(id);
  if (!key) return null;
  return buildGameLevel(key.track, key.level, key.difficulty, stack);
}

export function getGameLevel(
  track: GameTrackId,
  level: number,
  difficulty: SkillDifficulty,
  stack: GameStackPrefs,
) {
  return buildGameLevel(track, level, difficulty, stack);
}

export { gameLevelId, parseGameLevelId, gameLevelKey } from "@/lib/game/ids";
export type { GameLevelKey } from "@/lib/game/ids";
