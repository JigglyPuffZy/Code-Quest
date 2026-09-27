"use client";

import { usePlayer } from "@/components/player/PlayerProvider";
import { cn } from "@/lib/cn";
import { LogIn, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function AccountActions({ compact = false }: { compact?: boolean }) {
  const { email, signOut, supabaseEnabled } = usePlayer();
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function logout() {
    setPending(true);
    try {
      await signOut();
      router.push("/login");
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  const btnClass = cn(
    "inline-flex items-center gap-1.5 rounded-lg border border-line bg-white text-xs font-semibold text-muted transition",
    "hover:border-slate-300 hover:text-ink disabled:opacity-50",
    compact ? "px-2 py-1.5" : "px-3 py-2",
  );

  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      {!email && supabaseEnabled ? (
        <Link href="/login" className={btnClass}>
          <LogIn size={14} />
          <span className={compact ? "sr-only" : "hidden sm:inline"}>Log in</span>
        </Link>
      ) : null}

      <button
        type="button"
        onClick={() => void logout()}
        disabled={pending}
        className={btnClass}
        aria-label="Log out"
      >
        <LogOut size={14} />
        <span className={compact ? "sr-only" : "hidden sm:inline"}>
          {pending ? "…" : "Log out"}
        </span>
      </button>
    </div>
  );
}
