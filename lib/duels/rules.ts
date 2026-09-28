import { SKILL_DIFFICULTIES, type SkillDifficulty } from "@/lib/difficulty";

export type DuelRules = {
  targetWins: 1 | 3 | 5;
  roundTimerSec: 60 | 120 | 180 | 300;
  skillDifficulty: SkillDifficulty;
};

export const DUEL_TARGET_WINS_OPTIONS: Array<{ value: 1 | 3 | 5; label: string; hint: string }> = [
  { value: 1, label: "1 win", hint: "Sudden death — one round decides it" },
  { value: 3, label: "First to 3", hint: "Short series — race to three round wins" },
  { value: 5, label: "First to 5", hint: "Full series — endurance duel" },
];

export const DUEL_TIMER_OPTIONS: Array<{ value: 60 | 120 | 180 | 300; label: string }> = [
  { value: 60, label: "1 min / round" },
  { value: 120, label: "2 min / round" },
  { value: 180, label: "3 min / round" },
  { value: 300, label: "5 min / round" },
];

export const DEFAULT_DUEL_RULES: DuelRules = {
  targetWins: 1,
  roundTimerSec: 120,
  skillDifficulty: "mid",
};

export function normalizeDuelRules(input?: Partial<DuelRules>): DuelRules {
  const targetWins = input?.targetWins === 3 || input?.targetWins === 5 ? input.targetWins : 1;
  const roundTimerSec =
    input?.roundTimerSec === 60 ||
    input?.roundTimerSec === 180 ||
    input?.roundTimerSec === 300
      ? input.roundTimerSec
      : 120;
  const skillDifficulty =
    input?.skillDifficulty && input.skillDifficulty in SKILL_DIFFICULTIES
      ? input.skillDifficulty
      : "mid";
  return { targetWins, roundTimerSec, skillDifficulty };
}

export function duelRulesSummary(rules: DuelRules) {
  const diff = SKILL_DIFFICULTIES[rules.skillDifficulty];
  const wins = DUEL_TARGET_WINS_OPTIONS.find((item) => item.value === rules.targetWins)?.label ?? "1 win";
  const timer = DUEL_TIMER_OPTIONS.find((item) => item.value === rules.roundTimerSec)?.label ?? "2 min";
  return `${wins} · ${timer} · ${diff.label} difficulty`;
}

export function matchInviteExpiryMs(rules: DuelRules) {
  return 5 * 60_000;
}

export function matchMaxDurationMs(rules: DuelRules) {
  const rounds = rules.targetWins * 2 - 1;
  return rounds * rules.roundTimerSec * 1000 + 10 * 60_000;
}
