"use client";

import { TechLogo } from "@/components/icons/TechLogo";
import { usePlayer } from "@/components/player/PlayerProvider";
import { RingProgress } from "@/components/ui/RingProgress";
import { skillMapEntries } from "@/lib/dashboard/insights";
import { cn } from "@/lib/cn";
import type { LanguageId } from "@/lib/types";
import { ArrowRight, Map } from "lucide-react";
import Link from "next/link";

const SKILL_STYLE: Record<
  LanguageId,
  { track: string; from: string; to: string; soft: string; text: string; bar: string }
> = {
  python: { track: "#d1fae5", from: "#10b981", to: "#34d399", soft: "bg-emerald-50", text: "text-emerald-600", bar: "bg-emerald-500" },
  javascript: { track: "#fef3c7", from: "#f59e0b", to: "#fbbf24", soft: "bg-amber-50", text: "text-amber-600", bar: "bg-amber-500" },
  typescript: { track: "#e0f2fe", from: "#0ea5e9", to: "#38bdf8", soft: "bg-sky-50", text: "text-sky-600", bar: "bg-sky-500" },
  java: { track: "#ffedd5", from: "#f97316", to: "#fb923c", soft: "bg-orange-50", text: "text-orange-600", bar: "bg-orange-500" },
};

export function SkillMap() {
  const { player } = usePlayer();
  if (!player) return null;

  const entries = skillMapEntries(player);

  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-3 px-1">
        <div>
          <p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-muted">
            <Map size={12} className="text-primary" />
            Skill map
          </p>
          <h2 className="mt-1 text-lg font-bold tracking-tight">Your path mastery</h2>
        </div>
        <Link href="/guides" className="text-xs font-bold text-primary hover:underline">
          All paths
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {entries.map(({ language, progress }) => {
          const style = SKILL_STYLE[language.id];
          const pct = Math.round(progress.ratio * 100);

          return (
            <Link
              key={language.id}
              href={`/guides/${language.id}`}
              className="dash-skill-node group relative overflow-hidden rounded-2xl border border-line bg-white p-4 transition hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-lg hover:shadow-slate-900/5"
            >
              <div
                className={cn(
                  "pointer-events-none absolute inset-x-0 top-0 h-1 scale-x-0 transition duration-300 group-hover:scale-x-100",
                  style.bar,
                )}
                aria-hidden
              />
              <div className="flex items-center justify-between gap-2">
                <span className={cn("rounded-lg p-1.5", style.soft)}>
                  <TechLogo topicId={language.id} size={20} />
                </span>
                <span className={cn("text-[10px] font-bold uppercase tracking-wider", style.text)}>
                  {language.name}
                </span>
              </div>

              <div className="mt-4 flex items-center justify-center">
                <RingProgress
                  value={pct}
                  size={76}
                  stroke={6}
                  trackColor={style.track}
                  fromColor={style.from}
                  toColor={style.to}
                >
                  <span className={cn("text-sm font-extrabold tabular-nums", style.text)}>{pct}%</span>
                </RingProgress>
              </div>

              <p className="mt-3 text-center text-[11px] text-muted">
                {progress.done}/{progress.total} lessons
              </p>
              <p className="mt-2 flex items-center justify-center gap-1 text-[10px] font-bold text-primary opacity-0 transition group-hover:opacity-100">
                Train <ArrowRight size={11} />
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
