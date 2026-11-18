"use client";

import { useEffect, useRef } from "react";
import { ArrowUpRight, Award, BookOpen, Check, CheckCircle2, ChevronRight, Code2, Flame, Play, Swords, Terminal, Trophy, Zap } from "lucide-react";
import "./features.css";
import "./features-fx.css";

function WindowBar({ title, badge }: { title: string; badge?: string }) {
  return <div className="ft-window-bar"><span className="ft-dots"><i /><i /><i /></span><span>{title}</span>{badge && <small>{badge}</small>}</div>;
}

function LessonIllustration() {
  return <div className="ft-art ft-lesson" aria-hidden="true">
    <div className="ft-window ft-lesson-window">
      <WindowBar title="Your learning workspace" badge="PYTHON" />
      <div className="ft-lesson-layout">
        <div className="ft-syllabus"><small>THE FOUNDATIONS</small><strong>A little better.<br />Every lesson.</strong><div className="ft-course-row"><CheckCircle2 />Variables & types</div><div className="ft-course-row"><CheckCircle2 />Lists & collections</div><div className="ft-course-row ft-selected"><span>03</span>Loops that click<ChevronRight /></div><div className="ft-course-row ft-upcoming"><span>04</span>Your first function</div><div className="ft-course-progress"><span>Course progress <b>75%</b></span><div className="ft-progress"><i /></div></div></div>
        <div className="ft-lesson-content"><span className="ft-overline">LESSON 03 / 04</span><h4>Make repetition<br />work for you.</h4><p>One loop. Every item. Less code.</p><div className="ft-code-snippet"><code><span className="ft-pink">for</span> fruit <span className="ft-pink">in</span> fruits:<br />&nbsp;&nbsp;<span className="ft-blue">print</span>(fruit)</code></div><div className="ft-lesson-next"><span><BookOpen />Try it yourself</span><ArrowUpRight /></div></div>
      </div>
    </div>
    <div className="ft-float ft-lesson-float"><span className="ft-float-icon"><Check /></span><div><strong>That just clicked.</strong><small>Lesson complete · +40 XP</small></div><span className="ft-mini-spark">✦</span></div>
  </div>;
}

function TestingIllustration() {
  return <div className="ft-art ft-testing" aria-hidden="true"><div className="ft-window ft-editor">
    <WindowBar title="sum_even.py" badge="Python 3" />
    <div className="ft-editor-code"><div className="ft-line-numbers">1<br />2<br />3<br />4<br />5<br />6</div><pre><span className="ft-comment"># Small steps. Real results.</span>{"\n"}<span className="ft-pink">def</span> <span className="ft-blue">sum_even</span>(nums):{"\n"}{"  "}<span className="ft-pink">return</span> <span className="ft-blue">sum</span>(n <span className="ft-pink">for</span> n <span className="ft-pink">in</span> nums{"\n"}{"    "}<span className="ft-pink">if</span> n % <span className="ft-gold">2</span> == <span className="ft-gold">0</span>){"\n\n"}<span className="ft-blue">print</span>(sum_even([<span className="ft-gold">1, 2, 3, 4</span>]))</pre></div>
    <div className="ft-editor-actions"><span><Code2 />Ready when you are</span><span className="ft-run"><Play fill="currentColor" />Run code</span></div>
    <div className="ft-terminal"><div className="ft-terminal-label"><Terminal />TERMINAL<span>0.04s</span></div><code><span className="ft-green">❯</span> python sum_even.py<br /><b>6</b></code><div className="ft-test-list">{["Empty list", "Even numbers", "Negative values"].map((test, i) => <div className="ft-test-result" key={test} style={{ animationDelay: `${i * 180 + 400}ms` }}><CheckCircle2 /><span>{test}</span><small>Passed</small></div>)}</div><div className="ft-test-summary"><span className="ft-status-dot" />All 3 sample tests passed</div></div>
  </div><div className="ft-float ft-test-float"><CheckCircle2 /><span>Looks good. Ship it.</span></div></div>;
}

function DuelIllustration() {
  return <div className="ft-art ft-duel" aria-hidden="true"><div className="ft-duel-orbit" /><div className="ft-duel-top"><span><i />LIVE MATCH</span><span className="ft-timer">02:48</span></div><div className="ft-matchup"><div className="ft-player"><div className="ft-avatar ft-avatar-one">J<span /></div><strong>you</strong><small>Level 12</small></div><div className="ft-vs">VS<small>ROUND 2 / 3</small></div><div className="ft-player"><div className="ft-avatar ft-avatar-two">A<span /></div><strong>alex.codes</strong><small>Level 14</small></div></div><div className="ft-duel-task"><Code2 /><div><small>THE CHALLENGE</small><strong>Two Sum</strong></div><span>Medium</span></div><div className="ft-scoreboard"><div className="ft-score-head"><span>LIVE SCOREBOARD</span><Swords /></div><div className="ft-score-row ft-score-lead"><span>01</span><b>you</b><span className="ft-score-track"><i /></span><strong>240</strong></div><div className="ft-score-row"><span>02</span><b>alex.codes</b><span className="ft-score-track"><i /></span><strong>180</strong></div></div><div className="ft-duel-bottom"><span className="ft-status-dot" />Same challenge. Real competition.</div></div>;
}

function RewardsIllustration() {
  return <div className="ft-art ft-rewards" aria-hidden="true"><div className="ft-window ft-rewards-window"><WindowBar title="A little progress, every day" badge="YOUR JOURNEY" /><div className="ft-rewards-main"><div className="ft-level-panel"><div className="ft-level-heading"><span className="ft-level-badge"><Zap fill="currentColor" /></span><div><small>KEEP CLIMBING</small><strong>Level 12<span>Code explorer</span></strong></div><span className="ft-xp-earned">+120 XP ↗</span></div><div className="ft-xp-label"><span>1,240 / 1,600 XP</span><b>Next stop: Level 13</b></div><div className="ft-progress ft-xp-progress"><i /></div><div className="ft-reward-stats"><div><Flame /><strong>7 days</strong><small>On a roll</small></div><div><Trophy /><strong>#12</strong><small>This week</small></div><div><Award /><strong>8 badges</strong><small>Well earned</small></div></div><div className="ft-week">{"MTWTFSS".split("").map((day, i) => <span key={i}><Check />{day}</span>)}</div></div><div className="ft-quests-panel"><span className="ft-overline">TODAY’S SIDE QUESTS</span><div className="ft-quest"><span className="ft-quest-icon"><BookOpen /></span><div><strong>Feed your curiosity</strong><small>Complete one lesson</small></div><CheckCircle2 /></div><div className="ft-quest"><span className="ft-quest-icon"><Code2 /></span><div><strong>Put it into practice</strong><small>Pass 3 sample tests</small></div><CheckCircle2 /></div><div className="ft-quest-reward"><span><Zap />Quest complete</span><b>+60 XP</b></div><div className="ft-rank-rise"><Trophy /><span>You climbed 5 places<small>Your next milestone is closer.</small></span><ArrowUpRight /></div></div></div></div><div className="ft-float ft-badge-float"><span className="ft-award-medal"><Award /></span><div><small>NEW ACHIEVEMENT</small><strong>Consistency looks good on you.</strong></div></div></div>;
}

const features = [
  { id: "learning", label: "01 / GUIDED LEARNING", title: "Guides that explain, not overwhelm", description: "Plain-English lessons for languages, web and databases. Every lesson ends with practice questions and visible example tests, so you know you got it.", points: ["Plain English", "Examples included", "Quiz after each lesson"], Illustration: LessonIllustration },
  { id: "testing", label: "02 / CODE TESTING", title: "Run before you submit", description: "Try your code against sample tests first, then submit for the real grade.", points: ["Run unlimited tests", "Instant feedback", "Fair server grading"], Illustration: TestingIllustration },
  { id: "duels", label: "03 / LIVE 1V1 DUELS", title: "Live 1v1 duels", description: "Challenge rivals from the leaderboard. Pick the timer, series length and difficulty.", points: ["Same challenge", "Set your own timer", "Best-of series"], Illustration: DuelIllustration },
  { id: "rewards", label: "04 / MOMENTUM, BUILT IN", title: "XP, streaks and quests that keep you going", description: "Earn XP for every lesson and challenge, keep your streak alive, claim quest rewards and climb the leaderboard.", points: ["Daily streaks", "Quests and badges", "Live leaderboard"], Illustration: RewardsIllustration },
];

export function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        entry.target.classList.toggle("ft-in-view", entry.isIntersecting);
        if (entry.isIntersecting) entry.target.classList.add("ft-revealed");
      }
    }, { threshold: 0.12 });
    section.querySelectorAll("[data-ft-reveal]").forEach((card) => observer.observe(card));
    section.classList.add("ft-enhanced");
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !window.matchMedia("(hover: hover) and (prefers-reduced-motion: no-preference)").matches) return;
    let frame = 0;
    const cards = Array.from(section.querySelectorAll<HTMLElement>(".ft-card"));
    const move = (event: PointerEvent) => {
      const card = event.currentTarget as HTMLElement;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        card.style.setProperty("--cx", `${x}px`);
        card.style.setProperty("--cy", `${y}px`);
        card.style.setProperty("--ry", `${((x / rect.width) - 0.5) * 5}deg`);
        card.style.setProperty("--rx", `${((y / rect.height) - 0.5) * -4}deg`);
      });
    };
    const leave = (event: PointerEvent) => {
      const card = event.currentTarget as HTMLElement;
      card.style.setProperty("--rx", "0deg");
      card.style.setProperty("--ry", "0deg");
    };
    cards.forEach((card) => { card.addEventListener("pointermove", move); card.addEventListener("pointerleave", leave); });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      cards.forEach((card) => { card.removeEventListener("pointermove", move); card.removeEventListener("pointerleave", leave); });
    };
  }, []);

  return <section ref={sectionRef} id="features" className="ft-section" aria-labelledby="features-title"><div className="ft-wrap"><div className="ft-heading" data-ft-reveal><p className="ft-eyebrow"><span />BUILT FOR YOUR NEXT BREAKTHROUGH</p><h2 id="features-title">Everything you need<br />to <em>actually get good.</em></h2><p className="ft-intro">A single place to learn, practice and compete, without tabs, setup or guesswork.</p></div><div className="ft-grid">{features.map(({ id, label, title, description, points, Illustration }, index) => <article key={id} className={`ft-card ft-card-${id}`} data-ft-reveal aria-labelledby={`ft-${id}-title`} style={{ "--ft-delay": `${index * 110}ms` } as React.CSSProperties}><div className="ft-card-copy"><span className="ft-overline">{label}</span><h3 id={`ft-${id}-title`}>{title}</h3><p>{description}</p><ul className="ft-points">{points.map((point) => <li key={point}><Check />{point}</li>)}</ul></div><Illustration /></article>)}</div><div className="ft-footnote"><span><span className="ft-status-dot" />Less friction. More “I built that.”</span><span>LEARN. PRACTICE. COMPETE. REPEAT.</span></div></div></section>;
}
