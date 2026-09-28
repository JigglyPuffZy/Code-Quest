import {
  assertOpponentOnline,
  inviteExpiresAt,
  pickChallengeForDuel,
} from "@/lib/duels/server";
import { normalizeDuelRules } from "@/lib/duels/rules";
import { createServerSupabase } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const supabase = await createServerSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "Connect Supabase to duel live players." }, { status: 503 });
  }

  const { data: auth, error: authError } = await supabase.auth.getUser();
  if (authError || !auth.user) {
    return NextResponse.json({ error: "Sign in to send a duel invite." }, { status: 401 });
  }

  const body = (await request.json()) as {
    opponentId?: string;
    targetWins?: number;
    roundTimerSec?: number;
    skillDifficulty?: string;
  };
  const opponentId = body.opponentId?.trim();
  const rules = normalizeDuelRules({
    targetWins: body.targetWins === 3 || body.targetWins === 5 ? body.targetWins : 1,
    roundTimerSec: body.roundTimerSec as 60 | 120 | 180 | 300,
    skillDifficulty: body.skillDifficulty as "beginner" | "mid" | "expert" | "senior",
  });

  if (!opponentId) {
    return NextResponse.json({ error: "Pick an opponent." }, { status: 400 });
  }
  if (opponentId === auth.user.id) {
    return NextResponse.json({ error: "You cannot duel yourself." }, { status: 400 });
  }

  try {
    await assertOpponentOnline(supabase, opponentId);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Opponent is offline." },
      { status: 400 },
    );
  }

  const { data: existing } = await supabase
    .from("duel_rooms")
    .select("id")
    .or(
      `and(challenger_id.eq.${auth.user.id},opponent_id.eq.${opponentId},status.eq.pending),and(challenger_id.eq.${opponentId},opponent_id.eq.${auth.user.id},status.eq.pending),and(challenger_id.eq.${auth.user.id},opponent_id.eq.${opponentId},status.eq.active),and(challenger_id.eq.${opponentId},opponent_id.eq.${auth.user.id},status.eq.active)`,
    )
    .limit(1);

  if (existing?.length) {
    return NextResponse.json({ error: "A duel is already in progress with that player." }, { status: 409 });
  }

  const placeholder = pickChallengeForDuel(`${auth.user.id}-${opponentId}-invite`, rules);
  const { data, error } = await supabase
    .from("duel_rooms")
    .insert({
      challenger_id: auth.user.id,
      opponent_id: opponentId,
      challenge_id: placeholder.id,
      language: placeholder.language,
      status: "pending",
      target_wins: rules.targetWins,
      round_timer_sec: rules.roundTimerSec,
      skill_difficulty: rules.skillDifficulty,
      expires_at: inviteExpiresAt(rules),
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ duelId: data.id, rules });
}
