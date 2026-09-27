"use client";

import { NAV_ITEMS, isActive } from "@/components/shell/nav";
import { cn } from "@/lib/cn";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function MobileNav() {
  const pathname = usePathname();
  const items = NAV_ITEMS.filter((item) => item.mobile);

  return (
    <nav
      className="fixed inset-x-3 bottom-3 z-30 rounded-[1.75rem] border-2 border-line bg-surface/95 px-2 py-2 shadow-[0_8px_32px_rgba(123,92,245,0.15)] backdrop-blur lg:hidden"
      aria-label="Mobile"
    >
      <ul className="grid grid-cols-5 gap-1">
        {items.map((item) => {
          const active = isActive(pathname, item.href);
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-2xl px-1 py-2 text-[10px] font-bold transition",
                  active
                    ? "bg-gradient-to-b from-violet/15 to-violet/5 text-violet"
                    : "text-muted",
                )}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
