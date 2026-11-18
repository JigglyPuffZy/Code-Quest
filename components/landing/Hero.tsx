"use client";

import "./hero.css";
import { TechLogo } from "@/components/icons/TechLogo";
import { ArrowRight, BookOpen, CheckCircle2, Flame, ShieldCheck, Sparkles, Swords, Trophy, Zap } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

type Token = { t: string; c?: string };

/** The snippet that "types itself" inside the editor card. */
const CODE: Token[][] = [
  [{ t: "# Sum every even number in a list", c: "c" }],
  [{ t: "def ", c: "k" }, { t: "sum_even", c: "f" }, { t: "(nums):" }],
  [{ t: "    total = " }, { t: "0", c: "n" }],
  [{ t: "    for ", c: "k" }, { t: "n " }, { t: "in ", c: "k" }, { t: "nums:" }],
  [{ t: "        if ", c: "k" }, { t: "n % " }, { t: "2", c: "n" }, { t: " == " }, { t: "0", c: "n" }, { t: ":" }],
  [{ t: "            total += n" }],
  [{ t: "    return ", c: "k" }, { t: "total" }],
];
/** Precomputed character offsets so rendering stays a pure function of `typed`. */
const LAYOUT = (() => {
  let offset = 0;
  return CODE.map((line) => {
    const start = offset;
    const tokens = line.map((tok) => {
      const item = { ...tok, start: offset };
      offset += tok.t.length;
      return item;
    });
    return { start, end: offset, tokens };
  });
})();
const TOTAL_CHARS = LAYOUT[LAYOUT.length - 1].end;
const TESTS = ["Handles an empty list", "Ignores odd numbers", "Works with negative numbers"];
const TECH = ["python", "javascript", "typescript", "java", "react", "htmlcss", "sql", "mysql", "postgresql", "mongodb"] as const;
const WORDS_1 = ["Learn", "to", "code."];
const WORDS_2 = ["Level", "up", "for", "real."];

/** Deterministic pseudo-random so server and client render identical stars. */
function rand(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}
const STARS = Array.from({ length: 44 }, (_, i) => ({
  left: `${Math.round(rand(i + 1) * 1000) / 10}%`,
  top: `${Math.round(rand(i + 77) * 1000) / 10}%`,
  size: 1 + Math.round(rand(i + 191) * 2),
  delay: `${Math.round(rand(i + 311) * 60) / 10}s`,
  dur: `${3 + Math.round(rand(i + 523) * 40) / 10}s`,
}));

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";
function subscribeReduced(callback: () => void) {
  const query = window.matchMedia(REDUCED_QUERY);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}
function useReducedMotion() {
  return useSyncExternalStore(subscribeReduced, () => window.matchMedia(REDUCED_QUERY).matches, () => false);
}

type HeroProps = { enter: string; ready: boolean; email: string | null | undefined; supabaseEnabled: boolean };

export function Hero({ enter, ready, email, supabaseEnabled }: HeroProps) {
  const root = useRef<HTMLElement>(null);
  const [typedRaw, setTyped] = useState(0);
  const [testsRaw, setTestsDone] = useState(0);
  const reduced = useReducedMotion();
  const typed = reduced ? TOTAL_CHARS : typedRaw;
  const testsDone = reduced ? TESTS.length : testsRaw;

  /* Cursor spotlight + parallax: write CSS variables only, no React re-renders. */
  useEffect(() => {
    const node = root.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const onMove = (event: PointerEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const rect = node.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        node.style.setProperty("--px", `${x}px`);
        node.style.setProperty("--py", `${y}px`);
        node.style.setProperty("--mx", String(x / rect.width - 0.5));
        node.style.setProperty("--my", String(y / rect.height - 0.5));
      });
    };
    const onLeave = () => {
      node.style.setProperty("--mx", "0");
      node.style.setProperty("--my", "0");
    };
    node.addEventListener("pointermove", onMove);
    node.addEventListener("pointerleave", onLeave);
    return () => {
      node.removeEventListener("pointermove", onMove);
      node.removeEventListener("pointerleave", onLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  /* The editor demo: type the code, run the tests, fill the XP bar, then loop. */
  useEffect(() => {
    if (reduced) return;
    const timers: number[] = [];
    let interval = 0;
    const later = (fn: () => void, ms: number) => { timers.push(window.setTimeout(fn, ms)); };
    const run = () => {
      setTyped(0);
      setTestsDone(0);
      later(() => {
        let count = 0;
        interval = window.setInterval(() => {
          count += 2;
          setTyped(Math.min(count, TOTAL_CHARS));
          if (count >= TOTAL_CHARS) {
            window.clearInterval(interval);
            TESTS.forEach((_, i) => later(() => setTestsDone(i + 1), 650 + i * 650));
            later(run, 650 + TESTS.length * 650 + 4200);
          }
        }, 38);
      }, 900);
    };
    run();
    return () => {
      timers.forEach((id) => window.clearTimeout(id));
      window.clearInterval(interval);
    };
  }, [reduced]);

  const typing = typed < TOTAL_CHARS;
  const xpPct = reduced ? 100 : Math.round((testsDone / TESTS.length) * 100);

  return (
    <section ref={root} className="hx" aria-labelledby="hero-title">
      {/* Atmosphere */}
      <div className="hx-aurora" aria-hidden>
        <span className="hx-blob hx-blob-a" />
        <span className="hx-blob hx-blob-b" />
        <span className="hx-blob hx-blob-c" />
      </div>
      <div className="hx-grid" aria-hidden />
      <div className="hx-spotlight" aria-hidden />
      <div className="hx-stars" aria-hidden>
        {STARS.map((star, i) => (
          <i key={i} style={{ left: star.left, top: star.top, width: star.size, height: star.size, animationDelay: star.delay, animationDuration: star.dur }} />
        ))}
      </div>

      <div className="hx-inner">
        {/* Copy */}
        <div className="hx-copy">
          <p className="hx-badge hx-in" style={{ "--d": "0ms" } as React.CSSProperties}>
            <span className="hx-badge-tag">New</span>
            <span className="hx-live" aria-hidden />
            Live 1v1 coding duels
          </p>

          <h1 id="hero-title" className="hx-title">
            <span className="hx-line">
              {WORDS_1.map((word, i) => (
                <span key={word} className="hx-word" style={{ "--i": i } as React.CSSProperties}>{word}</span>
              ))}
            </span>
            <span className="hx-line hx-shimmer">
              {WORDS_2.map((word, i) => (
                <span key={word} className="hx-word" style={{ "--i": i + WORDS_1.length } as React.CSSProperties}>{word}</span>
              ))}
            </span>
          </h1>

          <p className="hx-lead hx-in" style={{ "--d": "700ms" } as React.CSSProperties}>
            Short guides, real tests and live duels in one playful place. Earn XP, protect your streak and
            watch your skills climb.
          </p>

          <div className="hx-cta hx-in" style={{ "--d": "850ms" } as React.CSSProperties}>
            <Link href={enter} className="hx-btn hx-btn-primary">
              <span>{ready && email ? "Continue learning" : "Start for free"}</span>
              <ArrowRight size={18} />
            </Link>
            {ready && email ? (
              <Link href="/leaderboard" className="hx-btn hx-btn-glass"><Swords size={17} />Find a duel</Link>
            ) : supabaseEnabled ? (
              <Link href="/login" className="hx-btn hx-btn-glass">I have an account</Link>
            ) : (
              <a href="#how" className="hx-btn hx-btn-glass">See how it works</a>
            )}
          </div>

          <ul className="hx-trust hx-in" style={{ "--d": "1000ms" } as React.CSSProperties}>
            <li><CheckCircle2 size={15} aria-hidden />Free to start</li>
            <li><ShieldCheck size={15} aria-hidden />Server-graded answers</li>
            <li><Sparkles size={15} aria-hidden />Runs in your browser</li>
          </ul>
        </div>

        {/* Stage */}
        <div className="hx-stage" aria-hidden>
          <span className="hx-orbit hx-orbit-a"><i /></span>
          <span className="hx-orbit hx-orbit-b"><i /></span>

          <div className="hx-card-wrap">
            <div className="hx-card">
              <div className="hx-card-bar">
                <i /><i /><i />
                <span>sum_even.py</span>
                <em><span className="hx-live" />Python</em>
              </div>
              <pre className="hx-code">
                {LAYOUT.map((line, li) => {
                  const holdsCaret = typed > line.start && typed <= line.end && (typing || li === LAYOUT.length - 1);
                  return (
                    <div key={li} className="hx-codeline">
                      <b>{li + 1}</b>
                      <span>
                        {line.tokens.map((tok, ti) => {
                          const part = tok.t.slice(0, Math.max(0, typed - tok.start));
                          return part ? <span key={ti} className={tok.c}>{part}</span> : null;
                        })}
                        {holdsCaret ? <u className={typing ? "hx-caret is-typing" : "hx-caret"} /> : null}
                      </span>
                    </div>
                  );
                })}
              </pre>
              <div className="hx-tests">
                {TESTS.map((label, i) => {
                  const done = testsDone > i;
                  return (
                    <div key={label} className={done ? "hx-test is-pass" : "hx-test"}>
                      <span className="hx-test-ic">{done ? <CheckCircle2 size={16} /> : <span className="hx-spin" />}</span>
                      {label}
                      <em>{done ? "passed" : typing ? "waiting" : "running"}</em>
                    </div>
                  );
                })}
              </div>
              <div className="hx-xp">
                <Zap size={16} />
                <span className="hx-xp-num">+{Math.round((xpPct / 100) * 40)} XP</span>
                <span className="hx-xp-bar"><i style={{ width: `${xpPct}%` }} /></span>
                <span>Level 4</span>
              </div>
            </div>
          </div>

          <div className="hx-chip hx-chip-a" style={{ "--depth": 34 } as React.CSSProperties}>
            <span className="hx-chip-ic hx-ic-amber"><Flame size={17} /></span>
            <span>7-day streak<small>Keep it going</small></span>
          </div>
          <div className="hx-chip hx-chip-b" style={{ "--depth": -26 } as React.CSSProperties}>
            <span className="hx-chip-ic hx-ic-pink"><Swords size={17} /></span>
            <span>Duel invite<small>coder42 challenged you</small></span>
          </div>
          <div className="hx-chip hx-chip-c" style={{ "--depth": 22 } as React.CSSProperties}>
            <span className="hx-chip-ic hx-ic-cyan"><Trophy size={17} /></span>
            <span>Rank #12<small>Up 5 places this week</small></span>
          </div>
          <div className="hx-chip hx-chip-d" style={{ "--depth": -38 } as React.CSSProperties}>
            <span className="hx-chip-ic hx-ic-green"><BookOpen size={17} /></span>
            <span>Lesson complete<small>Loops and lists</small></span>
          </div>
        </div>
      </div>

      {/* Tech marquee */}
      <div className="hx-marquee" aria-label="Languages and tools you can learn">
        <div className="hx-marquee-track">
          {[...TECH, ...TECH].map((id, i) => (
            <span key={`${id}-${i}`} className="hx-tech" aria-hidden={i >= TECH.length}>
              <TechLogo topicId={id} size={20} />
              {id === "htmlcss" ? "HTML & CSS" : id}
            </span>
          ))}
        </div>
      </div>

    </section>
  );
}
