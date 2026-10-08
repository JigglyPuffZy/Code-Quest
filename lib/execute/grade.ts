import { findExercise } from "@/lib/curriculum/index";
import type { SkillDifficulty } from "@/lib/difficulty";
import type { GameStackPrefs } from "@/lib/game/banks";
import type { GradeProgress } from "@/lib/execute/grade-progress";
import { applySeniorDifficulty } from "@/lib/execute/senior-overlay";
import { runInSandbox } from "@/lib/execute/sandbox";
import type {
  FunctionCase,
  GradeTest,
  LanguageId,
  PerformanceSpec,
  TestSpec,
} from "@/lib/types";

const NAME = /^[A-Za-z_][A-Za-z0-9_]*$/;
const DEFAULT_PERF_MS = 2_500;

function normalizeOutput(value: string) {
  return value.replace(/\r\n/g, "\n").replace(/[ \t]+$/gm, "").trimEnd();
}

function clip(value: string, max = 600) {
  if (value.length <= max) return value;
  return `${value.slice(0, max)}…`;
}

function formatExpected(value: unknown) {
  if (value === undefined) {
    return "(no return value — use return, not only print/console.log)";
  }
  return JSON.stringify(value);
}

function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (typeof a === "number" && typeof b === "number") {
    if (Number.isNaN(a) && Number.isNaN(b)) return true;
    return a === b;
  }
  if (typeof a !== typeof b) return false;
  if (a === null || b === null) return a === b;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((item, index) => deepEqual(item, b[index]));
  }
  if (typeof a === "object" && typeof b === "object") {
    const left = a as Record<string, unknown>;
    const right = b as Record<string, unknown>;
    const leftKeys = Object.keys(left).sort();
    const rightKeys = Object.keys(right).sort();
    if (leftKeys.length !== rightKeys.length) return false;
    return leftKeys.every((key, index) => key === rightKeys[index] && deepEqual(left[key], right[key]));
  }
  return false;
}

function parseHarnessJson(payload: string): { ok: true; value: unknown } | { ok: false } {
  const trimmed = payload.trim();
  if (!trimmed) return { ok: false };
  try {
    const value = JSON.parse(trimmed);
    if (value && typeof value === "object" && "__error" in (value as Record<string, unknown>)) {
      return { ok: false };
    }
    return { ok: true, value };
  } catch {
    return { ok: false };
  }
}

function valuesMatch(payload: string, expected: unknown) {
  const parsed = parseHarnessJson(payload);
  if (!parsed.ok) return false;
  return deepEqual(parsed.value, expected);
}

function casePayloads(stdout: string, count: number) {
  const payloads: string[] = [];
  for (let index = 0; index < count; index += 1) {
    const marker = `__CASE_${index}__`;
    const start = stdout.indexOf(marker);
    if (start < 0) {
      payloads.push("");
      continue;
    }
    const from = start + marker.length;
    const next = stdout.indexOf(`__CASE_${index + 1}__`, from);
    const body = stdout.slice(from, next === -1 ? undefined : next);
    const lines = body
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
    payloads.push(lines[0] ?? "");
  }
  return payloads;
}

type HarnessMode = "visible" | "performance" | "all";

function buildHarness(
  language: LanguageId,
  code: string,
  tests: TestSpec,
  performance?: PerformanceSpec,
  mode: HarnessMode = "all",
) {
  if (tests.type === "stdout") return code;
  if (!NAME.test(tests.functionName)) {
    throw new Error("This exercise has an invalid function name.");
  }

  const source = code.replace(/\s*$/, "");
  const functionName = tests.functionName;
  const perfCases = performance?.cases ?? [];
  const includeVisible = mode === "visible" || mode === "all";
  const includePerf = mode === "performance" || mode === "all";

  if (language === "python") {
    const perfBlock =
      includePerf && perfCases.length
      ? `
__perf = __json.loads(r"""${JSON.stringify(perfCases)}""")
for __i, __case in enumerate(__perf):
    try:
        __start = __time.perf_counter()
        __result = ${functionName}(*__case["args"])
        __elapsed = (__time.perf_counter() - __start) * 1000
        print("__PERF_%s__" % __i)
        print(__json.dumps({"ms": __elapsed, "result": __result}))
    except Exception as __error:
        print("__PERF_%s__" % __i)
        print(__json.dumps({"ms": None, "error": str(__error)}))
`
      : "";

    const visibleBlock = includeVisible
      ? `__cases = __json.loads(r"""${JSON.stringify(tests.cases)}""")
for __i, __case in enumerate(__cases):
    try:
        __result = ${functionName}(*__case["args"])
        print("__CASE_%s__" % __i)
        print(__json.dumps(__result))
    except Exception as __error:
        print("__CASE_%s__" % __i)
        print(__json.dumps({"__error": str(__error)}))
`
      : "";

    return `${source}

import json as __json
${includePerf && perfCases.length ? "import time as __time\n" : ""}${visibleBlock}${perfBlock}`;
  }

  if (language === "typescript" || language === "javascript") {
    const perfBlock =
      includePerf && perfCases.length
      ? `
const __perf = ${JSON.stringify(perfCases)};
for (let __i = 0; __i < __perf.length; __i++) {
  try {
    const __start = performance.now();
    const __result = ${functionName}(...__perf[__i].args);
    const __elapsed = performance.now() - __start;
    console.log("__PERF_" + __i + "__");
    console.log(JSON.stringify({ ms: __elapsed, result: __result }));
  } catch (__error) {
    console.log("__PERF_" + __i + "__");
    console.log(JSON.stringify({ ms: null, error: String(__error) }));
  }
}
`
      : "";

    const visibleBlock = includeVisible
      ? `const __cases = ${JSON.stringify(tests.cases)};
for (let __i = 0; __i < __cases.length; __i++) {
  try {
    const __result = ${functionName}(...__cases[__i].args);
    console.log("__CASE_" + __i + "__");
    console.log(JSON.stringify(__result));
  } catch (__error) {
    console.log("__CASE_" + __i + "__");
    console.log(JSON.stringify({ __error: String(__error) }));
  }
}
`
      : "";

    return `${source}

${visibleBlock}${perfBlock}`;
  }

  if (language === "java") {
    const visibleCases = includeVisible ? tests.cases : [];
    return buildJavaFunctionHarness(source, functionName, visibleCases);
  }

  throw new Error(`Function tests are not supported for ${language}.`);
}

function javaLiteral(value: unknown): string {
  if (typeof value === "number" && Number.isInteger(value)) return String(value);
  if (typeof value === "boolean") return value ? "true" : "false";
  if (typeof value === "string") return JSON.stringify(value);
  if (Array.isArray(value) && value.every((item) => typeof item === "number" && Number.isInteger(item))) {
    return `new int[]{${value.join(", ")}}`;
  }
  throw new Error("This Java exercise uses an unsupported argument type.");
}

function buildJavaFunctionHarness(code: string, functionName: string, cases: FunctionCase[]) {
  const calls = cases
    .map((item, index) => {
      const args = item.args.map(javaLiteral).join(", ");
      return `    System.out.println("__CASE_${index}__");
    try {
      System.out.println(__json(${functionName}(${args})));
    } catch (Exception __error) {
      System.out.println("{\\"__error\\":\\"" + __error.toString().replace("\\\\", "/").replace("\\"", "'") + "\\"}");
    }`;
    })
    .join("\n");

  const helpers = `
  static String __json(int v) { return Integer.toString(v); }
  static String __json(boolean v) { return v ? "true" : "false"; }
  static String __json(double v) {
    if (v == (long) v) return Long.toString((long) v);
    return Double.toString(v);
  }
  static String __json(String v) {
    if (v == null) return "null";
    StringBuilder sb = new StringBuilder();
    sb.append('"');
    for (int i = 0; i < v.length(); i++) {
      char ch = v.charAt(i);
      if (ch == '\\\\' || ch == '"') sb.append('\\\\');
      sb.append(ch);
    }
    sb.append('"');
    return sb.toString();
  }
  static String __json(int[] v) {
    StringBuilder sb = new StringBuilder();
    sb.append('[');
    for (int i = 0; i < v.length; i++) {
      if (i > 0) sb.append(',');
      sb.append(v[i]);
    }
    sb.append(']');
    return sb.toString();
  }
`;

  const injected = `public static void main(String[] args) {\n${calls}\n  }\n${helpers}`;

  const signature = /public\s+static\s+void\s+main\s*\(\s*String\s*\[\s*]\s+\w+\s*\)\s*\{/;
  const match = signature.exec(code);
  if (match) {
    const openBrace = code.indexOf("{", match.index);
    if (openBrace >= 0) {
      let depth = 0;
      let closeIndex = -1;
      for (let i = openBrace; i < code.length; i += 1) {
        const ch = code[i];
        if (ch === "{") depth += 1;
        else if (ch === "}") {
          depth -= 1;
          if (depth === 0) {
            closeIndex = i;
            break;
          }
        }
      }
      if (closeIndex >= 0) {
        return `${code.slice(0, match.index)}${injected.trim()}${code.slice(closeIndex + 1)}`;
      }
    }
  }

  const lastBrace = code.lastIndexOf("}");
  if (lastBrace === -1) return `${code}\n${injected}\n`;
  return `${code.slice(0, lastBrace)}${injected}\n${code.slice(lastBrace)}`;
}

function perfPayloads(stdout: string, count: number) {
  const payloads: string[] = [];
  for (let index = 0; index < count; index += 1) {
    const marker = `__PERF_${index}__`;
    const start = stdout.indexOf(marker);
    if (start < 0) {
      payloads.push("");
      continue;
    }
    const from = start + marker.length;
    const next = stdout.indexOf(`__PERF_${index + 1}__`, from);
    const body = stdout.slice(from, next === -1 ? undefined : next);
    const lines = body
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
    payloads.push(lines[0] ?? "");
  }
  return payloads;
}

function gradeFunction(cases: FunctionCase[], functionName: string, stdout: string, stderr: string) {
  const payloads = casePayloads(stdout, cases.length);
  const tests: GradeTest[] = cases.map((item, index) => {
    const payload = payloads[index] ?? "";
    let errorText = "";
    try {
      const maybe = JSON.parse(payload.trim());
      if (maybe && typeof maybe === "object" && "__error" in (maybe as Record<string, unknown>)) {
        errorText = String((maybe as { __error: unknown }).__error);
      }
    } catch {
      /* not json */
    }

    const passed = !errorText && valuesMatch(payload, item.expected);
    const args = item.args.map((arg) => JSON.stringify(arg)).join(", ");
    const parsedResult = parseHarnessJson(payload);
    const actual = errorText
      || (parsedResult.ok
        ? formatExpected(parsedResult.value)
        : clip(payload || stderr || "No result — check the function name and return a value."));

    return {
      name: item.label ? `${item.label}: ${functionName}(${args})` : `${functionName}(${args})`,
      passed,
      expected: formatExpected(item.expected),
      actual: clip(actual),
      kind: "visible" as const,
    };
  });

  return tests;
}

function gradePerformance(
  spec: PerformanceSpec,
  functionName: string,
  stdout: string,
  stderr: string,
) {
  const limit = spec.maxMsPerCase ?? DEFAULT_PERF_MS;
  const payloads = perfPayloads(stdout, spec.cases.length);

  return spec.cases.map((item, index) => {
    const payload = payloads[index] ?? "";
    let parsed: { ms?: number | null; result?: unknown; error?: string } | null = null;
    try {
      parsed = JSON.parse(payload) as { ms?: number | null; result?: unknown; error?: string };
    } catch {
      parsed = null;
    }

    const label = item.label ?? `large input #${index + 1}`;
    const name = `Performance (${spec.expectedComplexity}): ${label}`;

    if (!parsed || parsed.error) {
      return {
        name,
        passed: false,
        expected: `correct result within ${limit}ms`,
        actual: clip(parsed?.error || stderr || "No result"),
        kind: "performance" as const,
      };
    }

    const ms = typeof parsed.ms === "number" ? parsed.ms : null;
    const correct = deepEqual(parsed.result, item.expected);
    const timedOut = ms === null || ms > limit;

    let actual = "";
    if (!correct) {
      actual = `Wrong answer (${ms?.toFixed(1) ?? "?"}ms)`;
    } else if (timedOut) {
      actual = `Time limit exceeded (${ms?.toFixed(1) ?? "?"}ms > ${limit}ms)`;
    } else {
      actual = `Passed in ${ms!.toFixed(1)}ms`;
    }

    return {
      name,
      passed: correct && !timedOut,
      expected: `correct result within ${limit}ms`,
      actual,
      kind: "performance" as const,
    };
  });
}

export type GradeExerciseOptions = {
  visibleOnly?: boolean;
  onProgress?: (progress: GradeProgress) => void;
};

export async function gradeExercise(
  kind: "lesson" | "challenge" | "game" | "guide",
  id: string,
  code: string,
  difficulty?: SkillDifficulty,
  stack?: GameStackPrefs,
  options?: GradeExerciseOptions,
) {
  const visibleOnly = options?.visibleOnly ?? false;
  const onProgress = options?.onProgress;
  const report = (
    percent: number,
    label: string,
    phase: GradeProgress["phase"],
    extra?: Pick<GradeProgress, "completedTests" | "totalTests">,
  ) => {
    onProgress?.({ percent, label, phase, ...extra });
  };

  report(5, visibleOnly ? "Running visible tests…" : "Preparing your submission…", "prepare");

  const record = findExercise(kind, id, kind === "game" ? { stack } : undefined);
  if (!record) {
    throw new Error("That exercise does not exist.");
  }

  const gradedExercise =
    kind === "game" ? record.exercise : applySeniorDifficulty(record.exercise, difficulty, id);
  const exercise = visibleOnly ? record.exercise : gradedExercise;
  const tests = exercise.tests;
  const performance = visibleOnly ? undefined : exercise.performance;
  const stdin = tests.type === "stdout" ? tests.stdin ?? "" : "";
  const visibleCount = tests.type === "stdout" ? 1 : tests.cases.length;
  const perfCount = performance?.cases.length ?? 0;

  report(
    12,
    visibleCount === 1 ? "Running output check in sandbox…" : `Running ${visibleCount} visible tests…`,
    "visible",
    { completedTests: 0, totalTests: visibleCount },
  );

  const program = buildHarness(record.language, code, tests, performance, "visible");
  const run = await runInSandbox(record.language, program, stdin);

  report(
    performance && perfCount > 0 ? 52 : 88,
    visibleCount === 1 ? "Output check complete" : `${visibleCount} visible tests complete`,
    "visible",
    { completedTests: visibleCount, totalTests: visibleCount },
  );

  if (tests.type === "stdout") {
    const actual = normalizeOutput(run.stdout);
    const expected = normalizeOutput(tests.expected);
    const passed = actual === expected;
    report(100, "Grading complete", "finalize", { completedTests: 1, totalTests: 1 });
    return {
      engine: "wandbox" as const,
      passed,
      stderr: clip(run.stderr, 1200),
      tests: [
        {
          name: "Output",
          passed,
          expected,
          actual: clip(actual || run.stderr || "No output"),
        },
      ],
    };
  }

  const graded = gradeFunction(tests.cases, tests.functionName, run.stdout, run.stderr).map((item) => ({
    ...item,
    kind: item.kind ?? "visible",
  }));

  if (visibleOnly || !performance || !graded.every((item) => item.passed)) {
    report(100, visibleOnly ? "Visible tests complete" : "Grading complete", "finalize", {
      completedTests: visibleCount,
      totalTests: visibleCount,
    });
    return {
      engine: "wandbox" as const,
      passed: graded.every((item) => item.passed),
      stderr: clip(run.stderr, 1200),
      tests: graded,
    };
  }

  report(
    58,
    perfCount === 1 ? "Running performance check…" : `Running ${perfCount} performance tests…`,
    "performance",
    { completedTests: 0, totalTests: perfCount },
  );

  const perfProgram = buildHarness(record.language, code, tests, performance, "performance");
  const perfRun = await runInSandbox(record.language, perfProgram, stdin);

  report(92, "Performance tests complete", "performance", {
    completedTests: perfCount,
    totalTests: perfCount,
  });

  const perfGraded = gradePerformance(performance, tests.functionName, perfRun.stdout, perfRun.stderr);
  const allTests = [...graded, ...perfGraded];

  report(100, "Grading complete", "finalize", {
    completedTests: visibleCount + perfCount,
    totalTests: visibleCount + perfCount,
  });

  return {
    engine: "wandbox" as const,
    passed: allTests.every((item) => item.passed),
    stderr: clip(perfRun.stderr || run.stderr, 1200),
    tests: allTests,
  };
}
