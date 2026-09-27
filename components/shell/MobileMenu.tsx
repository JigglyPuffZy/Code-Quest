"use client";

import { Avatar } from "@/components/player/Avatar";
import { NAV_ITEMS, isActive } from "@/components/shell/nav";
import { RingProgress } from "@/components/ui/RingProgress";
import { cn } from "@/lib/cn";
import type { LevelInfo, Player } from "@/lib/types";
import { LogOut, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type MobileMenuProps = {
  player: Player;
  level: LevelInfo;
  xpPct: number;
  onLogout: () => void;
  logoutPending?: boolean;
};

export function MobileMenu({
  player,
  level,
  xpPct,
  onLogout,
  logoutPending = false,
}: MobileMenuProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const drawer =
    open && mounted
      ? createPortal(
          <div className="fixed inset-0 z-[200] md:hidden" role="presentation">
            <button
              type="button"
              className="absolute inset-0 bg-ink/45 backdrop-blur-sm"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
            />

            <nav
              id="mobile-menu-panel"
              className="mobile-menu-panel absolute inset-y-0 left-0 flex w-[min(88vw,20rem)] flex-col bg-surface shadow-2xl"
              aria-label="Main navigation"
            >
              <div className="border-b border-line/70 bg-gradient-to-br from-primary-50 via-white to-violet-50 px-4 pb-4 pt-5">
                <div className="flex items-start justify-between gap-3">
                  <Link
                    href="/profile"
                    onClick={() => setOpen(false)}
                    className="flex min-w-0 items-center gap-3"
                  >
                    <RingProgress value={xpPct} size={48} stroke={3.5}>
                      <Avatar id={player.avatar} size="sm" className="h-9 w-9 rounded-xl border-0 text-xs" />
                    </RingProgress>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold">{player.username}</p>
                      <p className="text-xs font-semibold text-primary">Level {level.level}</p>
                    </div>
                  </Link>
                  <button
                    type="button"
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/80 text-muted shadow-sm transition hover:text-primary"
                    onClick={() => setOpen(false)}
                    aria-label="Close menu"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              <ul className="flex-1 space-y-1 overflow-y-auto p-3">
                {NAV_ITEMS.map((item, index) => {
                  const active = isActive(pathname, item.href);
                  const Icon = item.icon;
                  return (
                    <li
                      key={item.href}
                      className="mobile-menu-item"
                      style={{ animationDelay: `${index * 30}ms` }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "flex items-center gap-3 rounded-2xl px-3 py-3.5 transition active:scale-[0.98]",
                          active
                            ? "bg-primary text-white shadow-md shadow-primary/25"
                            : "text-ink hover:bg-slate-50",
                        )}
                      >
                        <span
                          className={cn(
                            "grid h-9 w-9 shrink-0 place-items-center rounded-xl",
                            active ? "bg-white/20 text-white" : "bg-slate-100 text-muted",
                          )}
                        >
                          <Icon size={18} strokeWidth={active ? 2.25 : 1.75} />
                        </span>
                        <span className="flex-1 text-sm font-semibold">{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <div className="border-t border-line/70 p-3">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    onLogout();
                  }}
                  disabled={logoutPending}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border border-line bg-white px-4 py-3 text-sm font-semibold text-muted transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                >
                  <LogOut size={16} />
                  {logoutPending ? "Logging out…" : "Log out"}
                </button>
              </div>
            </nav>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <button
        type="button"
        className={cn(
          "grid h-10 w-10 place-items-center rounded-xl text-ink transition md:hidden",
          open ? "bg-primary-50 text-primary" : "hover:bg-primary-50 hover:text-primary",
        )}
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-menu-panel"
      >
        {open ? <X size={20} strokeWidth={2.25} /> : <Menu size={20} strokeWidth={2} />}
      </button>
      {drawer}
    </>
  );
}
