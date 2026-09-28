"use client";

import { Avatar } from "@/components/player/Avatar";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { SKILL_DIFFICULTIES, type SkillDifficulty } from "@/lib/difficulty";
import {
  DEFAULT_DUEL_RULES,
  DUEL_TARGET_WINS_OPTIONS,
  DUEL_TIMER_OPTIONS,
  duelRulesSummary,
  type DuelRules,
} from "@/lib/duels/rules";
import type { BoardEntry } from "@/lib/leaderboard";
import { Swords, X } from "lucide-react";
import { useState } from "react";

export function DuelSetupModal({
  opponent,
  demo = false,
  busy = false,
  onClose,
  onConfirm,
}: {
  opponent: BoardEntry;
  demo?: boolean;
  busy?: boolean;
  onClose: () => void;
  onConfirm: (rules: DuelRules) => void;
}) {
  const [rules, setRules] = useState<DuelRules>(DEFAULT_DUEL_RULES);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-4 sm:items-center">
      <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-line bg-white shadow-2xl">
        <div className="bg-gradient-to-r from-rose-500 via-primary-500 to-violet-500 px-5 py-4 text-white">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="inline-flex items-center gap-2 text-sm font-bold">
                <Swords size={16} />
                Set duel rules
              </p>
              <p className="mt-1 text-xs text-white/80">You invite — you choose the format.</p>
            </div>
            <button type="button" onClick={onClose} className="rounded-lg p-1 hover:bg-white/15" aria-label="Close">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="space-y-5 p-5">
          <div className="flex items-center gap-3 rounded-2xl border border-line bg-surface-2/60 px-4 py-3">
            <Avatar id={opponent.avatar} size="md" />
            <div>
              <p className="text-sm font-bold text-ink">Challenge {opponent.username}</p>
              <p className="text-xs text-muted">{demo ? "Practice rival" : "Live player"} · {opponent.xp} XP</p>
            </div>
          </div>

          <section>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">Series length</p>
            <div className="mt-2 grid gap-2">
              {DUEL_TARGET_WINS_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setRules((current) => ({ ...current, targetWins: option.value }))}
                  className={cn(
                    "rounded-xl border px-4 py-3 text-left transition",
                    rules.targetWins === option.value
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-line bg-white hover:bg-surface-2",
                  )}
                >
                  <p className="text-sm font-bold text-ink">{option.label}</p>
                  <p className="mt-0.5 text-xs text-muted">{option.hint}</p>
                </button>
              ))}
            </div>
          </section>

          <section>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">Round timer</p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {DUEL_TIMER_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setRules((current) => ({ ...current, roundTimerSec: option.value }))}
                  className={cn(
                    "rounded-xl border px-3 py-2.5 text-sm font-semibold transition",
                    rules.roundTimerSec === option.value
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-line bg-white text-ink hover:bg-surface-2",
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </section>

          <section>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">Difficulty</p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {(["beginner", "mid", "expert", "senior"] as SkillDifficulty[]).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setRules((current) => ({ ...current, skillDifficulty: level }))}
                  className={cn(
                    "rounded-xl border px-3 py-2.5 text-left transition",
                    rules.skillDifficulty === level
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-line bg-white hover:bg-surface-2",
                  )}
                >
                  <p className="text-sm font-bold text-ink">{SKILL_DIFFICULTIES[level].label}</p>
                  <p className="text-[10px] text-muted">{SKILL_DIFFICULTIES[level].rank}</p>
                </button>
              ))}
            </div>
          </section>

          <div className="rounded-xl border border-dashed border-line bg-surface-2/50 px-4 py-3 text-xs text-muted">
            <strong className="text-ink">Rules preview:</strong> {duelRulesSummary(rules)}. First correct answer
            each round wins the round. Server grades every submit.
          </div>

          <div className="flex gap-2">
            <Button variant="ghost" className="flex-1" onClick={onClose} disabled={busy}>
              Cancel
            </Button>
            <Button variant="primary" className="flex-1 shadow-lg shadow-primary/25" disabled={busy} onClick={() => onConfirm(rules)}>
              <Swords size={15} />
              Send invite
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
