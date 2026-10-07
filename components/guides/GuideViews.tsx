"use client";

import { LessonCopy } from "@/components/code/CodeBlock";
import { TechLogoBadge } from "@/components/icons/TechLogo";
import { GuideCourseTabs, GuideLessonHero, getTopicStyle } from "@/components/guides/GuideChrome";
import { GuidePracticePanel } from "@/components/guides/GuidePracticePanel";
import { ErrorState } from "@/components/ui/States";
import {
  getGuide,
  getGuideTopic,
  guidesForTopic,
  GUIDE_CATEGORY_LABELS,
  isGuideTopic,
  totalGuideMinutes,
  totalGuidesStats,
  topicsByCategory,
} from "@/lib/guides/index";
import { catalogStats } from "@/lib/guides/catalog";
import { hasCodePractice } from "@/lib/curriculum/links";
import { guideHasPractice } from "@/lib/guides/practice";
import { markGuideRead } from "@/lib/guides/progress";
import type { GuideCategory, GuideTopicId } from "@/lib/guides/types";
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, Clock, Code2, Database, Play } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

const CATEGORIES: GuideCategory[] = ["languages", "web", "databases"];

export function GuidesHome() {
  const stats = totalGuidesStats();
  const catalog = catalogStats();

  return (
    <div>
      <GuideCourseTabs />

      <header className="mb-10 mt-8 max-w-2xl">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-line bg-surface-2 px-3 py-1 text-xs font-medium text-muted">
          <BookOpen size={13} />
          {stats.lessons} lessons · {stats.courses} courses · {stats.minutes}m total
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Learn everything,
          <span className="text-muted"> step by step.</span>
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted">
          Full read-through guides for programming languages and databases — written in plain, easy-to-understand language. No coding experience needed to start reading.
        </p>
      </header>

      <section className="mb-12 overflow-hidden rounded-2xl border border-line bg-white p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-2xl">
            <div className="mb-2 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-primary">
              <Database size={14} />
              Full technology catalog
            </div>
            <h2 className="text-xl font-bold tracking-tight text-ink">
              {catalog.entries} languages &amp; databases — tabled and explained
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Browse the complete Programming Languages &amp; Database Systems catalog from your document. Each entry
              shows what it is, what it is for, and a simple explanation beginners can understand.
            </p>
          </div>
          <Link
            href="/guides/catalog"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/20 transition hover:bg-primary-hover"
          >
            Open full catalog
            <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      <div className="mb-16 space-y-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">Step-by-step courses</p>
          <h2 className="text-lg font-bold tracking-tight">Pick a course to start reading</h2>
        </div>
      </div>

      <div className="space-y-12">
        {CATEGORIES.map((category) => {
          const topics = topicsByCategory(category);
          return (
            <section key={category}>
              <div className="mb-4 flex items-end justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">Category</p>
                  <h2 className="text-lg font-bold tracking-tight">{GUIDE_CATEGORY_LABELS[category]}</h2>
                </div>
                <span className="text-xs text-muted">{topics.length} courses</span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {topics.map((topic) => {
                  const style = getTopicStyle(topic.id);
                  const lessons = guidesForTopic(topic.id);
                  const minutes = totalGuideMinutes(topic.id);
                  return (
                    <Link key={topic.id} href={`/guides/${topic.id}`} className="group">
                      <article className="guide-card relative flex h-full flex-col overflow-hidden p-5">
                        <div className="flex items-start justify-between gap-2">
                          <TechLogoBadge
                            topicId={topic.id}
                            name={topic.name}
                            size={22}
                            soft={style.soft}
                            ring={style.ring}
                          />
                          <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide ${style.soft} ${style.accent}`}>
                            {topic.tagline}
                          </span>
                        </div>
                        <h3 className="mt-4 text-lg font-bold tracking-tight">{topic.name}</h3>
                        <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted">{topic.description}</p>
                        <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
                          <span className="flex items-center gap-3 text-xs text-muted">
                            <span>{lessons.length} lessons</span>
                            <span className="flex items-center gap-1">
                              <Clock size={11} />
                              {minutes}m
                            </span>
                          </span>
                          <span className="flex items-center gap-1 text-xs font-semibold text-primary opacity-0 transition group-hover:opacity-100">
                            Open <ArrowRight size={13} />
                          </span>
                        </div>
                      </article>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

export function TopicGuideList({ topicId }: { topicId: string }) {
  if (!isGuideTopic(topicId)) return <ErrorState message="Topic not found." />;

  const topic = getGuideTopic(topicId);
  const lessons = guidesForTopic(topicId);
  const style = getTopicStyle(topicId);
  const minutes = totalGuideMinutes(topicId);
  const hasPractice = hasCodePractice(topicId);

  return (
    <div>
      <GuideCourseTabs activeId={topicId} />

      <header className="mt-8 border-b border-line pb-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <TechLogoBadge
            topicId={topicId}
            name={topic.name}
            size={30}
            soft={style.soft}
            ring={style.ring}
            className="shrink-0 rounded-2xl"
          />
          <div className="flex-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted">
              {GUIDE_CATEGORY_LABELS[topic.category]}
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">{topic.name}</h1>
            <p className="mt-1 text-sm text-muted">{lessons.length} lessons · {minutes} min total</p>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">{topic.description}</p>
          </div>
          {lessons[0] ? (
            <Link
              href={`/guides/${topicId}/${lessons[0].slug}`}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/20 transition hover:bg-primary-hover"
            >
              <Play size={15} />
              Start course
            </Link>
          ) : null}
        </div>
      </header>

      <ol className="mt-2 divide-y divide-line">
        {lessons.map((lesson, index) => {
          const hasLessonPractice = guideHasPractice(topicId, lesson.slug);
          return (
            <li key={lesson.slug}>
              <Link
                href={`/guides/${topicId}/${lesson.slug}`}
                className="group flex items-center gap-4 py-5 transition hover:bg-surface-2/60 sm:rounded-xl sm:px-4"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-line bg-white text-sm font-bold text-muted shadow-sm transition group-hover:border-ink group-hover:text-ink">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-semibold">{lesson.title}</h2>
                    {hasLessonPractice ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">
                        <Code2 size={10} />
                        Practice
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-0.5 text-sm text-muted">{lesson.summary}</p>
                </div>
                <span className="hidden text-xs text-muted sm:block">{lesson.minutes} min</span>
                <ArrowRight className="size-4 shrink-0 text-muted opacity-0 transition group-hover:opacity-100" />
              </Link>
            </li>
          );
        })}
      </ol>

      <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-line bg-surface-2 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-ok" />
          <div>
            <p className="font-semibold">{hasPractice ? "Hands-on practice built in" : "Keep learning"}</p>
            <p className="mt-0.5 text-sm text-muted">
              {hasPractice
                ? "Each lesson includes a code editor so you can try what you just read — no need to leave the guide."
                : "Track your reading progress — this path counts toward guide quests."}
            </p>
          </div>
        </div>
        {lessons[0] ? (
          <Link
            href={
              hasPractice
                ? `/guides/${topicId}/${lessons[0].slug}#practice`
                : `/guides/${topicId}/${lessons[0].slug}`
            }
            className="shrink-0 rounded-xl bg-primary px-5 py-2.5 text-center text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/20 transition hover:bg-primary-hover"
          >
            {hasPractice ? "Start practicing" : "Continue Reading"}
          </Link>
        ) : null}
      </div>
    </div>
  );
}

export function GuideReader({ topicId, slug }: { topicId: string; slug: string }) {
  useEffect(() => {
    if (isGuideTopic(topicId)) markGuideRead(topicId, slug);
  }, [topicId, slug]);

  if (!isGuideTopic(topicId)) return <ErrorState message="Topic not found." />;

  const lesson = getGuide(topicId as GuideTopicId, slug);
  if (!lesson) return <ErrorState message="Lesson not found." />;

  const topic = getGuideTopic(topicId as GuideTopicId);
  const lessons = guidesForTopic(topicId as GuideTopicId);
  const index = lessons.findIndex((l) => l.slug === slug);
  const prev = lessons[index - 1];
  const next = lessons[index + 1];
  const progress = ((index + 1) / lessons.length) * 100;
  const style = getTopicStyle(topicId as GuideTopicId);
  const hasPractice = hasCodePractice(topicId);
  const lessonHasPractice = guideHasPractice(topicId, slug);

  return (
    <div className="-mt-6 sm:-mt-8">
      <div className="fixed left-0 right-0 top-0 z-50 h-[3px] bg-surface-3">
        <div className="h-full bg-primary transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
      </div>

      <GuideCourseTabs activeId={topicId as GuideTopicId} />

      <GuideLessonHero
        topicId={topicId as GuideTopicId}
        topicName={topic.name}
        lessonTitle={lesson.title}
        lessonIndex={index}
        lessonTotal={lessons.length}
        minutes={lesson.minutes}
        lessons={lessons.map((l) => ({ slug: l.slug, title: l.title }))}
        currentSlug={slug}
      />

      <div className="lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10">
        <aside className="hidden lg:block">
          <div className="sticky top-28">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted">In this course</p>
            <nav className="mt-3 max-h-[calc(100vh-9rem)] space-y-0.5 overflow-y-auto">
              {lessons.map((l, i) => (
                <Link
                  key={l.slug}
                  href={`/guides/${topicId}/${l.slug}`}
                  className={`flex items-start gap-2 rounded-lg px-3 py-2.5 text-sm transition ${
                    l.slug === slug
                      ? "bg-surface-2 font-semibold text-ink"
                      : "text-muted hover:bg-surface-2/60 hover:text-ink"
                  }`}
                >
                  <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded text-[10px] font-bold ${
                    l.slug === slug ? "bg-primary text-primary-foreground" : i < index ? "bg-primary/10 text-ink" : "bg-line text-muted"
                  }`}>
                    {i + 1}
                  </span>
                  <span className="leading-snug">{l.title}</span>
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        <article className="min-w-0 pb-8">
          <div className="guide-prose max-w-prose">
            <LessonCopy blocks={lesson.blocks} />
          </div>

          {lessonHasPractice ? <GuidePracticePanel topicId={topicId} slug={slug} /> : null}

          <nav className="mt-14 grid gap-3 sm:grid-cols-2">
            {prev ? (
              <Link href={`/guides/${topicId}/${prev.slug}`} className="guide-card group flex flex-col p-5 transition">
                <span className="flex items-center gap-1 text-xs font-medium text-muted">
                  <ArrowLeft size={13} />
                  Previous
                </span>
                <span className="mt-2 font-semibold group-hover:text-ink">{prev.title}</span>
              </Link>
            ) : <div />}
            {next ? (
              <Link
                href={`/guides/${topicId}/${next.slug}`}
                className="guide-card group flex flex-col p-5 text-right transition sm:col-start-2"
              >
                <span className="flex items-center justify-end gap-1 text-xs font-medium text-muted">
                  Next
                  <ArrowRight size={13} />
                </span>
                <span className="mt-2 font-semibold group-hover:text-ink">{next.title}</span>
              </Link>
            ) : (
              <Link
                href={`/guides/${topicId}`}
                className="guide-card group flex flex-col p-5 text-right transition sm:col-start-2"
              >
                <span className="text-xs font-medium text-muted">Course complete</span>
                <span className="mt-2 font-semibold">Back to {topic.name} →</span>
              </Link>
            )}
          </nav>

          {hasPractice && !lessonHasPractice ? (
            <div className={`mt-6 flex items-center justify-between gap-4 rounded-2xl border p-5 ${style.soft}`}>
              <p className="text-sm">
                <span className="font-semibold">Want a bigger challenge?</span>
                <span className="text-muted"> Head to Arena for timed coding battles.</span>
              </p>
              <Link
                href="/challenges"
                className="shrink-0 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/20 hover:bg-primary-hover"
              >
                Go to Arena
              </Link>
            </div>
          ) : null}
        </article>
      </div>
    </div>
  );
}
