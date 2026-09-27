"use client";

import { Avatar } from "@/components/player/Avatar";
import { usePlayer } from "@/components/player/PlayerProvider";
import { AccountActions } from "@/components/shell/AccountActions";
import { HubNav } from "@/components/shell/HubNav";
import { Logo } from "@/components/shell/Logo";
import { RingProgress } from "@/components/ui/RingProgress";
import { ErrorState, LoadingState } from "@/components/ui/States";
import { cn } from "@/lib/cn";
import { Flame, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { player, ready, error, refresh, supabaseEnabled, email, level, toasts, dismissToast } = usePlayer();
  const pathname = usePathname();
  const isGuides = pathname.startsWith("/guides");
  const isGuideLesson = /^\/guides\/[^/]+\/[^/]+/.test(pathname);
  const xpPct = level.needed ? (level.into / level.needed) * 100 : 0;

  return (
    <div className="min-h-screen bg-white pb-28 text-ink">
      <div className="app-backdrop pointer-events-none fixed inset-0" />

      {/* Compact header — slimmer on guide lessons */}
      <header
        className={cn(
          "relative z-30 border-b border-line/60 bg-white/90 backdrop-blur-md",
          isGuideLesson && "border-transparent bg-white",
        )}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-3 sm:px-8">
          <Logo href="/dashboard" />

          <div className="flex items-center gap-2 sm:gap-3">
            {!supabaseEnabled ? (
              <span className="hidden rounded-full bg-surface-2 px-2.5 py-1 text-[10px] font-medium text-muted sm:inline">
                Demo mode
              </span>
            ) : email && player ? (
              <span className="hidden max-w-[8rem] truncate rounded-full bg-surface-2 px-2.5 py-1 text-[10px] font-medium text-muted sm:inline">
                @{player.username}
              </span>
            ) : null}

            <AccountActions compact={isGuideLesson} />

            {player ? (
              <Link
                href="/profile"
                className={cn(
                  "flex items-center gap-2 rounded-xl border border-line bg-white transition hover:shadow-sm",
                  isGuideLesson ? "px-2 py-1.5" : "px-3 py-2 shadow-sm",
                )}
              >
                {!isGuideLesson ? (
                  <div className="hidden text-right sm:block">
                    <p className="text-sm font-semibold leading-none">{player.username}</p>
                    <p className="mt-0.5 flex items-center justify-end gap-1 text-[10px] font-medium text-muted">
                      <Flame size={10} />
                      {player.streak}d · {level.title}
                    </p>
                  </div>
                ) : null}
                <RingProgress value={xpPct} size={isGuideLesson ? 36 : 40} stroke={3}>
                  <span className="text-[10px] font-bold text-primary">{level.level}</span>
                </RingProgress>
                {!isGuideLesson ? <Avatar id={player.avatar} size="sm" /> : null}
              </Link>
            ) : null}
          </div>
        </div>
      </header>

      <main
        className={cn(
          "relative z-10 mx-auto w-full",
          isGuides ? "max-w-5xl px-0 sm:px-0" : "max-w-6xl px-5 py-6 sm:px-8 sm:py-8",
          isGuideLesson && "px-5 sm:px-8",
          !isGuides && "py-6 sm:py-8",
          isGuides && !isGuideLesson && "px-5 py-6 sm:px-8 sm:py-8",
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
