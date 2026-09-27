"use client";

import { TechLogoBadge } from "@/components/icons/TechLogo";
import { RingProgress } from "@/components/ui/RingProgress";
import { cn } from "@/lib/cn";
import { guidePaths } from "@/lib/curriculum/guide-paths";
import { languageInfo, languages } from "@/lib/curriculum/index";
import { guideTopics } from "@/lib/guides/topics";
import { guidePathProgress } from "@/lib/guides/progress";
import { currentWorldName, languageProgress } from "@/lib/progress";
import type { LanguageId, Player } from "@/lib/types";
import { ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const PATH_STYLE: Record<
  LanguageId,
  { soft: string; accent: string; bar: string; glow: string; ring: string }
> = {
  python: {
    soft: "bg-emerald-50",
    accent: "text-emerald-600",
    bar: "bg-emerald-500",
    glow: "from-emerald-100/80",
    ring: "ring-emerald-100",
  },
  javascript: {
    soft: "bg-amber-50",
    accent: "text-amber-600",
    bar: "bg-amber-500",
    glow: "from-amber-100/80",
    ring: "ring-amber-100",
  },
  typescript: {
    soft: "bg-sky-50",
    accent: "text-sky-600",
    bar: "bg-sky-500",
    glow: "from-sky-100/80",
    ring: "ring-sky-100",
  },
  java: {
    soft: "bg-orange-50",
    accent: "text-orange-600",
    bar: "bg-orange-500",
    glow: "from-orange-100/80",
    ring: "ring-orange-100",
  },
};

export function PathDeck({ player }: { player: Player }) {
  const [guideProgress, setGuideProgress] = useState<Record<string, number>>({});

  useEffect(() => {
    const next: Record<string, number> = {};
    for (const path of guidePaths) {
      next[path.topicId] = Math.round(guidePathProgress(path.topicId).ratio * 100);
    }
    setGuideProgress(next);
  }, []);

  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-3 px-1">
        <div>
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-muted">Learn</p>
          <h2 className="text-lg font-bold tracking-tight">Your paths</h2>
        </div>
        <Link
          href="/learn"
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary transition hover:gap-1.5"
        >
          All paths <ArrowRight size={13} />
        </Link>
      </div>

      <div className="space-y-3">
        {languages.map((lang) => {
          const style = PATH_STYLE[lang.id];
          const prog = languageProgress(lang.id, player);
          const info = languageInfo(lang.id);
          const pct = Math.round(prog.ratio * 100);

          return (
            <Link
              key={lang.id}
              href={`/learn/${lang.id}`}
              className={cn(
                "path-ribbon group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-line bg-white p-4 sm:gap-5 sm:p-5",
                "transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-900/5",
              )}
            >
              <div className={cn("absolute inset-y-0 left-0 w-1", style.bar)} aria-hidden />
              <div
                className={cn(
                  "pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br to-transparent opacity-60 blur-2xl",
                  style.glow,
                )}
                aria-hidden
              />

              <TechLogoBadge
                topicId={lang.id}
                name={info.name}
                size={22}
                soft={style.soft}
                ring={style.ring}
                className="relative shrink-0"
              />

              <RingProgress value={pct} size={52} stroke={4}>
                <span className="text-[11px] font-bold tabular-nums text-ink">{pct}%</span>
              </RingProgress>

              <div className="relative min-w-0 flex-1">
                <p className={cn("text-[10px] font-bold uppercase tracking-wider", style.accent)}>
                  Interactive path
                </p>
                <h3 className="mt-0.5 text-lg font-bold tracking-tight">{info.name}</h3>
                <p className="mt-0.5 truncate text-sm text-muted">{currentWorldName(lang.id, player)}</p>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-2">
                  <div className="xp-fill h-full rounded-full transition-all" style={{ width: `${pct}%` }} />
                </div>
              </div>

              <div className="relative hidden shrink-0 text-right sm:block">
                <p className="text-lg font-bold tabular-nums">{prog.done}</p>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">
                  of {prog.total}
                </p>
              </div>

              <ArrowRight
                size={18}
                className="relative shrink-0 text-muted transition group-hover:translate-x-0.5 group-hover:text-ink"
              />
            </Link>
          );
        })}

        <div className="grid gap-2 sm:grid-cols-2">
          {guidePaths.slice(0, 4).map((path) => {
            const pct = guideProgress[path.topicId] ?? 0;
            return (
              <Link
                key={path.topicId}
                href={`/guides/${path.topicId}`}
                className="flex items-center gap-3 rounded-xl border border-line bg-white p-3 transition hover:border-slate-300 hover:shadow-md"
              >
                <TechLogoBadge topicId={path.topicId} name={path.name} size={18} soft="bg-surface-2" ring="ring-line" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{path.name}</p>
                  <p className="text-[10px] text-muted">Guide path · {pct}%</p>
                </div>
                <ArrowRight size={14} className="shrink-0 text-muted" />
              </Link>
            );
          })}
        </div>

        <Link
          href="/guides"
          className={cn(
            "path-ribbon group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-primary-200/60 bg-gradient-to-br from-primary-50/90 via-white to-white p-4 sm:gap-5 sm:p-5",
            "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary-900/5",
          )}
        >
          <div className="absolute inset-y-0 left-0 w-1 bg-primary-500" aria-hidden />
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary-50 ring-1 ring-primary-100">
            <BookOpen size={22} className="text-primary" />
          </span>

          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-primary">Read first</p>
            <h3 className="mt-0.5 text-lg font-bold tracking-tight">Full lesson guides</h3>
            <p className="mt-0.5 text-sm text-muted">
              {guideTopics.length} courses — languages, web, and databases.
            </p>
          </div>

          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-sm shadow-primary/20 transition group-hover:bg-primary-hover">
            <BookOpen size={14} />
            Open
          </span>
        </Link>
      </div>
    </section>
  );
}
