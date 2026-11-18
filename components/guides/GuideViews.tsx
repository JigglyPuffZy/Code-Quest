"use client";

import { LessonCopy } from "@/components/code/CodeBlock";
import { TechLogoBadge } from "@/components/icons/TechLogo";
import { GuideCourseTabs, GuideLessonHero, getTopicStyle } from "@/components/guides/GuideChrome";
import { GuideMcqPanel } from "@/components/guides/GuideMcqPanel";
import { GuidePracticePanel } from "@/components/guides/GuidePracticePanel";
import { LessonNotes } from "@/components/guides/LessonNotes";
import { useDevyyyyy } from "@/components/support/DevyyyyyProvider";
import { guideHasMcqPractice } from "@/lib/guides/practice/mcq";
import { ErrorState } from "@/components/ui/States";
import { PageHero } from "@/components/ui/PageHero";
import { continueGuide } from "@/lib/guides/navigation";
import { useClientReady } from "@/lib/learning/client";
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
import { guideTopicProgress, isGuideRead, markGuideRead, totalGuidesRead } from "@/lib/guides/progress";
import type { GuideCategory, GuideTopicId } from "@/lib/guides/types";
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, Clock, Code2, Database, HelpCircle, Play, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const CATEGORIES: GuideCategory[] = ["languages", "web", "databases"];

type CategoryFilter = GuideCategory | "all";

export function GuidesHome() {
  const stats = totalGuidesStats();
  const catalog = catalogStats();
  const ready = useClientReady();
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [query, setQuery] = useState("");
  const next = ready ? continueGuide() : null;
  const readCount = ready ? totalGuidesRead() : 0;
  const q = query.trim().toLowerCase();

  const groups = CATEGORIES.map((id) => ({
    id,
    topics: topicsByCategory(id).filter(
      (topic) =>
        (category === "all" || category === id) &&
        (!q || `${topic.name} ${topic.description} ${topic.tagline}`.toLowerCase().includes(q)),
    ),
  })).filter((group) => group.topics.length > 0);
  const shown = groups.reduce((sum, group) => sum + group.topics.length, 0);
  const totalTopics = CATEGORIES.reduce((sum, id) => sum + topicsByCategory(id).length, 0);

  return (
    <div>
      <PageHero
        icon={BookOpen}
        eyebrow="Guides"
        title="Learn everything,"
        accent="step by step."
        description="Short, plain-English lessons for programming languages, the web and databases. No experience needed. Read a lesson, try the practice, move on."
        stats={[
          { label: "lessons", value: stats.lessons, icon: BookOpen },
          { label: "courses", value: stats.courses, icon: Database },
          { label: "min of reading", value: stats.minutes, icon: Clock },
        ]}
      >
        <label className="pg-search">
          <Search size={18} aria-hidden />
          <span className="sr-only">Search courses</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search courses, e.g. Python, SQL, React"
          />
        </label>
      </PageHero>

      {next ? (
        <section className="pg-continue" aria-label="Continue learning">
          <span className="pg-continue-icon"><Play size={22} fill="currentColor" aria-hidden /></span>
          <div className="min-w-0 flex-1">
            <p className="workspace-eyebrow">{readCount ? "Pick up where you left off" : "Start your first lesson"}</p>
            <h2 className="mt-1">{next.title}</h2>
            <p>{next.summary}</p>
          </div>
          <Link href={`/guides/${next.topicId}/${next.slug}`} className="workspace-button workspace-button-primary">
            {readCount ? "Continue" : "Start lesson"}
            <ArrowRight size={15} />
          </Link>
        </section>
      ) : null}

      <div className="pg-filters" role="group" aria-label="Filter courses by category">
        {(["all", ...CATEGORIES] as CategoryFilter[]).map((item) => (
          <button
            type="button"
            key={item}
            aria-pressed={category === item}
            className={category === item ? "pg-pill is-active" : "pg-pill"}
            onClick={() => setCategory(item)}
          >
            {item === "all" ? "All courses" : GUIDE_CATEGORY_LABELS[item]}
            <small>{item === "all" ? totalTopics : topicsByCategory(item).length}</small>
          </button>
        ))}
      </div>

      {shown === 0 ? (
        <div className="rv-empty">
          <span className="rv-empty-icon"><Search size={28} aria-hidden /></span>
          <h2>No courses match &ldquo;{query}&rdquo;</h2>
          <p>Try a shorter word like &ldquo;python&rdquo; or &ldquo;sql&rdquo;, or clear the search to see every course.</p>
          <button type="button" className="workspace-button mt-5" onClick={() => { setQuery(""); setCategory("all"); }}>Clear search</button>
        </div>
      ) : (
        <div className="space-y-10">
          {groups.map((group) => (
            <section key={group.id} aria-labelledby={`cat-${group.id}`}>
              <div className="mb-4 flex items-end justify-between gap-3">
                <h2 id={`cat-${group.id}`} className="text-xl font-bold tracking-tight">{GUIDE_CATEGORY_LABELS[group.id]}</h2>
                <span className="text-sm text-muted">{group.topics.length} {group.topics.length === 1 ? "course" : "courses"}</span>
              </div>
              <div className="pg-grid">
                {group.topics.map((topic) => {
                  const style = getTopicStyle(topic.id);
                  const lessons = guidesForTopic(topic.id);
                  const minutes = totalGuideMinutes(topic.id);
                  const progress = ready ? guideTopicProgress(topic.id) : { done: 0, total: lessons.length, ratio: 0 };
                  const percent = Math.round(progress.ratio * 100);
                  return (
                    <Link key={topic.id} href={`/guides/${topic.id}`} className="pg-course">
                      <div className="flex items-start justify-between gap-2">
                        <TechLogoBadge topicId={topic.id} name={topic.name} size={26} soft={style.soft} ring={style.ring} />
                        <span className="pg-tag">{topic.tagline}</span>
                      </div>
                      <h3>{topic.name}</h3>
                      <p className="pg-course-desc">{topic.description}</p>
                      <div className="pg-meta">
                        <span><BookOpen size={15} aria-hidden />{lessons.length} lessons</span>
                        <span><Clock size={15} aria-hidden />{minutes} min</span>
                      </div>
                      <div className="pg-bar" role="progressbar" aria-label={`${topic.name} progress`} aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}><i style={{ width: `${percent}%` }} /></div>
                      <div className="pg-bar-label"><span>{progress.done ? `${progress.done} of ${progress.total} read` : "Not started"}</span><b>{percent}%</b></div>
                      <span className="pg-cta">{progress.done ? "Continue course" : "Start course"}<ArrowRight size={16} aria-hidden /></span>
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}

      <section className="pg-continue mt-12" aria-label="Full technology catalog">
        <span className="pg-continue-icon"><Database size={22} aria-hidden /></span>
        <div className="min-w-0 flex-1">
          <p className="workspace-eyebrow">Full technology catalog</p>
          <h2 className="mt-1">{catalog.entries} languages &amp; databases, compared side by side</h2>
          <p>Clear explanations, practical uses and links to related courses.</p>
        </div>
        <Link href="/guides/catalog" className="workspace-button">
          Open catalog
          <ArrowRight size={15} />
        </Link>
      </section>
    </div>
  );
}

export function TopicGuideList({ topicId }: { topicId: string }) {
  const ready = useClientReady();
  if (!isGuideTopic(topicId)) return <ErrorState message="Topic not found." />;

  const topic = getGuideTopic(topicId);
  const lessons = guidesForTopic(topicId);
  const minutes = totalGuideMinutes(topicId);
  const hasPractice = hasCodePractice(topicId);
  const doneCount = ready ? lessons.filter((lesson) => isGuideRead(topicId, lesson.slug)).length : 0;
  const percent = lessons.length ? Math.round((doneCount / lessons.length) * 100) : 0;
  const nextLesson = (ready && lessons.find((lesson) => !isGuideRead(topicId, lesson.slug))) || lessons[0];

  return (
    <div>
      <GuideCourseTabs activeId={topicId} />

      <PageHero
        className="mt-6"
        icon={BookOpen}
        eyebrow={GUIDE_CATEGORY_LABELS[topic.category]}
        title={topic.name}
        description={topic.description}
        stats={[
          { label: "lessons", value: lessons.length, icon: BookOpen },
          { label: "min total", value: minutes, icon: Clock },
          { label: "complete", value: `${percent}%`, icon: CheckCircle2 },
        ]}
        action={
          nextLesson ? (
            <Link href={`/guides/${topicId}/${nextLesson.slug}`} className="workspace-button">
              <Play size={15} fill="currentColor" />
              {doneCount ? "Continue course" : "Start course"}
            </Link>
          ) : null
        }
      >
        <div className="mt-5 max-w-md">
          <div className="pg-bar" style={{ background: "rgb(255 255 255 / .18)" }} role="progressbar" aria-label="Course progress" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}><i style={{ width: `${percent}%` }} /></div>
          <p className="mt-2 text-sm" style={{ color: "#dcd8ff" }}>{doneCount} of {lessons.length} lessons read</p>
        </div>
      </PageHero>

      <ol className="pg-lessons">
        {lessons.map((lesson, index) => {
          const done = ready && isGuideRead(topicId, lesson.slug);
          const hasLessonPractice = guideHasPractice(topicId, lesson.slug);
          return (
            <li key={lesson.slug}>
              <Link href={`/guides/${topicId}/${lesson.slug}`} className={done ? "pg-lesson is-done" : "pg-lesson"}>
                <span className="pg-lesson-num">{done ? <CheckCircle2 size={20} aria-label="Read" /> : index + 1}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2>{lesson.title}</h2>
                    {done ? <span className="pg-badge is-done">Read</span> : null}
                    {hasLessonPractice ? <span className="pg-badge"><Code2 size={12} aria-hidden />Practice</span> : null}
                  </div>
                  <p>{lesson.summary}</p>
                </div>
                <span className="hidden items-center gap-1.5 text-sm text-muted sm:flex"><Clock size={14} aria-hidden />{lesson.minutes} min</span>
                <ArrowRight className="size-5 shrink-0 text-muted" aria-hidden />
              </Link>
            </li>
          );
        })}
      </ol>

      <div className="pg-continue mt-8">
        <span className="pg-continue-icon"><Code2 size={22} aria-hidden /></span>
        <div className="min-w-0 flex-1">
          <h2>{hasPractice ? "Hands-on practice is built in" : "Keep learning"}</h2>
          <p>
            {hasPractice
              ? "Every lesson has a code editor so you can try what you just read without leaving the page."
              : "Your reading progress counts toward quests and your daily goal."}
          </p>
        </div>
        {lessons[0] ? (
          <Link href={hasPractice ? `/guides/${topicId}/${lessons[0].slug}#practice` : `/guides/${topicId}/${lessons[0].slug}`} className="workspace-button workspace-button-primary">
            {hasPractice ? "Start practicing" : "Continue reading"}
            <ArrowRight size={15} />
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
  const lessonHasMcq = guideHasMcqPractice(topicId, slug);

  return (
    <GuideReaderBody
      topicId={topicId}
      slug={slug}
      lesson={lesson}
      topic={topic}
      lessons={lessons}
      index={index}
      prev={prev}
      next={next}
      progress={progress}
      style={style}
      hasPractice={hasPractice}
      lessonHasPractice={lessonHasPractice}
      lessonHasMcq={lessonHasMcq}
    />
  );
}

function GuideReaderBody({
  topicId,
  slug,
  lesson,
  topic,
  lessons,
  index,
  prev,
  next,
  progress,
  style,
  hasPractice,
  lessonHasPractice,
  lessonHasMcq,
}: {
  topicId: string;
  slug: string;
  lesson: NonNullable<ReturnType<typeof getGuide>>;
  topic: ReturnType<typeof getGuideTopic>;
  lessons: ReturnType<typeof guidesForTopic>;
  index: number;
  prev: (typeof lessons)[number] | undefined;
  next: (typeof lessons)[number] | undefined;
  progress: number;
  style: ReturnType<typeof getTopicStyle>;
  hasPractice: boolean;
  lessonHasPractice: boolean;
  lessonHasMcq: boolean;
}) {
  const { openChat } = useDevyyyyy();

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

          <div className="mt-8">
            <button
              type="button"
              onClick={() =>
                openChat({
                  message: `I'm reading ${topic.name} — "${lesson.title}" and I don't fully get it yet. Explain the main idea in simple Taglish and give one tiny example.`,
                  autoSend: true,
                  mode: "simplify",
                })
              }
              className="inline-flex items-center gap-2 rounded-xl border border-primary-200 bg-primary-50 px-4 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary-100"
            >
              <HelpCircle size={16} />
              I don&apos;t get this lesson
            </button>
          </div>

          <LessonNotes topicId={topicId} slug={slug} />

          {lessonHasPractice ? <GuidePracticePanel topicId={topicId} slug={slug} /> : null}
          {!lessonHasPractice && lessonHasMcq ? <GuideMcqPanel topicId={topicId} slug={slug} /> : null}

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
