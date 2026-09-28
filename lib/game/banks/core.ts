import type { SkillDifficulty } from "@/lib/difficulty";
import type { GameModeId } from "@/lib/game/types";
import type { Exercise } from "@/lib/types";
import { pyFn, scale } from "@/lib/game/banks/shared";

function byteBlitz(difficulty: SkillDifficulty, level: number): Exercise {
  const s = scale(level);
  if (difficulty === "beginner") {
    const text = level === 1 ? "Hello CodeQuest" : `Beginner ${level}`;
    return {
      prompt: `Print exactly: ${text}`,
      starterCode: 'print("")\n',
      hints: ["Use print with quotes.", `Output must be: ${text}`],
      tests: { type: "stdout", expected: text },
    };
  }
  if (difficulty === "mid") {
    const sum = s.a + s.b;
    return {
      prompt: `Print the sum of ${s.a} and ${s.b} (number only).`,
      starterCode: `a = ${s.a}\nb = ${s.b}\n`,
      hints: ["Add with +.", "print the result."],
      tests: { type: "stdout", expected: String(sum) },
    };
  }
  if (difficulty === "expert") {
    const product = s.a * s.b;
    return {
      prompt: `Print ${s.a} × ${s.b} without extra text.`,
      starterCode: `a = ${s.a}\nb = ${s.b}\n`,
      hints: ["Multiply with *.", "Output only the product."],
      tests: { type: "stdout", expected: String(product) },
    };
  }
  const mod = (s.a * s.b * s.c) % Math.max(1, s.a + s.b);
  return {
    prompt: `SENIOR byte drill ${level}: print (a*b*c) % (a+b) where a=${s.a}, b=${s.b}, c=${s.c}.`,
    starterCode: `a = ${s.a}\nb = ${s.b}\nc = ${s.c}\n`,
    hints: ["Multiply all three, then use % for remainder.", "Denominator is a+b."],
    tests: { type: "stdout", expected: String(mod) },
  };
}

function functionForge(difficulty: SkillDifficulty, level: number): Exercise {
  const s = scale(level);
  if (difficulty === "beginner") {
    return pyFn(
      "double",
      "n",
      "Write double(n) that returns n multiplied by 2.",
      ["Return n * 2.", "Works for zero too."],
      [
        { args: [s.a], expected: s.a * 2, label: "main" },
        { args: [0], expected: 0, label: "zero" },
      ],
    );
  }
  if (difficulty === "mid") {
    return pyFn(
      "add",
      "a, b",
      "Write add(a, b) returning the sum.",
      ["Return a + b."],
      [
        { args: [s.a, s.b], expected: s.a + s.b, label: "main" },
        { args: [1, 1], expected: 2, label: "1+1" },
      ],
    );
  }
  if (difficulty === "expert") {
    return pyFn(
      "add3",
      "a, b, c",
      "Write add3(a, b, c) returning the sum of three numbers.",
      ["Add all three values."],
      [
        { args: [s.a, s.b, s.c], expected: s.a + s.b + s.c, label: "main" },
        { args: [-1, 2, 3], expected: 4, label: "mix" },
      ],
    );
  }
  return pyFn(
    "fib",
    "n",
    `Senior forge ${level}: fib(n) returns the nth Fibonacci number (fib(0)=0, fib(1)=1).`,
    ["Use a loop or recursion with a base case.", "fib(10) should be 55."],
    [
      { args: [10], expected: 55, label: "fib(10)" },
      { args: [1], expected: 1, label: "fib(1)" },
      { args: [0], expected: 0, label: "fib(0)" },
      { args: [15], expected: 610, label: "fib(15)" },
    ],
  );
}

function stringSurge(difficulty: SkillDifficulty, level: number): Exercise {
  const s = scale(level);
  if (difficulty === "beginner") {
    return pyFn(
      "shout",
      "text",
      "Write shout(text) returning the text uppercased.",
      ["Use .upper()."],
      [
        { args: [s.word], expected: s.word.toUpperCase(), label: s.word },
        { args: ["hi"], expected: "HI", label: "hi" },
      ],
    );
  }
  if (difficulty === "mid") {
    return pyFn(
      "first_three",
      "text",
      "Write first_three(text) returning the first 3 characters.",
      ["Slice with text[:3]."],
      [
        { args: ["CodeQuest"], expected: "Cod", label: "CodeQuest" },
        { args: ["go"], expected: "go", label: "go" },
      ],
    );
  }
  if (difficulty === "expert") {
    return pyFn(
      "repeat_tag",
      "text, times",
      "Write repeat_tag(text, times) returning text repeated times (no separator).",
      ["Multiply a string: text * times."],
      [
        { args: ["ab", 3], expected: "ababab", label: "ab x3" },
        { args: ["x", 1], expected: "x", label: "x x1" },
      ],
    );
  }
  return pyFn(
    "reverse_words",
    "text",
    `Senior string ${level}: reverse_words(text) reverses the order of words (split on single spaces).`,
    ["Split into words.", "Reverse the list, then join with spaces."],
    [
      { args: ["code quest arena"], expected: "arena quest code", label: "three words" },
      { args: ["solo"], expected: "solo", label: "one word" },
      { args: [""], expected: "", label: "empty" },
    ],
  );
}

function loopLabyrinth(difficulty: SkillDifficulty, level: number): Exercise {
  const s = scale(level);
  const target = difficulty === "beginner" ? Math.min(5, s.cap) : s.cap;
  if (difficulty === "senior") {
    return pyFn(
      "count_primes_up_to",
      "n",
      `Senior loop ${level}: count_primes_up_to(n) counts primes from 2 through n.`,
      ["Test each candidate with an inner loop.", "0 and 1 are not prime."],
      [
        { args: [10], expected: 4, label: "n=10" },
        { args: [20], expected: 8, label: "n=20" },
        { args: [1], expected: 0, label: "n=1" },
      ],
    );
  }
  return pyFn(
    "total_through",
    "n",
    `Write total_through(n) returning 1 + 2 + ... + n. Test uses n=${target}.`,
    ["Loop 1..n inclusive.", "range(1, n+1) works."],
    [
      { args: [target], expected: (target * (target + 1)) / 2, label: `n=${target}` },
      { args: [1], expected: 1, label: "n=1" },
    ],
  );
}

function arrayArena(difficulty: SkillDifficulty, level: number): Exercise {
  const s = scale(level);
  if (difficulty === "beginner") {
    return pyFn(
      "first",
      "nums",
      "Write first(nums) returning the first item or None if empty.",
      ["Check length first.", "Return nums[0]."],
      [
        { args: [[s.a, s.b]], expected: s.a, label: "pair" },
        { args: [[]], expected: null, label: "empty" },
      ],
    );
  }
  if (difficulty === "mid") {
    return pyFn(
      "list_sum",
      "nums",
      "Write list_sum(nums) returning the sum of a list.",
      ["sum(nums) or a loop.", "Empty list → 0."],
      [
        { args: [[s.a, s.b, s.c]], expected: s.a + s.b + s.c, label: "triple" },
        { args: [[]], expected: 0, label: "empty" },
      ],
    );
  }
  if (difficulty === "expert") {
    return pyFn(
      "max_of",
      "nums",
      "Write max_of(nums) returning the largest number.",
      ["Track a running max.", "Assume non-empty lists in tests."],
      [
        { args: [[s.a, s.b + 5, s.c]], expected: Math.max(s.a, s.b + 5, s.c), label: "mix" },
        { args: [[-1, -9]], expected: -1, label: "neg" },
      ],
    );
  }
  return pyFn(
    "two_sum_exists",
    "nums, target",
    `Senior array ${level}: two_sum_exists(nums, target) returns True if any two distinct indices sum to target.`,
    ["Nested loop over pairs.", "Return early when a match is found."],
    [
      { args: [[2, 7, 11, 15], 9], expected: true, label: "classic" },
      { args: [[1, 2, 3], 7], expected: false, label: "missing" },
      { args: [[3, 3], 6], expected: true, label: "duplicate" },
    ],
  );
}

function logicLair(difficulty: SkillDifficulty, level: number): Exercise {
  const s = scale(level);
  if (difficulty === "beginner") {
    return pyFn(
      "is_positive",
      "n",
      "Write is_positive(n) returning True when n > 0.",
      ["Compare with > 0."],
      [
        { args: [s.a], expected: s.a > 0, label: "main" },
        { args: [-1], expected: false, label: "neg" },
      ],
    );
  }
  if (difficulty === "mid") {
    return pyFn(
      "is_big",
      "n",
      "Write is_big(n) returning True when n >= 10.",
      ["Compare with >= 10."],
      [
        { args: [s.cap + 10], expected: true, label: "big" },
        { args: [3], expected: false, label: "small" },
      ],
    );
  }
  if (difficulty === "expert") {
    return pyFn(
      "in_range",
      "n, low, high",
      "Write in_range(n, low, high) True when low <= n <= high.",
      ["Two comparisons or chained check."],
      [
        { args: [5, 1, 10], expected: true, label: "inside" },
        { args: [11, 1, 10], expected: false, label: "outside" },
      ],
    );
  }
  return pyFn(
    "admission_tier",
    "age, score",
    `Senior logic ${level}: admission_tier(age, score) returns 'elite' if score>=90 and age>=18, 'standard' if score>=70, else 'retry'.`,
    ["Check elite conditions first.", "Return exact lowercase strings."],
    [
      { args: [20, 95], expected: "elite", label: "elite" },
      { args: [17, 95], expected: "standard", label: "young high scorer" },
      { args: [25, 72], expected: "standard", label: "standard" },
      { args: [30, 50], expected: "retry", label: "retry" },
    ],
  );
}

function bossGate(difficulty: SkillDifficulty, level: number): Exercise {
  const s = scale(level);
  const c = difficulty === "beginner" ? 1 : difficulty === "mid" ? s.c : difficulty === "expert" ? s.c + 2 : s.c + 12;
  return pyFn(
    "boss_stat",
    "a, b",
    `BOSS ${level} (${difficulty}): boss_stat(a,b) returns a*b + ${c}.`,
    ["Multiply, add constant.", "Watch negatives on senior."],
    [
      { args: [s.a, s.b], expected: s.a * s.b + c, label: "main" },
      { args: [2, 3], expected: 6 + c, label: "2,3" },
      ...(difficulty === "senior"
        ? [
            { args: [-2, 4], expected: -8 + c, label: "neg" },
            { args: [0, 99], expected: c, label: "zero" },
          ]
        : []),
    ],
  );
}

const BUILDERS: Record<GameModeId, (d: SkillDifficulty, l: number) => Exercise> = {
  "byte-blitz": byteBlitz,
  "function-forge": functionForge,
  "string-surge": stringSurge,
  "loop-labyrinth": loopLabyrinth,
  "array-arena": arrayArena,
  "logic-lair": logicLair,
  "boss-gate": bossGate,
};

export function buildCoreQuestion(difficulty: SkillDifficulty, mode: GameModeId, level: number) {
  return BUILDERS[mode](difficulty, level);
}
