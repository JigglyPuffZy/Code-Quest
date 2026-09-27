import type { GradeResponse, LanguageId, RunResponse } from "@/lib/types";

async function post(body: unknown) {
  const response = await fetch("/api/execute", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = (await response.json().catch(() => ({}))) as { error?: string };
  if (!response.ok) {
    throw new Error(data.error || "The sandbox could not run your code. Nothing was marked correct.");
  }
  return data;
}

export async function runCode(language: LanguageId, code: string) {
  return (await post({ mode: "run", language, code })) as RunResponse;
}

export async function gradeCode(kind: "lesson" | "challenge", id: string, code: string) {
  return (await post({ mode: "grade", kind, id, code })) as GradeResponse;
}
