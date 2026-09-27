"use client";

import { useEffect, useState } from "react";

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

const CODE_LINES = [
  'hero = "CodeQuest"',
  "level = 1",
  "xp += 50",
  'print("Welcome back!")',
];

export function useAuthHeroMotion() {
  const [xpPercent, setXpPercent] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [typedLines, setTypedLines] = useState(0);
  const [typedChars, setTypedChars] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const duration = 1600;
    let frame = 0;

    const tickXp = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setXpPercent(Math.round(62 * easeOutCubic(t)));
      if (t < 1) frame = requestAnimationFrame(tickXp);
    };
    frame = requestAnimationFrame(tickXp);
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const stepTimer = window.setInterval(() => {
      setActiveStep((current) => (current + 1) % 3);
    }, 2600);
    return () => window.clearInterval(stepTimer);
  }, []);

  useEffect(() => {
    const line = CODE_LINES[typedLines];
    if (!line) return;

    if (typedChars < line.length) {
      const timer = window.setTimeout(() => setTypedChars((c) => c + 1), 34);
      return () => window.clearTimeout(timer);
    }

    if (typedLines < CODE_LINES.length - 1) {
      const timer = window.setTimeout(() => {
        setTypedLines((l) => l + 1);
        setTypedChars(0);
      }, 280);
      return () => window.clearTimeout(timer);
    }

    const resetTimer = window.setTimeout(() => {
      setTypedLines(0);
      setTypedChars(0);
    }, 3200);
    return () => window.clearTimeout(resetTimer);
  }, [typedLines, typedChars]);

  const currentTyping = CODE_LINES[typedLines]?.slice(0, typedChars) ?? "";
  const showCursor = typedLines < CODE_LINES.length;

  return {
    xpPercent,
    activeStep,
    codeLines: CODE_LINES,
    typedLines,
    currentTyping,
    showCursor,
  };
}
