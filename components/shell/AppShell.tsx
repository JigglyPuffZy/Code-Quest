"use client";

import { Avatar } from "@/components/player/Avatar";
import { DevyyyyyChat } from "@/components/support/DevyyyyyChat";
import { usePlayer } from "@/components/player/PlayerProvider";
import { AccountActions } from "@/components/shell/AccountActions";
import { HubNav } from "@/components/shell/HubNav";
import { MobileMenu } from "@/components/shell/MobileMenu";
import { MobileNav } from "@/components/shell/MobileNav";
import { isInGameSession } from "@/components/shell/nav";
import { Logo } from "@/components/shell/Logo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { PlayerHud } from "@/components/shell/PlayerHud";
import { RingProgress } from "@/components/ui/RingProgress";
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
  const inGameSession = isInGameSession(pathname);
  const showMobileNav = Boolean(player) && !inGameSession;
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
    <div className={cn("min-h-screen bg-canvas text-ink md:pb-28", showMobileNav ? "pb-24" : "pb-6")}>
      <div className="app-backdrop pointer-events-none fixed inset-0" />

      <header
        className={cn(
          "shell-header relative z-30 border-b border-line/60 backdrop-blur-md",
          isGuideLesson && "border-transparent",
        )}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2.5 sm:px-8 sm:py-3">
          <div className="flex min-w-0 items-center gap-1.5">
            {player ? (
              <MobileMenu
                player={player}
                level={level}
                xpPct={xpPct}
                onLogout={() => void logout()}
                logoutPending={logoutPending}
              />
            ) : null}
            <Logo href="/dashboard" glow />
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {!supabaseEnabled ? (
              <span className="shell-demo-badge hidden sm:inline-flex">Demo mode</span>
            ) : null}

            <ThemeToggle compact className="shrink-0" />

            <div className="hidden md:block">
              <AccountActions compact={isGuideLesson} />
            </div>

            {player ? (
              <>
                <div className="md:hidden">
                  <Link
                    href="/profile"
                    className="grid h-10 w-10 place-items-center rounded-xl transition hover:bg-primary-50"
                    aria-label={`${player.username}, level ${level.level}`}
                  >
                    <RingProgress value={xpPct} size={40} stroke={3}>
                      <Avatar id={player.avatar} size="sm" className="h-8 w-8 rounded-lg border-0 text-[10px]" />
                    </RingProgress>
                  </Link>
                </div>
                <div className="hidden md:block">
                  <PlayerHud
                    player={player}
                    level={level}
                    xpPct={xpPct}
                    compact={isGuideLesson}
                    onLogout={() => void logout()}
                    logoutPending={logoutPending}
                  />
                </div>
              </>
            ) : (
              <AccountActions compact={isGuideLesson} />
            )}
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
        {ready && player ? <div className={inGameSession ? undefined : "rise"}>{children}</div> : null}
      </main>

      {showMobileNav ? <MobileNav /> : null}
      <HubNav />

      <div className="fixed bottom-4 right-4 z-40 flex w-[min(100%-2rem,280px)] flex-col gap-2 md:bottom-24">
        {toasts.map((toast) => (
          <div key={toast.id} className="rounded-xl border border-line bg-surface p-3 shadow-lg">
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

      <DevyyyyyChat variant="app" />
    </div>
  );
}
