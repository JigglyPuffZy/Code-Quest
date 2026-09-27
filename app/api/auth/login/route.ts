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

  const payload = body as { username?: string; password?: string };
  const username = payload.username?.trim() ?? "";
  const password = payload.password ?? "";

  if (!username || !password) {
    return NextResponse.json({ error: "Username and password are required." }, { status: 400 });
  }

  const supabase = await createServerSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "Sign-in is not configured yet." }, { status: 503 });
  }

  const { data: emailValue, error: profileError } = await supabase.rpc("login_email_for_username", {
    target_username: username,
  });

  if (profileError) {
    return NextResponse.json({ error: "Could not look up that username." }, { status: 500 });
  }

  const email = typeof emailValue === "string" ? emailValue.trim() : "";
  if (!email) {
    return NextResponse.json({ error: "Username or password is incorrect." }, { status: 401 });
  }

  const { data, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError) {
    const message = signInError.message.toLowerCase();
    if (message.includes("email not confirmed")) {
      return NextResponse.json(
        { error: "Confirm your email first, then log in with your username." },
        { status: 401 },
      );
    }
    return NextResponse.json(
      { error: "Username or password is incorrect." },
      { status: 401 },
    );
  }

  return NextResponse.json({
    ok: true,
    email: data.user?.email ?? email,
  });
}
