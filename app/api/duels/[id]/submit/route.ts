import { gradeExercise } from "@/lib/execute/grade";
import { claimRoundWin, roundExpired } from "@/lib/duels/engine";
import type { DuelRoomRow } from "@/lib/duels/map";
import { duelExpired, loadDuelSnapshot } from "@/lib/duels/server";
import { normalizeSkillDifficulty } from "@/lib/difficulty";
import { createServerSupabase } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

const MAX_CODE = 8_000;

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const supabase = await createServerSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "Live duels require Supabase." }, { status: 503 });
  }

  const { data: auth, error: authError } = await supabase.auth.getUser();
  if (authError || !auth.user) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const body = (await request.json()) as { code?: string };
  const code = body.code?.trim() ?? "";
  if (!code || code.length > MAX_CODE) {
    return NextResponse.json({ error: "Paste your solution first." }, { status: 400 });
  }

  let row = (await supabase.from("duel_rooms").select("*").eq("id", id).maybeSingle()).data as
    | DuelRoomRow
    | null;
  if (!row) return NextResponse.json({ error: "Duel not found." }, { status: 404 });

  const isChallenger = row.challenger_id === auth.user.id;
  const isOpponent = row.opponent_id === auth.user.id;
  if (!isChallenger && !isOpponent) {
    return NextResponse.json({ error: "You are not in this duel." }, { status: 403 });
  }
  if (row.status !== "active") {
    return NextResponse.json({ error: "This duel is not active." }, { status: 409 });
  }
  if (duelExpired(row.expires_at)) {
    await supabase.from("duel_rooms").update({ status: "expired", ended_at: new Date().toISOString() }).eq("id", id);
    return NextResponse.json({ error: "Duel timed out." }, { status: 410 });
  }
  if (row.winner_id) {
    const duel = await loadDuelSnapshot(supabase, id, auth.user.id);
    return NextResponse.json({
      duel,
      passed: false,
      won: row.winner_id === auth.user.id,
      roundWon: false,
    });
  }
  if (roundExpired(row)) {
    return NextResponse.json({ error: "Round timer ended. Waiting for next round…" }, { status: 409 });
  }
  if (row.round_winner_id) {
    return NextResponse.json({ error: "This round already has a winner." }, { status: 409 });
  }

  const difficulty = normalizeSkillDifficulty(row.skill_difficulty);
  const grade = await gradeExercise("challenge", row.challenge_id, code, difficulty, undefined, {
    visibleOnly: true,
  });
  const passed = grade.passed;
  const now = new Date().toISOString();

  const submitPatch = isChallenger
    ? { challenger_passed: passed, challenger_submitted_at: now }
    : { opponent_passed: passed, opponent_submitted_at: now };

  await supabase.from("duel_rooms").update(submitPatch).eq("id", id);

  if (!passed) {
    const duel = await loadDuelSnapshot(supabase, id, auth.user.id);
    return NextResponse.json({ duel, passed: false, won: false, roundWon: false });
  }

  row = (await claimRoundWin(supabase, row, auth.user.id)) as DuelRoomRow;
  const duel = await loadDuelSnapshot(supabase, id, auth.user.id);
  const matchWon = row.winner_id === auth.user.id;

  return NextResponse.json({
    duel,
    passed: true,
    won: matchWon,
    roundWon: true,
  });
}
