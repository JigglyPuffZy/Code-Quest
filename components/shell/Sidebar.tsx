"use client";

import { Avatar } from "@/components/player/Avatar";
import { usePlayer } from "@/components/player/PlayerProvider";
import { LevelBadge } from "@/components/ui/LevelBadge";
import { Logo } from "@/components/shell/Logo";
import { NAV_ITEMS, isActive } from "@/components/shell/nav";
import { cn } from "@/lib/cn";
import { X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_COLORS = [
  "from-violet/15 to-violet/5 text-violet border-violet/25",
  "from-teal/15 to-teal/5 text-teal border-teal/25",
  "from-primary/15 to-primary/5 text-primary border-primary/25",
  "from-coral/15 to-coral/5 text-coral border-coral/25",
  "from-sky/15 to-sky/5 text-sky border-sky/25",
  "from-berry/15 to-berry/5 text-berry border-berry/25",
  "from-violet/15 to-violet/5 text-violet border-violet/25",
];

export function Sidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const { player, level } = usePlayer();

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-primary/20 backdrop-blur-sm transition lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[280px] shrink-0 flex-col border-r-2 border-line bg-surface/95 px-4 py-5 shadow-xl backdrop-blur transition-transform lg:sticky lg:top-0 lg:z-auto lg:h-screen lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between">
          <Logo href="/dashboard" />
          <button
            type="button"
            className="grid h-9 w-9 place-items-center rounded-xl text-muted lg:hidden"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        {player ? (
          <div className="mt-6 flex items-center gap-3 rounded-2xl border-2 border-line bg-gradient-to-br from-surface-2 to-surface-3 p-3">
            <LevelBadge level={level.level} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-bold text-ink">{player.username}</p>
              <p className="text-xs text-muted">{level.title}</p>
            </div>
            <Avatar id={player.avatar} size="sm" />
          </div>
        ) : null}

        <p className="mt-6 px-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-muted">Your quest</p>
        <nav className="mt-2 flex flex-1 flex-col gap-1.5" aria-label="Primary">
          {NAV_ITEMS.map((item, index) => {
            const active = isActive(pathname, item.href);
            const Icon = item.icon;
            const color = NAV_COLORS[index % NAV_COLORS.length];
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-2xl border-2 px-3 py-2.5 text-sm font-bold transition",
                  active
                    ? `bg-gradient-to-r ${color} shadow-sm`
                    : "border-transparent text-muted hover:border-line hover:bg-surface-2 hover:text-ink",
                )}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <p className="px-2 text-xs leading-5 text-muted">
          Learn Python and JavaScript one cleared lesson at a time.
        </p>
      </aside>
    </>
  );
}
