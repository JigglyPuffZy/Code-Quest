"use client";

import { DevLadderMark } from "@/components/icons/DevLadderMark";
import { readIntroDismissed, writeIntroDismissed } from "@/lib/intro/storage";
import { cn } from "@/lib/cn";
import {
  ArrowRight,
  BookOpen,
  ChevronDown,
  Code2,
  MapPin,
  Swords,
  Target,
  Trophy,
  X,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const PATH_STEPS = [
  {
    step: "01",
    icon: BookOpen,
    title: "Read",
    label: "Guides",
    text: "Concepts in plain English",
    href: "/guides",
    glow: "shadow-sky-500/30",
    ring: "from-sky-400 to-cyan-300",
  },
  {
    step: "02",
    icon: Code2,
    title: "Write",
    label: "Sandbox",
    text: "Real checks on your code",
    href: "/guides",
    glow: "shadow-violet-500/30",
    ring: "from-violet-400 to-primary-300",
  },
  {
    step: "03",
    icon: Trophy,
    title: "Earn",
    label: "XP & quests",
    text: "Level up & keep streaks",
    href: "/quests",
    glow: "shadow-amber-500/30",
    ring: "from-amber-400 to-orange-300",
  },
] as const;

export function DevLadderIntro({ playerId, username }: { playerId: string; username: string }) {
  const [expanded, setExpanded] = useState(false);
  const [firstVisit, setFirstVisit] = useState(false);
  const [ready, setReady] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const pathRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dismissed = readIntroDismissed(playerId);
    setFirstVisit(!dismissed);
    setExpanded(false);
    setReady(true);
  }, [playerId]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "0px 0px -8% 0px", threshold: 0.15 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, [ready]);

  useEffect(() => {
    if (!expanded || !inView) return;
    const timer = window.setInterval(() => {
      setActiveStep((current) => (current + 1) % PATH_STEPS.length);
    }, 2800);
    return () => window.clearInterval(timer);
  }, [expanded, inView]);

  useEffect(() => {
    if (!expanded || !inView) return;
    const lane = pathRef.current;
    if (!lane) return;
    if (window.matchMedia("(min-width: 640px)").matches) return;

    const card = lane.children.item(activeStep) as HTMLElement | null;
    if (!card) return;

    const targetLeft = card.offsetLeft - (lane.clientWidth - card.clientWidth) / 2;
    lane.scrollTo({ left: Math.max(0, targetLeft), behavior: "smooth" });
  }, [activeStep, expanded, inView]);

  function dismiss() {
    writeIntroDismissed(playerId);
    setFirstVisit(false);
    setExpanded(false);
  }

  if (!ready) return null;

  return (
    <section
      ref={sectionRef}
      className={cn(
        "dl-intro-shell relative overflow-hidden rounded-3xl border border-white/10",
        expanded ? "dl-intro-welcome" : "dl-intro-collapsed",
      )}
    >
      <div className="dl-intro-mesh pointer-events-none absolute inset-0" aria-hidden />
      <div className="dl-intro-orb dl-intro-orb-a pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full" aria-hidden />
      <div className="dl-intro-orb dl-intro-orb-b pointer-events-none absolute -right-16 bottom-0 h-48 w-48 rounded-full" aria-hidden />
      <div className="dl-intro-scan pointer-events-none absolute inset-0" aria-hidden />

      <button
        type="button"
        onClick={() => setExpanded((open) => !open)}
        className="relative z-10 flex w-full items-center gap-4 px-5 py-4 text-left sm:px-7 sm:py-5"
        aria-expanded={expanded}
      >
        <DevLadderMark size={expanded ? 42 : 36} glow className="shrink-0" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="dl-intro-title text-sm font-extrabold tracking-tight sm:text-base">
              Quest briefing
            </p>
            {firstVisit && expanded ? (
              <span className="dl-intro-badge inline-flex items-center rounded-full border border-amber-300/30 bg-amber-400/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-amber-200">
                New hero
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-xs text-white/55 sm:text-sm">
            {expanded
              ? "Origin · purpose · your path through the academy"
              : "Tap to open the Dev Ladder story & how you play"}
          </p>
        </div>
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/10 bg-white/5">
          <ChevronDown
            size={18}
            className={cn("text-white/70 transition-transform duration-300", expanded && "rotate-180")}
          />
        </span>
      </button>

      {expanded ? (
        <div className="dl-intro-body relative z-10 px-5 pb-6 pt-2 sm:px-7 sm:pb-8">
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-md sm:p-7">
            <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/25 blur-3xl" aria-hidden />
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-primary-300">Dev Ladder Academy</p>
            {firstVisit ? (
              <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                Welcome,{" "}
                <span className="dl-intro-gradient-text">{username}</span>
              </h2>
            ) : (
              <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                Learn code like a{" "}
                <span className="dl-intro-gradient-text">quest</span>
              </h2>
            )}
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/65 sm:text-[15px]">
              Not another scattered tutorial tab. One academy where guides, practice, and progress connect —
              so you actually finish what you start.
            </p>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-12 lg:gap-5">
            <article className="dl-intro-glass relative overflow-hidden rounded-2xl p-5 sm:p-6 lg:col-span-7">
              <div className="absolute left-6 top-6 bottom-6 w-px bg-gradient-to-b from-primary-400/80 via-violet-400/50 to-transparent" aria-hidden />
              <div className="relative pl-8">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-violet-200">
                  <MapPin size={11} />
                  Origin story
                </span>
                <h3 className="mt-4 text-lg font-bold text-white sm:text-xl">Why Dev Ladder exists</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/60">
                  Tutorials everywhere — but no clear path to <em className="text-white/90">finish</em> and{" "}
                  <em className="text-white/90">prove</em> you learned. Dev Ladder was built as one connected world:
                  read, write real code in the sandbox, and watch your XP and streaks grow.
                </p>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-white/8 bg-black/20 px-4 py-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-primary-300">Mission</p>
                    <p className="mt-1 text-sm font-semibold text-white">Curious → confident</p>
                  </div>
                  <div className="rounded-xl border border-white/8 bg-black/20 px-4 py-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-amber-300">Built for</p>
                    <p className="mt-1 text-sm font-semibold text-white">Students & self-learners</p>
                  </div>
                </div>
              </div>
            </article>

            <div className="flex flex-col gap-4 lg:col-span-5">
              <article className="dl-intro-glass dl-intro-float-a flex-1 rounded-2xl p-5">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-primary-500 to-violet-500 text-white shadow-lg shadow-primary/30">
                  <Target size={18} />
                </span>
                <h3 className="mt-4 font-bold text-white">What it is</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">
                  A gamified coding academy — guides, practice paths, arena battles, quests, and levels in one calm app.
                </p>
              </article>
              <article className="dl-intro-glass dl-intro-float-b flex-1 rounded-2xl p-5">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-rose-500 to-orange-400 text-white shadow-lg shadow-rose-500/25">
                  <Zap size={18} />
                </span>
                <h3 className="mt-4 font-bold text-white">The point</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">
                  Structure without boredom. Real sandbox checks. Streaks that pull you back. Skills you can show off.
                </p>
              </article>
            </div>
          </div>

          <div className="mt-6">
            <div className="mb-4 flex items-end justify-between gap-3 px-1">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-white/40">Your loop</p>
                <h3 className="mt-1 text-lg font-bold text-white">How you play</h3>
              </div>
              <p className="text-xs text-white/40">
                <span className="sm:hidden">Swipe the path</span>
                <span className="hidden sm:inline">Follow the path · earn XP · level up</span>
              </p>
            </div>

            <div className="mb-3 flex justify-center gap-1.5 sm:hidden">
              {PATH_STEPS.map((step, index) => (
                <button
                  key={step.step}
                  type="button"
                  aria-label={`Show ${step.title} step`}
                  onClick={() => setActiveStep(index)}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    activeStep === index ? "w-5 bg-primary-300" : "w-1.5 bg-white/25",
                  )}
                />
              ))}
            </div>

            <div
              ref={pathRef}
              className="dl-intro-path relative -mx-5 flex gap-3 overflow-x-auto px-5 pb-2 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible sm:px-0 sm:pb-0 [&::-webkit-scrollbar]:hidden"
            >
              {PATH_STEPS.map((step, index) => (
                <Link
                  key={step.step}
                  href={step.href}
                  className={cn(
                    "dl-intro-node group relative z-[1] min-w-[min(82vw,17rem)] shrink-0 snap-center overflow-hidden rounded-2xl border p-4 transition duration-500 sm:min-w-0 sm:shrink sm:p-5",
                    activeStep === index
                      ? "border-white/25 bg-[#161a35] shadow-xl"
                      : "border-white/8 bg-[#12152c] hover:border-white/15 hover:bg-[#161a35]",
                    step.glow,
                    activeStep === index && "shadow-lg",
                  )}
                >
                  <div
                    className={cn(
                      "pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100",
                      activeStep === index && "opacity-100",
                    )}
                  >
                    <div
                      className={cn(
                        "absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br opacity-30 blur-2xl",
                        step.ring,
                      )}
                    />
                  </div>
                  <div className="relative flex items-start justify-between gap-3">
                    <span
                      className={cn(
                        "grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br text-white shadow-md",
                        step.ring,
                      )}
                    >
                      <step.icon size={20} />
                    </span>
                    <span className="font-mono text-[11px] font-bold text-white/30">{step.step}</span>
                  </div>
                  <p className="relative mt-4 text-base font-bold text-white">{step.title}</p>
                  <p className="relative mt-0.5 text-xs font-semibold uppercase tracking-wider text-primary-300">
                    {step.label}
                  </p>
                  <p className="relative mt-2 text-xs leading-relaxed text-white/55">{step.text}</p>
                  <span className="relative mt-4 inline-flex items-center gap-1 text-xs font-bold text-white/80 transition group-hover:gap-2">
                    Enter <ArrowRight size={13} />
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2 rounded-2xl border border-dashed border-white/15 bg-white/[0.03] px-4 py-3.5">
            <Swords size={15} className="shrink-0 text-rose-300" />
            <p className="text-xs text-white/55 sm:text-sm">
              <span className="font-semibold text-white/90">Pro tip:</span> Read a guide, then try Arena or Game mode
              to practice with real code checks.
            </p>
          </div>

          <div className="mt-5 flex flex-wrap gap-2.5">
            <Link
              href="/guides"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-[#0f1229] shadow-lg shadow-white/10 transition hover:bg-white/90"
            >
              <BookOpen size={15} />
              Browse guides
            </Link>
            <Link
              href="/challenges"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-bold text-white backdrop-blur transition hover:bg-white/10"
            >
              <Code2 size={15} />
              Go to Arena
            </Link>
            {firstVisit ? (
              <button
                type="button"
                onClick={dismiss}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-violet-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/30 transition hover:brightness-110"
              >
                Begin my quest
                <ArrowRight size={15} />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setExpanded(false)}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white/50 transition hover:text-white"
              >
                <X size={15} />
                Close briefing
              </button>
            )}
          </div>
        </div>
      ) : null}
    </section>
  );
}
