import { MAX_GAME_LEVEL } from "@/lib/game/types";
import type { Exercise, FunctionCase } from "@/lib/types";

export function clampLevel(level: number) {
  return Math.max(1, Math.min(MAX_GAME_LEVEL, Math.floor(level)));
}

export function scale(level: number) {
  const n = clampLevel(level);
  return {
    n,
    a: 2 + (n % 17),
    b: 3 + (n % 13),
    c: 5 + (n % 11),
    word: n % 2 === 0 ? "quest" : "code",
    cap: 4 + Math.floor(n / 12),
    tag: `lv${n}`,
  };
}

function withExampleExplanations(cases: FunctionCase[]): FunctionCase[] {
  return cases.map((caseItem, index) => ({
    ...caseItem,
    explanation:
      caseItem.explanation ??
      (index < 2 && caseItem.label ? `Expected result for the "${caseItem.label}" case.` : undefined),
  }));
}

export function pyFn(
  name: string,
  body: string,
  prompt: string,
  hints: string[],
  cases: FunctionCase[],
): Exercise {
  return {
    prompt,
    starterCode: `def ${name}(${body}):\n    return None\n`,
    hints,
    tests: { type: "function", functionName: name, cases: withExampleExplanations(cases) },
  };
}

export function jsFn(
  name: string,
  args: string,
  prompt: string,
  hints: string[],
  cases: FunctionCase[],
  typed = false,
): Exercise {
  const types = typed ? ": string" : "";
  const ret = typed ? ": string" : "";
  return {
    prompt,
    starterCode: `function ${name}(${args}${types})${ret} {\n  return "";\n}\n`,
    hints,
    tests: { type: "function", functionName: name, cases: withExampleExplanations(cases) },
  };
}

export function javaMain(prompt: string, starter: string, expected: string, hints: string[]): Exercise {
  return {
    prompt,
    starterCode: starter,
    hints,
    tests: { type: "stdout", expected },
  };
}
