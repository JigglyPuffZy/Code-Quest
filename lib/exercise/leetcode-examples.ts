import type { Exercise, FunctionCase, TestSpec } from "@/lib/types";

export function formatExampleValue(value: unknown): string {
  return JSON.stringify(value);
}

/** Pull parameter names from starter code for LeetCode-style input lines. */
export function parseParamNames(starterCode: string): string[] {
  const match =
    /def\s+\w+\s*\(([^)]*)\)/.exec(starterCode) ??
    /function\s+\w+\s*\(([^)]*)\)/.exec(starterCode) ??
    /public\s+static\s+\w+\s+\w+\s*\(([^)]*)\)/.exec(starterCode);

  if (!match?.[1]?.trim()) return [];

  return match[1]
    .split(",")
    .map((part) => part.trim().split(":")[0]?.split("=")[0]?.trim() ?? "")
    .filter(Boolean);
}

export function formatExampleInput(functionName: string, paramNames: string[], args: unknown[]): string {
  if (args.length === 0) return `${functionName}()`;

  const parts = args.map((arg, index) => {
    const name = paramNames[index] ?? `arg${index + 1}`;
    return `${name} = ${formatExampleValue(arg)}`;
  });

  return parts.join("\n");
}

export function formatExampleOutput(expected: unknown): string {
  if (typeof expected === "string" && expected.includes("\n")) {
    return expected;
  }
  return formatExampleValue(expected);
}

export function visibleExampleCases(tests: TestSpec, limit = 3): FunctionCase[] {
  if (tests.type !== "function") return [];
  return tests.cases.slice(0, Math.min(limit, tests.cases.length));
}

export function hiddenTestCount(exercise: Exercise): number {
  const visible =
    exercise.tests.type === "function" ? visibleExampleCases(exercise.tests).length : 1;
  const totalVisible =
    exercise.tests.type === "function" ? exercise.tests.cases.length : 1;
  const extraSubmit = Math.max(0, totalVisible - visible);
  const perf = exercise.performance?.cases.length ?? 0;
  return extraSubmit + perf;
}
