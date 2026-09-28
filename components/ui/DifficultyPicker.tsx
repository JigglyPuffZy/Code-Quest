"use client";

import { cn } from "@/lib/cn";
import {
  helpLimitLabel,
  SKILL_DIFFICULTIES,
  SKILL_DIFFICULTY_ORDER,
  type SkillDifficulty,
} from "@/lib/difficulty";
import { Lightbulb } from "lucide-react";
import { useEffect, useState } from "react";

const REVEALED_EMOJI: Record<
  SkillDifficulty,
  { emoji: string; anim: "smile" | "short-smile" | "wow" | "devil" }
> = {
  beginner: { emoji: "😊", anim: "smile" },
  mid: { emoji: "🙂", anim: "short-smile" },
  expert: { emoji: "😮", anim: "wow" },
  senior: { emoji: "😈", anim: "devil" },
};

function DifficultyEmoji({
  id,
  revealed,
  compact = false,
}: {
  id: SkillDifficulty;
  revealed: boolean;
  compact?: boolean;
}) {
  if (!revealed) return null;

  const { emoji, anim } = REVEALED_EMOJI[id];
  const animClass =
    anim === "smile"
      ? "diff-emoji-smile"
      : anim === "short-smile"
        ? "diff-emoji-short-smile"
        : anim === "wow"
          ? "diff-emoji-wow"
          : "diff-emoji-devil";

  return (
    <span
      className={cn(
        "diff-emoji diff-emoji-reveal",
        compact ? "text-xl sm:text-2xl" : "text-3xl sm:text-4xl",
        animClass,
      )}
      aria-hidden
    >
      {emoji}
    </span>
  );
}

function helpBadge(difficulty: SkillDifficulty, variant: "light" | "dark") {
  const label = helpLimitLabel(difficulty);
  const hasHelp = difficulty === "beginner";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold",
        variant === "dark"
          ? "bg-white/10 text-white/75"
          : hasHelp
            ? "bg-amber-50 text-amber-700"
            : "bg-slate-100 text-slate-600",
      )}
    >
      <Lightbulb size={9} />
      {label}
    </span>
  );
}

export function DifficultyPicker({
  value,
  onChange,
  className,
  variant = "light",
  layout = "default",
}: {
  value: SkillDifficulty;
  onChange: (value: SkillDifficulty) => void;
  className?: string;
  variant?: "light" | "dark";
  layout?: "default" | "compact";
}) {
  const [revealed, setRevealed] = useState<Set<SkillDifficulty>>(() => new Set([value]));
  const compact = layout === "compact";

  useEffect(() => {
    setRevealed((current) => new Set(current).add(value));
  }, [value]);

  function pick(id: SkillDifficulty) {
    setRevealed((current) => new Set(current).add(id));
    onChange(id);
  }

  return (
    <div className={cn(compact ? "space-y-2" : "space-y-3", className)}>
      <p
        className={cn(
          "text-[10px] font-bold uppercase tracking-[0.2em]",
          variant === "dark" ? "text-white/60" : "text-muted",
        )}
      >
        Choose difficulty
      </p>
      <div
        className={cn(
          "grid gap-2 sm:gap-3",
          compact ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-2 lg:grid-cols-4",
        )}
      >
        {SKILL_DIFFICULTY_ORDER.map((id) => {
          const meta = SKILL_DIFFICULTIES[id];
          const active = value === id;
          const showEmoji = active && revealed.has(id);
          return (
            <button
              key={id}
              type="button"
              onClick={() => pick(id)}
              aria-pressed={active}
              className={cn(
                "difficulty-picker-card group relative flex min-w-0 flex-col items-center rounded-xl border text-center transition duration-200",
                compact ? "min-h-[4.5rem] px-2 py-3 sm:min-h-0 sm:px-2 sm:py-3" : "min-h-[7.5rem] rounded-2xl px-3 py-4 sm:min-h-0",
                !compact && "hover:-translate-y-0.5 hover:shadow-md",
                active
                  ? variant === "dark"
                    ? "is-active border-white/40 bg-white text-slate-900 shadow-md shadow-black/25"
                    : cn("is-active border-transparent shadow-md", meta.soft, "ring-2", meta.ring)
                  : variant === "dark"
                    ? "border-white/12 bg-white/8 text-white/90 hover:border-white/20 hover:bg-white/12"
                    : "border-line bg-white hover:border-slate-300",
              )}
            >
              <div
                className={cn(
                  "grid place-items-center",
                  showEmoji
                    ? compact
                      ? "mb-1 h-8"
                      : "mb-2 h-12"
                    : "h-0 mb-0 overflow-hidden",
                )}
              >
                <DifficultyEmoji
                  id={id}
                  revealed={showEmoji}
                  compact={compact}
                />
              </div>

              <span
                className={cn(
                  "block w-full truncate font-bold leading-tight",
                  compact ? "text-[9px] sm:text-[10px]" : "text-xs sm:text-sm",
                  active && variant !== "dark" ? meta.accent : "",
                  active && variant === "dark" ? "text-slate-900" : variant === "dark" ? "text-white/90" : "",
                )}
              >
                {compact ? meta.rank : meta.label}
              </span>

              {!compact ? (
                <span
                  className={cn(
                    "mt-0.5 block text-[10px] font-semibold",
                    active && variant === "dark" ? "text-slate-600" : "opacity-75",
                  )}
                >
                  {meta.rank}
                </span>
              ) : null}

              {!compact && active && revealed.has(id) ? (
                <span
                  className={cn(
                    "mt-2 line-clamp-2 text-[10px] leading-snug",
                    variant === "dark" ? "text-slate-500" : "text-muted",
                  )}
                >
                  {meta.vibe}
                </span>
              ) : null}

              {!compact && active && revealed.has(id) ? (
                <span className="mt-2">{helpBadge(id, variant)}</span>
              ) : null}

              {active ? (
                <span
                  className={cn(
                    "absolute inset-x-2 bottom-0 h-0.5 rounded-full",
                    variant === "dark" ? "bg-primary" : meta.bar,
                  )}
                  aria-hidden
                />
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
