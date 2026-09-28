import { getChallenge } from "@/lib/curriculum/index";
import { syncExpiredRound } from "@/lib/duels/engine";
import { pickDuelChallenge } from "@/lib/duels/questions";
import { buildSnapshot, mapDuelRow, type DuelRoomRow, type ProfileSnippet } from "@/lib/duels/map";
import { matchInviteExpiryMs, matchMaxDurationMs, normalizeDuelRules, type DuelRules } from "@/lib/duels/rules";
import type { DuelSnapshot } from "@/lib/duels/types";
import { isOnline, ONLINE_WINDOW_MS } from "@/lib/duels/presence";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function loadDuelSnapshot(supabase: SupabaseClient, duelId: string, userId: string) {
  const { data: row, error } = await supabase.from("duel_rooms").select("*").eq("id", duelId).maybeSingle();
  if (error) throw error;
  if (!row) return null;

  const synced = await syncExpiredRound(supabase, row as DuelRoomRow);
  const duel = mapDuelRow(synced as DuelRoomRow);
  if (duel.challengerId !== userId && duel.opponentId !== userId) return null;

  const ids = [duel.challengerId, duel.opponentId];
  const { data: profiles, error: profileError } = await supabase
    .from("profiles")
    .select("id, username, avatar")
    .in("id", ids);
  if (profileError) throw profileError;

  const challenger = profiles?.find((item) => item.id === duel.challengerId);
  const opponent = profiles?.find((item) => item.id === duel.opponentId);
  if (!challenger || !opponent) return null;

  return buildSnapshot(duel, challenger as ProfileSnippet, opponent as ProfileSnippet, userId);
}

export async function assertOpponentOnline(supabase: SupabaseClient, opponentId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("last_seen_at")
    .eq("id", opponentId)
    .maybeSingle();
  if (error) throw error;
  if (!data || !isOnline(data.last_seen_at)) {
    throw new Error("That player is offline right now. Try someone with a green dot.");
  }
}

export function pickChallengeForDuel(seed: string, rules: DuelRules) {
  const challenge = pickDuelChallenge(seed, rules.skillDifficulty);
  if (!getChallenge(challenge.id)) throw new Error("Could not pick a duel question.");
  return challenge;
}

export function duelExpired(expiresAt: string) {
  return Date.parse(expiresAt) <= Date.now();
}

export function inviteExpiresAt(rules: DuelRules) {
  return new Date(Date.now() + matchInviteExpiryMs(rules)).toISOString();
}

export function matchExpiresAt(rules: DuelRules, from = new Date()) {
  return new Date(from.getTime() + matchMaxDurationMs(rules)).toISOString();
}

export { ONLINE_WINDOW_MS };
