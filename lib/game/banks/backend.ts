import type { SkillDifficulty } from "@/lib/difficulty";
import type { GameModeId } from "@/lib/game/types";
import type { BackendFrameworkId, BackendLanguage } from "@/lib/game/tracks";
import { BACKEND_FRAMEWORKS } from "@/lib/game/tracks";
import type { Exercise } from "@/lib/types";
import { javaMain, jsFn, pyFn, scale } from "@/lib/game/banks/shared";

function fw(framework: BackendFrameworkId) {
  return BACKEND_FRAMEWORKS[framework].label;
}

function title(framework: BackendFrameworkId, difficulty: SkillDifficulty, level: number, task: string) {
  return `[${fw(framework)} · ${difficulty} L${level}] ${task}`;
}

function makeFn(
  language: BackendLanguage,
  name: string,
  args: string,
  prompt: string,
  hints: string[],
  cases: import("@/lib/types").FunctionCase[],
): Exercise {
  if (language === "python") return pyFn(name, args, prompt, hints, cases);
  if (language === "javascript") return jsFn(name, args, prompt, hints, cases, false);
  return {
    prompt,
    starterCode: `public class Main {\n  public static int ${name}(int a, int b) {\n    return 0;\n  }\n}\n`,
    hints,
    tests: { type: "function", functionName: name, cases },
  };
}

function byteBlitz(
  framework: BackendFrameworkId,
  language: BackendLanguage,
  difficulty: SkillDifficulty,
  level: number,
): Exercise {
  const s = scale(level);
  if (language === "java") {
    if (difficulty === "beginner") {
      return javaMain(
        title(framework, difficulty, level, 'Print "API Ready" on one line.'),
        'public class Main {\n  public static void main(String[] args) {\n    // Print API Ready\n  }\n}\n',
        "API Ready",
        ['System.out.println("API Ready");'],
      );
    }
    if (difficulty === "senior") {
      const mod = (s.a * s.b * s.c) % Math.max(1, s.a + s.b);
      return javaMain(
        title(framework, difficulty, level, `Print (a*b*c) % (a+b) where a=${s.a}, b=${s.b}, c=${s.c}.`),
        `public class Main {\n  public static void main(String[] args) {\n    int a = ${s.a};\n    int b = ${s.b};\n    int c = ${s.c};\n  }\n}\n`,
        String(mod),
        ["Multiply a*b*c first.", "Use % with denominator a+b."],
      );
    }
    if (difficulty === "expert") {
      const product = s.a * s.b;
      return javaMain(
        title(framework, difficulty, level, `Print ${s.a} × ${s.b}.`),
        `public class Main {\n  public static void main(String[] args) {\n    int a = ${s.a};\n    int b = ${s.b};\n  }\n}\n`,
        String(product),
        ["Multiply with *.", "Print only the product."],
      );
    }
    return javaMain(
      title(framework, difficulty, level, `Print the number ${s.a + s.b}.`),
      `public class Main {\n  public static void main(String[] args) {\n    int a = ${s.a};\n    int b = ${s.b};\n  }\n}\n`,
      String(s.a + s.b),
      ["Print a + b with println."],
    );
  }
  if (difficulty === "beginner") {
    const text = "API Ready";
    return {
      prompt: title(framework, difficulty, level, `Print exactly: ${text}`),
      starterCode: language === "python" ? 'print("")\n' : 'console.log("");\n',
      hints: ["Use print or console.log.", `Exact output: ${text}`],
      tests: { type: "stdout", expected: text },
    };
  }
  if (difficulty === "expert") {
    const product = s.a * s.b;
    return {
      prompt: title(framework, difficulty, level, `Print ${s.a} × ${s.b}.`),
      starterCode:
        language === "python"
          ? `a = ${s.a}\nb = ${s.b}\n`
          : `const a = ${s.a};\nconst b = ${s.b};\n`,
      hints: ["Multiply the values."],
      tests: { type: "stdout", expected: String(product) },
    };
  }
  if (difficulty === "senior") {
    const mod = (s.a * s.b * s.c) % Math.max(1, s.a + s.b);
    return {
      prompt: title(framework, difficulty, level, `Print (a*b*c) % (a+b) where a=${s.a}, b=${s.b}, c=${s.c}.`),
      starterCode:
        language === "python"
          ? `a = ${s.a}\nb = ${s.b}\nc = ${s.c}\n`
          : `const a = ${s.a};\nconst b = ${s.b};\nconst c = ${s.c};\n`,
      hints: ["Multiply all three, then modulo by a+b."],
      tests: { type: "stdout", expected: String(mod) },
    };
  }
  const sum = s.a + s.b;
  return {
    prompt: title(framework, difficulty, level, `Print the sum of ${s.a} and ${s.b}.`),
    starterCode:
      language === "python"
        ? `a = ${s.a}\nb = ${s.b}\n`
        : `const a = ${s.a};\nconst b = ${s.b};\n`,
    hints: ["Add the values.", "Output only the number."],
    tests: { type: "stdout", expected: String(sum) },
  };
}

function functionForge(
  framework: BackendFrameworkId,
  language: BackendLanguage,
  difficulty: SkillDifficulty,
  level: number,
): Exercise {
  const s = scale(level);
  if (difficulty === "beginner") {
    return makeFn(
      language,
      language === "java" ? "doubleValue" : "doubleValue",
      language === "java" ? "a, b" : "n",
      title(framework, difficulty, level, "doubleValue doubles a request quota."),
      ["Multiply by 2."],
      language === "java"
        ? [{ args: [s.a, s.b], expected: s.a * 2, label: "use first arg" }]
        : [{ args: [s.a], expected: s.a * 2, label: "main" }],
    );
  }
  if (difficulty === "mid") {
    return makeFn(
      language,
      "addTax",
      language === "java" ? "price, rate" : "price, rate",
      title(framework, difficulty, level, "addTax(price, rate) returns price + rate."),
      ["Add the two numbers."],
      [{ args: [100, 12], expected: 112, label: "main" }],
    );
  }
  if (difficulty === "expert") {
    return makeFn(
      language,
      "bundleTotal",
      "a, b, c",
      title(framework, difficulty, level, "bundleTotal sums three line items."),
      ["Add all three."],
      [{ args: [s.a, s.b, s.c], expected: s.a + s.b + s.c, label: "main" }],
    );
  }
  return makeFn(
    language,
    "compound10",
    "principal, years",
    title(
      framework,
      difficulty,
      level,
      "compound10(principal, years) returns principal * 1.1 ** years rounded to int.",
    ),
    ["Fixed 10% growth per year.", "Use power for years."],
    [
      { args: [1000, 2], expected: 1210, label: "main" },
      { args: [500, 0], expected: 500, label: "zero years" },
    ],
  );
}

function stringSurge(
  framework: BackendFrameworkId,
  language: BackendLanguage,
  difficulty: SkillDifficulty,
  level: number,
): Exercise {
  const s = scale(level);
  if (difficulty === "beginner") {
    return makeFn(
      language,
      "routePath",
      "resource",
      title(framework, difficulty, level, "routePath(resource) returns `/api/${resource}`."),
      ["Build the path string."],
      [{ args: [s.word], expected: `/api/${s.word}`, label: s.word }],
    );
  }
  if (difficulty === "mid") {
    return makeFn(
      language,
      "authHeader",
      "token",
      title(framework, difficulty, level, 'authHeader(token) returns `Bearer ${token}`.'),
      ["Template string / formatting."],
      [{ args: ["abc"], expected: "Bearer abc", label: "main" }],
    );
  }
  if (difficulty === "expert") {
    return makeFn(
      language,
      "parseTag",
      "header",
      title(framework, difficulty, level, "parseTag(header) returns the part after 'tag:' trimmed."),
      ["Find 'tag:'", "Return substring after it."],
      [{ args: ["tag: daily"], expected: "daily", label: "main" }],
    );
  }
  return makeFn(
    language,
    "digit_sum",
    "n",
    title(framework, difficulty, level, "digit_sum(n) returns the sum of decimal digits in n."),
    ["Repeatedly take n % 10.", "Works for 0."],
    [
      { args: [12345], expected: 15, label: "main" },
      { args: [0], expected: 0, label: "zero" },
      { args: [909], expected: 18, label: "nines" },
    ],
  );
}

function loopLabyrinth(
  framework: BackendFrameworkId,
  language: BackendLanguage,
  difficulty: SkillDifficulty,
  level: number,
): Exercise {
  if (difficulty === "senior") {
    return makeFn(
      language,
      "sum_multiples",
      "n",
      title(framework, difficulty, level, "sum_multiples(n) sums integers 1..n divisible by 3 or 5."),
      ["Loop 1..n inclusive.", "Add when divisible by 3 or 5."],
      [
        { args: [15], expected: 60, label: "n=15" },
        { args: [10], expected: 33, label: "n=10" },
      ],
    );
  }
  const n = difficulty === "beginner" ? 3 : difficulty === "mid" ? 5 : 8;
  return makeFn(
    language,
    "repeatPing",
    "count",
    title(framework, difficulty, level, `repeatPing(count) returns 'ping' repeated count times.`),
    ["Loop and concatenate.", `Test uses count=${n}.`],
    [
      { args: [n], expected: "ping".repeat(n), label: `n=${n}` },
      { args: [1], expected: "ping", label: "one" },
    ],
  );
}

function arrayArena(
  framework: BackendFrameworkId,
  language: BackendLanguage,
  difficulty: SkillDifficulty,
  level: number,
): Exercise {
  const s = scale(level);
  if (difficulty === "beginner") {
    return makeFn(
      language,
      "firstId",
      "ids",
      title(framework, difficulty, level, "firstId(ids) returns the first id or empty string."),
      ["Check length.", "Return first element."],
      [
        { args: [[s.tag, "b"]], expected: s.tag, label: "main" },
        { args: [[]], expected: "", label: "empty" },
      ],
    );
  }
  if (difficulty === "mid") {
    return makeFn(
      language,
      "sumIds",
      "nums",
      title(framework, difficulty, level, "sumIds(nums) totals a list of numbers."),
      ["Loop or sum helper."],
      [
        { args: [[s.a, s.b, s.c]], expected: s.a + s.b + s.c, label: "main" },
        { args: [[]], expected: 0, label: "empty" },
      ],
    );
  }
  if (difficulty === "expert") {
    return makeFn(
      language,
      "countActive",
      "flags",
      title(framework, difficulty, level, "countActive(flags) counts true values."),
      ["Increment when true."],
      [
        { args: [[true, false, true]], expected: 2, label: "mix" },
        { args: [[]], expected: 0, label: "empty" },
      ],
    );
  }
  return makeFn(
    language,
    "longest_increasing",
    "nums",
    title(framework, difficulty, level, "longest_increasing(nums) returns length of longest strictly increasing subsequence."),
    ["DP table or patience sorting idea.", "Empty array → 0."],
    [
      { args: [[10, 9, 2, 5, 3, 7, 101, 18]], expected: 4, label: "classic" },
      { args: [[1, 2, 3]], expected: 3, label: "sorted" },
      { args: [[]], expected: 0, label: "empty" },
    ],
  );
}

function logicLair(
  framework: BackendFrameworkId,
  language: BackendLanguage,
  difficulty: SkillDifficulty,
  level: number,
): Exercise {
  if (difficulty === "beginner") {
    return makeFn(
      language,
      "isAuthorized",
      "token",
      title(framework, difficulty, level, "isAuthorized(token) true when token is non-empty."),
      ["Check length > 0."],
      [
        { args: ["abc"], expected: true, label: "yes" },
        { args: [""], expected: false, label: "no" },
      ],
    );
  }
  if (difficulty === "mid") {
    return makeFn(
      language,
      "rateLimited",
      "hits",
      title(framework, difficulty, level, "rateLimited(hits) true when hits >= 100."),
      ["Compare with >= 100."],
      [
        { args: [100], expected: true, label: "cap" },
        { args: [12], expected: false, label: "low" },
      ],
    );
  }
  if (difficulty === "expert") {
    return makeFn(
      language,
      "canDelete",
      "role",
      title(framework, difficulty, level, "canDelete(role) true only for admin or owner."),
      ["Compare role strings."],
      [
        { args: ["admin"], expected: true, label: "admin" },
        { args: ["guest"], expected: false, label: "guest" },
      ],
    );
  }
  return makeFn(
    language,
    "route_policy",
    "role, method",
    title(
      framework,
      difficulty,
      level,
      "route_policy(role, method) returns 'allow' for admin, 'read' for GET on user, else 'deny'.",
    ),
    ["Check admin first.", "method is uppercase in tests."],
    [
      { args: ["admin", "DELETE"], expected: "allow", label: "admin" },
      { args: ["user", "GET"], expected: "read", label: "user get" },
      { args: ["user", "POST"], expected: "deny", label: "user post" },
    ],
  );
}

function bossGate(
  framework: BackendFrameworkId,
  language: BackendLanguage,
  difficulty: SkillDifficulty,
  level: number,
): Exercise {
  const s = scale(level);
  const bonus = difficulty === "beginner" ? 1 : difficulty === "mid" ? s.c : difficulty === "expert" ? s.c + 3 : s.c + 12;
  return makeFn(
    language,
    "bossMetric",
    "reqs, load",
    title(framework, difficulty, level, `BOSS: bossMetric(reqs,load) returns reqs*load+${bonus}.`),
    ["Multiply then add constant."],
    [
      { args: [s.a, s.b], expected: s.a * s.b + bonus, label: "main" },
      { args: [2, 3], expected: 6 + bonus, label: "2,3" },
    ],
  );
}

const BUILDERS: Record<
  GameModeId,
  (fw: BackendFrameworkId, lang: BackendLanguage, d: SkillDifficulty, l: number) => Exercise
> = {
  "byte-blitz": byteBlitz,
  "function-forge": functionForge,
  "string-surge": stringSurge,
  "loop-labyrinth": loopLabyrinth,
  "array-arena": arrayArena,
  "logic-lair": logicLair,
  "boss-gate": bossGate,
};

export function buildBackendQuestion(
  framework: BackendFrameworkId,
  language: BackendLanguage,
  difficulty: SkillDifficulty,
  mode: GameModeId,
  level: number,
) {
  return BUILDERS[mode](framework, language, difficulty, level);
}
