import type { Chapter, Lesson, World } from "@/lib/types";

export const typescriptWorlds: World[] = [
  {
    id: "crystal-dock",
    language: "typescript",
    title: "Crystal Dock",
    summary: "Types, console output, and your first typed functions.",
    icon: "ship",
  },
  {
    id: "typed-spire",
    language: "typescript",
    title: "Typed Spire",
    summary: "Branch with conditions and work through typed arrays.",
    icon: "tower",
  },
];

export const typescriptChapters: Chapter[] = [
  {
    id: "ts-voice",
    worldId: "crystal-dock",
    title: "Typed Signals",
    summary: "console.log and string types.",
  },
  {
    id: "ts-craft",
    worldId: "crystal-dock",
    title: "Small Programs",
    summary: "Numbers, variables, and template strings.",
  },
  {
    id: "ts-forks",
    worldId: "typed-spire",
    title: "Split Decisions",
    summary: "if and else with booleans.",
  },
  {
    id: "ts-returns",
    worldId: "typed-spire",
    title: "Return Values",
    summary: "Functions that hand back a result.",
  },
  {
    id: "ts-arrays",
    worldId: "typed-spire",
    title: "Typed Lists",
    summary: "number[] and summing values.",
  },
  {
    id: "ts-loops",
    worldId: "typed-spire",
    title: "Repeaters",
    summary: "for loops over arrays.",
  },
];

export const typescriptLessons: Lesson[] = [
  {
    id: "ts-hello",
    language: "typescript",
    worldId: "crystal-dock",
    chapterId: "ts-voice",
    title: "Hello, TypeScript",
    summary: "Log an exact greeting with types.",
    xp: 20,
    minutes: 4,
    blocks: [
      {
        type: "p",
        text: "TypeScript is JavaScript with types. console.log still prints to the output. The sandbox checks your exact output.",
      },
      {
        type: "code",
        caption: "A typed greeting",
        code: 'const message: string = "Hello, traveler";\nconsole.log(message);',
      },
    ],
    exercise: {
      prompt: "Print exactly: Hello, CodeQuest!",
      starterCode: "// Log the academy greeting.\n",
      hints: [
        "Use console.log with quotes around the text.",
        'console.log("Hello, CodeQuest!");',
      ],
      tests: { type: "stdout", expected: "Hello, CodeQuest!" },
    },
  },
  {
    id: "ts-store",
    language: "typescript",
    worldId: "crystal-dock",
    chapterId: "ts-voice",
    title: "Named Values",
    summary: "Store a hero name and level, then print them.",
    xp: 25,
    minutes: 5,
    blocks: [
      {
        type: "p",
        text: "Use const for values that do not change. TypeScript can annotate types like string and number after the colon.",
      },
      {
        type: "code",
        caption: "Two variables, one log",
        code: 'const hero: string = "Ada";\nconst level: number = 2;\nconsole.log(hero, level);',
      },
    ],
    exercise: {
      prompt:
        'Create hero as "Nova" and level as 1. Print both on one line so the output is Nova 1.',
      starterCode: 'let hero = "";\nlet level = 0;\n\n// Print hero and level.\n',
      hints: [
        'hero should be the string "Nova".',
        "level should be the number 1.",
        "console.log(hero, level);",
      ],
      tests: { type: "stdout", expected: "Nova 1" },
    },
  },
  {
    id: "ts-greet",
    language: "typescript",
    worldId: "crystal-dock",
    chapterId: "ts-craft",
    title: "Greeting Recipe",
    summary: "Return a hello message for any name.",
    xp: 30,
    minutes: 6,
    blocks: [
      {
        type: "p",
        text: "A function can take typed parameters and return a typed value. Use return to send a string back.",
      },
      {
        type: "code",
        caption: "A function with types",
        code: 'function greet(name: string): string {\n  return "Hello, " + name;\n}',
      },
    ],
    exercise: {
      prompt: 'Write greet(name) that returns "Hello, " plus the name.',
      starterCode: "function greet(name: string): string {\n  return \"\";\n}\n",
      hints: [
        "Concatenate with +.",
        'return "Hello, " + name;',
      ],
      tests: {
        type: "function",
        functionName: "greet",
        cases: [
          { args: ["Nova"], expected: "Hello, Nova", label: "Nova" },
          { args: ["CodeQuest"], expected: "Hello, CodeQuest", label: "CodeQuest" },
        ],
      },
    },
  },
  {
    id: "ts-branch",
    language: "typescript",
    worldId: "typed-spire",
    chapterId: "ts-forks",
    title: "Gate Check",
    summary: "Return whether a level is high enough.",
    xp: 30,
    minutes: 6,
    blocks: [
      {
        type: "p",
        text: "if checks a condition. Return true when level is 10 or higher, otherwise false.",
      },
      {
        type: "code",
        caption: "A simple threshold",
        code: "function canEnter(level: number): boolean {\n  return level >= 10;\n}",
      },
    ],
    exercise: {
      prompt: "Write canEnter(level) that returns true when level is at least 10.",
      starterCode: "function canEnter(level: number): boolean {\n  return false;\n}\n",
      hints: [
        "Use >= to compare.",
        "return level >= 10;",
      ],
      tests: {
        type: "function",
        functionName: "canEnter",
        cases: [
          { args: [10], expected: true, label: "10" },
          { args: [9], expected: false, label: "9" },
          { args: [25], expected: true, label: "25" },
        ],
      },
    },
  },
  {
    id: "ts-sum",
    language: "typescript",
    worldId: "typed-spire",
    chapterId: "ts-returns",
    title: "Add Two",
    summary: "Return the sum of two numbers.",
    xp: 25,
    minutes: 5,
    blocks: [
      {
        type: "p",
        text: "Functions can return numbers. Add the parameters and return the result.",
      },
    ],
    exercise: {
      prompt: "Write add(a, b) that returns a + b.",
      starterCode: "function add(a: number, b: number): number {\n  return 0;\n}\n",
      hints: ["return a + b;"],
      tests: {
        type: "function",
        functionName: "add",
        cases: [
          { args: [2, 3], expected: 5, label: "2 + 3" },
          { args: [-1, 4], expected: 3, label: "-1 + 4" },
        ],
      },
    },
  },
  {
    id: "ts-total",
    language: "typescript",
    worldId: "typed-spire",
    chapterId: "ts-arrays",
    title: "Array Total",
    summary: "Sum every number in a number array.",
    xp: 35,
    minutes: 7,
    blocks: [
      {
        type: "p",
        text: "Walk the array with a for loop or reduce. Start a running total at 0.",
      },
    ],
    exercise: {
      prompt: "Write total(nums) that returns the sum of all numbers in the array.",
      starterCode: "function total(nums: number[]): number {\n  return 0;\n}\n",
      hints: [
        "Use a for loop and add each item.",
        "An empty array should return 0.",
      ],
      tests: {
        type: "function",
        functionName: "total",
        cases: [
          { args: [[1, 2, 3]], expected: 6, label: "1,2,3" },
          { args: [[10]], expected: 10, label: "10" },
          { args: [[]], expected: 0, label: "empty" },
        ],
      },
    },
  },
];
