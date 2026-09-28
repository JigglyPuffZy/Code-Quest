import { buildRoundStartPatch } from "@/lib/duels/engine";
import type { DuelRoomRow } from "@/lib/duels/map";
import { duelExpired, loadDuelSnapshot, matchExpiresAt } from "@/lib/duels/server";
import { normalizeDuelRules } from "@/lib/duels/rules";
import { createServerSupabase } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

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

  const body = (await request.json()) as { accept?: boolean };
  const accept = Boolean(body.accept);

  const { data: row, error } = await supabase.from("duel_rooms").select("*").eq("id", id).maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!row) return NextResponse.json({ error: "Duel not found." }, { status: 404 });
  if (row.opponent_id !== auth.user.id) {
    return NextResponse.json({ error: "Only the invited player can respond." }, { status: 403 });
  }
  if (row.status !== "pending") {
    return NextResponse.json({ error: "This invite is no longer pending." }, { status: 409 });
  }
  if (duelExpired(row.expires_at)) {
    await supabase.from("duel_rooms").update({ status: "expired", ended_at: new Date().toISOString() }).eq("id", id);
    return NextResponse.json({ error: "Invite expired." }, { status: 410 });
  }

  if (!accept) {
    const { error: updateError } = await supabase
      .from("duel_rooms")
      .update({ status: "declined", ended_at: new Date().toISOString() })
      .eq("id", id);
    if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });
    const duel = await loadDuelSnapshot(supabase, id, auth.user.id);
    return NextResponse.json({ duel });
  }

  const rules = normalizeDuelRules({
    targetWins: row.target_wins === 3 || row.target_wins === 5 ? row.target_wins : 1,
    roundTimerSec: (row.round_timer_sec ?? 120) as 60 | 120 | 180 | 300,
    skillDifficulty: (row.skill_difficulty as "beginner" | "mid" | "expert" | "senior") ?? "mid",
  });
  const now = new Date();
  const roundPatch = buildRoundStartPatch(row as DuelRoomRow, now);

  const { error: updateError } = await supabase
    .from("duel_rooms")
    .update({
      status: "active",
      started_at: now.toISOString(),
      expires_at: matchExpiresAt(rules, now),
      challenger_score: 0,
      opponent_score: 0,
      ...roundPatch,
    })
    .eq("id", id);

  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });

  const duel = await loadDuelSnapshot(supabase, id, auth.user.id);
  return NextResponse.json({ duel });
}
