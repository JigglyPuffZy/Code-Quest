import type { SkillDifficulty } from "@/lib/difficulty";
import { SKILL_DIFFICULTIES } from "@/lib/difficulty";
import type { GameModeId } from "@/lib/game/types";

export const GAME_MODES: Record<
  GameModeId,
  { label: string; emoji: string; blurb: string; accent: string }
> = {
  "byte-blitz": {
    label: "Byte Blitz",
    emoji: "⚡",
    blurb: "Print the exact output.",
    accent: "from-cyan-500 to-sky-400",
  },
  "function-forge": {
    label: "Function Forge",
    emoji: "🔨",
    blurb: "Craft functions that pass checks.",
    accent: "from-violet-500 to-primary-400",
  },
  "string-surge": {
    label: "String Surge",
    emoji: "🧵",
    blurb: "Twist and slice text.",
    accent: "from-fuchsia-500 to-pink-400",
  },
  "loop-labyrinth": {
    label: "Loop Labyrinth",
    emoji: "🌀",
    blurb: "Repeat until the pattern wins.",
    accent: "from-emerald-500 to-teal-400",
  },
  "array-arena": {
    label: "Array Arena",
    emoji: "📦",
    blurb: "Lists, sums, and picks.",
    accent: "from-amber-500 to-orange-400",
  },
  "logic-lair": {
    label: "Logic Lair",
    emoji: "🧠",
    blurb: "True, false, and decisions.",
    accent: "from-rose-500 to-red-400",
  },
  "boss-gate": {
    label: "Boss Gate",
    emoji: "👹",
    blurb: "A harder fusion fight every 10 levels.",
    accent: "from-primary-600 to-violet-500",
  },
};

export function gameModeForLevel(level: number): GameModeId {
  if (level % 10 === 0) return "boss-gate";
  const cycle: GameModeId[] = [
    "byte-blitz",
    "function-forge",
    "string-surge",
    "loop-labyrinth",
    "array-arena",
    "logic-lair",
  ];
  return cycle[(level - 1) % cycle.length];
}

export function tierForLevel(level: number) {
  if (level <= 15) return "Rookie";
  if (level <= 35) return "Scout";
  if (level <= 55) return "Fighter";
  if (level <= 75) return "Veteran";
  if (level <= 90) return "Elite";
  return "Mythic";
}

export function xpForGameLevel(level: number, difficulty: SkillDifficulty = "mid") {
  const base = 12 + level * 1.35 + (level % 10 === 0 ? 25 : 0);
  return Math.round(base * SKILL_DIFFICULTIES[difficulty].xpMultiplier);
}

export function effectiveGameLevel(level: number, difficulty: SkillDifficulty) {
  const offset = SKILL_DIFFICULTIES[difficulty].gameLevelOffset;
  return Math.max(1, Math.min(100, Math.floor(level + offset)));
}
