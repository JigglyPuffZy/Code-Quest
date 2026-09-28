import { challenges } from "@/lib/curriculum/challenges";
import type { SkillDifficulty } from "@/lib/difficulty";
import type { Challenge } from "@/lib/types";

function poolForDifficulty(difficulty: SkillDifficulty) {
  const exact = challenges.filter((item) => item.difficulty === difficulty);
  if (exact.length > 0) return exact;
  const mid = challenges.filter((item) => item.difficulty === "mid");
  return mid.length > 0 ? mid : challenges;
}

export function pickDuelChallenge(seed: string, difficulty: SkillDifficulty = "mid"): Challenge {
  const pool = poolForDifficulty(difficulty);
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return pool[hash % pool.length]!;
}
