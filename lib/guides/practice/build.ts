import type { Exercise, FunctionCase, LanguageId } from "@/lib/types";

export const GUIDE_PRACTICE_PER_LESSON = 20;

export function goalSteps(goal: string, steps: string[], examples?: string) {
  const parts = [`Goal: ${goal}`];
  if (examples) parts.push(examples);
  parts.push(`Steps:\n${steps.map((step, index) => `${index + 1}. ${step}`).join("\n")}`);
  return parts.join("\n\n");
}

export function formatCallExamples(functionName: string, cases: FunctionCase[]) {
  const bits = cases.map((item) => {
    const args = item.args.map((arg) => JSON.stringify(arg)).join(", ");
    const expected =
      typeof item.expected === "string" ? JSON.stringify(item.expected) : String(item.expected);
    return `${functionName}(${args}) → ${expected}`;
  });
  return `Examples: ${bits.join(", ")}.`;
}

export function stdoutExercise(
  prompt: string,
  starterCode: string,
  expected: string,
  hints: string[],
  exampleInput: string,
  stdin?: string,
): Exercise {
  return {
    prompt,
    starterCode,
    hints,
    tests: {
      type: "stdout",
      expected,
      exampleInput,
      ...(stdin !== undefined ? { stdin } : {}),
    },
  };
}

export function functionExercise(
  prompt: string,
  starterCode: string,
  functionName: string,
  cases: FunctionCase[],
  hints: string[],
): Exercise {
  return {
    prompt,
    starterCode,
    hints,
    tests: {
      type: "function",
      functionName,
      cases: cases.map((item, index) => ({
        ...item,
        label: item.label ?? `Example ${index + 1}`,
      })),
    },
  };
}

export function requireCount<T>(items: T[], kind: string, language: LanguageId) {
  if (items.length !== GUIDE_PRACTICE_PER_LESSON) {
    throw new Error(`Expected ${GUIDE_PRACTICE_PER_LESSON} ${kind} questions for ${language}, got ${items.length}`);
  }
  return items;
}

export function langTitle(language: LanguageId) {
  switch (language) {
    case "python":
      return "Python";
    case "javascript":
      return "JavaScript";
    case "typescript":
      return "TypeScript";
    case "java":
      return "Java";
  }
}

export function comment(language: LanguageId, text: string) {
  return language === "python" ? `# ${text}` : `// ${text}`;
}

export function withMain(language: LanguageId, body: string) {
  if (language !== "java") return body.endsWith("\n") ? body : `${body}\n`;
  const inner = body
    .trimEnd()
    .split("\n")
    .map((line) => (line ? `    ${line}` : line))
    .join("\n");
  return `public class Main {\n  public static void main(String[] args) {\n${inner}\n  }\n}\n`;
}

export function printString(language: LanguageId, text: string) {
  const quoted = JSON.stringify(text);
  switch (language) {
    case "python":
      return `print(${quoted})`;
    case "javascript":
    case "typescript":
      return `console.log(${quoted});`;
    case "java":
      return `System.out.println(${quoted});`;
  }
}

export function printExpr(language: LanguageId, expr: string) {
  switch (language) {
    case "python":
      return `print(${expr})`;
    case "javascript":
    case "typescript":
      return `console.log(${expr});`;
    case "java":
      return `System.out.println(${expr});`;
  }
}

export function printVars(language: LanguageId, names: string[]) {
  switch (language) {
    case "python":
      return `print(${names.join(", ")})`;
    case "javascript":
    case "typescript":
      return `console.log(${names.join(", ")});`;
    case "java":
      return `System.out.println(${names.join(' + " " + ')});`;
  }
}

export function logName(language: LanguageId) {
  switch (language) {
    case "python":
      return "print()";
    case "javascript":
    case "typescript":
      return "console.log()";
    case "java":
      return "System.out.println()";
  }
}

export type ParamKind = "int" | "str";
export type ReturnKind = "int" | "bool" | "str";

export function fnStarter(
  language: LanguageId,
  name: string,
  params: Array<{ name: string; kind: ParamKind }>,
  ret: ReturnKind,
) {
  const pyParams = params.map((item) => item.name).join(", ");
  const jsParams = params.map((item) => item.name).join(", ");
  const tsParams = params
    .map((item) => `${item.name}: ${item.kind === "str" ? "string" : "number"}`)
    .join(", ");
  const javaParams = params
    .map((item) => `${item.kind === "str" ? "String" : "int"} ${item.name}`)
    .join(", ");
  const tsRet = ret === "str" ? "string" : ret === "bool" ? "boolean" : "number";
  const javaRet = ret === "str" ? "String" : ret === "bool" ? "boolean" : "int";
  const javaPlaceholder = ret === "str" ? 'return "";' : ret === "bool" ? "return false;" : "return 0;";

  switch (language) {
    case "python":
      return `def ${name}(${pyParams}):\n    pass\n`;
    case "javascript":
      return `function ${name}(${jsParams}) {\n  \n}\n`;
    case "typescript":
      return `function ${name}(${tsParams}): ${tsRet} {\n  \n}\n`;
    case "java":
      return `public class Main {\n  public static ${javaRet} ${name}(${javaParams}) {\n    ${javaPlaceholder}\n  }\n\n  public static void main(String[] args) {\n  }\n}\n`;
  }
}

export function arrayFnStarter(language: LanguageId, name: string) {
  switch (language) {
    case "python":
      return `def ${name}(nums):\n    pass\n`;
    case "javascript":
      return `function ${name}(nums) {\n  \n}\n`;
    case "typescript":
      return `function ${name}(nums: number[]): number {\n  \n}\n`;
    case "java":
      return `public class Main {\n  public static int ${name}(int[] nums) {\n    return 0;\n  }\n\n  public static void main(String[] args) {\n  }\n}\n`;
  }
}

export function pickExpr(
  language: LanguageId,
  expr: string | { python: string; javascript: string; java: string },
) {
  if (typeof expr === "string") return expr;
  if (language === "typescript") return expr.javascript;
  return expr[language];
}

export function returnHint(language: LanguageId, expr: string) {
  switch (language) {
    case "python":
      return `return ${expr}`;
    case "javascript":
    case "typescript":
    case "java":
      return `return ${expr};`;
  }
}

export function literal(value: string | number) {
  return typeof value === "string" ? JSON.stringify(value) : String(value);
}

export function emptyLiteral(value: string | number) {
  return typeof value === "string" ? '""' : "0";
}

export function varDecl(
  language: LanguageId,
  name: string,
  value: string | number,
  mode: "empty" | "filled",
) {
  const shown = mode === "filled" ? literal(value) : emptyLiteral(value);
  const isStr = typeof value === "string";
  switch (language) {
    case "python":
      return `${name} = ${shown}`;
    case "javascript":
      return `${typeof value === "number" ? "let" : "const"} ${name} = ${shown};`;
    case "typescript":
      return `${typeof value === "number" ? "let" : "const"} ${name}: ${isStr ? "string" : "number"} = ${shown};`;
    case "java":
      return `${isStr ? "String" : "int"} ${name} = ${shown};`;
  }
}
