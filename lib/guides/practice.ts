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
        "Print exactly: Hello, DevLadder!",
        "# Use print() like in the lesson above.\n",
        "Hello, DevLadder!",
        ['Call print with the greeting in quotes.', 'print("Hello, DevLadder!")'],
      );
    case "variables":
      return stdoutExercise(
        'Set name to "Alex" and level to 3, then print both on one line separated by a space (output: Alex 3).',
        "name = \"\"\nlevel = 0\n# Print name and level.\n",
        "Alex 3",
        ["Assign the strings and numbers first.", "print(name, level)"],
      );
    case "operators":
      return stdoutExercise(
        "Store 7 and 4 in variables, then print their sum.",
        "a = 7\nb = 4\n# Print the sum.\n",
        "11",
        ["Use + to add numbers.", "print(a + b)"],
      );
    case "conditionals":
      return stdoutExercise(
        "If score is 85 or higher, print Pass. Otherwise print Study more. Use score = 85.",
        "score = 85\n# Write your if / else.\n",
        "Pass",
        ["Compare score >= 85", 'print("Pass") in the if branch'],
      );
    case "loops":
      return stdoutExercise(
        "Use a for loop to print the numbers 1 through 3, each on its own line.",
        "# Loop from 1 to 3.\n",
        "1\n2\n3",
        ["range(1, 4) gives 1, 2, 3", "print inside the loop"],
      );
    case "functions":
      return functionExercise(
        "Write a function double(n) that returns n multiplied by 2.",
        "def double(n):\n    pass\n",
        "double",
        [
          { args: [2], expected: 4 },
          { args: [5], expected: 10 },
        ],
        ["Use return inside the function.", "return n * 2"],
      );
    case "collections":
      return functionExercise(
        "Write sum_list(nums) that returns the total of all numbers in the list.",
        "def sum_list(nums):\n    pass\n",
        "sum_list",
        [
          { args: [[1, 2, 3]], expected: 6 },
          { args: [[10, -2]], expected: 8 },
        ],
        ["Loop over nums and add each value.", "Or use sum(nums)"],
      );
    default:
      return null;
  }
}

function javascriptPractice(kind: PracticeKind): Exercise | null {
  switch (kind) {
    case "introduction":
      return stdoutExercise(
        "Log exactly: Hello, DevLadder!",
        "// Use console.log like in the lesson.\n",
        "Hello, DevLadder!",
        ['console.log("Hello, DevLadder!");'],
      );
    case "variables":
      return stdoutExercise(
        'Use const for hero = "Alex" and let level = 3, then log both separated by a space.',
        "const hero = \"\";\nlet level = 0;\n// Log hero and level.\n",
        "Alex 3",
        ['hero = "Alex"; level = 3;', "console.log(hero, level);"],
      );
    case "operators":
      return stdoutExercise(
        "Store 7 and 4, then log their sum.",
        "const a = 7;\nconst b = 4;\n// Log the sum.\n",
        "11",
        ["console.log(a + b);"],
      );
    case "conditionals":
      return stdoutExercise(
        "If score >= 85, log Pass. Otherwise log Study more. Use score = 85.",
        "const score = 85;\n// if / else here.\n",
        "Pass",
        ['if (score >= 85) { console.log("Pass"); }'],
      );
    case "loops":
      return stdoutExercise(
        "Use a for loop to log 1, 2, and 3 on separate lines.",
        "// for loop here.\n",
        "1\n2\n3",
        ["for (let i = 1; i <= 3; i++)", "console.log(i);"],
      );
    case "functions":
      return functionExercise(
        "Write a function double(n) that returns n * 2.",
        "function double(n) {\n  \n}\n",
        "double",
        [
          { args: [2], expected: 4 },
          { args: [5], expected: 10 },
        ],
        ["return n * 2;"],
      );
    case "collections":
      return functionExercise(
        "Write sumArray(nums) that returns the total of all numbers in the array.",
        "function sumArray(nums) {\n  \n}\n",
        "sumArray",
        [
          { args: [[1, 2, 3]], expected: 6 },
          { args: [[4, 5]], expected: 9 },
        ],
        ["Use a loop or nums.reduce((a, b) => a + b, 0)"],
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
        "Print exactly: Hello, DevLadder!",
        "public class Main {\n  public static void main(String[] args) {\n    // Print the greeting.\n  }\n}\n",
        "Hello, DevLadder!",
        ['System.out.println("Hello, DevLadder!");'],
      );
    case "variables":
      return stdoutExercise(
        'Set hero to "Alex" and level to 3, then print both with a space between.',
        "public class Main {\n  public static void main(String[] args) {\n    String hero = \"\";\n    int level = 0;\n    // Print hero and level.\n  }\n}\n",
        "Alex 3",
        ['hero = "Alex";', "System.out.println(hero + \" \" + level);"],
      );
    case "operators":
      return stdoutExercise(
        "Store 7 and 4, then print their sum.",
        "public class Main {\n  public static void main(String[] args) {\n    int a = 7;\n    int b = 4;\n    // Print sum.\n  }\n}\n",
        "11",
        ["System.out.println(a + b);"],
      );
    case "conditionals":
      return stdoutExercise(
        "If score >= 85, print Pass. Otherwise print Study more. Use score = 85.",
        "public class Main {\n  public static void main(String[] args) {\n    int score = 85;\n    // if / else.\n  }\n}\n",
        "Pass",
        ['if (score >= 85) System.out.println("Pass");'],
      );
    case "loops":
      return stdoutExercise(
        "Use a for loop to print 1, 2, and 3 on separate lines.",
        "public class Main {\n  public static void main(String[] args) {\n    // for loop.\n  }\n}\n",
        "1\n2\n3",
        ["for (int i = 1; i <= 3; i++)", "System.out.println(i);"],
      );
    case "functions":
      return functionExercise(
        "Write a static method doubleNum(int n) that returns n * 2.",
        "public class Main {\n  public static int doubleNum(int n) {\n    return 0;\n  }\n\n  public static void main(String[] args) {\n  }\n}\n",
        "doubleNum",
        [
          { args: [2], expected: 4 },
          { args: [5], expected: 10 },
        ],
        ["return n * 2;"],
      );
    case "collections":
      return functionExercise(
        "Write sumArray(int[] nums) that returns the total of all elements.",
        "public class Main {\n  public static int sumArray(int[] nums) {\n    return 0;\n  }\n\n  public static void main(String[] args) {\n  }\n}\n",
        "sumArray",
        [
          { args: [[1, 2, 3]], expected: 6 },
          { args: [[4, 5]], expected: 9 },
        ],
        ["Loop through nums and add each value."],
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
