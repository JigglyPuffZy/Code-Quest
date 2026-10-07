"use client";

import { SKILL_DIFFICULTIES } from "@/lib/difficulty";
import { DUEL_TARGET_WINS_OPTIONS, DUEL_TIMER_OPTIONS, type DuelRules } from "@/lib/duels/rules";
import { Settings2 } from "lucide-react";

export function DuelRulesCard({ rules, hostName }: { rules: DuelRules; hostName?: string }) {
  const wins = DUEL_TARGET_WINS_OPTIONS.find((item) => item.value === rules.targetWins)?.label ?? "1 win";
  const timer = DUEL_TIMER_OPTIONS.find((item) => item.value === rules.roundTimerSec)?.label ?? "2 min";
  const diff = SKILL_DIFFICULTIES[rules.skillDifficulty];

  return (
    <div className="rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50/80 via-surface to-surface p-4">
      <p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-violet-600">
        <Settings2 size={12} />
        Duel rules
      </p>
      {hostName ? (
        <p className="mt-2 text-xs text-muted">
          Set by <strong className="text-ink">{hostName}</strong>
        </p>
      ) : null}
      <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-3">
        <div className="rounded-xl border border-line bg-surface px-3 py-2">
          <dt className="text-[10px] font-bold uppercase text-muted">Series</dt>
          <dd className="font-bold text-ink">{wins}</dd>
        </div>
        <div className="rounded-xl border border-line bg-surface px-3 py-2">
          <dt className="text-[10px] font-bold uppercase text-muted">Timer</dt>
          <dd className="font-bold text-ink">{timer}</dd>
        </div>
        <div className="rounded-xl border border-line bg-surface px-3 py-2">
          <dt className="text-[10px] font-bold uppercase text-muted">Difficulty</dt>
          <dd className="font-bold text-ink">{diff.label}</dd>
        </div>
      </dl>
    </div>
  );
}
