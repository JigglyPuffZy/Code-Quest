"use client";

import { TechLogo } from "@/components/icons/TechLogo";
import { topicsInCategory } from "@/lib/guides/index";
import { GUIDE_CATEGORY_LABELS } from "@/lib/guides/topics";
import { getTopicStyle, TOPIC_STYLES } from "@/lib/guides/styles";
import type { GuideCategory, GuideTopicId } from "@/lib/guides/types";
import { cn } from "@/lib/cn";
import { ArrowLeft, Clock, List } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

const CATEGORY_FILTERS: Array<GuideCategory | "all"> = ["all", "languages", "web", "databases"];

export function GuideCourseTabs({ activeId }: { activeId?: GuideTopicId }) {
  const [category, setCategory] = useState<GuideCategory | "all">("all");
  const router = useRouter();
  const visible = topicsInCategory(category);
  return <nav className="workspace-course-switcher" aria-label="Course navigation">
    <div className="flex flex-wrap items-center gap-1">{CATEGORY_FILTERS.map((item) => <button type="button" key={item} aria-pressed={category === item} onClick={() => setCategory(item)} className={`workspace-filter ${category === item ? "is-active" : ""}`}>{item === "all" ? "All topics" : GUIDE_CATEGORY_LABELS[item]}</button>)}</div>
    <label className="flex items-center gap-3 text-xs font-semibold text-muted">Course<select aria-label="Choose a guide course" value={visible.some((topic) => topic.id === activeId) ? activeId : ""} className="workspace-input !w-auto min-w-36" onChange={(event) => { if (event.target.value) router.push(`/guides/${event.target.value}`); }}><option value="">Choose a course</option>{visible.map((topic) => <option key={topic.id} value={topic.id}>{topic.name}</option>)}</select></label>
  </nav>;
}

export function GuideLessonHero({
  topicId,
  topicName,
  lessonTitle,
  lessonIndex,
  lessonTotal,
  minutes,
  lessons,
  currentSlug,
}: {
  topicId: GuideTopicId;
  topicName: string;
  lessonTitle: string;
  lessonIndex: number;
  lessonTotal: number;
  minutes: number;
  lessons: { slug: string; title: string }[];
  currentSlug: string;
}) {
  const [tocOpen, setTocOpen] = useState(false);
  const style = getTopicStyle(topicId);
  const progress = ((lessonIndex + 1) / lessonTotal) * 100;

  return (
    <div className="guide-hero -mx-5 mb-8 overflow-hidden border-b border-line bg-surface sm:-mx-8">
      <div className="mx-auto max-w-5xl px-5 pb-8 pt-2 sm:px-8">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2 text-sm">
            <Link
              href={`/guides/${topicId}`}
              className="inline-flex shrink-0 items-center gap-1 font-medium text-muted transition hover:text-ink"
            >
              <ArrowLeft size={15} />
              <span className="hidden sm:inline">{topicName}</span>
            </Link>
            <span className="text-line">/</span>
            <span className="truncate font-medium text-ink">Lesson {lessonIndex + 1}</span>
          </div>
          <button
            type="button"
            onClick={() => setTocOpen((o) => !o)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-muted transition hover:border-ink hover:text-ink lg:hidden"
          >
            <List size={14} />
            Contents
          </button>
        </div>

        {tocOpen ? (
          <nav className="mt-4 rounded-xl border border-line bg-surface-2 p-3 lg:hidden">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-muted">Jump to lesson</p>
            <ul className="max-h-48 space-y-0.5 overflow-y-auto">
              {lessons.map((l, i) => (
                <li key={l.slug}>
                  <Link
                    href={`/guides/${topicId}/${l.slug}`}
                    onClick={() => setTocOpen(false)}
                    className={cn(
                      "block rounded-lg px-3 py-2 text-sm",
                      l.slug === currentSlug ? "bg-white font-semibold shadow-sm" : "text-muted hover:bg-white/60",
                    )}
                  >
                    {i + 1}. {l.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}

        <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${style.soft} ${style.accent}`}>
                <TechLogo topicId={topicId} name={topicName} size={14} />
                {topicName}
              </span>
              <span className="flex items-center gap-1 text-xs text-muted">
                <Clock size={12} />
                {minutes} min read
              </span>
            </div>
            <h1 className="mt-4 text-2xl font-bold leading-[1.15] tracking-tight sm:text-4xl">
              {lessonTitle}
            </h1>
          </div>

          <div className="flex shrink-0 items-center gap-4 rounded-2xl border border-line bg-surface-2 px-5 py-4">
            <div className="text-center">
              <p className="text-2xl font-bold tabular-nums leading-none">{lessonIndex + 1}</p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-muted">of {lessonTotal}</p>
            </div>
            <div className="h-12 w-px bg-line" />
            <div className="min-w-[5rem]">
              <p className="text-right text-xs font-semibold tabular-nums text-ink">{Math.round(progress)}%</p>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white">
                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
              </div>
              <p className="mt-1 text-[10px] text-muted">course done</p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-1">
          {lessons.map((l, i) => (
            <Link
              key={l.slug}
              href={`/guides/${topicId}/${l.slug}`}
              title={l.title}
              className={cn(
                "h-1 flex-1 rounded-full transition-all",
                i < lessonIndex ? "bg-primary" : i === lessonIndex ? "bg-primary/70 ring-2 ring-primary/20 ring-offset-1" : "bg-line hover:bg-slate-300",
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export { TOPIC_STYLES as TOPIC_STYLE, getTopicStyle };
