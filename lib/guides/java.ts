import type { GuideLesson } from "@/lib/guides/types";

const PRACTICE_NOTE =
  "Scroll to Practice this lesson below when you're ready. Read first, then type the code yourself — that's how it sticks.";

export const javaGuides: GuideLesson[] = [
  {
    slug: "introduction",
    topicId: "java",
    title: "Introduction to Java",
    summary: "What Java is, JVM, and your first class.",
    minutes: 10,
    order: 1,
    blocks: [
      {
        type: "p",
        text: "Java is a popular language for Android apps, enterprise software, and backend servers. Its motto is write once, run anywhere — the same compiled code runs on Windows, Mac, and Linux thanks to the JVM (Java Virtual Machine).",
      },
      {
        type: "p",
        text: "Every Java program lives inside a class. Execution starts in the main method. The file name must match the public class name (HelloWorld.java for class HelloWorld).",
      },
      {
        type: "code",
        caption: "HelloWorld.java",
        code: 'public class HelloWorld {\n    public static void main(String[] args) {\n        System.out.println("Hello, Java!");\n    }\n}',
      },
      {
        type: "steps",
        title: "What each part means",
        items: [
          "public class HelloWorld — defines a class named HelloWorld.",
          "public static void main — the entry point; the JVM starts here.",
          "System.out.println(...) — prints a line to the screen.",
          "Compile: javac HelloWorld.java. Run: java HelloWorld.",
        ],
      },
      { type: "tip", title: "Ready to try?", text: PRACTICE_NOTE },
    ],
  },
  {
    slug: "variables-and-types",
    topicId: "java",
    title: "Variables and Data Types",
    summary: "Primitives, strings, and declaring variables.",
    minutes: 12,
    order: 2,
    blocks: [
      {
        type: "p",
        text: "Java is statically typed — you declare the type before the variable name. That helps catch mistakes early because the compiler knows what each variable can hold.",
      },
      {
        type: "code",
        caption: "Common types",
        code: 'int age = 20;           // whole number\ndouble price = 9.99;    // decimal\nboolean active = true;  // true or false\nString name = "Alex";   // text (capital S — it\'s a class)\n\nfinal int MAX = 100;    // final = cannot change',
      },
      {
        type: "ul",
        items: [
          "Primitives: byte, short, int, long, float, double, char, boolean.",
          "String holds text — always use double quotes.",
          "Use final when a value should never change (like a max score).",
        ],
      },
      { type: "tip", title: "Practice", text: PRACTICE_NOTE },
    ],
  },
  {
    slug: "operators",
    topicId: "java",
    title: "Operators",
    summary: "Arithmetic, comparison, and logical operators.",
    minutes: 8,
    order: 3,
    blocks: [
      {
        type: "p",
        text: "Operators let you do math and compare values. Comparisons return true or false — you'll use those in if statements.",
      },
      {
        type: "code",
        code: "int a = 10, b = 3;\nSystem.out.println(a + b);  // 13\nSystem.out.println(a % b);  // 1 (remainder)\nSystem.out.println(a > b);  // true",
      },
      {
        type: "p",
        text: "The + operator joins strings. For String objects, use .equals() to compare content — == checks if two variables point to the same object, not always the same text.",
      },
      {
        type: "code",
        code: 'String s1 = "hi";\nString s2 = "hi";\nSystem.out.println(s1.equals(s2)); // true — same content',
      },
      { type: "tip", title: "Practice", text: PRACTICE_NOTE },
    ],
  },
  {
    slug: "control-flow",
    topicId: "java",
    title: "Control Flow",
    summary: "if, switch, for, while, and break.",
    minutes: 14,
    order: 4,
    blocks: [
      {
        type: "p",
        text: "Control flow decides which code runs. Use if/else for decisions and loops to repeat work without copy-pasting.",
      },
      {
        type: "code",
        caption: "if / else if / else",
        code: 'int score = 85;\n\nif (score >= 90) {\n    System.out.println("A");\n} else if (score >= 80) {\n    System.out.println("B");\n} else {\n    System.out.println("C");\n}',
      },
      {
        type: "code",
        caption: "for loop — count 0 to 4",
        code: "for (int i = 0; i < 5; i++) {\n    System.out.println(i);\n}",
      },
      {
        type: "p",
        text: "The enhanced for loop (for-each) is simpler when looping over an array or list:",
      },
      {
        type: "code",
        code: 'String[] fruits = {"apple", "banana"};\nfor (String fruit : fruits) {\n    System.out.println(fruit);\n}',
      },
      {
        type: "tip",
        title: "Remember",
        text: "Curly braces { } group code that belongs together. Only one if/else branch runs. Make sure loops can end — update the counter inside while loops.",
      },
      { type: "tip", title: "Practice", text: PRACTICE_NOTE },
    ],
  },
  {
    slug: "methods",
    topicId: "java",
    title: "Methods",
    summary: "Define reusable logic with parameters and return types.",
    minutes: 12,
    order: 5,
    blocks: [
      {
        type: "p",
        text: "A method is a named block of code inside a class. Parameters pass values in; the return type says what comes back. void means nothing is returned.",
      },
      {
        type: "code",
        code: 'public static int add(int a, int b) {\n    return a + b;\n}\n\npublic static void greet(String name) {\n    System.out.println("Hello, " + name);\n}',
      },
      {
        type: "p",
        text: "static methods belong to the class itself — you can call add(2, 3) from main without creating an object first. That's why practice exercises use static methods.",
      },
      { type: "tip", title: "Practice", text: PRACTICE_NOTE },
    ],
  },
  {
    slug: "classes-and-objects",
    topicId: "java",
    title: "Classes and Objects",
    summary: "Create blueprints and instances.",
    minutes: 14,
    order: 6,
    blocks: [
      {
        type: "p",
        text: "A class is a blueprint. An object is one real instance built from that blueprint. Fields store data; methods define behavior.",
      },
      {
        type: "code",
        code: 'public class Player {\n    String name;\n    int level;\n\n    public Player(String name, int level) {\n        this.name = name;\n        this.level = level;\n    }\n\n    public void levelUp() {\n        level++;\n    }\n\n    public static void main(String[] args) {\n        Player p = new Player("Mia", 1);\n        p.levelUp();\n    }\n}',
      },
      {
        type: "tip",
        title: "Key idea",
        text: "new Player(...) creates an object. this refers to the current object inside its own methods.",
      },
    ],
  },
  {
    slug: "arrays",
    topicId: "java",
    title: "Arrays",
    summary: "Fixed-size collections and ArrayList.",
    minutes: 10,
    order: 7,
    blocks: [
      {
        type: "p",
        text: "An array holds a fixed number of items in order. Index starts at 0. length tells you how many slots exist (not the last index).",
      },
      {
        type: "code",
        code: 'int[] nums = {1, 2, 3};\nSystem.out.println(nums.length); // 3\nSystem.out.println(nums[0]);      // 1',
      },
      {
        type: "p",
        text: "ArrayList grows and shrinks — better when you don't know the size ahead of time. Import java.util.ArrayList:",
      },
      {
        type: "code",
        code: 'ArrayList<String> items = new ArrayList<>();\nitems.add("sword");\nitems.add("shield");\nSystem.out.println(items.get(0));',
      },
      { type: "tip", title: "Practice", text: PRACTICE_NOTE },
    ],
  },
  {
    slug: "inheritance",
    topicId: "java",
    title: "Inheritance",
    summary: "Extend classes and override methods.",
    minutes: 12,
    order: 8,
    blocks: [
      {
        type: "p",
        text: "Inheritance lets a child class reuse and extend a parent class. The child gets the parent's fields and methods, and can override behavior.",
      },
      {
        type: "code",
        code: 'class Animal {\n    void speak() {\n        System.out.println("...");\n    }\n}\n\npublic class Dog extends Animal {\n    @Override\n    void speak() {\n        System.out.println("Woof!");\n    }\n}',
      },
      {
        type: "p",
        text: "extends creates the child. @Override replaces a parent method. super calls the parent's version when you still need it.",
      },
    ],
  },
  {
    slug: "encapsulation",
    topicId: "java",
    title: "Encapsulation",
    summary: "private fields, getters, and setters.",
    minutes: 10,
    order: 9,
    blocks: [
      {
        type: "p",
        text: "Encapsulation means hiding internal data and exposing only safe ways to read or change it. Use private for fields, public methods for controlled access.",
      },
      {
        type: "code",
        code: 'public class Account {\n    private double balance;\n\n    public double getBalance() {\n        return balance;\n    }\n\n    public void deposit(double amount) {\n        if (amount > 0) balance += amount;\n    }\n}',
      },
      {
        type: "tip",
        title: "Why it matters",
        text: "deposit checks amount > 0 before changing balance — outsiders can't set balance to -999 by accident.",
      },
    ],
  },
  {
    slug: "exceptions",
    topicId: "java",
    title: "Exception Handling",
    summary: "try, catch, finally, and throwing errors.",
    minutes: 10,
    order: 10,
    blocks: [
      {
        type: "p",
        text: "When something goes wrong at runtime, Java throws an exception. try/catch lets you handle the error gracefully instead of crashing.",
      },
      {
        type: "code",
        code: 'try {\n    int result = 10 / 0;\n} catch (ArithmeticException e) {\n    System.out.println("Cannot divide by zero");\n} finally {\n    System.out.println("Done");\n}',
      },
      {
        type: "p",
        text: "finally always runs — useful for cleanup. Some exceptions are checked and must be handled or declared. Use throw when your code detects an invalid state.",
      },
    ],
  },
];
