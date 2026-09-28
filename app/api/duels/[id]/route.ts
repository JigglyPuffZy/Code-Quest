import { loadDuelSnapshot } from "@/lib/duels/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const supabase = await createServerSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "Live duels require Supabase." }, { status: 503 });
  }

  const { data: auth, error: authError } = await supabase.auth.getUser();
  if (authError || !auth.user) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const duel = await loadDuelSnapshot(supabase, id, auth.user.id);
  if (!duel) {
    return NextResponse.json({ error: "Duel not found." }, { status: 404 });
  }

  return NextResponse.json({ duel });
}
