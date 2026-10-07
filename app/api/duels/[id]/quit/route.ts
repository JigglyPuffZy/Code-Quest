import { loadDuelSnapshot } from "@/lib/duels/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const supabase = await createServerSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "Live duels require Supabase." }, { status: 503 });
  }

  const { data: auth, error: authError } = await supabase.auth.getUser();
  if (authError || !auth.user) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const { data: row, error } = await supabase.from("duel_rooms").select("*").eq("id", id).maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!row) return NextResponse.json({ error: "Duel not found." }, { status: 404 });

  const isParticipant = row.challenger_id === auth.user.id || row.opponent_id === auth.user.id;
  if (!isParticipant) {
    return NextResponse.json({ error: "You are not in this duel." }, { status: 403 });
  }

  if (row.status === "completed" || row.status === "declined" || row.status === "expired" || row.status === "cancelled") {
    return NextResponse.json({ error: "This duel is already over." }, { status: 409 });
  }

  const now = new Date().toISOString();

  if (row.status === "pending") {
    if (row.challenger_id !== auth.user.id) {
      return NextResponse.json({ error: "Only the inviter can cancel a pending duel." }, { status: 403 });
    }

    const { error: updateError } = await supabase
      .from("duel_rooms")
      .update({ status: "cancelled", ended_at: now })
      .eq("id", id)
      .eq("status", "pending");

    if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });
  } else if (row.status === "active") {
    const winnerId = row.challenger_id === auth.user.id ? row.opponent_id : row.challenger_id;
    const targetWins = row.target_wins === 3 || row.target_wins === 5 ? row.target_wins : 1;
    const challengerScore =
      winnerId === row.challenger_id ? Math.max(row.challenger_score ?? 0, targetWins) : row.challenger_score ?? 0;
    const opponentScore =
      winnerId === row.opponent_id ? Math.max(row.opponent_score ?? 0, targetWins) : row.opponent_score ?? 0;

    const { error: updateError } = await supabase
      .from("duel_rooms")
      .update({
        status: "completed",
        winner_id: winnerId,
        challenger_score: challengerScore,
        opponent_score: opponentScore,
        ended_at: now,
      })
      .eq("id", id)
      .eq("status", "active");

    if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });
  } else {
    return NextResponse.json({ error: "This duel cannot be quit right now." }, { status: 409 });
  }

  const duel = await loadDuelSnapshot(supabase, id, auth.user.id);
  return NextResponse.json({ duel });
}
