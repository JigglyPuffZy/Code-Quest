"use client";

import { NAV_ITEMS, isActive } from "@/components/shell/nav";
import { cn } from "@/lib/cn";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function HubNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-1.5rem)] max-w-2xl -translate-x-1/2 hub-dock px-1.5 py-1.5 sm:bottom-5"
      aria-label="Main navigation"
    >
      <ul className="flex items-center justify-between gap-0 overflow-x-auto sm:justify-center sm:gap-0.5">
        {NAV_ITEMS.map((item) => {
          const active = isActive(pathname, item.href);
          const Icon = item.icon;
          return (
            <li key={item.href} className="shrink-0">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "hub-dock-item flex flex-col items-center gap-0.5 rounded-xl px-2.5 py-1.5 transition sm:rounded-2xl sm:px-3 sm:py-2",
                  active ? "active text-primary" : "text-muted hover:text-ink",
                )}
              >
                <Icon size={18} strokeWidth={active ? 2.25 : 1.75} />
                <span className="text-[8px] font-bold tracking-wide sm:text-[9px]">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
