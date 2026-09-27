"use client";

import { continueGuide } from "@/lib/guides/navigation";
import { BookOpen, Play } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

export function ContinueGuideCard() {
  const next = useMemo(() => continueGuide(), []);

  if (!next) {
    return (
      <Link href="/guides" className="group block h-full">
        <article className="flex h-full flex-col justify-between rounded-2xl border border-line bg-white p-5 sm:p-6 transition hover:-translate-y-0.5 hover:shadow-md">
          <div>
            <p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-primary">
              <BookOpen size={11} />
              Start reading
            </p>
            <h3 className="mt-3 text-xl font-bold">Explore guides</h3>
            <p className="mt-2 text-sm text-muted">Languages, web, databases — all in one place.</p>
          </div>
          <span className="mt-5 inline-flex w-fit items-center gap-2 text-sm font-bold text-primary">
            Open guides
          </span>
        </article>
      </Link>
    );
  }

  return (
    <Link href={`/guides/${next.topicId}/${next.slug}`} className="group block h-full">
      <article
        className="relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-primary-200 bg-gradient-to-br from-primary-50 via-white to-white p-5 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/10 sm:p-6"
      >
        <div>
          <p className="inline-flex items-center gap-1.5 rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
            <BookOpen size={11} />
            Continue reading
          </p>
          <h3 className="mt-3 text-xl font-bold leading-tight sm:text-2xl">{next.title}</h3>
          <p className="mt-2 line-clamp-2 text-sm text-muted">{next.summary}</p>
          <p className="mt-2 text-xs text-muted">{next.minutes} min read</p>
        </div>
        <span
          className="mt-5 inline-flex w-fit items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition group-hover:bg-primary-hover"
        >
          <Play size={15} fill="currentColor" />
          Resume guide
        </span>
      </article>
    </Link>
  );
}
