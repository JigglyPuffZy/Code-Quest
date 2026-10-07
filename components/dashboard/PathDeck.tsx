"use client";

import { TechLogoBadge } from "@/components/icons/TechLogo";
import { guidePaths } from "@/lib/curriculum/guide-paths";
import { guideTopics } from "@/lib/guides/topics";
import { guidePathProgress } from "@/lib/guides/progress";
import type { GuideTopicId } from "@/lib/guides/types";
import { cn } from "@/lib/cn";
import { ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";

const CORE_GUIDES: GuideTopicId[] = ["python", "javascript", "typescript", "java"];

function readGuideProgressMap() {
  const next: Record<string, number> = {};
  for (const topic of guideTopics) {
    next[topic.id] = Math.round(guidePathProgress(topic.id).ratio * 100);
  }
  return next;
}

const GUIDE_STYLE: Record<string, { soft: string; accent: string; bar: string }> = {
  python: { soft: "bg-emerald-50", accent: "text-emerald-600", bar: "bg-emerald-500" },
  javascript: { soft: "bg-amber-50", accent: "text-amber-600", bar: "bg-amber-500" },
  typescript: { soft: "bg-sky-50", accent: "text-sky-600", bar: "bg-sky-500" },
  java: { soft: "bg-orange-50", accent: "text-orange-600", bar: "bg-orange-500" },
  default: { soft: "bg-surface-2", accent: "text-primary", bar: "bg-primary" },
};

export function PathDeck({ embedded = false }: { embedded?: boolean }) {
  const guideProgress = readGuideProgressMap();

  const coreTopics = guideTopics.filter((t) => CORE_GUIDES.includes(t.id));
  const extraPaths = guidePaths.filter((p) => !CORE_GUIDES.includes(p.topicId));

  return (
    <section className="space-y-6">
      {!embedded ? (
        <div className="flex items-end justify-between gap-3 px-1">
          <div>
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-muted">Guides</p>
            <h2 className="text-lg font-bold tracking-tight">Your reading paths</h2>
          </div>
          <Link
            href="/guides"
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary transition hover:gap-1.5"
          >
            All guides <ArrowRight size={13} />
          </Link>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-2 px-1">
          <p className="text-xs font-semibold text-muted">Language & topic guides — read then practice in Arena or Game</p>
          <Link href="/guides" className="text-xs font-bold text-primary hover:underline">
            All guides
          </Link>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {coreTopics.map((topic) => {
          const style = GUIDE_STYLE[topic.id] ?? GUIDE_STYLE.default;
          const pct = guideProgress[topic.id] ?? 0;
          return (
            <Link
              key={topic.id}
              href={`/guides/${topic.id}`}
              className={cn(
                "group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-line bg-surface p-4 transition",
                "hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-900/5",
              )}
            >
              <div className={cn("absolute inset-y-0 left-0 w-1", style.bar)} aria-hidden />
              <TechLogoBadge topicId={topic.id} name={topic.name} size={22} soft={style.soft} ring="ring-line" />
              <div className="min-w-0 flex-1">
                <p className={cn("text-[10px] font-bold uppercase tracking-wider", style.accent)}>{topic.tagline}</p>
                <h3 className="mt-0.5 text-base font-bold">{topic.name}</h3>
                <p className="mt-1 text-[11px] text-muted">{pct}% read</p>
              </div>
              <ArrowRight size={16} className="shrink-0 text-muted transition group-hover:translate-x-0.5 group-hover:text-ink" />
            </Link>
          );
        })}
      </div>

      {extraPaths.length > 0 ? (
        <div className="border-t border-line pt-5">
          <p className="mb-3 px-1 text-xs font-semibold text-muted">Web & databases</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {extraPaths.map((path) => {
              const pct = guideProgress[path.topicId] ?? 0;
              return (
                <Link
                  key={path.topicId}
                  href={`/guides/${path.topicId}`}
                  className="flex items-center gap-3 rounded-xl border border-line bg-surface p-3 transition hover:border-slate-300 hover:shadow-md"
                >
                  <TechLogoBadge topicId={path.topicId} name={path.name} size={18} soft="bg-surface-2" ring="ring-line" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{path.name}</p>
                    <p className="text-[10px] text-muted">{path.tagline} · {pct}%</p>
                  </div>
                  <ArrowRight size={14} className="shrink-0 text-muted" />
                </Link>
              );
            })}
          </div>
        </div>
      ) : null}

      {!embedded ? (
        <Link
          href="/guides"
          className="path-ribbon group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-primary-200/60 bg-gradient-to-br from-primary-50/90 via-surface to-surface p-4 sm:gap-5 sm:p-5 transition hover:-translate-y-0.5 hover:shadow-lg"
        >
          <div className="absolute inset-y-0 left-0 w-1 bg-primary-500" aria-hidden />
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary-50 ring-1 ring-primary-100">
            <BookOpen size={22} className="text-primary" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-primary">Browse catalog</p>
            <h3 className="mt-0.5 text-lg font-bold tracking-tight">{guideTopics.length} guide courses</h3>
            <p className="mt-0.5 text-sm text-muted">Languages, frameworks, and databases.</p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground">
            Open guides
          </span>
        </Link>
      ) : null}
    </section>
  );
}
