import type { SkillDifficulty } from "@/lib/difficulty";
import type { GradeProgress } from "@/lib/execute/grade-progress";
import { readGradeStream } from "@/lib/execute/read-stream";
import type { GameStackPrefs } from "@/lib/game/banks";
import type { GradeResponse, LanguageId, RunResponse } from "@/lib/types";

async function post(body: unknown, signal?: AbortSignal) {
  const response = await fetch("/api/execute", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal,
  });
  const data = (await response.json().catch(() => ({}))) as { error?: string };
  if (!response.ok) {
    throw new Error(data.error || "The sandbox could not run your code. Nothing was marked correct.");
  }
  return data;
}

export async function runCode(language: LanguageId, code: string, signal?: AbortSignal) {
  return (await post({ mode: "run", language, code }, signal)) as RunResponse;
}

export async function runVisibleTests(
  kind: "lesson" | "challenge" | "game" | "guide",
  id: string,
  code: string,
  difficulty?: SkillDifficulty,
  stack?: GameStackPrefs,
  signal?: AbortSignal,
) {
  return (await post({ mode: "run-tests", kind, id, code, difficulty, stack }, signal)) as GradeResponse;
}

export async function gradeCode(
  kind: "lesson" | "challenge" | "game" | "guide",
  id: string,
  code: string,
  difficulty?: SkillDifficulty,
  stack?: GameStackPrefs,
  signal?: AbortSignal,
  onProgress?: (progress: GradeProgress) => void,
) {
  const response = await fetch("/api/execute", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mode: "grade", kind, id, code, difficulty, stack, stream: true }),
    signal,
  });

  if (!response.ok) {
    const data = (await response.json().catch(() => ({}))) as { error?: string };
    throw new Error(data.error || "The sandbox could not run your code. Nothing was marked correct.");
  }

  return readGradeStream(response, onProgress);
}
