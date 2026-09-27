"use client";

import { Logo } from "@/components/shell/Logo";
import { NAV_ITEMS, isActive } from "@/components/shell/nav";
import { cn } from "@/lib/cn";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function RailNav() {
  const pathname = usePathname();
  const mobileItems = NAV_ITEMS.filter((item) => item.mobile);

  return (
    <>
      <nav
        className="fixed bottom-0 left-0 right-0 z-30 border-t border-line bg-surface/95 backdrop-blur-md lg:hidden"
        aria-label="Mobile"
      >
        <ul className="flex justify-around px-1 py-1.5">
          {mobileItems.map((item) => {
            const active = isActive(pathname, item.href);
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex flex-col items-center gap-0.5 rounded-lg px-2 py-1.5 text-[10px] font-medium",
                    active ? "text-primary" : "text-muted",
                  )}
                >
                  <Icon size={18} strokeWidth={active ? 2.25 : 1.75} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <nav
        className="fixed inset-y-0 left-0 z-30 hidden w-[72px] flex-col items-center border-r border-line bg-surface py-5 lg:flex"
        aria-label="Primary"
      >
        <Logo compact href="/dashboard" />
        <div className="mt-6 flex w-full flex-1 flex-col gap-0.5">
          {NAV_ITEMS.map((item) => {
            const active = isActive(pathname, item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                title={item.label}
                className={cn(
                  "group relative flex w-full flex-col items-center py-3 transition",
                  active ? "text-primary" : "text-muted hover:text-ink",
                )}
              >
                {active ? (
                  <span className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-primary" />
                ) : null}
                <Icon size={20} strokeWidth={active ? 2.25 : 1.75} />
                <span className="pointer-events-none absolute left-full z-50 ml-3 hidden whitespace-nowrap rounded-lg border border-line bg-surface px-2.5 py-1.5 text-xs font-medium text-ink shadow-md group-hover:block">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
