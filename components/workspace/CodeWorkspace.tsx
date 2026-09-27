"use client";

import { Button } from "@/components/ui/Button";
import { CodeEditor } from "@/components/workspace/CodeEditor";
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
}: {
  language: LanguageId;
  starterCode: string;
  kind: "lesson" | "challenge";
  exerciseId: string;
  alreadyCleared: boolean;
  onCleared: () => { awarded: boolean; xp: number };
}) {
  const [code, setCode] = useState(starterCode);
  const [running, setRunning] = useState<"run" | "grade" | null>(null);
  const [output, setOutput] = useState<RunResponse | null>(null);
  const [grade, setGrade] = useState<GradeResponse | null>(null);
  const [error, setError] = useState("");
  const [rewardNote, setRewardNote] = useState("");

  async function execute(mode: "run" | "grade") {
    setRunning(mode);
    setError("");
    setRewardNote("");
    try {
      if (mode === "run") {
        setOutput(await runCode(language, code));
      } else {
        const result = await gradeCode(kind, exerciseId, code);
        setGrade(result);
        if (result.passed) {
          const reward = onCleared();
          setRewardNote(reward.awarded ? `Passed · +${reward.xp} XP` : "Passed · XP already awarded");
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
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="tag font-mono">{language}</p>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={() => void execute("run")} disabled={running !== null}>
            <Play size={14} />
            {running === "run" ? "Running…" : "Run"}
          </Button>
          <Button onClick={() => void execute("grade")} disabled={running !== null}>
            <Terminal size={14} />
            {running === "grade" ? "Checking…" : alreadyCleared ? "Recheck" : "Submit"}
          </Button>
        </div>
      </div>
      <CodeEditor code={code} language={language} onChange={setCode} onSubmit={() => void execute("grade")} />
      <p className="text-[11px] text-muted">Runs in a real sandbox. XP only when all checks pass.</p>
      <div className="overflow-hidden rounded-xl border border-line bg-surface-2" aria-live="polite">
        <div className="flex items-center gap-2 border-b border-line px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted">
          <Terminal size={12} />
          Output
        </div>
        <div className="space-y-2 px-3 py-3 font-mono text-xs leading-5">
          {running ? <p className="text-primary">Running…</p> : null}
          {error ? <p className="text-danger">{error}</p> : null}
          {rewardNote ? <p className="font-semibold text-primary">{rewardNote}</p> : null}
          {output ? (
            <div>
              <pre className="whitespace-pre-wrap text-ink">{output.stdout || "(no output)"}</pre>
              {output.stderr ? <pre className="mt-1 whitespace-pre-wrap text-danger">{output.stderr}</pre> : null}
            </div>
          ) : null}
          {grade ? (
            <ul className="space-y-1.5">
              {grade.tests.map((test) => (
                <li key={test.name} className="rounded-lg border border-line bg-surface px-2.5 py-2">
                  <p className={test.passed ? "flex items-center gap-1 text-ok" : "flex items-center gap-1 text-danger"}>
                    {test.passed ? <Check size={12} /> : <X size={12} />}
                    {test.name}
                  </p>
                </li>
              ))}
            </ul>
          ) : null}
          {!running && !error && !output && !grade ? <p className="text-muted">Run or submit to see results.</p> : null}
        </div>
      </div>
    </div>
  );
}
