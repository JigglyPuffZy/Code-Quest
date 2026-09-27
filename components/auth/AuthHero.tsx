"use client";

import { CodeQuestMark } from "@/components/icons/CodeQuestMark";
import { TechLogo } from "@/components/icons/TechLogo";
import { useAuthHeroMotion } from "@/components/auth/useAuthHeroMotion";
import { cn } from "@/lib/cn";
import { BookOpen, Flame, Swords, Terminal, Trophy, Zap } from "lucide-react";

const STAT_CARDS = [
  { icon: Zap, label: "+50 XP", hint: "Last lesson", tone: "from-primary-500 to-primary-400", delay: "0.55s" },
  { icon: Flame, label: "7-day streak", hint: "Keep it alive", tone: "from-amber-500 to-orange-400", delay: "0.7s" },
  { icon: Trophy, label: "Quest cleared", hint: "Claim reward", tone: "from-violet-500 to-primary-400", delay: "0.85s" },
  { icon: Swords, label: "Arena ready", hint: "New battle", tone: "from-rose-500 to-pink-400", delay: "1s" },
] as const;

const STEPS = [
  { n: "1", title: "Read guides", text: "Learn the concept" },
  { n: "2", title: "Write code", text: "Pass real checks" },
  { n: "3", title: "Earn XP", text: "Level up & streak" },
];

const TECH = ["python", "javascript", "typescript", "java", "react", "sql"] as const;

const PARTICLES = [
  { left: "12%", top: "18%", size: 6, delay: "0s" },
  { left: "78%", top: "12%", size: 4, delay: "-2s" },
  { left: "88%", top: "42%", size: 5, delay: "-4s" },
  { left: "6%", top: "55%", size: 4, delay: "-1s" },
  { left: "72%", top: "68%", size: 7, delay: "-3s" },
  { left: "38%", top: "8%", size: 3, delay: "-5s" },
];

function highlightCode(line: string) {
  if (line.startsWith("print")) {
    return (
      <>
        <span className="text-sky-600">print</span>
        <span className="text-emerald-600">{line.slice(5)}</span>
      </>
    );
  }
  if (line.includes("+=")) {
    const [key, rest] = line.split("+=");
    return (
      <>
        <span className="text-violet-600">{key}</span>
        <span className="text-slate-400">+=</span>
        <span className="text-amber-600">{rest}</span>
      </>
    );
  }
  if (line.includes("=")) {
    const [key, rest] = line.split("=");
    return (
      <>
        <span className="text-violet-600">{key}</span>
        <span className="text-slate-400">=</span>
        <span className={rest.includes('"') ? "text-emerald-600" : "text-amber-600"}>{rest}</span>
      </>
    );
  }
  return <span>{line}</span>;
}

export function AuthHero({
  mode,
  className,
}: {
  mode: "login" | "signup" | "forgot";
  className?: string;
}) {
  const { xpPercent, activeStep, codeLines, typedLines, currentTyping, showCursor } = useAuthHeroMotion();

  const headline =
    mode === "login"
      ? { plain: "Continue your ", accent: "quest." }
      : mode === "signup"
        ? { plain: "Start your ", accent: "adventure." }
        : { plain: "Recover your ", accent: "account." };

  const sub =
    mode === "login"
      ? "Log in to pick up where you left off — paths, XP, and streaks saved."
      : mode === "signup"
        ? "Create a hero, choose a path, and start earning XP in minutes."
        : "Enter your username and we'll email you a secure reset link.";

  return (
    <div className={cn("auth-hero relative hidden overflow-hidden lg:block", className)}>
      <div className="auth-hero-mesh pointer-events-none absolute inset-0" aria-hidden />
      <div className="auth-hero-grid auth-hero-grid-drift pointer-events-none absolute inset-0" aria-hidden />
      <div className="auth-hero-glow auth-hero-glow-a pointer-events-none absolute -left-16 top-10 h-96 w-96 rounded-full" aria-hidden />
      <div className="auth-hero-glow auth-hero-glow-b pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full" aria-hidden />
      <div className="auth-hero-glow auth-hero-glow-c pointer-events-none absolute left-[40%] top-[35%] h-56 w-56 rounded-full" aria-hidden />

      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className="auth-particle pointer-events-none absolute rounded-full bg-primary/30"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            animationDelay: p.delay,
          }}
          aria-hidden
        />
      ))}

      <div className="auth-bento relative mx-auto flex h-full min-h-screen max-w-2xl flex-col gap-6 px-8 py-10 xl:px-10 xl:py-12">
        <div className="auth-rise auth-rise-1 flex items-center justify-between gap-4">
          <span className="auth-pill tag auth-tag-glow inline-flex items-center gap-2 py-1.5 pl-1.5 pr-3">
            <CodeQuestMark size={24} />
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary">Academy</span>
          </span>
          <span className="auth-level-pill inline-flex items-center gap-2 rounded-full border border-primary-200 bg-white/90 px-3 py-1.5 text-xs font-bold text-primary shadow-sm">
            <span className="auth-level-badge relative grid h-6 w-6 place-items-center rounded-full bg-primary text-[10px] text-white">
              1
            </span>
            Level 1 · Initiate
          </span>
        </div>

        <div className="auth-rise auth-rise-2">
          <h2 className="text-[2.1rem] font-extrabold leading-[1.1] tracking-tight text-ink xl:text-[2.5rem]">
            {headline.plain}
            <span className="auth-gradient-text auth-gradient-animate">{headline.accent}</span>
          </h2>
          <p className="auth-sub-fade mt-3 max-w-lg text-[15px] leading-relaxed text-muted">{sub}</p>
        </div>

        <div className="auth-rise auth-rise-2 grid grid-cols-3 gap-2">
          {STEPS.map((step, index) => (
            <div
              key={step.n}
              className={cn(
                "auth-step-card rounded-xl border bg-white/80 px-3 py-3 shadow-sm transition-all duration-500",
                activeStep === index
                  ? "auth-step-active border-primary-300 shadow-md shadow-primary/10"
                  : "border-line/80",
              )}
              style={{ animationDelay: `${0.2 + index * 0.1}s` }}
            >
              <span
                className={cn(
                  "grid h-6 w-6 place-items-center rounded-lg text-[11px] font-bold transition-colors duration-500",
                  activeStep === index ? "bg-primary text-white" : "bg-primary-50 text-primary",
                )}
              >
                {step.n}
              </span>
              <p className="mt-2 text-xs font-bold text-ink">{step.title}</p>
              <p className="mt-0.5 text-[10px] text-muted">{step.text}</p>
            </div>
          ))}
        </div>

        <div className="auth-rise auth-rise-3 grid min-h-0 flex-1 grid-cols-[1.15fr_0.85fr] gap-4">
          <div className="auth-terminal-wrap relative flex items-center justify-center">
            <div className="auth-terminal-ring pointer-events-none absolute inset-4 rounded-3xl" aria-hidden />
            <div className="auth-terminal-tilt w-full">
              <div className="auth-terminal auth-terminal-shine relative overflow-hidden rounded-2xl border border-white/80 bg-white shadow-2xl shadow-primary/20">
                <div className="flex items-center justify-between border-b border-line/60 bg-slate-50/90 px-4 py-2.5">
                  <div className="flex gap-1.5">
                    <span className="auth-dot h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                    <span className="auth-dot h-2.5 w-2.5 rounded-full bg-[#febc2e]" style={{ animationDelay: "0.15s" }} />
                    <span className="auth-dot h-2.5 w-2.5 rounded-full bg-[#28c840]" style={{ animationDelay: "0.3s" }} />
                  </div>
                  <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-muted">
                    quest_terminal.py
                  </span>
                  <span className="w-8" />
                </div>
                <div className="bg-[#f8f9ff] px-4 py-4">
                  <pre className="font-mono text-[12px] leading-7 sm:text-[13px]">
                    {codeLines.slice(0, typedLines).map((line) => (
                      <div key={line} className="auth-code-line-done flex">
                        <span className="mr-2 text-primary-300">›</span>
                        <span>{highlightCode(line)}</span>
                      </div>
                    ))}
                    {showCursor ? (
                      <div className="flex items-center">
                        <span className="mr-2 text-primary-300">›</span>
                        <span>{highlightCode(currentTyping)}</span>
                        <span className="auth-cursor ml-0.5 inline-block h-[1em] w-1.5 rounded-sm bg-primary" />
                      </div>
                    ) : null}
                  </pre>
                  <div className="auth-xp-panel mt-4 rounded-xl border border-primary-100 bg-white p-3">
                    <div className="mb-1.5 flex justify-between text-[10px] font-semibold">
                      <span className="text-muted">Progress to Level 2</span>
                      <span className="auth-xp-count text-primary tabular-nums">{xpPercent}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="auth-xp-bar auth-xp-fill h-full rounded-full"
                        style={{ width: `${xpPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            {STAT_CARDS.map((card, index) => (
              <div
                key={card.label}
                className="auth-stat-card auth-stat-slide group flex flex-1 items-center gap-3 rounded-2xl border border-line/70 bg-white/95 p-3 shadow-sm transition hover:-translate-y-1 hover:border-primary-200 hover:shadow-lg"
                style={{ animationDelay: card.delay }}
              >
                <span
                  className={cn(
                    "auth-stat-icon grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br text-white shadow-sm",
                    card.tone,
                  )}
                  style={{ animationDelay: `${0.6 + index * 0.15}s` }}
                >
                  <card.icon size={18} />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-ink">{card.label}</p>
                  <p className="text-[10px] text-muted">{card.hint}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="auth-rise auth-rise-3 shrink-0">
          <p className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.22em] text-muted">Pick a path</p>
          <div className="flex flex-wrap gap-2">
            {TECH.map((id, index) => (
              <span
                key={id}
                className="auth-tech-chip auth-tech-pop inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-2 text-xs font-bold shadow-sm transition hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-md"
                style={{ animationDelay: `${0.9 + index * 0.06}s` }}
              >
                <TechLogo topicId={id} size={16} />
                {id === "sql" ? "SQL" : id.charAt(0).toUpperCase() + id.slice(1)}
              </span>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-4 border-t border-line/60 pt-4">
            {[
              { icon: BookOpen, label: "23 full guides" },
              { icon: Terminal, label: "Sandbox checks" },
              { icon: Zap, label: "XP & quests" },
            ].map(({ icon: Icon, label }, index) => (
              <span
                key={label}
                className="auth-footer-stat inline-flex items-center gap-2 text-xs font-medium text-muted"
                style={{ animationDelay: `${1.1 + index * 0.08}s` }}
              >
                <Icon size={14} className="auth-footer-icon text-primary" />
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
