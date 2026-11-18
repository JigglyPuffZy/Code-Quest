"use client";

import { usePlayer } from "@/components/player/PlayerProvider";
import { WorkspaceIsland, WorkspaceMobileMenu } from "@/components/shell/WorkspaceNavigation";
import { WorkspaceSearch } from "@/components/shell/WorkspaceSearch";
import { MobileNav } from "@/components/shell/MobileNav";
import { Logo } from "@/components/shell/Logo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { ErrorState, LoadingState } from "@/components/ui/States";
import { PageGuide } from "@/components/help/PageGuide";
import { getPageManual } from "@/lib/help/pages";
import { AppAssistant } from "@/components/support/AppAssistant";
import { BookOpen, Flame, X, Zap } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { player, ready, error, refresh, level, xp, toasts, dismissToast, signOut, email } = usePlayer();
  const pathname = usePathname();
  const router = useRouter();
  const [logoutPending, setLogoutPending] = useState(false);
  const [guidePath, setGuidePath] = useState("");
  const manual = getPageManual(pathname);

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

  const navigation = {
    username: player?.username ?? "Learner",
    avatar: player?.avatar ?? "nova",
    level: level.level,
    connected: Boolean(email),
    onLogout: () => void logout(),
    logoutPending,
  };

  return (
    <div className="workspace-shell">
      <a href="#workspace-main" className="workspace-skip-link">Skip to main content</a>
      <div className="workspace-body">
        {player ? (
          <WorkspaceIsland
            {...navigation}
            mobileMenu={<WorkspaceMobileMenu {...navigation} />}
            actions={
              <>
                <WorkspaceSearch />
                <span className="workspace-pill workspace-pill--streak" title="Learning streak">
                  <Flame size={15} aria-hidden />
                  {player.streak}
                </span>
                <span className="workspace-pill workspace-pill--xp" title={`Level ${level.level}`}>
                  <Zap size={15} aria-hidden />
                  {xp.toLocaleString()}
                </span>
                <button
                  type="button"
                  className="workspace-icon-button workspace-header-help"
                  aria-label="How to use this page"
                  aria-expanded={guidePath === pathname}
                  onClick={() => setGuidePath(guidePath === pathname ? "" : pathname)}
                >
                  <BookOpen size={17} />
                </button>
                <ThemeToggle compact />
              </>
            }
          />
        ) : (
          <header className="ws-island-wrap">
            <div className="ws-island">
              <Logo href="/" />
              <div className="ws-island-actions"><ThemeToggle compact /></div>
            </div>
          </header>
        )}
        <main id="workspace-main" tabIndex={-1} className="workspace-main">
          {!ready ? <LoadingState /> : null}
          {ready && error && !player ? <ErrorState message={error} onRetry={() => void refresh()} /> : null}
          {ready && !player && !error ? (
            <div className="workspace-surface p-10 text-center">
              <h1 className="text-lg font-semibold">Your session has ended</h1>
              <p className="mt-2 text-sm text-muted">Sign in to return to your workspace.</p>
              <Link href="/login" className="workspace-button workspace-button-primary mt-5">Log in again</Link>
            </div>
          ) : null}
          {ready && player ? (
            <>
              <PageGuide
                key={`${player.id}:${pathname}`}
                manual={manual}
                playerId={player.id}
                expanded={guidePath === pathname}
                onToggle={() => setGuidePath(guidePath === pathname ? "" : pathname)}
              />
              <div className="workspace-content" data-tour="page-content">{children}</div>
            </>
          ) : null}
          <footer className="workspace-page-footer">
            <span>Dev Ladder · Build understanding, one step at a time.</span>
            <Link href="/help" prefetch={false}>User manual</Link>
          </footer>
        </main>
      </div>
      {player ? <MobileNav /> : null}
      <div className="workspace-toasts" aria-live="polite">
        {toasts.map((toast) => (
          <div key={toast.id} className="workspace-toast">
            <div>
              <p className="text-sm font-semibold">{toast.title}</p>
              <p className="mt-1 text-xs leading-5 text-muted">{toast.detail}</p>
            </div>
            <button type="button" aria-label="Dismiss notification" className="workspace-icon-button" onClick={() => dismissToast(toast.id)}>
              <X size={15} />
            </button>
          </div>
        ))}
      </div>
      <AppAssistant />
    </div>
  );
}
