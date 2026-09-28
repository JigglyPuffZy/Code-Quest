import { pickDuelChallenge } from "@/lib/duels/questions";
import { normalizeDuelRules, type DuelRules } from "@/lib/duels/rules";
import { demoRivals } from "@/lib/leaderboard";
import type { DuelSnapshot } from "@/lib/duels/types";
import type { Player } from "@/lib/types";

const DEMO_PREFIX = "demo-duel-";
const STORAGE_KEY = "devladder.demo-duel";

export type DemoDuelState = DuelSnapshot & {
  cpuDeadlineMs: number;
  cpuWins: boolean;
};

export function isDemoDuelId(id: string) {
  return id.startsWith(DEMO_PREFIX);
}

function roundEndsAt(timerSec: number) {
  return new Date(Date.now() + timerSec * 1000).toISOString();
}

export function createDemoDuel(player: Player, opponentId: string, rulesInput?: Partial<DuelRules>): DemoDuelState {
  const rival = demoRivals.find((entry) => entry.id === opponentId);
  if (!rival) throw new Error("That rival is not available for practice.");

  const rules = normalizeDuelRules(rulesInput);
  const challenge = pickDuelChallenge(`${player.id}-${opponentId}-${Date.now()}`, rules.skillDifficulty);
  const id = `${DEMO_PREFIX}${Date.now()}`;
  const now = Date.now();
  const cpuDelay = rules.roundTimerSec * 500 + Math.floor(Math.random() * rules.roundTimerSec * 500);

  const duel: DemoDuelState = {
    id,
    challengerId: player.id,
    opponentId: rival.id,
    status: "active",
    challengeId: challenge.id,
    language: challenge.language,
    winnerId: null,
    challengerPassed: null,
    opponentPassed: null,
    challengerSubmittedAt: null,
    opponentSubmittedAt: null,
    createdAt: new Date(now).toISOString(),
    startedAt: new Date(now).toISOString(),
    endedAt: null,
    expiresAt: new Date(now + rules.targetWins * rules.roundTimerSec * 2000).toISOString(),
    targetWins: rules.targetWins,
    roundTimerSec: rules.roundTimerSec,
    skillDifficulty: rules.skillDifficulty,
    challengerScore: 0,
    opponentScore: 0,
    currentRound: 1,
    roundEndsAt: roundEndsAt(rules.roundTimerSec),
    roundWinnerId: null,
    challenger: { id: player.id, username: player.username, avatar: player.avatar },
    opponent: { id: rival.id, username: rival.username, avatar: rival.avatar },
    youAre: "challenger",
    cpuDeadlineMs: now + cpuDelay,
    cpuWins: Math.random() > 0.4,
  };

  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(duel));
  return duel;
}

export function readDemoDuel(id: string): DemoDuelState | null {
  if (!isDemoDuelId(id)) return null;
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as DemoDuelState;
    return parsed.id === id ? parsed : null;
  } catch {
    return null;
  }
}

export function writeDemoDuel(duel: DemoDuelState) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(duel));
}

export function clearDemoDuel() {
  sessionStorage.removeItem(STORAGE_KEY);
}

export function advanceDemoRound(duel: DemoDuelState, roundWinnerId: string | null): DemoDuelState {
  const challengerScore =
    roundWinnerId === duel.challengerId ? duel.challengerScore + 1 : duel.challengerScore;
  const opponentScore = roundWinnerId === duel.opponentId ? duel.opponentScore + 1 : duel.opponentScore;

  if (challengerScore >= duel.targetWins) {
    return {
      ...duel,
      challengerScore,
      opponentScore,
      winnerId: duel.challengerId,
      status: "completed",
      endedAt: new Date().toISOString(),
      roundWinnerId: roundWinnerId,
    };
  }
  if (opponentScore >= duel.targetWins) {
    return {
      ...duel,
      challengerScore,
      opponentScore,
      winnerId: duel.opponentId,
      status: "completed",
      endedAt: new Date().toISOString(),
      roundWinnerId: roundWinnerId,
    };
  }

  const nextRound = duel.currentRound + 1;
  const challenge = pickDuelChallenge(`${duel.id}-round-${nextRound}`, duel.skillDifficulty);
  const now = Date.now();

  return {
    ...duel,
    challengerScore,
    opponentScore,
    currentRound: nextRound,
    challengeId: challenge.id,
    language: challenge.language,
    roundEndsAt: roundEndsAt(duel.roundTimerSec),
    roundWinnerId: null,
    challengerPassed: null,
    opponentPassed: null,
    challengerSubmittedAt: null,
    opponentSubmittedAt: null,
    cpuDeadlineMs: now + duel.roundTimerSec * 500 + Math.floor(Math.random() * duel.roundTimerSec * 500),
    cpuWins: Math.random() > 0.4,
  };
}
