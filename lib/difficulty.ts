export type SkillDifficulty = "beginner" | "mid" | "expert" | "senior";

export const SKILL_DIFFICULTY_ORDER: SkillDifficulty[] = [
  "beginner",
  "mid",
  "expert",
  "senior",
];

export const SKILL_DIFFICULTIES: Record<
  SkillDifficulty,
  {
    label: string;
    rank: string;
    blurb: string;
    vibe: string;
    gameLevelOffset: number;
    xpMultiplier: number;
    soft: string;
    accent: string;
    bar: string;
    ring: string;
  }
> = {
  beginner: {
    label: "Beginner",
    rank: "Junior",
    vibe: "Easy mode — thumbs up!",
    blurb: "Warm-up problems and gentler game puzzles.",
    gameLevelOffset: -18,
    xpMultiplier: 1,
    soft: "bg-sky-50",
    accent: "text-sky-700",
    bar: "bg-sky-500",
    ring: "ring-sky-100",
  },
  mid: {
    label: "Mid-Level",
    rank: "Developer",
    vibe: "Double thumbs — keep going!",
    blurb: "Standard campaign pace for everyday practice.",
    gameLevelOffset: 0,
    xpMultiplier: 1.15,
    soft: "bg-emerald-50",
    accent: "text-emerald-700",
    bar: "bg-emerald-500",
    ring: "ring-emerald-100",
  },
  expert: {
    label: "Expert",
    rank: "Senior track",
    vibe: "Wow… no hints allowed.",
    blurb: "Tighter checks and trickier logic.",
    gameLevelOffset: 14,
    xpMultiplier: 1.35,
    bar: "bg-amber-500",
    soft: "bg-amber-50",
    accent: "text-amber-700",
    ring: "ring-amber-100",
  },
  senior: {
    label: "Senior",
    rank: "Staff dev",
    vibe: "Devil mode — no mercy.",
    blurb: "Boss-tier thinking — only for the brave.",
    gameLevelOffset: 28,
    xpMultiplier: 1.6,
    soft: "bg-rose-50",
    accent: "text-rose-700",
    bar: "bg-rose-500",
    ring: "ring-rose-100",
  },
};

export function isSkillDifficulty(value: unknown): value is SkillDifficulty {
  return value === "beginner" || value === "mid" || value === "expert" || value === "senior";
}

export function normalizeSkillDifficulty(value: unknown): SkillDifficulty {
  return isSkillDifficulty(value) ? value : "mid";
}

export function difficultyLabel(difficulty: SkillDifficulty) {
  const meta = SKILL_DIFFICULTIES[difficulty];
  return `${meta.label} · ${meta.rank}`;
}

export function difficultyShort(difficulty: SkillDifficulty) {
  return SKILL_DIFFICULTIES[difficulty].label;
}

/** How many hints a player may reveal for a given skill difficulty. */
export function hintsAllowedForDifficulty(difficulty: SkillDifficulty): number {
  switch (difficulty) {
    case "beginner":
      return 2;
    case "mid":
      return 1;
    case "expert":
    case "senior":
      return 0;
    default:
      return 0;
  }
}

export function hintLimitLabel(difficulty: SkillDifficulty): string {
  const allowed = hintsAllowedForDifficulty(difficulty);
  if (allowed === 0) return "No hints on this difficulty";
  if (allowed === 1) return "1 hint available";
  return `${allowed} hints available`;
}
