import { buildBackendQuestion } from "@/lib/game/banks/backend";
import { buildCoreQuestion } from "@/lib/game/banks/core";
import { buildFrontendQuestion } from "@/lib/game/banks/frontend";
import type { SkillDifficulty } from "@/lib/difficulty";
import type { GameModeId } from "@/lib/game/types";
import type {
  BackendFrameworkId,
  BackendLanguage,
  FrontendFrameworkId,
  FrontendLanguage,
  GameTrackId,
} from "@/lib/game/tracks";
import type { Exercise } from "@/lib/types";

export type GameStackPrefs = {
  frontendFramework: FrontendFrameworkId;
  frontendLanguage: FrontendLanguage;
  backendFramework: BackendFrameworkId;
  backendLanguage: BackendLanguage;
};

export function buildTrackQuestion(
  track: GameTrackId,
  difficulty: SkillDifficulty,
  mode: GameModeId,
  level: number,
  stack: GameStackPrefs,
): Exercise {
  if (track === "core") return buildCoreQuestion(difficulty, mode, level);
  if (track === "frontend") {
    return buildFrontendQuestion(stack.frontendFramework, stack.frontendLanguage, difficulty, mode, level);
  }
  return buildBackendQuestion(stack.backendFramework, stack.backendLanguage, difficulty, mode, level);
}
