"use client";

import { usePlayer } from "@/components/player/PlayerProvider";
import { useClientReady } from "@/lib/learning/client";
import { readLabProgress } from "@/lib/lab/progress";
import { storageKey } from "@/lib/storage-keys";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore, type ReactNode } from "react";
import { PageHero } from "@/components/ui/PageHero";
import { FlaskConical } from "lucide-react";

export const labPanel = "rounded-2xl border border-line bg-surface p-5 sm:p-6";
export const labButton = "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-line bg-surface-2 px-4 py-2 text-sm font-semibold text-ink transition hover:border-primary focus-visible:outline-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50";
export const labInput = "w-full rounded-xl border border-line bg-surface-2 px-3 py-2.5 text-sm text-ink focus:outline-2 focus:outline-primary";
const tabs = [["/lab", "Overview"], ["/lab/detective", "Debug Detective"], ["/lab/time-machine", "Time Machine"], ["/lab/boss", "Boss battle"], ["/lab/projects", "Project evolution"], ["/lab/coop", "Co-op"], ["/lab/portfolio", "Portfolio"]];

export function LabShell({ children }: { children: ReactNode }) {
  const ready = useClientReady();
  const { player } = usePlayer();
  const pathname = usePathname();
  if (!ready || !player) return <p className="text-sm text-muted">Loading developer lab...</p>;
  return <div className="mx-auto max-w-6xl space-y-6">
    <PageHero icon={FlaskConical} eyebrow="Developer lab" title="Think. Debug." accent="Build." description="Investigate broken code, watch execution unfold, and turn each fix into something you can explain and show." />
    <nav aria-label="Developer lab" data-tour="lab-tabs" className="workspace-lab-tabs">{tabs.map(([href, label]) => {
      const active = href === "/lab" ? pathname === href : pathname.startsWith(href);
      return <Link key={href} href={href} aria-current={active ? "page" : undefined} prefetch={false} className={`workspace-lab-tab ${active ? "is-active" : ""}`}>{label}</Link>;
    })}</nav>
    <div key={player.id}>{children}</div>
  </div>;
}

function subscribe(refresh: () => void) {
  window.addEventListener("devladder:lab-updated", refresh);
  window.addEventListener("storage", refresh);
  return () => { window.removeEventListener("devladder:lab-updated", refresh); window.removeEventListener("storage", refresh); };
}
export function useLabProgress(playerId: string) {
  useSyncExternalStore(subscribe, () => {
    try { return window.localStorage.getItem(storageKey("lab", playerId, "v1")) ?? ""; }
    catch { return ""; }
  }, () => "");
  return readLabProgress(playerId);
}
