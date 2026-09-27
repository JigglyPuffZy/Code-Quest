"use client";

import { NAV_ITEMS, isActive } from "@/components/shell/nav";
import { cn } from "@/lib/cn";
import { ChevronRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function MobileMenu() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

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

  return (
    <>
      <button
        type="button"
        className="mobile-menu-trigger grid h-10 w-10 place-items-center rounded-xl border border-line bg-white text-ink shadow-sm transition hover:border-primary-200 hover:bg-primary-50 hover:text-primary md:hidden"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls="mobile-menu-panel"
      >
        <Menu size={20} strokeWidth={2} />
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 md:hidden" role="presentation">
          <button
            type="button"
            className="absolute inset-0 bg-ink/35 backdrop-blur-[2px]"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />

          <nav
            id="mobile-menu-panel"
            className="mobile-menu-panel absolute inset-y-0 right-0 flex w-[min(100%,19rem)] flex-col border-l border-line bg-surface shadow-2xl"
            aria-label="Main navigation"
          >
            <div className="flex items-center justify-between border-b border-line/70 px-4 py-3.5">
              <p className="text-sm font-bold tracking-tight">Navigate</p>
              <button
                type="button"
                className="grid h-9 w-9 place-items-center rounded-xl text-muted transition hover:bg-primary-50 hover:text-primary"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>

            <ul className="flex-1 space-y-1 overflow-y-auto p-3">
              {NAV_ITEMS.map((item, index) => {
                const active = isActive(pathname, item.href);
                const Icon = item.icon;
                return (
                  <li
                    key={item.href}
                    className="mobile-menu-item"
                    style={{ animationDelay: `${index * 35}ms` }}
                  >
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-3 rounded-2xl px-3 py-3 transition",
                        active
                          ? "bg-gradient-to-r from-primary-50 to-primary-50/40 text-primary shadow-sm"
                          : "text-ink hover:bg-slate-50",
                      )}
                    >
                      <span
                        className={cn(
                          "grid h-10 w-10 shrink-0 place-items-center rounded-xl border",
                          active
                            ? "border-primary-200 bg-white text-primary"
                            : "border-line bg-white text-muted",
                        )}
                      >
                        <Icon size={18} strokeWidth={active ? 2.25 : 1.75} />
                      </span>
                      <span className="flex-1 text-sm font-semibold">{item.label}</span>
                      <ChevronRight
                        size={16}
                        className={cn("shrink-0", active ? "text-primary" : "text-muted/60")}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      ) : null}
    </>
  );
}
