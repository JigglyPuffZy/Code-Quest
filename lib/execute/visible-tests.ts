import {
  formatExampleInput,
  formatExampleOutput,
  parseParamNames,
} from "@/lib/exercise/leetcode-examples";
import type { Exercise, FunctionCase, GradeTest, TestSpec } from "@/lib/types";

export type VisibleTestCase = {
  id: string;
  title: string;
  input: string;
  expected: string;
};

function formatValue(value: unknown) {
  return JSON.stringify(value);
}

function caseInput(functionName: string, item: FunctionCase) {
  const args = item.args.map((arg) => formatValue(arg)).join(", ");
  return `${functionName}(${args})`;
}

export function listVisibleTestCases(tests: TestSpec): VisibleTestCase[] {
  if (tests.type === "stdout") {
    return [
      {
        id: "stdout",
        title: "Program output",
        input: tests.stdin ? `stdin = ${JSON.stringify(tests.stdin)}` : "// Your program runs with no stdin",
        expected: tests.expected,
      },
    ];
  }

  return tests.cases.map((item, index) => ({
    id: `case-${index}`,
    title: item.label ?? `Example ${index + 1}`,
    input: caseInput(tests.functionName, item),
    expected: formatValue(item.expected),
  }));
}

/** LeetCode-style display rows for the mission panel. */
export function listVisibleTestDisplay(
  exercise: Exercise,
): Array<{ id: string; title: string; input: string; expected: string }> {
  const { tests, starterCode } = exercise;

  if (tests.type === "stdout") {
    const stdin = tests.stdin?.trim();
    return [
      {
        id: "stdout",
        title: "Program output",
        input: stdin ? `stdin = ${JSON.stringify(stdin)}` : "// main() runs your code",
        expected: tests.expected,
      },
    ];
  }

  const paramNames = parseParamNames(starterCode);
  return tests.cases.map((item, index) => ({
    id: `case-${index}`,
    title: item.label ?? `Example ${index + 1}`,
    input: formatExampleInput(tests.functionName, paramNames, item.args),
    expected: formatExampleOutput(item.expected),
  }));
}

export function matchRunResultsToCases(
  tests: TestSpec,
  results: GradeTest[],
): Array<{ case: VisibleTestCase; result?: GradeTest }> {
  const cases = listVisibleTestCases(tests);
  return cases.map((caseItem, index) => ({
    case: caseItem,
    result: results[index],
  }));
}

export function matchRunResultsToDisplay(
  exercise: Exercise,
  results: GradeTest[],
): Array<{ case: { id: string; title: string; input: string; expected: string }; result?: GradeTest }> {
  const cases = listVisibleTestDisplay(exercise);
  return cases.map((caseItem, index) => ({
    case: caseItem,
    result: results[index],
  }));
}

export function summarizeRunResults(results: GradeTest[] | null | undefined) {
  if (!results?.length) {
    return { passed: 0, failed: 0, total: 0, allPassed: false };
  }
  const passed = results.filter((item) => item.passed).length;
  const failed = results.length - passed;
  return {
    passed,
    failed,
    total: results.length,
    allPassed: failed === 0,
  };
}
