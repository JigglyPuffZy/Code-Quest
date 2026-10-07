import { practiceLanguageForGuide } from "@/lib/curriculum/links";
import type { Exercise, FunctionCase, LanguageId } from "@/lib/types";

export const GUIDE_PRACTICE_XP = 15;

export type GuidePracticeRecord = {
  language: LanguageId;
  exercise: Exercise;
  exerciseId: string;
  xp: number;
};

type PracticeKind =
  | "introduction"
  | "variables"
  | "operators"
  | "conditionals"
  | "loops"
  | "functions"
  | "collections";

const SLUG_TO_KIND: Record<string, PracticeKind> = {
  introduction: "introduction",
  "variables-and-types": "variables",
  operators: "operators",
  conditionals: "conditionals",
  "control-flow": "conditionals",
  loops: "loops",
  functions: "functions",
  methods: "functions",
  "lists-and-tuples": "collections",
  arrays: "collections",
  "data-structures": "collections",
};

function practiceKind(slug: string): PracticeKind | null {
  return SLUG_TO_KIND[slug] ?? null;
}

function stdoutExercise(
  prompt: string,
  starterCode: string,
  expected: string,
  hints: string[],
): Exercise {
  return { prompt, starterCode, hints, tests: { type: "stdout", expected } };
}

function functionExercise(
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
    tests: { type: "function", functionName, cases },
  };
}

function buildExercise(language: LanguageId, kind: PracticeKind): Exercise | null {
  switch (language) {
    case "python":
      return pythonPractice(kind);
    case "javascript":
      return javascriptPractice(kind);
    case "typescript":
      return typescriptPractice(kind);
    case "java":
      return javaPractice(kind);
    default:
      return null;
  }
}

function pythonPractice(kind: PracticeKind): Exercise | null {
  switch (kind) {
    case "introduction":
      return stdoutExercise(
        "Goal: Print exactly this line of text:\nHello, DevLadder!\n\nSteps:\n1. Use the print() function from the lesson.\n2. Put the greeting inside quotes.\n3. Run tests — the output must match exactly.",
        "# Step 1: use print() with the greeting in quotes.\n",
        "Hello, DevLadder!",
        [
          "print() shows text on the screen.",
          'The text goes in quotes: print("Hello, DevLadder!")',
          "Copy carefully — spelling and punctuation must match.",
        ],
      );
    case "variables":
      return stdoutExercise(
        "Goal: Show Alex 3 on one line (name, space, level).\n\nSteps:\n1. Set name = \"Alex\"\n2. Set level = 3\n3. Print both with print(name, level)",
        "name = \"\"\nlevel = 0\n# Assign name and level, then print them.\n",
        "Alex 3",
        [
          'name = "Alex" and level = 3',
          "print(name, level) prints both with a space between.",
        ],
      );
    case "operators":
      return stdoutExercise(
        "Goal: Print the sum of 7 and 4.\n\nSteps:\n1. Store 7 in a variable (already done: a = 7).\n2. Store 4 in b.\n3. Print a + b — the answer should be 11.",
        "a = 7\nb = 4\n# Print the sum of a and b.\n",
        "11",
        ["Use + to add two numbers.", "print(a + b)"],
      );
    case "conditionals":
      return stdoutExercise(
        "Goal: Print Pass when score is 85 or higher; otherwise print Study more.\n\nSteps:\n1. score is already 85.\n2. Write if score >= 85: and print Pass.\n3. Add else: and print Study more.",
        "score = 85\n# Write if / else below.\n",
        "Pass",
        [
          "if score >= 85: starts the check.",
          'print("Pass") goes inside the if block (indented).',
          'print("Study more") goes in the else block.',
        ],
      );
    case "loops":
      return stdoutExercise(
        "Goal: Print 1, 2, and 3 — each number on its own line.\n\nSteps:\n1. Use for i in range(1, 4): — that gives 1, 2, 3.\n2. Inside the loop, print(i).",
        "# Use a for loop from 1 to 3.\n",
        "1\n2\n3",
        [
          "range(1, 4) produces 1, 2, 3 (4 is not included).",
          "Indent print(i) under the for line.",
        ],
      );
    case "functions":
      return functionExercise(
        "Goal: Write double(n) so it returns n multiplied by 2.\n\nExamples: double(2) → 4, double(5) → 10.\n\nSteps:\n1. Replace pass with return n * 2.",
        "def double(n):\n    pass\n",
        "double",
        [
          { args: [2], expected: 4 },
          { args: [5], expected: 10 },
        ],
        [
          "Delete pass and use return.",
          "return n * 2 sends the result back to the caller.",
        ],
      );
    case "collections":
      return functionExercise(
        "Goal: Write sum_list(nums) that adds every number in the list.\n\nExample: sum_list([1, 2, 3]) → 6.\n\nSteps:\n1. Start total at 0.\n2. Loop over nums and add each value to total.\n3. Return total (or use return sum(nums)).",
        "def sum_list(nums):\n    pass\n",
        "sum_list",
        [
          { args: [[1, 2, 3]], expected: 6 },
          { args: [[10, -2]], expected: 8 },
        ],
        [
          "total = 0, then for n in nums: total += n",
          "Or simply: return sum(nums)",
        ],
      );
    default:
      return null;
  }
}

function javascriptPractice(kind: PracticeKind): Exercise | null {
  switch (kind) {
    case "introduction":
      return stdoutExercise(
        "Goal: Log exactly this line:\nHello, DevLadder!\n\nSteps:\n1. Use console.log() from the lesson.\n2. Put the greeting in quotes.\n3. Run tests — output must match exactly.",
        "// Use console.log() with the greeting in quotes.\n",
        "Hello, DevLadder!",
        [
          "console.log() prints to the output.",
          'console.log("Hello, DevLadder!");',
        ],
      );
    case "variables":
      return stdoutExercise(
        "Goal: Log Alex 3 on one line.\n\nSteps:\n1. Set const hero = \"Alex\"\n2. Set let level = 3\n3. Log both: console.log(hero, level)",
        "const hero = \"\";\nlet level = 0;\n// Assign hero and level, then log them.\n",
        "Alex 3",
        [
          'const hero = "Alex"; and let level = 3;',
          "console.log(hero, level) prints both with a space.",
        ],
      );
    case "operators":
      return stdoutExercise(
        "Goal: Log the sum of 7 and 4 (answer: 11).\n\nSteps:\n1. a and b are already set.\n2. Log a + b with console.log.",
        "const a = 7;\nconst b = 4;\n// Log the sum.\n",
        "11",
        ["console.log(a + b); adds the two numbers."],
      );
    case "conditionals":
      return stdoutExercise(
        "Goal: Log Pass when score >= 85; otherwise log Study more.\n\nSteps:\n1. score is already 85.\n2. Write if (score >= 85) { ... } else { ... }",
        "const score = 85;\n// Write if / else below.\n",
        "Pass",
        [
          'if (score >= 85) { console.log("Pass"); }',
          'else { console.log("Study more"); }',
        ],
      );
    case "loops":
      return stdoutExercise(
        "Goal: Log 1, 2, and 3 — each on its own line.\n\nSteps:\n1. Use for (let i = 1; i <= 3; i++)\n2. Inside the loop, console.log(i)",
        "// Write a for loop that logs 1, 2, 3.\n",
        "1\n2\n3",
        [
          "for (let i = 1; i <= 3; i++) { ... }",
          "console.log(i); goes inside the curly braces.",
        ],
      );
    case "functions":
      return functionExercise(
        "Goal: double(n) should return n * 2.\n\nExamples: double(2) → 4, double(5) → 10.\n\nSteps:\n1. Inside the function, return n * 2;",
        "function double(n) {\n  \n}\n",
        "double",
        [
          { args: [2], expected: 4 },
          { args: [5], expected: 10 },
        ],
        ["return n * 2; inside the function body."],
      );
    case "collections":
      return functionExercise(
        "Goal: sumArray(nums) returns the total of all numbers.\n\nExample: sumArray([1, 2, 3]) → 6.\n\nSteps:\n1. Loop through nums and add each value.\n2. Return the total.",
        "function sumArray(nums) {\n  \n}\n",
        "sumArray",
        [
          { args: [[1, 2, 3]], expected: 6 },
          { args: [[4, 5]], expected: 9 },
        ],
        [
          "let total = 0; for (const n of nums) total += n; return total;",
          "Or: return nums.reduce((a, b) => a + b, 0)",
        ],
      );
    default:
      return null;
  }
}

function typescriptPractice(kind: PracticeKind): Exercise | null {
  const js = javascriptPractice(kind);
  if (!js) return null;
  if (kind === "variables") {
    return {
      ...js,
      starterCode: "const hero: string = \"\";\nlet level: number = 0;\n// Log hero and level.\n",
    };
  }
  if (kind === "functions") {
    return {
      ...js,
      starterCode: "function double(n: number): number {\n  \n}\n",
    };
  }
  if (kind === "collections") {
    return {
      ...js,
      starterCode: "function sumArray(nums: number[]): number {\n  \n}\n",
    };
  }
  return js;
}

function javaPractice(kind: PracticeKind): Exercise | null {
  switch (kind) {
    case "introduction":
      return stdoutExercise(
        "Goal: Print exactly this line:\nHello, DevLadder!\n\nSteps:\n1. Inside main, use System.out.println(...).\n2. Put the greeting in double quotes.\n3. Keep the class structure — only add code inside main.",
        "public class Main {\n  public static void main(String[] args) {\n    // Print the greeting here.\n  }\n}\n",
        "Hello, DevLadder!",
        [
          "System.out.println prints a line to the output.",
          'System.out.println("Hello, DevLadder!");',
        ],
      );
    case "variables":
      return stdoutExercise(
        "Goal: Print Alex 3 (name, space, level).\n\nSteps:\n1. Set hero = \"Alex\" and level = 3.\n2. Print with System.out.println(hero + \" \" + level);",
        "public class Main {\n  public static void main(String[] args) {\n    String hero = \"\";\n    int level = 0;\n    // Assign values and print.\n  }\n}\n",
        "Alex 3",
        [
          'hero = "Alex"; level = 3;',
          'System.out.println(hero + " " + level); joins text with +',
        ],
      );
    case "operators":
      return stdoutExercise(
        "Goal: Print the sum of 7 and 4 (answer: 11).\n\nSteps:\n1. a and b are already set.\n2. Print a + b inside main.",
        "public class Main {\n  public static void main(String[] args) {\n    int a = 7;\n    int b = 4;\n    // Print the sum.\n  }\n}\n",
        "11",
        ["System.out.println(a + b);"],
      );
    case "conditionals":
      return stdoutExercise(
        "Goal: Print Pass when score >= 85; otherwise print Study more.\n\nSteps:\n1. score is already 85.\n2. Write if (score >= 85) with println for Pass.\n3. Add else for Study more.",
        "public class Main {\n  public static void main(String[] args) {\n    int score = 85;\n    // Write if / else below.\n  }\n}\n",
        "Pass",
        [
          'if (score >= 85) System.out.println("Pass");',
          'else System.out.println("Study more");',
        ],
      );
    case "loops":
      return stdoutExercise(
        "Goal: Print 1, 2, and 3 — each on its own line.\n\nSteps:\n1. Use for (int i = 1; i <= 3; i++)\n2. System.out.println(i); inside the loop.",
        "public class Main {\n  public static void main(String[] args) {\n    // Write a for loop here.\n  }\n}\n",
        "1\n2\n3",
        [
          "for (int i = 1; i <= 3; i++) { ... }",
          "System.out.println(i); inside the loop body.",
        ],
      );
    case "functions":
      return functionExercise(
        "Goal: doubleNum(n) returns n * 2.\n\nExamples: doubleNum(2) → 4, doubleNum(5) → 10.\n\nSteps:\n1. Replace return 0 with return n * 2;",
        "public class Main {\n  public static int doubleNum(int n) {\n    return 0;\n  }\n\n  public static void main(String[] args) {\n  }\n}\n",
        "doubleNum",
        [
          { args: [2], expected: 4 },
          { args: [5], expected: 10 },
        ],
        ["Change return 0 to return n * 2;"],
      );
    case "collections":
      return functionExercise(
        "Goal: sumArray(nums) adds every number in the array.\n\nExample: sumArray([1,2,3]) → 6.\n\nSteps:\n1. Start total at 0.\n2. Loop through nums and add each value.\n3. Return total.",
        "public class Main {\n  public static int sumArray(int[] nums) {\n    return 0;\n  }\n\n  public static void main(String[] args) {\n  }\n}\n",
        "sumArray",
        [
          { args: [[1, 2, 3]], expected: 6 },
          { args: [[4, 5]], expected: 9 },
        ],
        [
          "int total = 0; for (int n : nums) total += n; return total;",
        ],
      );
    default:
      return null;
  }
}

export function guideExerciseId(topicId: string, slug: string) {
  return `${topicId}/${slug}`;
}

export function getGuidePractice(topicId: string, slug: string): GuidePracticeRecord | null {
  const language = practiceLanguageForGuide(topicId);
  if (!language) return null;

  const kind = practiceKind(slug);
  if (!kind) return null;

  const exercise = buildExercise(language, kind);
  if (!exercise) return null;

  return {
    language,
    exercise,
    exerciseId: guideExerciseId(topicId, slug),
    xp: GUIDE_PRACTICE_XP,
  };
}

export function guideHasPractice(topicId: string, slug: string) {
  return getGuidePractice(topicId, slug) !== null;
}
