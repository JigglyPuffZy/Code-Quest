import type { SkillDifficulty } from "@/lib/difficulty";
import type { GameTrackId } from "@/lib/game/tracks";
import type { ContentBlock, Exercise, LanguageId } from "@/lib/types";

export type GameModeId =
  | "byte-blitz"
  | "function-forge"
  | "string-surge"
  | "loop-labyrinth"
  | "array-arena"
  | "logic-lair"
  | "boss-gate";

export type GameLevel = {
  track: GameTrackId;
  difficulty: SkillDifficulty;
  level: number;
  id: string;
  mode: GameModeId;
  title: string;
  subtitle: string;
  stackLabel: string;
  tier: "Rookie" | "Scout" | "Fighter" | "Veteran" | "Elite" | "Mythic";
  xp: number;
  language: LanguageId;
  blocks: ContentBlock[];
  exercise: Exercise;
};

export const MAX_GAME_LEVEL = 100;
