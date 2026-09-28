"use client";

import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { CodeEditor } from "@/components/workspace/CodeEditor";
import { cn } from "@/lib/cn";
import type { GradeProgress } from "@/lib/execute/grade-progress";
import { gradeCode, runCode } from "@/lib/execute/client";
import type { GradeResponse, LanguageId, RunResponse } from "@/lib/types";
import { Check, Play, Terminal, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function draftKey(kind: string, exerciseId: string, difficulty?: string) {
  const base = `codequest.draft.${kind}.${exerciseId}`;
  return difficulty ? `${base}.${difficulty}` : base;
}

export function CodeWorkspace({
  language,
  starterCode,
  kind,
  exerciseId,
  alreadyCleared,
  onCleared,
  skillDifficulty,
  gameStack,
  theme = "default",
  expectedTests,
}: {
  language: LanguageId;
  starterCode: string;
  kind: "lesson" | "challenge" | "game";
  exerciseId: string;
  alreadyCleared: boolean;
  onCleared: () => { awarded: boolean; xp: number };
  skillDifficulty?: import("@/lib/difficulty").SkillDifficulty;
  gameStack?: import("@/lib/game/banks").GameStackPrefs;
  theme?: "default" | "game";
  expectedTests?: number;
}) {
  const difficultyKey = skillDifficulty ?? "default";
  const [code, setCode] = useState(() => {
    if (typeof window === "undefined") return starterCode;
    return window.sessionStorage.getItem(draftKey(kind, exerciseId, difficultyKey)) ?? starterCode;
  });
  const [running, setRunning] = useState<"run" | "grade" | null>(null);
  const [output, setOutput] = useState<RunResponse | null>(null);
  const [grade, setGrade] = useState<GradeResponse | null>(null);
  const [error, setError] = useState("");
  const [rewardNote, setRewardNote] = useState("");
  const [gradeProgress, setGradeProgress] = useState<GradeProgress | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const isGame = theme === "game";

  useEffect(() => {
    const timer = window.setTimeout(() => {
      window.sessionStorage.setItem(draftKey(kind, exerciseId, difficultyKey), code);
    }, 400);
    return () => window.clearTimeout(timer);
  }, [code, kind, exerciseId, difficultyKey]);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  async function execute(mode: "run" | "grade") {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setRunning(mode);
    setError("");
    setRewardNote("");
    setGradeProgress(null);
    try {
      if (mode === "run") {
        setOutput(await runCode(language, code, controller.signal));
        setGrade(null);
      } else {
        setGradeProgress({ percent: 5, label: "Preparing your submission…", phase: "prepare" });
        const result = await gradeCode(
          kind,
          exerciseId,
          code,
          skillDifficulty,
          gameStack,
          controller.signal,
          (progress) => setGradeProgress(progress),
        );
        setGrade(result);
        setOutput(null);
        if (result.passed) {
          window.sessionStorage.removeItem(draftKey(kind, exerciseId, difficultyKey));
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              const reward = onCleared();
              setRewardNote(reward.awarded ? `Level cleared · +${reward.xp} XP` : "Passed · XP already awarded");
            });
          });
        }
      }
    } catch (runError) {
      if (runError instanceof Error && runError.name === "AbortError") return;
      setError(runError instanceof Error ? runError.message : "Could not run your code.");
    } finally {
      if (abortRef.current === controller) {
        abortRef.current = null;
        setRunning(null);
        setGradeProgress(null);
      }
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {!isGame ? (
          <p className="tag font-mono">{language}</p>
        ) : (
          <p className="hidden text-[11px] font-medium text-slate-400 sm:block">
            <kbd className="rounded border border-slate-700 bg-slate-800 px-1.5 py-0.5 font-mono text-[10px] text-slate-300">
              Ctrl
            </kbd>
            {" + "}
            <kbd className="rounded border border-slate-700 bg-slate-800 px-1.5 py-0.5 font-mono text-[10px] text-slate-300">
              Enter
            </kbd>
            <span className="ml-1.5 text-slate-500">to submit</span>
          </p>
        )}
        <div
          className={cn(
            "grid w-full grid-cols-2 gap-2 sm:inline-flex sm:w-auto sm:items-center sm:gap-1.5",
            isGame && "rounded-xl border border-slate-700 bg-slate-900/90 p-1.5 sm:p-1",
          )}
        >
          <Button
            variant={isGame ? "arena" : "ghost"}
            className="w-full px-3 py-2.5 text-sm shadow-none sm:w-auto sm:px-3.5"
            onClick={() => void execute("run")}
            disabled={running === "run"}
          >
            <Play size={15} className={isGame ? "text-cyan-300" : undefined} />
            {running === "run" ? "Running…" : "Run"}
          </Button>
          {running === "grade" ? (
            <Button
              variant="ghost"
              className="w-full px-3 py-2.5 text-sm sm:w-auto sm:px-3.5"
              onClick={() => abortRef.current?.abort()}
            >
              <X size={15} />
              Cancel
            </Button>
          ) : (
            <Button
              variant="primary"
              className="w-full px-3 py-2.5 text-sm shadow-md shadow-primary/30 sm:w-auto sm:px-3.5"
              onClick={() => void execute("grade")}
            >
              <Terminal size={15} />
              {alreadyCleared ? "Recheck" : "Submit"}
            </Button>
          )}
        </div>
      </div>
      <CodeEditor
        code={code}
        language={language}
        theme={theme}
        onChange={setCode}
        onSubmit={() => void execute("grade")}
      />
      <p className={cn("text-xs leading-relaxed sm:text-[11px]", isGame ? "text-slate-400" : "text-muted")}>
        {isGame
          ? "Real sandbox · tap Submit when ready · all checks must pass"
          : "Runs in a real sandbox. XP only when all checks pass."}
      </p>
      <div
        className={cn(
          "overflow-hidden rounded-xl border",
          isGame ? "border-slate-800 bg-slate-900" : "border-line bg-surface-2",
        )}
        aria-live="polite"
      >
        <div
          className={cn(
            "flex items-center gap-2 border-b px-3 py-2.5 text-[10px] font-semibold uppercase tracking-wider sm:py-2",
            isGame ? "border-slate-800 text-slate-400" : "border-line text-muted",
          )}
        >
          <Terminal size={12} />
          Output
        </div>
        <div className="space-y-2 px-3 py-3 font-mono text-xs leading-5 sm:px-4">
          {running === "grade" && gradeProgress ? (
            <div
              className={cn(
                "rounded-lg border px-3 py-3",
                isGame ? "border-slate-800 bg-slate-950" : "border-line bg-surface",
              )}
            >
              <div className="mb-2 flex items-center justify-between gap-3 text-[11px]">
                <span className={cn("font-medium", isGame ? "text-slate-200" : "text-ink")}>
                  {gradeProgress.label}
                </span>
                <span className={cn("tabular-nums font-bold", isGame ? "text-cyan-300" : "text-primary")}>
                  {gradeProgress.percent}%
                </span>
              </div>
              <ProgressBar
                value={gradeProgress.percent}
                label={gradeProgress.label}
                fast
                className={isGame ? "bg-slate-800" : undefined}
                barClassName={isGame ? "bg-gradient-to-r from-cyan-400 to-primary" : undefined}
              />
              {gradeProgress.totalTests ? (
                <p className={cn("mt-2 text-[10px]", isGame ? "text-slate-500" : "text-muted")}>
                  {gradeProgress.completedTests ?? 0} / {gradeProgress.totalTests} checks
                  {gradeProgress.phase === "performance" ? " · performance phase" : null}
                </p>
              ) : null}
            </div>
          ) : null}
          {running === "run" ? <p className={isGame ? "text-cyan-300" : "text-primary"}>Running…</p> : null}
          {error ? <p className="text-danger">{error}</p> : null}
          {rewardNote ? (
            <p className={cn("font-semibold", isGame ? "text-emerald-400" : "text-primary")}>{rewardNote}</p>
          ) : null}
          {output ? (
            <div>
              <pre className={cn("whitespace-pre-wrap break-words", isGame ? "text-slate-100" : "text-ink")}>
                {output.stdout || "(no output)"}
              </pre>
              {output.stderr ? (
                <pre className="mt-1 whitespace-pre-wrap break-words text-danger">{output.stderr}</pre>
              ) : null}
            </div>
          ) : null}
          {grade ? (
            <ul className="space-y-1.5">
              {grade.tests.map((test) => (
                <li
                  key={test.name}
                  className={cn(
                    "rounded-lg border px-3 py-2.5 sm:px-2.5 sm:py-2",
                    isGame ? "border-slate-800 bg-slate-950" : "border-line bg-surface",
                    test.kind === "performance" && !test.passed && "border-amber-300/60 bg-amber-50/80",
                  )}
                >
                  <p className={test.passed ? "flex items-center gap-1.5 text-ok" : "flex items-center gap-1.5 text-danger"}>
                    {test.passed ? <Check size={13} /> : <X size={13} />}
                    {test.name}
                  </p>
                  {!test.passed || test.kind === "performance" ? (
                    <p className="mt-1 text-[11px] text-muted">
                      {test.actual}
                      {!test.passed ? ` · expected ${test.expected}` : null}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : null}
          {!running && !error && !output && !grade ? (
            <p className={isGame ? "text-slate-500" : "text-muted"}>Run or submit to see results.</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
