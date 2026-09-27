"use client";

import { usePlayer } from "@/components/player/PlayerProvider";
import { cn } from "@/lib/cn";
import { LogIn } from "lucide-react";
import Link from "next/link";

export function AccountActions({ compact = false }: { compact?: boolean }) {
  const { email, supabaseEnabled } = usePlayer();

  if (email || !supabaseEnabled) return null;

  const btnClass = cn(
    "inline-flex items-center gap-1.5 rounded-xl border border-line bg-white text-xs font-semibold text-muted shadow-sm transition",
    "hover:border-primary-200 hover:text-primary disabled:opacity-50",
    compact ? "px-2.5 py-2" : "px-3.5 py-2",
  );

  return (
    <Link href="/login" className={btnClass}>
      <LogIn size={14} />
      <span className={compact ? "sr-only" : "hidden sm:inline"}>Log in</span>
    </Link>
  );
}
