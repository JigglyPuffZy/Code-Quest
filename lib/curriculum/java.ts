import type { Chapter, Lesson, World } from "@/lib/types";

export const javaWorlds: World[] = [
  {
    id: "jvm-gate",
    language: "java",
    title: "JVM Gate",
    summary: "Your first class, println, and variables.",
    icon: "blocks",
  },
  {
    id: "jvm-tower",
    language: "java",
    title: "JVM Tower",
    summary: "Conditions, loops, and simple methods.",
    icon: "tower",
  },
];

export const javaChapters: Chapter[] = [
  {
    id: "java-hello",
    worldId: "jvm-gate",
    title: "First Class",
    summary: "Main and System.out.println.",
  },
  {
    id: "java-vars",
    worldId: "jvm-gate",
    title: "Variables",
    summary: "Strings and integers.",
  },
  {
    id: "java-flow",
    worldId: "jvm-tower",
    title: "Decisions",
    summary: "if and else.",
  },
  {
    id: "java-loops",
    worldId: "jvm-tower",
    title: "Loops",
    summary: "for and while.",
  },
  {
    id: "java-methods",
    worldId: "jvm-tower",
    title: "Methods",
    summary: "Static helpers inside Main.",
  },
  {
    id: "java-arrays",
    worldId: "jvm-tower",
    title: "Arrays",
    summary: "int[] and summing.",
  },
];

export const javaLessons: Lesson[] = [
  {
    id: "java-hello",
    language: "java",
    worldId: "jvm-gate",
    chapterId: "java-hello",
    title: "Hello, Java",
    summary: "Print an exact greeting from main.",
    xp: 20,
    minutes: 5,
    blocks: [
      {
        type: "p",
        text: "Every Java program starts with a class. The main method is where execution begins. System.out.println writes a line to the output.",
      },
      {
        type: "code",
        caption: "A minimal program",
        code: 'public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, traveler");\n  }\n}',
      },
    ],
    exercise: {
      prompt: "Print exactly: Hello, CodeQuest!",
      starterCode: "public class Main {\n  public static void main(String[] args) {\n    // Print the greeting.\n  }\n}\n",
      hints: [
        "Use System.out.println with quotes.",
        'System.out.println("Hello, CodeQuest!");',
      ],
      tests: { type: "stdout", expected: "Hello, CodeQuest!" },
    },
  },
  {
    id: "java-vars",
    language: "java",
    worldId: "jvm-gate",
    chapterId: "java-vars",
    title: "Hero Stats",
    summary: "Store a name and level, then print them.",
    xp: 25,
    minutes: 6,
    blocks: [
      {
        type: "p",
        text: "Declare variables with a type: String for text, int for whole numbers. println can print several values separated by spaces when you pass them as separate arguments.",
      },
    ],
    exercise: {
      prompt:
        'In main, set hero to "Nova" and level to 1, then print both so the output is Nova 1.',
      starterCode: "public class Main {\n  public static void main(String[] args) {\n    String hero = \"\";\n    int level = 0;\n    // Print hero and level.\n  }\n}\n",
      hints: [
        'hero = "Nova";',
        "level = 1;",
        "System.out.println(hero + \" \" + level); or println(hero, level) won't work — use + for one string.",
      ],
      tests: { type: "stdout", expected: "Nova 1" },
    },
  },
  {
    id: "java-add",
    language: "java",
    worldId: "jvm-gate",
    chapterId: "java-vars",
    title: "Sum Two",
    summary: "Print the sum of two integers.",
    xp: 25,
    minutes: 5,
    blocks: [
      {
        type: "p",
        text: "Add two int variables and print the result with println.",
      },
    ],
    exercise: {
      prompt: "Set a to 7 and b to 5, then print their sum (output should be 12).",
      starterCode: "public class Main {\n  public static void main(String[] args) {\n    int a = 0;\n    int b = 0;\n    // Print a + b.\n  }\n}\n",
      hints: [
        "a = 7; b = 5;",
        "System.out.println(a + b);",
      ],
      tests: { type: "stdout", expected: "12" },
    },
  },
  {
    id: "java-branch",
    language: "java",
    worldId: "jvm-tower",
    chapterId: "java-flow",
    title: "Gate Message",
    summary: "Print different text based on a level.",
    xp: 30,
    minutes: 6,
    blocks: [
      {
        type: "p",
        text: "Use if (level >= 10) to choose which string to print.",
      },
    ],
    exercise: {
      prompt:
        'Set level to 10. If level is 10 or more, print "Welcome". Otherwise print "Try again".',
      starterCode: "public class Main {\n  public static void main(String[] args) {\n    int level = 10;\n    // Print Welcome or Try again.\n  }\n}\n",
      hints: [
        'if (level >= 10) System.out.println("Welcome");',
        'else System.out.println("Try again");',
      ],
      tests: { type: "stdout", expected: "Welcome" },
    },
  },
  {
    id: "java-loop",
    language: "java",
    worldId: "jvm-tower",
    chapterId: "java-loops",
    title: "Count Up",
    summary: "Print numbers 1 through 3 on separate lines.",
    xp: 30,
    minutes: 6,
    blocks: [
      {
        type: "p",
        text: "A for loop can count from 1 to 3 and println each value.",
      },
      {
        type: "code",
        caption: "Count with a for loop",
        code: "for (int i = 1; i <= 3; i++) {\n  System.out.println(i);\n}",
      },
    ],
    exercise: {
      prompt: "Print the numbers 1, 2, and 3 each on their own line.",
      starterCode: "public class Main {\n  public static void main(String[] args) {\n    // Print 1, 2, 3 on separate lines.\n  }\n}\n",
      hints: [
        "for (int i = 1; i <= 3; i++)",
        "System.out.println(i); inside the loop",
      ],
      tests: { type: "stdout", expected: "1\n2\n3" },
    },
  },
  {
    id: "java-array-sum",
    language: "java",
    worldId: "jvm-tower",
    chapterId: "java-arrays",
    title: "Array Sum",
    summary: "Sum an int array and print the total.",
    xp: 35,
    minutes: 7,
    blocks: [
      {
        type: "p",
        text: "Create int[] nums = {1, 2, 3}; loop through it and add each value to a running total, then print the total.",
      },
    ],
    exercise: {
      prompt: "Given int[] nums = {4, 5, 6}, print the sum (15).",
      starterCode: "public class Main {\n  public static void main(String[] args) {\n    int[] nums = {4, 5, 6};\n    // Print the sum.\n  }\n}\n",
      hints: [
        "int sum = 0;",
        "for (int n : nums) sum += n;",
        "System.out.println(sum);",
      ],
      tests: { type: "stdout", expected: "15" },
    },
  },
];
