"use client";

import { usePlayer } from "@/components/player/PlayerProvider";
import { AccountActions } from "@/components/shell/AccountActions";
import { HubNav } from "@/components/shell/HubNav";
import { Logo } from "@/components/shell/Logo";
import { PlayerHud } from "@/components/shell/PlayerHud";
import { ErrorState, LoadingState } from "@/components/ui/States";
import { cn } from "@/lib/cn";
import { X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { player, ready, error, refresh, supabaseEnabled, level, toasts, dismissToast, signOut } = usePlayer();
  const router = useRouter();
  const [logoutPending, setLogoutPending] = useState(false);
  const pathname = usePathname();
  const isGuides = pathname.startsWith("/guides");
  const isGuideLesson = /^\/guides\/[^/]+\/[^/]+/.test(pathname);
  const xpPct = level.needed ? (level.into / level.needed) * 100 : 0;

  async function logout() {
    setLogoutPending(true);
    try {
      await signOut();
      router.push("/login");
      router.refresh();
    } finally {
      setLogoutPending(false);
    }
  }

  return (
    <div className="min-h-screen bg-white pb-32 text-ink sm:pb-28">
      <div className="app-backdrop pointer-events-none fixed inset-0" />

      <header
        className={cn(
          "shell-header relative z-30 border-b border-line/60 backdrop-blur-md",
          isGuideLesson && "border-transparent",
        )}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-2.5 sm:gap-3 sm:px-8 sm:py-3">
          <Logo href="/dashboard" glow />

          <div className="flex items-center gap-2 sm:gap-2.5">
            {!supabaseEnabled ? (
              <span className="shell-demo-badge hidden sm:inline-flex">Demo mode</span>
            ) : null}

            <AccountActions compact={isGuideLesson} />

            {player ? (
              <PlayerHud
                player={player}
                level={level}
                xpPct={xpPct}
                compact={isGuideLesson}
                onLogout={() => void logout()}
                logoutPending={logoutPending}
              />
            ) : null}
          </div>
        </div>
      </header>

      <main
        className={cn(
          "relative z-10 mx-auto w-full",
          isGuides ? "max-w-5xl px-0 sm:px-0" : "max-w-6xl px-4 py-5 sm:px-8 sm:py-8",
          isGuideLesson && "px-4 sm:px-8",
          !isGuides && "py-5 sm:py-8",
          isGuides && !isGuideLesson && "px-4 py-5 sm:px-8 sm:py-8",
        )}
      >
        {!ready ? <LoadingState /> : null}
        {ready && error && !player ? <ErrorState message={error} onRetry={() => void refresh()} /> : null}
        {ready && !player && !error ? (
          <div className="py-16 text-center">
            <p className="text-sm text-muted">You&apos;ve been logged out.</p>
            <Link href="/login" className="mt-3 inline-block text-sm font-semibold text-primary hover:underline">
              Log in again
            </Link>
          </div>
        ) : null}
        {ready && player ? (
          <div className="rise">
            {error ? <ErrorState message={error} onRetry={() => void refresh()} /> : null}
            {children}
          </div>
        ) : null}
      </main>

      <HubNav />

      <div className="fixed bottom-28 right-4 z-40 flex w-[min(100%-2rem,280px)] flex-col gap-2 sm:bottom-24">
        {toasts.map((toast) => (
          <div key={toast.id} className="rounded-xl border border-line bg-white p-3 shadow-lg">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-semibold">{toast.title}</p>
                <p className="mt-0.5 text-xs text-muted">{toast.detail}</p>
              </div>
              <button type="button" aria-label="Dismiss" onClick={() => dismissToast(toast.id)} className="text-muted">
                <X size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
