"use client";

import { AuthHero } from "@/components/auth/AuthHero";
import { AuthMobileStrip } from "@/components/auth/AuthMobileStrip";
import { Logo } from "@/components/shell/Logo";
import { Button } from "@/components/ui/Button";
import { loginUsernameError } from "@/lib/auth/username";
import { ArrowRight, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const inputClass =
  "w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm outline-none transition placeholder:text-muted/60 focus:border-primary focus:ring-2 focus:ring-primary/15";

export function ForgotPasswordScreen() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setNotice("");

    const problem = loginUsernameError(username);
    if (problem) {
      setError(problem);
      return;
    }

    setPending(true);
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error || "Could not send reset email.");
      }
      setNotice("Check your recovery email for a password reset link.");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Could not send reset email.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-canvas">
      <div className="auth-hero-grid pointer-events-none fixed inset-0 lg:hidden" aria-hidden />
      <div className="relative grid min-h-screen lg:grid-cols-[1.08fr_0.92fr]">
        <AuthHero mode="forgot" />

        <div className="auth-form-side relative flex flex-col justify-center px-5 py-8 sm:px-10 lg:px-12 xl:px-16">
          <div className="auth-form-rise mx-auto w-full max-w-[400px]">
            <div className="mb-3 flex justify-end lg:hidden">
              <Link
                href="/login"
                className="rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-muted shadow-sm transition hover:border-primary-200 hover:text-primary"
              >
                ← Log in
              </Link>
            </div>

            <AuthMobileStrip mode="forgot" />

            <div className="auth-panel relative mt-5 overflow-hidden rounded-2xl border border-line bg-surface p-6 shadow-2xl shadow-slate-900/[0.06] sm:p-8 lg:mt-0">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary-400 via-primary to-violet-400" aria-hidden />
              <div className="mb-6 hidden lg:block">
                <Logo href="/" size="lg" glow subtitle="Academy" />
              </div>

              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Account recovery</p>
              <h1 className="mt-2 text-2xl font-bold tracking-tight">Forgot password?</h1>
              <p className="mt-2 text-sm text-muted">
                Enter your username. We&apos;ll send a reset link to your recovery email.
              </p>

              <form onSubmit={(event) => void submit(event)} className="mt-6 space-y-4">
                <label className="block text-sm">
                  <span className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-muted">
                    <User size={13} />
                    Username
                  </span>
                  <input
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    autoComplete="username"
                    placeholder="your_hero_name"
                    className={inputClass}
                    maxLength={20}
                    required
                  />
                </label>
                {error ? (
                  <p className="rounded-xl border border-danger/20 bg-danger/5 px-3 py-2 text-sm text-danger">{error}</p>
                ) : null}
                {notice ? (
                  <p className="rounded-xl border border-primary/20 bg-primary-50 px-3 py-2 text-sm text-primary-800">
                    {notice}
                  </p>
                ) : null}
                <Button type="submit" className="group w-full py-3 font-bold" disabled={pending}>
                  {pending ? "Sending…" : (
                    <span className="inline-flex items-center gap-2">
                      Send reset link
                      <ArrowRight size={15} className="transition group-hover:translate-x-0.5" />
                    </span>
                  )}
                </Button>
              </form>

              <p className="mt-6 text-center text-xs text-muted">
                Remembered it?{" "}
                <Link href="/login" className="font-semibold text-primary hover:text-primary-hover">
                  Back to log in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
