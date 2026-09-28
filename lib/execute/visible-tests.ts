import type { FunctionCase, GradeTest, TestSpec } from "@/lib/types";

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
        title: "Output",
        input: tests.stdin ? `stdin: ${JSON.stringify(tests.stdin)}` : "Run your program",
        expected: tests.expected,
      },
    ];
  }

  return tests.cases.map((item, index) => ({
    id: `case-${index}`,
    title: item.label ?? `Test ${index + 1}`,
    input: caseInput(tests.functionName, item),
    expected: formatValue(item.expected),
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
