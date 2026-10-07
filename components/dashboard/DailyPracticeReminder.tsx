"use client";

import { guidePracticePassesToday } from "@/lib/learning/practice-log";
import { Bell, Zap } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const DAILY_TARGET = 1;

export function DailyPracticeReminder() {
  const [done, setDone] = useState(0);

  useEffect(() => {
    function refresh() {
      setDone(guidePracticePassesToday());
    }
    refresh();
    window.addEventListener("devladder:practice-log-updated", refresh);
    return () => window.removeEventListener("devladder:practice-log-updated", refresh);
  }, []);

  if (done >= DAILY_TARGET) return null;

  return (
    <article className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-violet-200 bg-gradient-to-r from-violet-50 to-white px-4 py-3.5 sm:px-5">
      <div className="flex items-start gap-3">
        <Bell className="mt-0.5 size-5 shrink-0 text-violet-600" />
        <div>
          <p className="text-sm font-bold text-ink">Daily practice reminder</p>
          <p className="text-sm text-muted">
            Pass at least one guide practice question today to keep your learning streak strong.
          </p>
        </div>
      </div>
      <Link
        href="/guides"
        className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-violet-700"
      >
        <Zap size={14} />
        Practice now
      </Link>
    </article>
  );
}
