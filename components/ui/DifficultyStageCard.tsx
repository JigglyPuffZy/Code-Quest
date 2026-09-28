"use client";

import { cn } from "@/lib/cn";
import { helpLimitLabel, SKILL_DIFFICULTIES, type SkillDifficulty } from "@/lib/difficulty";

export function DifficultyStageCard({
  difficulty,
  onChange,
  className,
}: {
  difficulty: SkillDifficulty;
  onChange?: () => void;
  className?: string;
}) {
  const skill = SKILL_DIFFICULTIES[difficulty];
  const help = helpLimitLabel(difficulty);

  return (
    <div
      className={cn(
        "shrink-0 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-sm",
        className,
      )}
    >
      <p className="text-[10px] font-bold uppercase tracking-wider text-white/60">Difficulty</p>
      <p className="mt-0.5 text-base font-bold text-white sm:text-lg">{skill.label}</p>
      <p className="text-[11px] font-semibold text-white/75">{skill.rank}</p>
      <p
        className={cn(
          "mt-2 rounded-lg px-2 py-1 text-[10px] font-bold uppercase leading-snug",
          difficulty === "beginner"
            ? "bg-emerald-400/15 text-emerald-200 ring-1 ring-emerald-300/25"
            : "bg-rose-400/15 text-rose-100 ring-1 ring-rose-300/25",
        )}
      >
        {help}
      </p>
      {onChange ? (
        <button
          type="button"
          onClick={onChange}
          className="mt-2 text-[11px] font-semibold text-cyan-300 underline-offset-2 hover:text-white hover:underline"
        >
          Change
        </button>
      ) : null}
    </div>
  );
}

export function DifficultyStageChips({ difficulty }: { difficulty: SkillDifficulty }) {
  const skill = SKILL_DIFFICULTIES[difficulty];
  const help = helpLimitLabel(difficulty);

  return (
    <div className="flex flex-wrap gap-2">
      <span className="rounded-lg border border-white/15 bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase text-white/90">
        {skill.label} · {skill.rank}
      </span>
      <span
        className={cn(
          "rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase",
          difficulty === "beginner"
            ? "border border-emerald-300/25 bg-emerald-400/10 text-emerald-100"
            : "border border-rose-300/25 bg-rose-400/10 text-rose-100",
        )}
      >
        {help}
      </span>
    </div>
  );
}
