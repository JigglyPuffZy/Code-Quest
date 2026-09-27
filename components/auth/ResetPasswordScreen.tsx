"use client";

import { AuthMobileStrip } from "@/components/auth/AuthMobileStrip";
import { usePlayer } from "@/components/player/PlayerProvider";
import { Logo } from "@/components/shell/Logo";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const inputClass =
  "w-full rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none transition placeholder:text-muted/60 focus:border-primary focus:ring-2 focus:ring-primary/15";

export function ResetPasswordScreen() {
  const { refresh, supabaseEnabled, email } = usePlayer();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!supabaseEnabled) return;
    createClient()
      .auth.getSession()
      .then(({ data }) => setReady(Boolean(data.session)))
      .catch(() => setReady(false));
  }, [supabaseEnabled]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Use at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setPending(true);
    try {
      const { error: updateError } = await createClient().auth.updateUser({ password });
      if (updateError) throw updateError;
      await refresh();
      router.push("/dashboard");
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Could not update password.");
    } finally {
      setPending(false);
    }
  }

  if (!supabaseEnabled) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-white">
        <div className="auth-hero-grid pointer-events-none fixed inset-0" aria-hidden />
        <div className="relative mx-auto flex min-h-screen max-w-md flex-col justify-center px-5 py-10">
          <Logo glow subtitle="Academy" />
          <div className="auth-panel mt-6 rounded-2xl border border-line bg-white p-6 text-sm text-muted shadow-xl">
            Password reset needs Supabase to be configured.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-white">
      <div className="auth-hero-grid pointer-events-none fixed inset-0" aria-hidden />
      <div className="relative mx-auto flex min-h-screen max-w-md flex-col justify-center px-5 py-8 sm:px-8">
        <div className="auth-form-rise">
          <div className="mb-3 flex justify-end">
            <Link
              href="/login"
              className="rounded-full border border-line bg-white px-3 py-1.5 text-xs font-semibold text-muted shadow-sm transition hover:border-primary-200 hover:text-primary"
            >
              ← Log in
            </Link>
          </div>

          <AuthMobileStrip mode="forgot" />

          <div className="auth-panel relative mt-5 overflow-hidden rounded-2xl border border-line bg-white p-6 shadow-2xl shadow-slate-900/[0.06] sm:p-8">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary-400 via-primary to-violet-400" aria-hidden />
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">New password</p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight">Choose a new password</h1>
            <p className="mt-2 text-sm text-muted">
              {ready
                ? email
                  ? `Set a new password for ${email}.`
                  : "Set a new password for your account."
                : "Open the reset link from your email first."}
            </p>
            <form onSubmit={(event) => void submit(event)} className="mt-6 space-y-4">
              <label className="block text-sm">
                <span className="mb-1.5 block text-xs font-semibold text-muted">New password</span>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className={inputClass}
                  autoComplete="new-password"
                  minLength={6}
                  required
                  disabled={!ready || pending}
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1.5 block text-xs font-semibold text-muted">Confirm password</span>
                <input
                  type="password"
                  value={confirm}
                  onChange={(event) => setConfirm(event.target.value)}
                  className={inputClass}
                  autoComplete="new-password"
                  minLength={6}
                  required
                  disabled={!ready || pending}
                />
              </label>
              {error ? <p className="text-sm text-danger">{error}</p> : null}
              <Button type="submit" className="w-full" disabled={!ready || pending}>
                {pending ? "Saving…" : "Update password"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
