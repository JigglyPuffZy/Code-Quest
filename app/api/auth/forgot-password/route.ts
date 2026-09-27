import { createServerSupabase } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Send a JSON body." }, { status: 400 });
  }

  const payload = body as { username?: string };
  const username = payload.username?.trim() ?? "";

  if (!username) {
    return NextResponse.json({ error: "Enter your username." }, { status: 400 });
  }

  const supabase = await createServerSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "Password reset is not configured yet." }, { status: 503 });
  }

  const { data: emailValue, error: profileError } = await supabase.rpc("login_email_for_username", {
    target_username: username,
  });

  if (profileError) {
    return NextResponse.json({ error: "Could not look up that username." }, { status: 500 });
  }

  const email = typeof emailValue === "string" ? emailValue.trim() : "";
  if (!email) {
    return NextResponse.json(
      { error: "No account found with that username, or no recovery email is saved." },
      { status: 404 },
    );
  }

  const origin = new URL(request.url).origin;
  const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/reset-password`,
  });

  if (resetError) {
    return NextResponse.json({ error: resetError.message || "Could not send reset email." }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
