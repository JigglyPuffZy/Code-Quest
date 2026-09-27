"use client";

import { Button } from "@/components/ui/Button";
import { CodeEditor } from "@/components/workspace/CodeEditor";
import { cn } from "@/lib/cn";
import { gradeCode, runCode } from "@/lib/execute/client";
import type { GradeResponse, LanguageId, RunResponse } from "@/lib/types";
import { Check, Play, Terminal, X } from "lucide-react";
import { useState } from "react";

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
}) {
  const [code, setCode] = useState(starterCode);
  const [running, setRunning] = useState<"run" | "grade" | null>(null);
  const [output, setOutput] = useState<RunResponse | null>(null);
  const [grade, setGrade] = useState<GradeResponse | null>(null);
  const [error, setError] = useState("");
  const [rewardNote, setRewardNote] = useState("");
  const isGame = theme === "game";

  async function execute(mode: "run" | "grade") {
    setRunning(mode);
    setError("");
    setRewardNote("");
    try {
      if (mode === "run") {
        setOutput(await runCode(language, code));
        setGrade(null);
      } else {
        const result = await gradeCode(kind, exerciseId, code, skillDifficulty, gameStack);
        setGrade(result);
        setOutput(null);
        if (result.passed) {
          const reward = onCleared();
          setRewardNote(reward.awarded ? `Level cleared · +${reward.xp} XP` : "Passed · XP already awarded");
        }
      }
    } catch (runError) {
      setError(runError instanceof Error ? runError.message : "Could not run your code.");
    } finally {
      setRunning(null);
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
            disabled={running !== null}
          >
            <Play size={15} className={isGame ? "text-cyan-300" : undefined} />
            {running === "run" ? "Running…" : "Run"}
          </Button>
          <Button
            variant="primary"
            className="w-full px-3 py-2.5 text-sm shadow-md shadow-primary/30 sm:w-auto sm:px-3.5"
            onClick={() => void execute("grade")}
            disabled={running !== null}
          >
            <Terminal size={15} />
            {running === "grade" ? "Checking…" : alreadyCleared ? "Recheck" : "Submit"}
          </Button>
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
          {running ? <p className={isGame ? "text-cyan-300" : "text-primary"}>Running…</p> : null}
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
                  )}
                >
                  <p className={test.passed ? "flex items-center gap-1.5 text-ok" : "flex items-center gap-1.5 text-danger"}>
                    {test.passed ? <Check size={13} /> : <X size={13} />}
                    {test.name}
                  </p>
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
