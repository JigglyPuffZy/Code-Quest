"use client";

import { TechLogo } from "@/components/icons/TechLogo";
import { Logo } from "@/components/shell/Logo";
import { usePlayer } from "@/components/player/PlayerProvider";
import { cn } from "@/lib/cn";
import {
  ArrowRight,
  BookOpen,
  Code2,
  Flame,
  Swords,
  Trophy,
  Zap,
} from "lucide-react";
import Link from "next/link";

const STATS = [
  { label: "Guide courses", value: "23" },
  { label: "Code paths", value: "4" },
  { label: "Arena battles", value: "16+" },
];

const FEATURES = [
  {
    icon: BookOpen,
    title: "Full guides",
    text: "Deep lessons for languages, web, and databases — plain English, no fluff.",
    accent: "from-primary-500/20 to-transparent",
  },
  {
    icon: Code2,
    title: "Practice paths",
    text: "Python, JavaScript, TypeScript & Java with real sandbox checks.",
    accent: "from-sky-500/15 to-transparent",
  },
  {
    icon: Swords,
    title: "Arena challenges",
    text: "Standalone coding battles. Unlock harder fights as you level up.",
    accent: "from-rose-500/15 to-transparent",
  },
  {
    icon: Trophy,
    title: "Quests & XP",
    text: "Earn XP, keep streaks alive, and claim quest rewards.",
    accent: "from-amber-500/15 to-transparent",
  },
];

const MARQUEE_TECH = [
  "python",
  "javascript",
  "typescript",
  "java",
  "react",
  "htmlcss",
  "sql",
  "mysql",
  "postgresql",
  "mongodb",
] as const;

const TERMINAL_LINES = [
  ">>> Welcome to Dev Ladder",
  '>>> hero.login("you")',
  ">>> Loading paths... OK",
  ">>> XP system: ONLINE",
  ">>> Ready. Type learn() to begin.",
];

export function LandingPage() {
  const { ready, email, supabaseEnabled } = usePlayer();
  const enter = email ? "/dashboard" : "/signup";

  return (
    <div className="landing-page relative min-h-screen overflow-hidden">
      <div className="landing-grid pointer-events-none fixed inset-0" aria-hidden />
      <div className="landing-orb landing-orb-a pointer-events-none fixed -left-32 top-20 h-96 w-96 rounded-full" aria-hidden />
      <div className="landing-orb landing-orb-b pointer-events-none fixed -right-24 bottom-10 h-80 w-80 rounded-full" aria-hidden />

      <div className="relative mx-auto max-w-6xl px-5 pb-20 pt-6 sm:px-8">
        <header className="landing-rise flex items-center justify-between gap-3">
          <Logo glow subtitle="Academy" className="min-w-0 shrink" />
          <nav className="flex items-center gap-2 sm:gap-3">
            {supabaseEnabled && !email ? (
              <>
                <Link
                  href="/login"
                  className="rounded-full px-3 py-2 text-xs font-semibold text-muted transition hover:text-ink sm:px-4 sm:text-sm"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-bold text-white shadow-lg shadow-primary/25 transition hover:bg-primary-hover sm:gap-2 sm:px-5 sm:py-2.5 sm:text-sm"
                >
                  Sign up
                  <ArrowRight size={14} className="sm:hidden" />
                </Link>
              </>
            ) : (
              <Link
                href={enter}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/25 transition hover:bg-primary-hover hover:shadow-primary/30"
              >
                {email ? "Open app" : "Get started"}
                <ArrowRight size={15} />
              </Link>
            )}
          </nav>
        </header>

        <main className="mt-14 lg:mt-20">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <div>
              <p className="landing-rise landing-rise-1 tag">Gamified coding academy</p>
              <h1 className="landing-rise landing-rise-2 mega-title mt-5 max-w-2xl">
                Learn code.
                <br />
                <span className="landing-gradient-text">Level up for real.</span>
              </h1>
              <p className="landing-rise landing-rise-3 mt-6 max-w-lg text-base leading-relaxed text-muted">
                Guides, practice paths, arena challenges, and quests — everything connected so you
                actually finish what you start.
              </p>

              <div className="landing-rise landing-rise-4 mt-8 flex flex-wrap gap-3">
                <Link
                  href={enter}
                  className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition hover:bg-primary-hover hover:shadow-xl hover:shadow-primary/25"
                >
                  {ready && email ? "Continue quest" : "Start free"}
                  <ArrowRight size={16} className="transition group-hover:translate-x-0.5" />
                </Link>
                {supabaseEnabled ? (
                  <>
                    <Link
                      href="/signup"
                      className="rounded-full border border-primary-200 bg-primary-50 px-7 py-3.5 text-sm font-bold text-primary backdrop-blur transition hover:border-primary-300 hover:bg-primary-100"
                    >
                      Sign up free
                    </Link>
                    <Link
                      href="/login"
                      className="rounded-full border border-line bg-white/90 px-7 py-3.5 text-sm font-bold backdrop-blur transition hover:border-primary-200 hover:shadow-md"
                    >
                      Log in
                    </Link>
                  </>
                ) : null}
                <Link
                  href="/guides"
                  className="rounded-full border border-line bg-white/80 px-7 py-3.5 text-sm font-bold backdrop-blur transition hover:border-primary-200"
                >
                  Browse guides
                </Link>
              </div>

              <div className="landing-rise landing-rise-5 mt-10 grid grid-cols-3 gap-3 sm:max-w-md">
                {STATS.map((stat) => (
                  <div key={stat.label} className="landing-stat rounded-2xl border border-line bg-white/80 p-4 text-center backdrop-blur-sm">
                    <p className="text-2xl font-extrabold tabular-nums text-primary">{stat.value}</p>
                    <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="landing-rise landing-rise-3 relative mx-auto w-full max-w-md lg:max-w-none">
              <div className="landing-terminal relative z-10 rounded-2xl border border-line bg-white/90 p-6 shadow-2xl shadow-primary/10 backdrop-blur-md">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  </div>
                  <span className="font-mono text-[10px] font-medium uppercase tracking-widest text-muted">
                    devladder.init
                  </span>
                </div>
                <div className="space-y-1 font-mono text-sm leading-7">
                  {TERMINAL_LINES.map((line, index) => (
                    <p
                      key={line}
                      className="landing-terminal-line text-ink"
                      style={{ animationDelay: `${0.3 + index * 0.35}s` }}
                    >
                      <span className="text-primary-400">{line.startsWith(">>>") ? "" : ""}</span>
                      {line}
                    </p>
                  ))}
                </div>
                <div className="mt-5 flex items-center gap-2 rounded-xl bg-primary-50 px-4 py-3">
                  <Zap size={16} className="text-primary" />
                  <span className="text-sm font-semibold text-primary-800">+120 XP available today</span>
                </div>
              </div>

              <div className="landing-float-badge landing-float-a absolute -left-4 top-8 flex items-center gap-2 rounded-full border border-line bg-white px-3 py-2 text-xs font-bold shadow-lg sm:-left-8">
                <Flame size={14} className="text-amber-500" />
                Streak bonus
              </div>
              <div className="landing-float-badge landing-float-b absolute -right-2 bottom-16 flex items-center gap-2 rounded-full border border-line bg-white px-3 py-2 text-xs font-bold shadow-lg sm:-right-6">
                <Trophy size={14} className="text-primary" />
                Quest ready
              </div>
            </div>
          </div>

          <section className="mt-24 sm:mt-32">
            <div className="landing-rise text-center">
              <p className="tag mx-auto">Why Dev Ladder</p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">Built to keep you going</h2>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {FEATURES.map((feature, index) => (
                <article
                  key={feature.title}
                  className={cn(
                    "landing-feature group relative overflow-hidden rounded-2xl border border-line bg-white p-6 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/5",
                  )}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div
                    className={cn(
                      "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 transition group-hover:opacity-100",
                      feature.accent,
                    )}
                    aria-hidden
                  />
                  <span className="relative grid h-11 w-11 place-items-center rounded-xl bg-primary-50 text-primary">
                    <feature.icon size={20} />
                  </span>
                  <h3 className="relative mt-4 font-bold">{feature.title}</h3>
                  <p className="relative mt-2 text-sm leading-relaxed text-muted">{feature.text}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-20 overflow-hidden rounded-2xl border border-line bg-surface-2 py-8">
            <p className="mb-6 text-center text-[10px] font-bold uppercase tracking-[0.25em] text-muted">
              Topics you can learn
            </p>
            <div className="marquee-viewport px-2">
              <div className="marquee-track">
                {[...MARQUEE_TECH, ...MARQUEE_TECH].map((id, index) => (
                  <span
                    key={`${id}-${index}`}
                    className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-2.5 shadow-sm"
                  >
                    <TechLogo topicId={id} size={18} />
                    <span className="text-sm font-semibold capitalize">{id === "htmlcss" ? "HTML & CSS" : id}</span>
                  </span>
                ))}
              </div>
            </div>
          </section>

          <section className="landing-cta mt-20 overflow-hidden rounded-3xl border border-primary-200/60 bg-gradient-to-br from-primary-50 via-white to-white p-8 text-center sm:p-12">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Ready to enter the academy?</h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-muted">
              Create your hero, pick a path, and start earning XP in minutes.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition hover:bg-primary-hover"
              >
                Create account
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/login"
                className="rounded-full border border-line bg-white px-8 py-3.5 text-sm font-bold transition hover:border-primary-200"
              >
                I have an account
              </Link>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
