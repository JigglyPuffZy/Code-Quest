import { pickDuelChallenge } from "@/lib/duels/questions";
import { mapDuelRow, type DuelRoomRow } from "@/lib/duels/map";
import { normalizeDuelRules } from "@/lib/duels/rules";
import type { SupabaseClient } from "@supabase/supabase-js";

export function roundExpired(row: DuelRoomRow) {
  if (!row.round_ends_at) return false;
  return Date.parse(row.round_ends_at) <= Date.now();
}

export function roundActive(row: DuelRoomRow) {
  return row.status === "active" && !row.winner_id && !row.round_winner_id && !roundExpired(row);
}

function scorePatch(row: DuelRoomRow, roundWinnerId: string) {
  if (roundWinnerId === row.challenger_id) {
    return { challenger_score: (row.challenger_score ?? 0) + 1 };
  }
  if (roundWinnerId === row.opponent_id) {
    return { opponent_score: (row.opponent_score ?? 0) + 1 };
  }
  return {};
}

function matchWinner(row: DuelRoomRow) {
  const target = row.target_wins === 3 || row.target_wins === 5 ? row.target_wins : 1;
  if ((row.challenger_score ?? 0) >= target) return row.challenger_id;
  if ((row.opponent_score ?? 0) >= target) return row.opponent_id;
  return null;
}

function nextRoundSeed(row: DuelRoomRow) {
  return `${row.id}-round-${(row.current_round ?? 1) + 1}-${Date.now()}`;
}

export function buildRoundStartPatch(row: DuelRoomRow, now = new Date()) {
  const rules = normalizeDuelRules({
    targetWins: row.target_wins === 3 || row.target_wins === 5 ? row.target_wins : 1,
    roundTimerSec: (row.round_timer_sec ?? 120) as 60 | 120 | 180 | 300,
    skillDifficulty: (row.skill_difficulty as "beginner" | "mid" | "expert" | "senior") ?? "mid",
  });
  const round = row.current_round ?? 1;
  const challenge = pickDuelChallenge(`${row.id}-round-${round}-${now.getTime()}`, rules.skillDifficulty);
  const ends = new Date(now.getTime() + rules.roundTimerSec * 1000);

  return {
    challenge_id: challenge.id,
    language: challenge.language,
    current_round: row.current_round ?? 1,
    round_ends_at: ends.toISOString(),
    round_winner_id: null,
    challenger_passed: null,
    opponent_passed: null,
    challenger_submitted_at: null,
    opponent_submitted_at: null,
  };
}

export function buildNextRoundPatch(row: DuelRoomRow, roundWinnerId: string | null, now = new Date()) {
  const scored = row.challenger_score ?? 0;
  const scoreOpp = row.opponent_score ?? 0;
  const withScore = roundWinnerId
    ? {
        ...row,
        challenger_score: roundWinnerId === row.challenger_id ? scored + 1 : scored,
        opponent_score: roundWinnerId === row.opponent_id ? scoreOpp + 1 : scoreOpp,
      }
    : row;

  const winner = matchWinner(withScore as DuelRoomRow);
  if (winner) {
    return {
      challenger_score: withScore.challenger_score,
      opponent_score: withScore.opponent_score,
      winner_id: winner,
      status: "completed",
      ended_at: now.toISOString(),
      round_winner_id: roundWinnerId,
    };
  }

  const nextRound = (row.current_round ?? 1) + 1;
  const rules = normalizeDuelRules({
    targetWins: row.target_wins === 3 || row.target_wins === 5 ? row.target_wins : 1,
    roundTimerSec: (row.round_timer_sec ?? 120) as 60 | 120 | 180 | 300,
    skillDifficulty: (row.skill_difficulty as "beginner" | "mid" | "expert" | "senior") ?? "mid",
  });
  const challenge = pickDuelChallenge(`${row.id}-round-${nextRound}`, rules.skillDifficulty);
  const ends = new Date(now.getTime() + rules.roundTimerSec * 1000);

  return {
    ...scorePatch(row, roundWinnerId ?? ""),
    current_round: nextRound,
    challenge_id: challenge.id,
    language: challenge.language,
    round_ends_at: ends.toISOString(),
    round_winner_id: null,
    challenger_passed: null,
    opponent_passed: null,
    challenger_submitted_at: null,
    opponent_submitted_at: null,
  };
}

/** If the round timer elapsed with no winner, advance without awarding a point. */
export async function syncExpiredRound(supabase: SupabaseClient, row: DuelRoomRow) {
  if (row.status !== "active" || row.winner_id) return row;
  if (!roundExpired(row) || row.round_winner_id) return row;

  const patch = buildNextRoundPatch(row, null);
  const { data, error } = await supabase
    .from("duel_rooms")
    .update(patch)
    .eq("id", row.id)
    .eq("status", "active")
    .is("round_winner_id", null)
    .select("*")
    .maybeSingle();

  if (error) throw error;
  return (data as DuelRoomRow | null) ?? row;
}

export async function claimRoundWin(supabase: SupabaseClient, row: DuelRoomRow, winnerId: string) {
  const patch = buildNextRoundPatch(row, winnerId, new Date());
  const { data, error } = await supabase
    .from("duel_rooms")
    .update(patch)
    .eq("id", row.id)
    .eq("status", "active")
    .is("round_winner_id", null)
    .is("winner_id", null)
    .select("*")
    .maybeSingle();

  if (error) throw error;
  return (data as DuelRoomRow | null) ?? row;
}

export function describeDuelRow(row: DuelRoomRow) {
  return mapDuelRow(row);
}
