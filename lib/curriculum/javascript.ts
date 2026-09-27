import type { Chapter, Lesson, World } from "@/lib/types";

export const javascriptWorlds: World[] = [
  {
    id: "neon-harbor",
    language: "javascript",
    title: "Neon Harbor",
    summary: "Log a message, store values, and write your first functions.",
    icon: "ship",
  },
  {
    id: "signal-spire",
    language: "javascript",
    title: "Signal Spire",
    summary: "Branch with conditions and repeat work with loops.",
    icon: "tower",
  },
  {
    id: "module-citadel",
    language: "javascript",
    title: "Module Citadel",
    summary: "Return results and work through arrays.",
    icon: "blocks",
  },
];

export const javascriptChapters: Chapter[] = [
  {
    id: "js-voice",
    worldId: "neon-harbor",
    title: "Dockside Signals",
    summary: "console.log and variables.",
  },
  {
    id: "js-craft",
    worldId: "neon-harbor",
    title: "Small Scripts",
    summary: "Template strings and addition.",
  },
  {
    id: "js-forks",
    worldId: "signal-spire",
    title: "Split the Signal",
    summary: "if and else for decisions.",
  },
  {
    id: "js-cycles",
    worldId: "signal-spire",
    title: "Repeaters",
    summary: "for and while loops.",
  },
  {
    id: "js-returns",
    worldId: "module-citadel",
    title: "Hand It Back",
    summary: "Functions that return a value.",
  },
  {
    id: "js-arrays",
    worldId: "module-citadel",
    title: "Stacks of Data",
    summary: "Read and total an array.",
  },
];

export const javascriptLessons: Lesson[] = [
  {
    id: "js-hello",
    language: "javascript",
    worldId: "neon-harbor",
    chapterId: "js-voice",
    title: "Signal Hello",
    summary: "Log an exact greeting.",
    xp: 20,
    minutes: 4,
    blocks: [
      {
        type: "p",
        text: "JavaScript shows text with console.log. The value inside the parentheses is written to the console, and a string is text wrapped in quotes.",
      },
      {
        type: "ul",
        items: [
          "Statements usually end with a semicolon.",
          "Spelling and punctuation are part of the output.",
          "console.log is a function call, just like print in Python.",
        ],
      },
      {
        type: "code",
        caption: "Log a line",
        code: 'console.log("Hello, traveler");',
      },
    ],
    exercise: {
      prompt: "Log exactly this line: Hello, CodeQuest!",
      starterCode: "// Send the academy greeting to the console.\n",
      hints: [
        "Use console.log.",
        "Put the greeting in quotes.",
        'console.log("Hello, CodeQuest!");',
      ],
      tests: { type: "stdout", expected: "Hello, CodeQuest!" },
    },
  },
  {
    id: "js-store",
    language: "javascript",
    worldId: "neon-harbor",
    chapterId: "js-voice",
    title: "Name the Lights",
    summary: "Store a name and a level with const and let.",
    xp: 25,
    minutes: 6,
    blocks: [
      {
        type: "p",
        text: "const names a value that you do not plan to reassign. let names a value that can change later. Both can hold strings or numbers.",
      },
      {
        type: "code",
        caption: "Declare, then log",
        code: 'const hero = "Ada";\nlet rank = 2;\nconsole.log(hero, rank);',
      },
      {
        type: "p",
        text: "console.log with two values separates them with a space.",
      },
    ],
    exercise: {
      prompt:
        'Create hero set to "Nova" and level set to 1. Log both so the output is Nova 1.',
      starterCode: 'const hero = "";\nlet level = 0;\n\n// Log hero and level.\n',
      hints: [
        "Strings need quotes. Numbers do not.",
        "Pass both variables to console.log.",
        "console.log(hero, level);",
      ],
      tests: { type: "stdout", expected: "Nova 1" },
    },
  },
  {
    id: "js-greet",
    language: "javascript",
    worldId: "neon-harbor",
    chapterId: "js-craft",
    title: "Template Greeting",
    summary: "Return a hello message with a template string.",
    xp: 30,
    minutes: 7,
    blocks: [
      {
        type: "p",
        text: "A function packages work under a name. Template strings use backticks, and ${name} drops a value into the text.",
      },
      {
        type: "code",
        caption: "Build a sentence from a name",
        code: "function welcome(name) {\n  return `Welcome, ${name}`;\n}",
      },
    ],
    exercise: {
      prompt: 'Write greet(name) so it returns Hello, Ada! when name is "Ada".',
      starterCode: "function greet(name) {\n  return \"\";\n}\n",
      hints: [
        "Use return, not console.log.",
        "Backticks make a template string.",
        "return `Hello, ${name}!`;",
      ],
      tests: {
        type: "function",
        functionName: "greet",
        cases: [
          { args: ["Ada"], expected: "Hello, Ada!", label: "Ada" },
          { args: ["Nova"], expected: "Hello, Nova!", label: "Nova" },
        ],
      },
    },
  },
  {
    id: "js-add",
    language: "javascript",
    worldId: "neon-harbor",
    chapterId: "js-craft",
    title: "Add the Cargo",
    summary: "Return the sum of two numbers.",
    xp: 25,
    minutes: 5,
    blocks: [
      {
        type: "p",
        text: "JavaScript uses +, -, *, and / for arithmetic. A returned number can be checked by the sandbox without you printing it yourself.",
      },
      {
        type: "code",
        caption: "Add two parameters",
        code: "function plus(a, b) {\n  return a + b;\n}",
      },
    ],
    exercise: {
      prompt: "Write add(a, b) and return the sum of the two numbers.",
      starterCode: "function add(a, b) {\n  return 0;\n}\n",
      hints: [
        "Use both parameters.",
        "The + operator adds numbers.",
        "return a + b;",
      ],
      tests: {
        type: "function",
        functionName: "add",
        cases: [
          { args: [2, 3], expected: 5, label: "2 + 3" },
          { args: [10, -4], expected: 6, label: "10 + -4" },
          { args: [0, 0], expected: 0, label: "0 + 0" },
        ],
      },
    },
  },
  {
    id: "js-even",
    language: "javascript",
    worldId: "signal-spire",
    chapterId: "js-forks",
    title: "Even Frequency",
    summary: "Return true when a number is even.",
    xp: 30,
    minutes: 7,
    blocks: [
      {
        type: "p",
        text: "if runs a block when a condition is true. === checks that two values are equal. % gives the remainder after division. Even numbers leave a remainder of 0 when divided by 2.",
      },
      {
        type: "code",
        caption: "A condition can be returned directly",
        code: "function isPositive(n) {\n  return n > 0;\n}",
      },
    ],
    exercise: {
      prompt: "Write isEven(n). Return true when n is even and false when it is odd.",
      starterCode: "function isEven(n) {\n  return false;\n}\n",
      hints: [
        "Remainder uses %.",
        "Compare the remainder to 0 with ===.",
        "return n % 2 === 0;",
      ],
      tests: {
        type: "function",
        functionName: "isEven",
        cases: [
          { args: [4], expected: true, label: "4" },
          { args: [7], expected: false, label: "7" },
          { args: [0], expected: true, label: "0" },
        ],
      },
    },
  },
  {
    id: "js-sign",
    language: "javascript",
    worldId: "signal-spire",
    chapterId: "js-forks",
    title: "Read the Needle",
    summary: "Label a number as positive, negative, or zero.",
    xp: 30,
    minutes: 7,
    blocks: [
      {
        type: "p",
        text: "Stack if statements when a value can fall into more than two groups. The first true condition wins, so order matters.",
      },
      {
        type: "code",
        caption: "Three outcomes",
        code: 'function feel(temp) {\n  if (temp >= 30) return "hot";\n  if (temp <= 10) return "cold";\n  return "mild";\n}',
      },
    ],
    exercise: {
      prompt:
        'Write signLabel(n). Return "positive", "negative", or "zero".',
      starterCode: "function signLabel(n) {\n  return \"zero\";\n}\n",
      hints: [
        "Test n > 0 and n < 0.",
        "The leftover case is zero.",
        "Match the three words exactly.",
      ],
      tests: {
        type: "function",
        functionName: "signLabel",
        cases: [
          { args: [5], expected: "positive", label: "5" },
          { args: [-2], expected: "negative", label: "-2" },
          { args: [0], expected: "zero", label: "0" },
        ],
      },
    },
  },
  {
    id: "js-count",
    language: "javascript",
    worldId: "signal-spire",
    chapterId: "js-cycles",
    title: "Light Three Lamps",
    summary: "Log 1, 2, and 3 with a for loop.",
    xp: 30,
    minutes: 6,
    blocks: [
      {
        type: "p",
        text: "A for loop has a start, a condition, and an update. for (let n = 1; n <= 3; n++) begins at 1 and stops once n is no longer less than or equal to 3.",
      },
      {
        type: "code",
        caption: "One log per pass",
        code: "for (let n = 1; n <= 3; n++) {\n  console.log(n);\n}",
      },
    ],
    exercise: {
      prompt: "Use a for loop to log 1, 2, and 3, each on its own line.",
      starterCode: "// Start at 1 and stop after 3.\n",
      hints: [
        "let n = 1 starts the counter.",
        "Keep going while n <= 3.",
        "console.log(n) inside the loop.",
      ],
      tests: { type: "stdout", expected: "1\n2\n3" },
    },
  },
  {
    id: "js-countdown",
    language: "javascript",
    worldId: "signal-spire",
    chapterId: "js-cycles",
    title: "While the Beacon Holds",
    summary: "Count down from 3 with a while loop.",
    xp: 35,
    minutes: 8,
    blocks: [
      {
        type: "p",
        text: "while repeats until its condition becomes false. Change the variable inside the loop. If you do not, the sandbox will cut the program off.",
      },
      {
        type: "code",
        caption: "Count down from 3",
        code: "let n = 3;\nwhile (n > 0) {\n  console.log(n);\n  n = n - 1;\n}",
      },
    ],
    exercise: {
      prompt: "Use a while loop to log 3, then 2, then 1.",
      starterCode: "let n = 3;\n\n// Log n while it is positive, then decrease it.\n",
      hints: [
        "The condition can be n > 0.",
        "Log n before you change it.",
        "n = n - 1 or n-- moves toward the exit.",
      ],
      tests: { type: "stdout", expected: "3\n2\n1" },
    },
  },
  {
    id: "js-shout",
    language: "javascript",
    worldId: "module-citadel",
    chapterId: "js-returns",
    title: "Shout It Back",
    summary: "Return a word with an exclamation mark.",
    xp: 25,
    minutes: 5,
    blocks: [
      {
        type: "p",
        text: "return sends a value to the caller. console.log only prints. These checks call your function and compare the returned value, so print alone will not pass.",
      },
      {
        type: "code",
        caption: "Join a mark onto a word",
        code: "function excite(word) {\n  return word + \"!\";\n}",
      },
    ],
    exercise: {
      prompt: 'Write shout(word) and return the word followed by "!".',
      starterCode: "function shout(word) {\n  return word;\n}\n",
      hints: [
        "Strings join with +.",
        "The exclamation mark is its own string.",
        'return word + "!";',
      ],
      tests: {
        type: "function",
        functionName: "shout",
        cases: [
          { args: ["Run"], expected: "Run!", label: "Run" },
          { args: ["Quest"], expected: "Quest!", label: "Quest" },
        ],
      },
    },
  },
  {
    id: "js-area",
    language: "javascript",
    worldId: "module-citadel",
    chapterId: "js-returns",
    title: "Measure the Hall",
    summary: "Return the area of a rectangle.",
    xp: 30,
    minutes: 6,
    blocks: [
      {
        type: "p",
        text: "Parameters arrive in the order the caller writes them. width * height is the area of a rectangle. * is multiplication.",
      },
      {
        type: "code",
        caption: "Two inputs, one product",
        code: "function rectangleArea(width, height) {\n  return width * height;\n}",
      },
    ],
    exercise: {
      prompt: "Write area(width, height) and return width multiplied by height.",
      starterCode: "function area(width, height) {\n  return 0;\n}\n",
      hints: [
        "Use both parameters.",
        "* multiplies.",
        "return width * height;",
      ],
      tests: {
        type: "function",
        functionName: "area",
        cases: [
          { args: [3, 4], expected: 12, label: "3 by 4" },
          { args: [8, 1], expected: 8, label: "8 by 1" },
          { args: [5, 5], expected: 25, label: "5 by 5" },
        ],
      },
    },
  },
  {
    id: "js-first",
    language: "javascript",
    worldId: "module-citadel",
    chapterId: "js-arrays",
    title: "Top of the Stack",
    summary: "Return the first item in an array.",
    xp: 30,
    minutes: 6,
    blocks: [
      {
        type: "p",
        text: "An array is an ordered list. Indexes start at 0, so items[0] is the first value. Square brackets both create arrays and read from them.",
      },
      {
        type: "code",
        caption: "Read index 0",
        code: 'const tools = ["map", "torch", "key"];\nconsole.log(tools[0]);',
      },
    ],
    exercise: {
      prompt: "Write firstItem(items) and return the first value in the array.",
      starterCode: "function firstItem(items) {\n  return null;\n}\n",
      hints: [
        "The first index is 0.",
        "Read it with square brackets.",
        "return items[0];",
      ],
      tests: {
        type: "function",
        functionName: "firstItem",
        cases: [
          { args: [["map", "torch"]], expected: "map", label: "map, torch" },
          { args: [[4, 9, 2]], expected: 4, label: "4, 9, 2" },
        ],
      },
    },
  },
  {
    id: "js-total",
    language: "javascript",
    worldId: "module-citadel",
    chapterId: "js-arrays",
    title: "Count the Coins",
    summary: "Return the total of an array of numbers.",
    xp: 35,
    minutes: 8,
    blocks: [
      {
        type: "p",
        text: "Walk an array with for...of, or use reduce. Either way, start from 0 and add each number. An empty array totals 0.",
      },
      {
        type: "code",
        caption: "reduce folds the array into one number",
        code: "function total(nums) {\n  return nums.reduce((sum, n) => sum + n, 0);\n}",
      },
    ],
    exercise: {
      prompt: "Write total(nums) and return the sum of every number in the array.",
      starterCode: "function total(nums) {\n  return 0;\n}\n",
      hints: [
        "A loop or reduce both work.",
        "Do not forget the starting total of 0.",
        "return nums.reduce((sum, n) => sum + n, 0);",
      ],
      tests: {
        type: "function",
        functionName: "total",
        cases: [
          { args: [[1, 2, 3]], expected: 6, label: "1, 2, 3" },
          { args: [[10, -2]], expected: 8, label: "10, -2" },
          { args: [[]], expected: 0, label: "empty" },
        ],
      },
    },
  },
];
