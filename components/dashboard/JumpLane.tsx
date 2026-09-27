"use client";

import { TechLogoBadge } from "@/components/icons/TechLogo";
import { MarqueeLane } from "@/components/ui/MarqueeLane";
import { cn } from "@/lib/cn";
import type { GuideTopicId } from "@/lib/guides/types";
import { ArrowRight, BookOpen, Swords, Target, Trophy } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

type JumpItem = {
  href: string;
  label: string;
  sub: string;
  topicId?: GuideTopicId;
  icon?: ReactNode;
  soft: string;
  accent: string;
  ring: string;
  bar: string;
};

const JUMP_ITEMS: JumpItem[] = [
  {
    href: "/guides",
    label: "Guides",
    sub: "Full lessons",
    icon: <BookOpen size={18} className="text-primary" />,
    soft: "bg-primary-50",
    accent: "text-primary",
    ring: "ring-primary-100",
    bar: "bg-primary-400",
  },
  {
    href: "/guides/python",
    label: "Python",
    sub: "Guide",
    topicId: "python",
    soft: "bg-emerald-50",
    accent: "text-emerald-600",
    ring: "ring-emerald-100",
    bar: "bg-emerald-400",
  },
  {
    href: "/guides/javascript",
    label: "JavaScript",
    sub: "Guide",
    topicId: "javascript",
    soft: "bg-amber-50",
    accent: "text-amber-600",
    ring: "ring-amber-100",
    bar: "bg-amber-400",
  },
  {
    href: "/guides/typescript",
    label: "TypeScript",
    sub: "Guide",
    topicId: "typescript",
    soft: "bg-sky-50",
    accent: "text-sky-600",
    ring: "ring-sky-100",
    bar: "bg-sky-400",
  },
  {
    href: "/guides/java",
    label: "Java",
    sub: "Guide",
    topicId: "java",
    soft: "bg-orange-50",
    accent: "text-orange-600",
    ring: "ring-orange-100",
    bar: "bg-orange-400",
  },
  {
    href: "/guides/react",
    label: "React",
    sub: "Guide",
    topicId: "react",
    soft: "bg-violet-50",
    accent: "text-violet-600",
    ring: "ring-violet-100",
    bar: "bg-violet-400",
  },
  {
    href: "/challenges",
    label: "Arena",
    sub: "Challenges",
    icon: <Swords size={18} className="text-rose-600" />,
    soft: "bg-rose-50",
    accent: "text-rose-600",
    ring: "ring-rose-100",
    bar: "bg-rose-400",
  },
  {
    href: "/quests",
    label: "Quests",
    sub: "Bonus XP",
    icon: <Target size={18} className="text-violet-600" />,
    soft: "bg-violet-50",
    accent: "text-violet-600",
    ring: "ring-violet-100",
    bar: "bg-violet-400",
  },
  {
    href: "/leaderboard",
    label: "Ranks",
    sub: "Leaderboard",
    icon: <Trophy size={18} className="text-slate-700" />,
    soft: "bg-slate-100",
    accent: "text-slate-700",
    ring: "ring-slate-200",
    bar: "bg-slate-400",
  },
];

function JumpTile({ item }: { item: JumpItem }) {
  return (
    <Link
      href={item.href}
      className={cn(
        "jump-tile group relative flex w-[9.5rem] flex-col gap-3 p-4 sm:w-[10.5rem]",
        "rounded-2xl border border-line bg-white",
        "transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-900/5",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        {item.topicId ? (
          <TechLogoBadge
            topicId={item.topicId}
            name={item.label}
            size={18}
            soft={item.soft}
            ring={item.ring}
            className="transition-transform duration-200 group-hover:scale-105"
          />
        ) : (
          <span
            className={cn(
              "grid h-11 w-11 place-items-center rounded-xl ring-1 transition-transform duration-200 group-hover:scale-105",
              item.soft,
              item.ring,
            )}
          >
            {item.icon}
          </span>
        )}
        <ArrowRight
          size={14}
          className={cn(
            "mt-1 shrink-0 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100",
            item.accent,
          )}
        />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-bold leading-tight tracking-tight">{item.label}</p>
        <p className={cn("mt-0.5 text-[11px] font-medium", item.accent)}>{item.sub}</p>
      </div>
      <div className={cn("absolute inset-x-4 bottom-0 h-0.5 rounded-full opacity-0 transition group-hover:opacity-100", item.bar)} aria-hidden />
    </Link>
  );
}

export function JumpLane({ embedded = false }: { embedded?: boolean }) {
  const loop = [...JUMP_ITEMS, ...JUMP_ITEMS];

  return (
    <section className="space-y-3">
      {!embedded ? (
        <div className="flex items-end justify-between gap-3 px-1">
          <div>
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-muted">Navigate</p>
            <h2 className="text-lg font-bold tracking-tight">Jump to</h2>
          </div>
          <span className="text-[10px] text-muted">
            <span className="md:hidden">Swipe to browse</span>
            <span className="hidden md:inline">Hover to pause</span>
          </span>
        </div>
      ) : null}

      <MarqueeLane>
        {loop.map((item, index) => (
          <JumpTile key={`${item.href}-${index}`} item={item} />
        ))}
      </MarqueeLane>
    </section>
  );
}
