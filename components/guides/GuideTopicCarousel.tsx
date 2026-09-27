"use client";

import { TechLogoBadge } from "@/components/icons/TechLogo";
import { MarqueeLane } from "@/components/ui/MarqueeLane";
import { guidesForTopic, totalGuideMinutes } from "@/lib/guides/index";
import { getTopicStyle } from "@/lib/guides/styles";
import type { GuideTopic, GuideTopicId } from "@/lib/guides/types";
import { cn } from "@/lib/cn";
import { ArrowRight, BookOpen, Clock } from "lucide-react";
import Link from "next/link";

function TopicCard({
  href,
  topicId,
  name,
  sub,
  meta,
  soft,
  accent,
  ring,
  bar,
  active,
}: {
  href: string;
  topicId: GuideTopicId;
  name: string;
  sub: string;
  meta?: string;
  soft: string;
  accent: string;
  ring: string;
  bar: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "guide-topic-card group relative flex w-[8.75rem] flex-col gap-2.5 p-3.5 sm:w-[9.5rem]",
        "rounded-2xl border bg-white transition-all duration-200",
        active
          ? cn("border-slate-300 shadow-md shadow-slate-900/5 ring-2 ring-primary/30", soft)
          : "border-line hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-900/5",
      )}
    >
      <div className="flex items-start justify-between gap-1">
        <TechLogoBadge
          topicId={topicId}
          name={name}
          size={18}
          soft={soft}
          ring={ring}
          className="transition-transform group-hover:scale-105"
        />
        <ArrowRight
          size={12}
          className={cn(
            "mt-0.5 shrink-0 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100",
            accent,
          )}
        />
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-bold leading-tight">{name}</p>
        <p className={cn("mt-0.5 truncate text-[10px] font-medium", accent)}>{sub}</p>
        {meta ? (
          <p className="mt-1.5 flex items-center gap-1 text-[9px] text-muted">
            <Clock size={9} />
            {meta}
          </p>
        ) : null}
      </div>
      <div
        className={cn(
          "absolute inset-x-3 bottom-0 h-0.5 rounded-full transition-opacity",
          active ? "opacity-100" : "opacity-0 group-hover:opacity-100",
          bar,
        )}
        aria-hidden
      />
    </Link>
  );
}

function HomeCard({ active }: { active: boolean }) {
  return (
    <Link
      href="/guides"
      className={cn(
        "guide-topic-card group relative flex w-[8.75rem] flex-col gap-2.5 p-3.5 sm:w-[9.5rem]",
        "rounded-2xl border bg-white transition-all duration-200",
        active
          ? "border-slate-300 bg-surface-2 shadow-md ring-2 ring-primary/30"
          : "border-line hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-900/5",
      )}
    >
      <div className="flex items-start justify-between gap-1">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-surface-2 text-primary ring-1 ring-primary-100">
          <BookOpen size={16} />
        </span>
        <ArrowRight size={12} className="mt-0.5 text-muted opacity-0 transition group-hover:opacity-100" />
      </div>
      <div>
        <p className="text-sm font-bold">All guides</p>
        <p className="mt-0.5 text-[10px] font-medium text-muted">Browse courses</p>
      </div>
      <div className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-primary-400 opacity-0 transition group-hover:opacity-100" aria-hidden />
    </Link>
  );
}

type CarouselItem =
  | { kind: "home" }
  | { kind: "topic"; topic: GuideTopic; key: string };

function buildItems(topics: GuideTopic[]): CarouselItem[] {
  return [{ kind: "home" }, ...topics.map((topic) => ({ kind: "topic" as const, topic, key: topic.id }))];
}

export function GuideTopicCarousel({
  topics,
  activeId,
}: {
  topics: GuideTopic[];
  activeId?: GuideTopicId;
}) {
  const items = buildItems(topics);
  const loop = [...items, ...items];

  return (
    <div className="space-y-2 pb-1">
      <div className="flex items-center justify-between gap-3 px-1">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">Courses</p>
        <span className="text-[10px] text-muted">
          <span className="md:hidden">Swipe to browse</span>
          <span className="hidden md:inline">Hover to pause</span>
        </span>
      </div>

      <MarqueeLane className="guide-marquee" trackClassName="guide-marquee-track">
        {loop.map((item, index) => {
          if (item.kind === "home") {
            return <HomeCard key={`home-${index}`} active={!activeId} />;
          }
          const { topic } = item;
          const style = getTopicStyle(topic.id);
          const lessons = guidesForTopic(topic.id);
          const minutes = totalGuideMinutes(topic.id);
          return (
            <TopicCard
              key={`${topic.id}-${index}`}
              href={`/guides/${topic.id}`}
              topicId={topic.id}
              name={topic.name}
              sub={topic.tagline}
              meta={`${lessons.length} lessons · ${minutes}m`}
              soft={style.soft}
              accent={style.accent}
              ring={style.ring}
              bar={style.bar}
              active={activeId === topic.id}
            />
          );
        })}
      </MarqueeLane>
    </div>
  );
}
