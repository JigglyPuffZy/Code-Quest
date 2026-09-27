"use client";

import { TechLogo, TechLogoBadge } from "@/components/icons/TechLogo";
import { usePlayer } from "@/components/player/PlayerProvider";
import { ScrollLane } from "@/components/ui/ScrollLane";
import { ErrorState } from "@/components/ui/States";
import { ExerciseView } from "@/components/workspace/ExerciseView";
import { guidePaths } from "@/lib/curriculum/guide-paths";
import { LANGUAGE_TO_GUIDE } from "@/lib/curriculum/links";
import {
  getLesson,
  getWorld,
  isLanguage,
  languageInfo,
  languages,
  lessonsFor,
  lessonsForChapter,
} from "@/lib/curriculum/index";
import { guidePathProgress } from "@/lib/guides/progress";
import {
  chapterProgress,
  isLessonComplete,
  isLessonUnlocked,
  languageProgress,
  pathSnapshot,
} from "@/lib/progress";
import type { LanguageId } from "@/lib/types";
import { ArrowRight, BookOpen, Check, Lock } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function LearnHome() {
  const { player } = usePlayer();
  const [guideProgress, setGuideProgress] = useState<Record<string, { done: number; total: number; ratio: number }>>({});

  useEffect(() => {
    const next: Record<string, { done: number; total: number; ratio: number }> = {};
    for (const path of guidePaths) {
      next[path.topicId] = guidePathProgress(path.topicId);
    }
    setGuideProgress(next);
  }, []);

  if (!player) return null;

  return (
    <div className="space-y-8">
      <header>
        <p className="tag">Interactive</p>
        <h1 className="mega-title mt-2">Practice paths</h1>
        <p className="mt-3 max-w-lg text-sm text-muted">
          Write real code, pass real checks, earn XP. Each code path links to its full guide.
        </p>
      </header>

      <section className="space-y-4">
        <div className="px-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">Code paths</p>
          <h2 className="mt-1 text-lg font-bold">Interactive lessons</h2>
        </div>
        <div className="space-y-4">
          {languages.map((language) => {
            const progress = languageProgress(language.id, player);
            const pct = Math.round(progress.ratio * 100);
            const guideId = LANGUAGE_TO_GUIDE[language.id];
            return (
              <article key={language.id} className="hero-blob flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
                <div className="flex items-start gap-4">
                  <TechLogoBadge
                    topicId={language.id}
                    name={language.name}
                    size={24}
                    soft="bg-white"
                    ring="ring-line"
                  />
                  <div>
                    <p className="text-6xl font-extrabold leading-none text-primary/20">{pct}%</p>
                    <h2 className="mt-1 text-2xl font-bold">{language.name}</h2>
                    <p className="mt-1 text-sm text-muted">{language.blurb}</p>
                    <p className="mt-2 text-xs font-bold text-muted">
                      {progress.done}/{progress.total} lessons cleared
                    </p>
                    <Link
                      href={`/guides/${guideId}`}
                      className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                    >
                      <BookOpen size={12} />
                      Read {language.name} guide
                    </Link>
                  </div>
                </div>
                <Link
                  href={`/learn/${language.id}`}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-md"
                >
                  Enter <ArrowRight size={14} />
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      <section className="space-y-4">
        <div className="px-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">Guide paths</p>
          <h2 className="mt-1 text-lg font-bold">Read & track progress</h2>
          <p className="mt-1 text-sm text-muted">
            Web and database topics — connected to quests when you finish guide lessons.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {guidePaths.map((path) => {
            const prog = guideProgress[path.topicId] ?? { done: 0, total: 0, ratio: 0 };
            const pct = Math.round(prog.ratio * 100);
            return (
              <Link
                key={path.topicId}
                href={`/guides/${path.topicId}`}
                className="group flex items-center gap-4 rounded-2xl border border-line bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-900/5"
              >
                <TechLogoBadge topicId={path.topicId} name={path.name} size={22} soft="bg-surface-2" ring="ring-line" />
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted">{path.tagline}</p>
                  <h3 className="font-bold">{path.name}</h3>
                  <p className="mt-0.5 truncate text-xs text-muted">{path.blurb}</p>
                  <p className="mt-2 text-xs font-semibold text-primary">
                    {prog.done}/{prog.total} read · {pct}%
                  </p>
                </div>
                <ArrowRight className="size-4 shrink-0 text-muted group-hover:text-primary" />
              </Link>
            );
          })}
        </div>
      </section>

      <ScrollLane title="All guides" subtitle="23 full courses — languages, web, and databases">
        <Link href="/guides" className="orbit-card w-36 p-4 text-center">
          <BookOpen size={28} className="mx-auto text-primary" />
          <p className="mt-2 text-sm font-bold">Browse all</p>
        </Link>
        <Link href="/guides/typescript" className="orbit-card w-36 p-4 text-center">
          <TechLogo topicId="typescript" size={28} className="mx-auto" />
          <p className="mt-2 text-sm font-bold">TypeScript</p>
        </Link>
        <Link href="/guides/react" className="orbit-card w-36 p-4 text-center">
          <TechLogo topicId="react" size={28} className="mx-auto" />
          <p className="mt-2 text-sm font-bold">React</p>
        </Link>
        <Link href="/guides/sql" className="orbit-card w-36 p-4 text-center">
          <TechLogo topicId="sql" size={28} className="mx-auto" />
          <p className="mt-2 text-sm font-bold">SQL</p>
        </Link>
      </ScrollLane>
    </div>
  );
}

export function PathMap({ language }: { language: string }) {
  const { player } = usePlayer();
  if (!player) return null;
  if (!isLanguage(language)) return <ErrorState message="Language not found." />;

  const info = languageInfo(language);
  const snapshot = pathSnapshot(language, player);
  const guideId = LANGUAGE_TO_GUIDE[language];

  return (
    <div className="space-y-8">
      <header>
        <Link href="/learn" className="text-xs font-bold text-primary">← Paths</Link>
        <h1 className="mega-title mt-3">{info.name}</h1>
        <p className="mt-2 text-sm text-muted">{info.blurb}</p>
        <Link
          href={`/guides/${guideId}`}
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
        >
          <BookOpen size={14} />
          Read the full {info.name} guide
        </Link>
      </header>

      {snapshot.map(({ world, progress, chapters }) => {
        const firstLesson = chapters[0]?.lessons[0];
        const unlocked = firstLesson ? isLessonUnlocked(firstLesson, player) : false;
        return (
          <section key={world.id} className={unlocked ? "" : "opacity-60"}>
            <div className="mb-4 flex items-end justify-between">
              <div>
                <p className="tag">{world.title}</p>
                <p className="mt-1 text-sm text-muted">{world.summary}</p>
              </div>
              <span className="text-2xl font-extrabold tabular-nums text-primary">{progress.done}/{progress.total}</span>
            </div>

            <div className="space-y-6 pl-2">
              {chapters.map(({ chapter, lessons }) => (
                <div key={chapter.id}>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-muted">{chapter.title}</h3>
                  <ul className="mt-2 space-y-1">
                    {lessons.map((lesson) => {
                      const open = isLessonUnlocked(lesson, player);
                      const done = isLessonComplete(lesson.id, player);
                      return (
                        <li key={lesson.id} className="relative">
                          {open ? (
                            <Link
                              href={`/learn/${language}/${lesson.id}`}
                              className="group flex items-center gap-3 rounded-xl py-2.5 pl-2 pr-3 transition hover:bg-white/70"
                            >
                              <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-xs font-bold ${
                                done ? "bg-primary/15 text-primary" : "bg-surface-2 text-muted"
                              }`}>
                                {done ? <Check size={14} /> : lesson.xp}
                              </span>
                              <span className="min-w-0 flex-1 border-b border-line/50 pb-2.5">
                                <span className="block font-semibold">{lesson.title}</span>
                                <span className="block text-xs text-muted">{lesson.minutes} min</span>
                              </span>
                              <ArrowRight className="size-4 text-primary opacity-0 group-hover:opacity-100" />
                            </Link>
                          ) : (
                            <div className="flex items-center gap-3 py-2.5 pl-2 text-muted">
                              <span className="grid h-9 w-9 place-items-center rounded-full bg-surface-2">
                                <Lock size={13} />
                              </span>
                              <span className="text-sm">{lesson.title}</span>
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

export function LessonPlayer({ language, lessonId }: { language: string; lessonId: string }) {
  const { player, rememberLesson } = usePlayer();

  useEffect(() => {
    if (player && isLanguage(language) && getLesson(lessonId)) rememberLesson(lessonId);
  }, [language, lessonId, player, rememberLesson]);

  if (!player) return null;
  if (!isLanguage(language)) return <ErrorState message="Language not available." />;

  const lesson = getLesson(lessonId);
  if (!lesson || lesson.language !== language) return <ErrorState message="Lesson not found." />;

  const world = getWorld(lesson.worldId);
  const unlocked = isLessonUnlocked(lesson, player);
  const cleared = isLessonComplete(lesson.id, player);
  const chapter = chapterProgress(lesson.chapterId, player);
  const ordered = lessonsFor(language);
  const next = ordered[ordered.findIndex((item) => item.id === lesson.id) + 1];
  const guideId = LANGUAGE_TO_GUIDE[language];

  return (
    <ExerciseView
      backHref={`/learn/${language}`}
      backLabel={world ? world.title : "Back"}
      eyebrow={`${languageInfo(language).name} · ${chapter.done}/${chapter.total}`}
      title={lesson.title}
      meta={`${lesson.minutes} min · ${lesson.xp} XP · ${cleared ? "Done" : "Active"}`}
      blocks={lesson.blocks}
      exercise={lesson.exercise}
      language={language as LanguageId}
      kind="lesson"
      exerciseId={lesson.id}
      alreadyCleared={cleared}
      locked={!unlocked}
      lockMessage="Clear the previous lesson first."
      footer={
        <div className="flex flex-wrap items-center justify-between gap-3">
          {next ? (
            <Link href={`/learn/${language}/${next.id}`} className="text-sm font-bold text-primary">
              Next: {next.title} →
            </Link>
          ) : (
            <p className="text-sm text-muted">Last lesson on this path.</p>
          )}
          <Link href={`/guides/${guideId}`} className="text-sm font-semibold text-muted hover:text-primary">
            Read guide →
          </Link>
        </div>
      }
    />
  );
}
