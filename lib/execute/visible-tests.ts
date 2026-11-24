import {
  formatExampleInput,
  formatExampleOutput,
  parseParamNames,
} from "@/lib/exercise/leetcode-examples";
import type { Exercise, GradeTest, TestSpec } from "@/lib/types";

function stdoutExampleInput(tests: Extract<TestSpec, { type: "stdout" }>) {
  if (tests.exampleInput?.trim()) return tests.exampleInput.trim();
  const stdin = tests.stdin?.trim();
  if (stdin) return `Typed input:\n${stdin}`;
  return "No extra input. Use the values already in the starter code, then print the expected output.";
}

/** LeetCode-style display rows for the mission panel. */
export function listVisibleTestDisplay(
  exercise: Exercise,
): Array<{ id: string; title: string; input: string; expected: string }> {
  const { tests, starterCode } = exercise;

  if (tests.type === "stdout") {
    return [
      {
        id: "stdout",
        title: "Example 1",
        input: stdoutExampleInput(tests),
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
