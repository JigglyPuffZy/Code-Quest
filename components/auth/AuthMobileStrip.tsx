"use client";

import { DevLadderMark } from "@/components/icons/DevLadderMark";
import { BookOpen, Flame, Zap } from "lucide-react";

export function AuthMobileStrip({ mode }: { mode: "login" | "signup" | "forgot" }) {
  const title =
    mode === "login" ? "Welcome back, hero." : mode === "signup" ? "Join the quest." : "Reset your password.";

  return (
    <div className="auth-mobile-strip relative overflow-hidden rounded-2xl border border-primary-100 bg-gradient-to-br from-primary-50 via-surface to-violet-50/80 p-5 shadow-sm shadow-primary/5 lg:hidden">
      <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-primary/15 blur-2xl" aria-hidden />
      <div className="pointer-events-none absolute -bottom-10 left-8 h-24 w-24 rounded-full bg-violet-400/10 blur-2xl" aria-hidden />

      <div className="relative flex items-center gap-3">
        <DevLadderMark size={48} glow className="auth-mobile-logo" />
        <div className="min-w-0">
          <div className="flex items-baseline gap-0.5">
            <span className="text-lg font-bold tracking-tight text-ink">Code</span>
            <span className="bg-gradient-to-r from-primary-600 via-primary-500 to-violet-500 bg-clip-text text-lg font-extrabold tracking-tight text-transparent">
              Quest
            </span>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Academy</p>
        </div>
      </div>

      <h2 className="relative mt-4 text-xl font-bold tracking-tight text-ink">{title}</h2>
      <p className="relative mt-1 text-sm leading-relaxed text-muted">Read → Practice → Earn XP. Your path awaits.</p>

      <div className="relative mt-4 flex flex-wrap gap-2">
        {[
          { icon: Zap, label: "+XP" },
          { icon: Flame, label: "Streaks" },
          { icon: BookOpen, label: "23 guides" },
        ].map(({ icon: Icon, label }) => (
          <span
            key={label}
            className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface/90 px-3 py-1.5 text-[10px] font-bold text-muted shadow-sm"
          >
            <Icon size={12} className="text-primary" />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
