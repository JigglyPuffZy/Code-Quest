import type { SkillDifficulty } from "@/lib/difficulty";
import type { Exercise, FunctionCase } from "@/lib/types";

const SENIOR_EXTRA_CASES: Record<string, FunctionCase[]> = {
  "js-sum": [{ args: [[-3, 10, -1, 4]], expected: 10, label: "senior: negatives" }],
  "js-palindrome": [{ args: ["RaceCar"], expected: true, label: "senior: mixed case" }],
  "js-double": [{ args: [0], expected: 0, label: "senior: zero" }],
  "py-vowels": [{ args: ["rhythm"], expected: 0, label: "senior: no vowels" }],
};

export function applySeniorDifficulty(
  exercise: Exercise,
  difficulty?: SkillDifficulty,
  exerciseId?: string,
): Exercise {
  if (difficulty !== "senior" || exercise.tests.type !== "function") return exercise;

  const extra = exerciseId ? SENIOR_EXTRA_CASES[exerciseId] ?? [] : [];
  const cases = [...exercise.tests.cases, ...extra];

  const performance =
    exercise.performance ??
    (cases.length >= 3
      ? {
          expectedComplexity: "O(n)",
          maxMsPerCase: 2_500,
          cases: [cases[cases.length - 1]],
        }
      : undefined);

  return {
    ...exercise,
    tests: { ...exercise.tests, cases },
    performance,
  };
}
