import type { Chapter, Lesson, World } from "@/lib/types";

export const pythonWorlds: World[] = [
  {
    id: "spark-village",
    language: "python",
    title: "Spark Village",
    summary: "Speak to the machine, store a value, and do a little arithmetic.",
    icon: "spark",
  },
  {
    id: "logic-woods",
    language: "python",
    title: "Logic Woods",
    summary: "Split the path with conditions, then walk it again with loops.",
    icon: "trees",
  },
  {
    id: "function-keep",
    language: "python",
    title: "Function Keep",
    summary: "Pack work into functions and pick values out of lists.",
    icon: "castle",
  },
];

export const pythonChapters: Chapter[] = [
  {
    id: "py-voice",
    worldId: "spark-village",
    title: "First Words",
    summary: "Print a message and keep data in variables.",
  },
  {
    id: "py-numbers",
    worldId: "spark-village",
    title: "Words and Numbers",
    summary: "Build strings and add numbers with small functions.",
  },
  {
    id: "py-forks",
    worldId: "logic-woods",
    title: "Forks in the Path",
    summary: "Choose what happens with if and else.",
  },
  {
    id: "py-cycles",
    worldId: "logic-woods",
    title: "Walking in Circles",
    summary: "Repeat work with for and while.",
  },
  {
    id: "py-returns",
    worldId: "function-keep",
    title: "Return Values",
    summary: "Hand a result back from a function.",
  },
  {
    id: "py-lists",
    worldId: "function-keep",
    title: "The Vault",
    summary: "Read and total items in a list.",
  },
];

export const pythonLessons: Lesson[] = [
  {
    id: "py-hello",
    language: "python",
    worldId: "spark-village",
    chapterId: "py-voice",
    title: "Hello, DevLadder",
    summary: "Print an exact greeting.",
    xp: 20,
    minutes: 4,
    blocks: [
      {
        type: "p",
        text: "A program can talk. In Python, print sends text to the output console. Whatever you put inside the quotes shows up when the program runs.",
      },
      {
        type: "ul",
        items: [
          "Text belongs in quotes: \"Hello\".",
          "Parentheses wrap the value you want to print.",
          "The sandbox checks the output, including spelling and punctuation.",
        ],
      },
      {
        type: "code",
        caption: "A program that says hello",
        code: 'print("Hello, traveler")',
      },
    ],
    exercise: {
      prompt: "Print exactly this line: Hello, DevLadder!",
      starterCode: "# Print the academy greeting.\n",
      hints: [
        "Call the print function.",
        "The greeting needs quotes around it.",
        'print("Hello, DevLadder!")',
      ],
      tests: { type: "stdout", expected: "Hello, DevLadder!" },
    },
  },
  {
    id: "py-store",
    language: "python",
    worldId: "spark-village",
    chapterId: "py-voice",
    title: "Pocket Variables",
    summary: "Store a name and a level, then print them.",
    xp: 25,
    minutes: 6,
    blocks: [
      {
        type: "p",
        text: "A variable is a name for a value. Write the name, then =, then the value. Strings use quotes. Whole numbers do not.",
      },
      {
        type: "code",
        caption: "Two variables, then one print",
        code: 'hero = "Ada"\nrank = 2\nprint(hero, rank)',
      },
      {
        type: "p",
        text: "print with two values separates them with a single space.",
      },
    ],
    exercise: {
      prompt:
        'Create hero set to "Nova" and level set to 1. Print both on one line so the output is Nova 1.',
      starterCode: 'hero = ""\nlevel = 0\n\n# Print hero and level on one line.\n',
      hints: [
        "Assign the string Nova to hero, with quotes.",
        "level should be the number 1, without quotes.",
        'print(hero, level)',
      ],
      tests: { type: "stdout", expected: "Nova 1" },
    },
  },
  {
    id: "py-greet",
    language: "python",
    worldId: "spark-village",
    chapterId: "py-numbers",
    title: "A Greeting Recipe",
    summary: "Return a hello message for any name.",
    xp: 30,
    minutes: 7,
    blocks: [
      {
        type: "p",
        text: "A function is a named recipe. def starts it, the parameters sit in parentheses, and return sends a value back to the caller.",
      },
      {
        type: "code",
        caption: "Join a name onto a sentence",
        code: 'def welcome(name):\n    return "Welcome, " + name',
      },
      {
        type: "ul",
        items: [
          "Indent the body with four spaces.",
          "Plus joins strings together.",
          "You can also write f\"Hello, {name}!\".",
        ],
      },
    ],
    exercise: {
      prompt: 'Write greet(name) so it returns Hello, Ada! when name is "Ada".',
      starterCode: "def greet(name):\n    return \"\"\n",
      hints: [
        "Use return, not print.",
        "The result must include the name and an exclamation mark.",
        'return f"Hello, {name}!"',
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
    id: "py-add",
    language: "python",
    worldId: "spark-village",
    chapterId: "py-numbers",
    title: "Add the Spoils",
    summary: "Return the sum of two numbers.",
    xp: 25,
    minutes: 5,
    blocks: [
      {
        type: "p",
        text: "Numbers use the same functions as strings. +, -, *, and / are the everyday operators. return hands the answer back so other code can use it.",
      },
      {
        type: "code",
        caption: "A tiny adder",
        code: "def plus(a, b):\n    return a + b",
      },
    ],
    exercise: {
      prompt: "Write add(a, b) and return the sum of the two numbers.",
      starterCode: "def add(a, b):\n    return 0\n",
      hints: [
        "The function needs both parameters.",
        "Use the + operator.",
        "return a + b",
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
    id: "py-even",
    language: "python",
    worldId: "logic-woods",
    chapterId: "py-forks",
    title: "Even Ground",
    summary: "Decide whether a number is even.",
    xp: 30,
    minutes: 7,
    blocks: [
      {
        type: "p",
        text: "if runs a block only when a condition is true. A condition often uses a comparison: ==, !=, <, >, <=, or >=. The % operator gives the remainder of a division.",
      },
      {
        type: "code",
        caption: "Remainder tells you if a number is even",
        code: "def is_positive(n):\n    if n > 0:\n        return True\n    return False",
      },
      {
        type: "p",
        text: "True and False are Python's boolean values. An even number has no remainder when divided by 2.",
      },
    ],
    exercise: {
      prompt: "Write is_even(n). Return True when n is even and False when it is odd.",
      starterCode: "def is_even(n):\n    return False\n",
      hints: [
        "n % 2 is 0 for even numbers.",
        "You can return the comparison directly.",
        "return n % 2 == 0",
      ],
      tests: {
        type: "function",
        functionName: "is_even",
        cases: [
          { args: [4], expected: true, label: "4" },
          { args: [7], expected: false, label: "7" },
          { args: [0], expected: true, label: "0" },
        ],
      },
    },
  },
  {
    id: "py-sign",
    language: "python",
    worldId: "logic-woods",
    chapterId: "py-forks",
    title: "Which Way",
    summary: "Label a number as positive, negative, or zero.",
    xp: 30,
    minutes: 7,
    blocks: [
      {
        type: "p",
        text: "When there are more than two outcomes, stack conditions. The first true branch wins. Anything left over can fall through to a final return.",
      },
      {
        type: "code",
        caption: "Three labels for a temperature",
        code: 'def feel(temp):\n    if temp >= 30:\n        return "hot"\n    if temp <= 10:\n        return "cold"\n    return "mild"',
      },
    ],
    exercise: {
      prompt:
        'Write sign_label(n). Return "positive", "negative", or "zero".',
      starterCode: "def sign_label(n):\n    return \"zero\"\n",
      hints: [
        "Check greater than 0 and less than 0 separately.",
        "Zero is the case that remains.",
        "Return the three strings exactly, in lowercase.",
      ],
      tests: {
        type: "function",
        functionName: "sign_label",
        cases: [
          { args: [5], expected: "positive", label: "5" },
          { args: [-2], expected: "negative", label: "-2" },
          { args: [0], expected: "zero", label: "0" },
        ],
      },
    },
  },
  {
    id: "py-count",
    language: "python",
    worldId: "logic-woods",
    chapterId: "py-cycles",
    title: "Count the Lanterns",
    summary: "Print 1, 2, and 3 with a for loop.",
    xp: 30,
    minutes: 6,
    blocks: [
      {
        type: "p",
        text: "A for loop walks through a sequence. range(1, 4) produces 1, then 2, then 3. The stop value is not included.",
      },
      {
        type: "code",
        caption: "Print each number on its own line",
        code: "for n in range(1, 4):\n    print(n)",
      },
    ],
    exercise: {
      prompt: "Use a for loop to print 1, 2, and 3, each on its own line.",
      starterCode: "# Loop from 1 up to and including 3.\n",
      hints: [
        "range(start, stop) stops before stop.",
        "range(1, 4) is the sequence you want.",
        "print(n) inside the loop.",
      ],
      tests: { type: "stdout", expected: "1\n2\n3" },
    },
  },
  {
    id: "py-countdown",
    language: "python",
    worldId: "logic-woods",
    chapterId: "py-cycles",
    title: "While the Torch Lasts",
    summary: "Count down from 3 with a while loop.",
    xp: 35,
    minutes: 8,
    blocks: [
      {
        type: "p",
        text: "A while loop repeats as long as its condition stays true. If you forget to change the value you are testing, the loop never ends. The sandbox stops a program that runs too long.",
      },
      {
        type: "code",
        caption: "Count down, then stop",
        code: "n = 3\nwhile n > 0:\n    print(n)\n    n = n - 1",
      },
    ],
    exercise: {
      prompt: "Use a while loop to print 3, then 2, then 1, each on its own line.",
      starterCode: "n = 3\n\n# Print n while it is still positive, then decrease it.\n",
      hints: [
        "Keep looping while n is greater than 0.",
        "Print before you decrease n.",
        "n = n - 1 moves the countdown forward.",
      ],
      tests: { type: "stdout", expected: "3\n2\n1" },
    },
  },
  {
    id: "py-shout",
    language: "python",
    worldId: "function-keep",
    chapterId: "py-returns",
    title: "Shout It Back",
    summary: "Return a word with an exclamation mark.",
    xp: 25,
    minutes: 5,
    blocks: [
      {
        type: "p",
        text: "return is different from print. print shows text to a person. return gives a value to the code that called the function. The checks for this lesson call your function and read what it returns.",
      },
      {
        type: "code",
        caption: "Add punctuation and give it back",
        code: "def excite(word):\n    return word + \"!\"",
      },
    ],
    exercise: {
      prompt: 'Write shout(word) and return the word followed by "!".',
      starterCode: "def shout(word):\n    return word\n",
      hints: [
        "Join the exclamation mark onto the word.",
        "A string plus a string makes a new string.",
        'return word + "!"',
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
    id: "py-area",
    language: "python",
    worldId: "function-keep",
    chapterId: "py-returns",
    title: "Measure the Hall",
    summary: "Return the area of a rectangle.",
    xp: 30,
    minutes: 6,
    blocks: [
      {
        type: "p",
        text: "Functions can take several parameters. The caller passes them in order: the first value lands in the first parameter, the second in the next.",
      },
      {
        type: "code",
        caption: "Width times height",
        code: "def rectangle_area(width, height):\n    return width * height",
      },
    ],
    exercise: {
      prompt: "Write area(width, height) and return width multiplied by height.",
      starterCode: "def area(width, height):\n    return 0\n",
      hints: [
        "Multiplication uses *.",
        "Use both parameters.",
        "return width * height",
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
    id: "py-first",
    language: "python",
    worldId: "function-keep",
    chapterId: "py-lists",
    title: "First in the Vault",
    summary: "Return the first item in a list.",
    xp: 30,
    minutes: 6,
    blocks: [
      {
        type: "p",
        text: "A list holds several values in order. Square brackets build one, and an index picks an item out. Indexes start at 0, so the first item is items[0].",
      },
      {
        type: "code",
        caption: "Read the front of a list",
        code: 'tools = ["map", "torch", "key"]\nprint(tools[0])',
      },
    ],
    exercise: {
      prompt: "Write first_item(items) and return the first value in the list.",
      starterCode: "def first_item(items):\n    return None\n",
      hints: [
        "Indexes start at 0.",
        "Use square brackets after the list name.",
        "return items[0]",
      ],
      tests: {
        type: "function",
        functionName: "first_item",
        cases: [
          { args: [["map", "torch"]], expected: "map", label: "map, torch" },
          { args: [[4, 9, 2]], expected: 4, label: "4, 9, 2" },
        ],
      },
    },
  },
  {
    id: "py-total",
    language: "python",
    worldId: "function-keep",
    chapterId: "py-lists",
    title: "Count the Coins",
    summary: "Return the total of a list of numbers.",
    xp: 35,
    minutes: 8,
    blocks: [
      {
        type: "p",
        text: "You can walk a list with for. Start a total at 0, then add each number as you visit it. Python also has sum(numbers), which does that walk for you.",
      },
      {
        type: "code",
        caption: "Either style is fine",
        code: "def total(nums):\n    running = 0\n    for n in nums:\n        running = running + n\n    return running",
      },
    ],
    exercise: {
      prompt: "Write total(nums) and return the sum of every number in the list.",
      starterCode: "def total(nums):\n    return 0\n",
      hints: [
        "An empty list should total 0.",
        "Add each item to a running total, or call sum.",
        "return sum(nums)",
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
