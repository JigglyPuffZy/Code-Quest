"use client";

import { AuthHero } from "@/components/auth/AuthHero";
import { AuthMobileStrip } from "@/components/auth/AuthMobileStrip";
import { usePlayer } from "@/components/player/PlayerProvider";
import { AvatarPicker } from "@/components/profile/AvatarPicker";
import { Logo } from "@/components/shell/Logo";
import { Button } from "@/components/ui/Button";
import { loginUsernameError } from "@/lib/auth/username";
import { usernameError } from "@/lib/username";
import { ArrowRight, Lock, User } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

function safeNext(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/dashboard";
  return value;
}

const inputClass =
  "w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm outline-none transition placeholder:text-muted/60 focus:border-primary focus:ring-2 focus:ring-primary/15";

export function AuthScreen({ mode }: { mode: "login" | "signup" }) {
  const { supabaseEnabled, signIn, signUp, setLocalIdentity, refresh, ready } = usePlayer();
  const router = useRouter();
  const params = useSearchParams();
  const next = safeNext(params.get("next"));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("nova");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setNotice("");
    setPending(true);
    try {
      if (!supabaseEnabled) {
        if (mode === "signup") {
          const problem = usernameError(username);
          if (problem) {
            setError(problem);
            return;
          }
          setLocalIdentity(username, avatar);
        } else {
          await refresh();
        }
        router.push("/dashboard");
        return;
      }
      if (mode === "login") {
        const problem = loginUsernameError(username);
        if (problem) {
          setError(problem);
          return;
        }
        await signIn(username, password);
        router.push(next);
        router.refresh();
        return;
      }
      const problem = usernameError(username);
      if (problem) {
        setError(problem);
        return;
      }
      if (!email.trim()) {
        setError("Enter a recovery email.");
        return;
      }
      const result = await signUp(email, password, username, avatar);
      if (result.needsConfirmation) {
        setNotice("Check your email to confirm, then log in with your username.");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Could not continue.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-canvas">
      <div className="auth-hero-grid pointer-events-none fixed inset-0 lg:hidden" aria-hidden />
      <div className="relative grid min-h-screen lg:grid-cols-[1.08fr_0.92fr]">
        <AuthHero mode={mode} />

        <div className="auth-form-side relative flex flex-col justify-center px-5 py-8 sm:px-10 lg:px-12 xl:px-16">
          <div className="auth-form-rise mx-auto w-full max-w-[400px]">
            <div className="mb-3 flex justify-end lg:hidden">
              <Link
                href="/"
                className="rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-muted shadow-sm transition hover:border-primary-200 hover:text-primary"
              >
                ← Home
              </Link>
            </div>

            <AuthMobileStrip mode={mode} />

            <div className="auth-panel relative mt-5 overflow-hidden rounded-2xl border border-line bg-surface p-6 shadow-2xl shadow-slate-900/[0.06] sm:p-8 lg:mt-0">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary-400 via-primary to-violet-400" aria-hidden />
              <div className="mb-6 hidden lg:block">
                <Logo href="/" size="lg" glow subtitle="Academy" />
              </div>

              <div className="mb-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                  {mode === "login" ? "Step in" : "New hero"}
                </p>
                <h1 className="mt-2 text-2xl font-bold tracking-tight">
                  {mode === "login" ? "Log in" : "Create account"}
                </h1>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {supabaseEnabled
                    ? mode === "login"
                      ? "Use the username and password you chose at signup."
                      : "Choose a username, add a recovery email, and pick your avatar."
                    : "Pick a display name — progress saves on this device."}
                </p>
              </div>

              <form onSubmit={(event) => void submit(event)} className="space-y-4">
                <label className="block text-sm">
                  <span className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-muted">
                    <User size={13} />
                    Username
                  </span>
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                    placeholder="your_hero_name"
                    className={inputClass}
                    maxLength={20}
                    required
                  />
                </label>

                {mode === "signup" ? <AvatarPicker value={avatar} onChange={setAvatar} /> : null}

                {supabaseEnabled && mode === "signup" ? (
                  <label className="block text-sm">
                    <span className="mb-1.5 block text-xs font-semibold text-muted">Recovery email</span>
                    <input
                      type="email"
                      autoComplete="email"
                      required
                      placeholder="you@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={inputClass}
                    />
                    <span className="mt-1.5 block text-[11px] text-muted">
                      For confirmation and password reset only.
                    </span>
                  </label>
                ) : null}

                {supabaseEnabled ? (
                  <label className="block text-sm">
                    <span className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-muted">
                      <Lock size={13} />
                      Password
                    </span>
                    <input
                      type="password"
                      autoComplete={mode === "login" ? "current-password" : "new-password"}
                      required
                      minLength={6}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={inputClass}
                    />
                  </label>
                ) : null}

                {mode === "login" && supabaseEnabled ? (
                  <div className="text-right">
                    <Link
                      href="/forgot-password"
                      className="text-xs font-semibold text-primary transition hover:text-primary-hover"
                    >
                      Forgot password?
                    </Link>
                  </div>
                ) : null}

                {error ? (
                  <p className="rounded-xl border border-danger/20 bg-danger/5 px-3 py-2 text-sm text-danger">{error}</p>
                ) : null}
                {notice ? (
                  <p className="rounded-xl border border-primary/20 bg-primary-50 px-3 py-2 text-sm text-primary-800">
                    {notice}
                  </p>
                ) : null}

                <Button type="submit" className="group w-full py-3 text-sm font-bold" disabled={pending || !ready}>
                  {pending ? (
                    <span className="auth-pulse">Working…</span>
                  ) : (
                    <span className="inline-flex items-center gap-2">
                      {mode === "login" ? "Enter Dev Ladder" : "Start your quest"}
                      <ArrowRight size={15} className="transition group-hover:translate-x-0.5" />
                    </span>
                  )}
                </Button>

                {mode === "login" && supabaseEnabled ? (
                  <Link
                    href="/signup"
                    className="flex w-full items-center justify-center rounded-xl border border-primary-200 bg-primary-50 px-4 py-3 text-sm font-bold text-primary transition hover:border-primary-300 hover:bg-primary-100"
                  >
                    Create free account
                  </Link>
                ) : null}
              </form>

              <p className="mt-6 text-center text-xs text-muted">
                {mode === "login" ? (
                  <>
                    New here?{" "}
                    <Link href="/signup" className="font-semibold text-primary hover:text-primary-hover">
                      Sign up
                    </Link>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <Link href="/login" className="font-semibold text-primary hover:text-primary-hover">
                      Log in
                    </Link>
                  </>
                )}
              </p>
            </div>

            <p className="mt-6 text-center text-[11px] text-muted">
              <Link href="/" className="font-medium hover:text-primary">← Back to homepage</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
