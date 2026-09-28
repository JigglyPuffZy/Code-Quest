import { findExercise } from "@/lib/curriculum/index";
import type { SkillDifficulty } from "@/lib/difficulty";
import type { GameStackPrefs } from "@/lib/game/banks";
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
  return JSON.stringify(value);
}

function valuesMatch(actualText: string, expected: unknown) {
  try {
    return JSON.stringify(JSON.parse(actualText)) === JSON.stringify(expected);
  } catch {
    return false;
  }
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
    payloads.push(lines.at(-1) ?? "");
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

  throw new Error(`Function tests are not supported for ${language}.`);
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
    payloads.push(lines.at(-1) ?? "");
  }
  return payloads;
}

function gradeFunction(cases: FunctionCase[], functionName: string, stdout: string, stderr: string) {
  const payloads = casePayloads(stdout, cases.length);
  const tests: GradeTest[] = cases.map((item, index) => {
    const payload = payloads[index] ?? "";
    let parsed: unknown = null;
    let parsedOk = false;
    try {
      parsed = JSON.parse(payload);
      parsedOk = true;
    } catch {
      parsedOk = false;
    }

    const failed = !parsedOk || (parsed && typeof parsed === "object" && parsed !== null && "__error" in parsed);
    const errorText =
      parsed && typeof parsed === "object" && parsed !== null && "__error" in parsed
        ? String((parsed as { __error: unknown }).__error)
        : "";
    const passed = !failed && valuesMatch(payload, item.expected);
    const args = item.args.map((arg) => JSON.stringify(arg)).join(", ");
    const actual = errorText || (payload ? payload : stderr || "No result");

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
    const correct = valuesMatch(JSON.stringify(parsed.result), item.expected);
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

export async function gradeExercise(
  kind: "lesson" | "challenge" | "game",
  id: string,
  code: string,
  _difficulty?: SkillDifficulty,
  stack?: GameStackPrefs,
) {
  const record = findExercise(kind, id, kind === "game" ? { stack } : undefined);
  if (!record) {
    throw new Error("That exercise does not exist.");
  }

  const tests = record.exercise.tests;
  const performance = record.exercise.performance;
  const stdin = tests.type === "stdout" ? tests.stdin ?? "" : "";
  const program = buildHarness(record.language, code, tests, performance, "visible");
  const run = await runInSandbox(record.language, program, stdin);

  if (tests.type === "stdout") {
    const actual = normalizeOutput(run.stdout);
    const expected = normalizeOutput(tests.expected);
    const crashed = run.exitCode !== null && run.exitCode !== 0;
    const passed = actual === expected && !crashed;
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

  if (!performance || !graded.every((item) => item.passed)) {
    return {
      engine: "wandbox" as const,
      passed: graded.every((item) => item.passed),
      stderr: clip(run.stderr, 1200),
      tests: graded,
    };
  }

  const perfProgram = buildHarness(record.language, code, tests, performance, "performance");
  const perfRun = await runInSandbox(record.language, perfProgram, stdin);
  const perfGraded = gradePerformance(performance, tests.functionName, perfRun.stdout, perfRun.stderr);
  const allTests = [...graded, ...perfGraded];

  return {
    engine: "wandbox" as const,
    passed: allTests.every((item) => item.passed),
    stderr: clip(perfRun.stderr || run.stderr, 1200),
    tests: allTests,
  };
}
