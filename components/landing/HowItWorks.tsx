"use client";

import "./how.css";
import { ArrowRight, BookOpen, Check, CheckCircle2, Clock, Code2, Flame, Lightbulb, Play, Trophy, Zap } from "lucide-react";
import { useEffect, useState, useSyncExternalStore, type CSSProperties } from "react";

const STEP_MS = 7000;

const STEPS = [
  {
    id: "learn",
    icon: BookOpen,
    title: "Learn the concept",
    text: "Short guides in plain English, with clear examples.",
    points: ["Lessons you can finish in minutes", "Examples to read and copy", "Practice questions after every lesson"],
  },
  {
    id: "practice",
    icon: Code2,
    title: "Practice with real tests",
    text: "Write code in your browser and run it against sample tests.",
    points: ["Run the tests before you submit", "Graded on the server, so results are fair", "Hints when you get stuck"],
  },
  {
    id: "level",
    icon: Trophy,
    title: "Build and level up",
    text: "Earn XP, keep your streak and challenge other learners.",
    points: ["XP, levels and badges for every win", "Live 1v1 duels with a timer", "Climb the leaderboard"],
  },
] as const;

const REDUCED = "(prefers-reduced-motion: reduce)";
function useReducedMotion() {
  return useSyncExternalStore(
    (callback) => {
      const query = window.matchMedia(REDUCED);
      query.addEventListener("change", callback);
      return () => query.removeEventListener("change", callback);
    },
    () => window.matchMedia(REDUCED).matches,
    () => false,
  );
}

function LearnPanel() {
  return (
    <div className="hw-ui">
      <div className="hw-ui-top">
        <span className="hw-chip"><BookOpen size={13} />Lesson 3 of 8</span>
        <span className="hw-chip hw-chip-soft"><Clock size={13} />5 min</span>
      </div>
      <h4>Loops: do it once, repeat it for free</h4>
      <p>A loop runs the same steps for every item in a list, so you write less code and make fewer mistakes.</p>
      <pre className="hw-code"><span className="k">for</span> fruit <span className="k">in</span> fruits:{"\n"}{"    "}<span className="f">print</span>(fruit)</pre>
      <div className="hw-quiz">
        <p className="hw-quiz-q"><Lightbulb size={14} />Quick check: what does this print?</p>
        <div className="hw-option">Only the first fruit</div>
        <div className="hw-option is-correct"><CheckCircle2 size={16} />Every fruit in the list<em>Correct</em></div>
        <div className="hw-option">Nothing at all</div>
      </div>
    </div>
  );
}

function PracticePanel() {
  return (
    <div className="hw-ui">
      <div className="hw-ui-top">
        <span className="hw-chip"><Code2 size={13} />sum_even.py</span>
        <span className="hw-run"><Play size={12} fill="currentColor" />Run tests</span>
      </div>
      <pre className="hw-code hw-code-lg"><span className="k">def</span> <span className="f">sum_even</span>(nums):{"\n"}{"    "}<span className="k">return</span> <span className="f">sum</span>(n <span className="k">for</span> n <span className="k">in</span> nums{"\n"}{"               "}<span className="k">if</span> n % <span className="n">2</span> == <span className="n">0</span>)</pre>
      <div className="hw-tests">
        {["Handles an empty list", "Ignores odd numbers", "Works with negative numbers"].map((label, i) => (
          <div className="hw-test" key={label} style={{ "--i": i } as CSSProperties}>
            <CheckCircle2 size={16} />{label}<em>Passed</em>
          </div>
        ))}
      </div>
      <div className="hw-result"><Check size={15} />All 3 tests passed. Ready to submit.</div>
    </div>
  );
}

function LevelPanel() {
  return (
    <div className="hw-ui">
      <div className="hw-level">
        <div className="hw-ring" aria-hidden><span><b>12</b>Level</span></div>
        <div className="hw-level-info">
          <strong>1,240 / 1,600 XP</strong>
          <span>360 XP to Level 13</span>
          <div className="hw-bar"><i /></div>
        </div>
        <span className="hw-xp-pop"><Zap size={14} />+120 XP</span>
      </div>
      <div className="hw-stats">
        <div><Flame size={18} /><b>7 days</b><span>Streak</span></div>
        <div><Trophy size={18} /><b>#12</b><span>This week</span></div>
        <div><Zap size={18} /><b>8</b><span>Badges</span></div>
      </div>
      <div className="hw-board">
        <p>Leaderboard</p>
        {[["1", "alex.codes", "2,140"], ["2", "mia.dev", "1,870"], ["3", "you", "1,240"]].map(([rank, name, xp]) => (
          <div key={name} className={name === "you" ? "hw-row is-you" : "hw-row"}><span>{rank}</span><b>{name}</b><em>{xp} XP</em></div>
        ))}
      </div>
    </div>
  );
}

const PANELS = [LearnPanel, PracticePanel, LevelPanel];

export function HowItWorks() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();

  // Auto-advance every few seconds; pauses while the user is interacting.
  useEffect(() => {
    if (reduced || paused) return;
    const timer = window.setTimeout(() => setActive((current) => (current + 1) % STEPS.length), STEP_MS);
    return () => window.clearTimeout(timer);
  }, [active, paused, reduced]);

  const Panel = PANELS[active];

  return (
    <section id="how" className="hw" aria-labelledby="how-title">
      <div className="hw-wrap">
        <div className="lp-head-center hw-head">
          <p className="lp-eyebrow">How it works</p>
          <h2 id="how-title" className="lp-h2">Three steps. One simple loop.</h2>
          <p className="lp-sub">Learn something, prove it with real tests, then level up. Repeat, and watch your skills grow.</p>
        </div>

        <div
          className="hw-grid"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <div className="hw-steps" role="tablist" aria-label="How Dev Ladder works" aria-orientation="vertical">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              const isActive = i === active;
              return (
                <button
                  key={step.id}
                  type="button"
                  role="tab"
                  id={`hw-tab-${step.id}`}
                  aria-selected={isActive}
                  aria-controls="hw-panel"
                  tabIndex={isActive ? 0 : -1}
                  className={isActive ? "hw-step is-active" : "hw-step"}
                  onClick={() => setActive(i)}
                  onKeyDown={(event) => {
                    if (event.key === "ArrowDown" || event.key === "ArrowRight") { event.preventDefault(); setActive((active + 1) % STEPS.length); }
                    if (event.key === "ArrowUp" || event.key === "ArrowLeft") { event.preventDefault(); setActive((active + STEPS.length - 1) % STEPS.length); }
                  }}
                >
                  <span className="hw-step-num"><Icon size={20} /></span>
                  <span className="hw-step-body">
                    <span className="hw-step-kicker">Step {i + 1}</span>
                    <strong>{step.title}</strong>
                    <span className="hw-step-text">{step.text}</span>
                    {isActive ? (
                      <ul className="hw-points">
                        {step.points.map((point) => <li key={point}><Check size={14} />{point}</li>)}
                      </ul>
                    ) : null}
                  </span>
                  {isActive && !reduced ? <span className="hw-timer" aria-hidden><i key={`${active}-${paused}`} style={{ animationPlayState: paused ? "paused" : "running" }} /></span> : null}
                </button>
              );
            })}
          </div>

          <div className="hw-stage" id="hw-panel" role="tabpanel" aria-labelledby={`hw-tab-${STEPS[active].id}`}>
            <div className="hw-stage-glow" aria-hidden />
            <div className="hw-window">
              <div className="hw-window-bar"><i /><i /><i /><span>Step {active + 1} of {STEPS.length}</span></div>
              <div key={active} className="hw-panel-in"><Panel /></div>
            </div>
          </div>
        </div>

        <p className="hw-foot">Ready to try step one? <a href="#tracks">Pick a course <ArrowRight size={14} /></a></p>
      </div>
    </section>
  );
}
