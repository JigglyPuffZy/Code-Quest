"use client";
import { cn } from "@/lib/cn";
import { helpLimitLabel, SKILL_DIFFICULTIES, SKILL_DIFFICULTY_ORDER, type SkillDifficulty } from "@/lib/difficulty";
import { Check } from "lucide-react";

export function DifficultyPicker({ value, onChange, className, variant = "light", layout = "default" }: {
  value: SkillDifficulty; onChange: (value: SkillDifficulty) => void; className?: string;
  variant?: "light" | "dark"; layout?: "default" | "compact";
}) {
  const compact = layout === "compact";
  return <div className={cn("space-y-3", className)}><p className={`text-[10px] font-semibold uppercase tracking-widest ${variant === "dark" ? "text-white/65" : "text-muted"}`}>Choose difficulty</p><div className="grid grid-cols-2 gap-2 sm:grid-cols-4" role="group" aria-label="Choose difficulty">{SKILL_DIFFICULTY_ORDER.map((id) => {
    const meta = SKILL_DIFFICULTIES[id]; const active = value === id;
    return <button type="button" key={id} aria-pressed={active} onClick={() => onChange(id)} className={cn("difficulty-control", active && "is-selected", compact && "is-compact", variant === "dark" && "is-on-dark")}><span className="flex w-full items-center justify-between gap-2"><span className="text-xs font-semibold">{meta.label}</span>{active ? <Check size={13} aria-hidden /> : null}</span>{!compact ? <span className="mt-2 block text-[10px] opacity-75">{meta.rank}</span> : null}<span className="mt-2 block text-[10px] leading-5 opacity-75">{helpLimitLabel(id)}</span></button>;
  })}</div></div>;
}
