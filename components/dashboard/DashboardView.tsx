"use client";

import { usePlayer } from "@/components/player/PlayerProvider";
import { ActiveQuestCard } from "@/components/dashboard/ActiveQuestCard";
import { DailyGoalCard } from "@/components/dashboard/DailyGoalCard";
import { RingProgress } from "@/components/ui/RingProgress";
import { continueGuide } from "@/lib/guides/navigation";
import { exportGuideProgress } from "@/lib/guides/progress";
import { guidesForTopic } from "@/lib/guides";
import { listPracticeMistakes, reviewDueTime } from "@/lib/learning/mistakes";
import { useLearningClock } from "@/lib/learning/client";
import { ArrowRight, ArrowUpRight, BookOpen, Bug, Code2, Flame, FlaskConical, Gamepad2, GitBranch, Play, RotateCcw, Sparkles, Swords, Trophy } from "lucide-react";
import Link from "next/link";
import { useMemo, type CSSProperties } from "react";

const courses = [
  { id: "python" as const, name: "Python", mark: "Py", note: "Programming foundations" },
  { id: "javascript" as const, name: "JavaScript", mark: "JS", note: "The language of the web" },
  { id: "typescript" as const, name: "TypeScript", mark: "TS", note: "Build with confidence" },
  { id: "java" as const, name: "Java", mark: "Ja", note: "Structured application design" },
];

function greeting(hour: number) {
  if (hour < 5) return "Burning the midnight oil";
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function DashboardView() {
  const { player, level, xp } = usePlayer();
  const now = useLearningClock();
  const next = useMemo(() => continueGuide(), []);
  const guideProgress = exportGuideProgress();
  const guidesRead = Object.values(guideProgress.read).reduce((total, slugs) => total + slugs.length, 0);
  const due = listPracticeMistakes().filter((item) => reviewDueTime(item) <= now).length;
  if (!player) return null;

  const nextHref = next ? `/guides/${next.topicId}/${next.slug}` : "/guides";
  const levelPct = level.needed ? Math.min(100, Math.round((level.into / level.needed) * 100)) : 0;
  const date = new Date(now).toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
  const hello = greeting(new Date(now).getHours());

  const tiles = [
    { href: "/lab/detective", title: "Debug Detective", text: "Find the bug and explain the fix.", icon: Bug, tile: "linear-gradient(135deg,#f43f5e,#fb923c)", shadow: "#f43f5e" },
    { href: "/review", title: due ? `${due} reviews due` : "Review queue", text: due ? "Revisit what you missed." : "Mistakes return when it's time.", icon: RotateCcw, tile: "linear-gradient(135deg,#0ea5e9,#22d3ee)", shadow: "#0ea5e9" },
    { href: "/challenges", title: "Coding arena", text: "Battle a challenge and earn XP.", icon: Swords, tile: "linear-gradient(135deg,#8b5cf6,#ec4899)", shadow: "#8b5cf6" },
    { href: "/game", title: "Puzzle campaign", text: "Level up through game tracks.", icon: Gamepad2, tile: "linear-gradient(135deg,#10b981,#22d3ee)", shadow: "#10b981" },
  ];

  return (
    <div className="flex flex-col gap-5">
      <header className="bento-head">
        <div>
          <p className="bento-date">{date}</p>
          <h1 className="bento-title">{hello}, <span>{player.username}</span>.</h1>
          <p className="bento-sub">Pick up where you left off, or try something new today.</p>
        </div>
        <Link href="/learning" prefetch={false} className="workspace-button">
          Weekly planner <ArrowRight size={14} />
        </Link>
      </header>

      <section className="bento" aria-label="Your dashboard" data-tour="next-actions">
        <article className="bento-card bento-hero">
          <p className="bento-label"><Sparkles size={14} /> Continue learning</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="bento-chip">{next?.topicId ?? "Guides"}</span>
            <span className="bento-chip">{next?.minutes ?? 8} min lesson</span>
          </div>
          <h2>{next?.title ?? "Build your next skill."}</h2>
          <p className="bento-desc">{next?.summary ?? "Follow a clear guide, try the examples, and make the concept your own."}</p>
          <div className="bento-cta">
            <Link href={nextHref} className="bento-play"><Play size={16} fill="currentColor" />Continue</Link>
            <div className="text-right">
              <p className="text-2xl font-bold tabular-nums">Level {level.level}</p>
              <p className="text-xs text-indigo-100/80">{level.title}</p>
            </div>
          </div>
        </article>

        <article className="bento-card bento-level-card" data-tour="daily-focus">
          <p className="bento-label"><Trophy size={14} /> Your level</p>
          <div className="bento-level mt-4">
            <RingProgress value={levelPct} size={104} stroke={9}>
              <div className="text-center">
                <p className="text-2xl font-bold leading-none tabular-nums">{level.level}</p>
                <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-muted">Level</p>
              </div>
            </RingProgress>
            <div className="min-w-0">
              <p className="bento-big">{xp.toLocaleString()}</p>
              <p className="bento-small">total XP · {Math.max(0, level.needed - level.into)} to next level</p>
            </div>
          </div>
          <div className="bento-stats">
            <div className="bento-stat"><b className="flex items-center gap-1.5"><Flame size={18} className="text-amber-500" />{player.streak}</b><span>{player.streak === 1 ? "day streak" : "day streak"}</span></div>
            <div className="bento-stat"><b className="flex items-center gap-1.5"><BookOpen size={18} className="text-primary" />{guidesRead}</b><span>guides read</span></div>
          </div>
        </article>

        <div className="bento-card bento-goal"><DailyGoalCard /></div>

        {tiles.map(({ href, title, text, icon: Icon, tile, shadow }) => (
          <Link key={href} href={href} prefetch={false} className="bento-card bento-tile">
            <ArrowUpRight size={18} className="bento-arrow" aria-hidden />
            <span className="bento-tile-icon" style={{ "--tile": tile, boxShadow: `0 10px 20px -8px ${shadow}` } as CSSProperties}><Icon size={22} /></span>
            <span><h3>{title}</h3><p>{text}</p></span>
          </Link>
        ))}
      </section>

      <div className="bento-section-title">
        <h2>Your learning paths</h2>
        <Link prefetch={false} href="/guides" className="workspace-text-link">All courses<ArrowRight size={13} /></Link>
      </div>
      <section className="bento" aria-label="Learning paths">
        {courses.map((course) => {
          const total = guidesForTopic(course.id).length;
          const done = (guideProgress.read[course.id] ?? []).length;
          const pct = total ? Math.min(100, Math.round((done / total) * 100)) : 0;
          return (
            <Link prefetch={false} href={`/guides/${course.id}`} key={course.id} className="bento-card bento-course">
              <RingProgress value={pct} size={64} stroke={6}><span className="bento-mono">{course.mark}</span></RingProgress>
              <div className="min-w-0 flex-1">
                <h3>{course.name}</h3>
                <p>{course.note}</p>
                <p className="mt-1 tabular-nums">{Math.min(done, total)} of {total} lessons · {pct}%</p>
              </div>
              <ArrowRight size={16} className="shrink-0 text-muted" aria-hidden />
            </Link>
          );
        })}
        <div className="bento-card bento-quest bento-wide"><ActiveQuestCard /></div>
      </section>

      <section className="bento-card bento-banner">
        <div className="flex items-start gap-4">
          <span className="bento-tile-icon" style={{ "--tile": "var(--dl-gradient)" } as CSSProperties}><GitBranch size={22} /></span>
          <div>
            <p className="bento-label"><FlaskConical size={14} /> Beyond the lesson</p>
            <h2 className="mt-1 text-xl font-bold tracking-tight">Your developer lab is ready.</h2>
            <p className="mt-1 max-w-xl text-sm leading-6 text-muted">Step through execution, grow a project through tested milestones, and build a portfolio that shows how you think.</p>
          </div>
        </div>
        <Link prefetch={false} href="/lab" className="workspace-button workspace-button-primary"><Code2 size={15} />Explore the lab<ArrowRight size={14} /></Link>
      </section>
    </div>
  );
}
