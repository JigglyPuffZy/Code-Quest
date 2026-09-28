import type { DuelRoom, DuelSnapshot } from "@/lib/duels/types";
import { normalizeDuelRules } from "@/lib/duels/rules";
import type { SkillDifficulty } from "@/lib/difficulty";

export type DuelRoomRow = {
  id: string;
  challenger_id: string;
  opponent_id: string;
  status: DuelRoom["status"];
  challenge_id: string;
  language: string;
  winner_id: string | null;
  challenger_passed: boolean | null;
  opponent_passed: boolean | null;
  challenger_submitted_at: string | null;
  opponent_submitted_at: string | null;
  created_at: string;
  started_at: string | null;
  ended_at: string | null;
  expires_at: string;
  target_wins?: number | null;
  round_timer_sec?: number | null;
  skill_difficulty?: string | null;
  challenger_score?: number | null;
  opponent_score?: number | null;
  current_round?: number | null;
  round_ends_at?: string | null;
  round_winner_id?: string | null;
};

export type ProfileSnippet = {
  id: string;
  username: string;
  avatar: string;
};

export function mapDuelRow(row: DuelRoomRow): DuelRoom {
  const rules = normalizeDuelRules({
    targetWins: row.target_wins === 3 || row.target_wins === 5 ? row.target_wins : 1,
    roundTimerSec: (row.round_timer_sec ?? 120) as 60 | 120 | 180 | 300,
    skillDifficulty: (row.skill_difficulty as SkillDifficulty) ?? "mid",
  });

  return {
    id: row.id,
    challengerId: row.challenger_id,
    opponentId: row.opponent_id,
    status: row.status,
    challengeId: row.challenge_id,
    language: row.language,
    winnerId: row.winner_id,
    challengerPassed: row.challenger_passed,
    opponentPassed: row.opponent_passed,
    challengerSubmittedAt: row.challenger_submitted_at,
    opponentSubmittedAt: row.opponent_submitted_at,
    createdAt: row.created_at,
    startedAt: row.started_at,
    endedAt: row.ended_at,
    expiresAt: row.expires_at,
    targetWins: rules.targetWins,
    roundTimerSec: rules.roundTimerSec,
    skillDifficulty: rules.skillDifficulty,
    challengerScore: row.challenger_score ?? 0,
    opponentScore: row.opponent_score ?? 0,
    currentRound: row.current_round ?? 1,
    roundEndsAt: row.round_ends_at ?? null,
    roundWinnerId: row.round_winner_id ?? null,
  };
}

export function buildSnapshot(
  room: DuelRoom,
  challenger: ProfileSnippet,
  opponent: ProfileSnippet,
  userId: string,
): DuelSnapshot {
  const youAre = room.challengerId === userId ? "challenger" : "opponent";
  return {
    ...room,
    challenger: { id: challenger.id, username: challenger.username, avatar: challenger.avatar },
    opponent: { id: opponent.id, username: opponent.username, avatar: opponent.avatar },
    youAre,
  };
}
