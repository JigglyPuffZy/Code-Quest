"use client";

import { useTheme } from "@/components/theme/ThemeProvider";
import { cn } from "@/lib/cn";
import { Moon, Sun } from "lucide-react";

type ThemeToggleProps = {
  className?: string;
  compact?: boolean;
};

export function ThemeToggle({ className, compact = false }: ThemeToggleProps) {
  const { theme, toggleTheme, ready } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      disabled={!ready}
      className={cn(
        "inline-flex items-center justify-center rounded-xl border border-line bg-surface text-muted shadow-sm transition",
        "hover:border-primary-200 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25",
        "disabled:opacity-60",
        compact ? "h-9 w-9 p-0" : "h-10 gap-2 px-3",
        className,
      )}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
    >
      {isDark ? <Sun size={compact ? 16 : 18} aria-hidden /> : <Moon size={compact ? 16 : 18} aria-hidden />}
      {!compact ? (
        <span className="hidden text-xs font-semibold sm:inline">{isDark ? "Light" : "Dark"}</span>
      ) : null}
    </button>
  );
}
