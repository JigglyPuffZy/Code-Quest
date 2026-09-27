import type { Challenge } from "@/lib/types";

export const challenges: Challenge[] = [
  {
    id: "py-reverse",
    language: "python",
    title: "Mirror Script",
    summary: "Return a string reversed.",
    difficulty: "beginner",
    xp: 50,
    requiresLessons: 0,
    blocks: [
      {
        type: "p",
        text: "Python slices can step backward. text[::-1] walks the string from the end to the start. A loop that builds a new string from the last character also works.",
      },
    ],
    exercise: {
      prompt: "Write reverse_text(text) and return the characters in reverse order.",
      starterCode: "def reverse_text(text):\n    return text\n",
      hints: [
        "The last character is text[-1].",
        "A slice with a step of -1 walks backward.",
        "An empty string stays empty.",
      ],
      tests: {
        type: "function",
        functionName: "reverse_text",
        cases: [
          { args: ["quest"], expected: "tseuq", label: "quest" },
          { args: ["a"], expected: "a", label: "a" },
          { args: [""], expected: "", label: "empty" },
        ],
      },
    },
  },
  {
    id: "py-largest",
    language: "python",
    title: "Highest Peak",
    summary: "Return the largest of three numbers.",
    difficulty: "beginner",
    xp: 50,
    requiresLessons: 0,
    blocks: [
      {
        type: "p",
        text: "Compare the three numbers, or call max(a, b, c). The checks include negatives, so do not assume the first argument wins.",
      },
    ],
    exercise: {
      prompt: "Write largest(a, b, c) and return the greatest of the three numbers.",
      starterCode: "def largest(a, b, c):\n    return a\n",
      hints: [
        "max can take three arguments.",
        "You can also nest comparisons.",
        "Negatives still have a largest value.",
      ],
      tests: {
        type: "function",
        functionName: "largest",
        cases: [
          { args: [3, 9, 4], expected: 9, label: "3, 9, 4" },
          { args: [-1, -8, -3], expected: -1, label: "negatives" },
          { args: [5, 5, 2], expected: 5, label: "tie" },
        ],
      },
    },
  },
  {
    id: "py-vowels",
    language: "python",
    title: "Vowel Count",
    summary: "Count a, e, i, o, and u.",
    difficulty: "expert",
    xp: 70,
    requiresLessons: 4,
    blocks: [
      {
        type: "p",
        text: "Walk each character, lowercase it, and add one when it is a vowel. y stays a consonant for this challenge.",
      },
    ],
    exercise: {
      prompt:
        "Write count_vowels(text) and return how many vowels are in the text. Count a, e, i, o, and u, in either case.",
      starterCode: "def count_vowels(text):\n    return 0\n",
      hints: [
        "text.lower() makes the case check easier.",
        "A string can hold the vowels: \"aeiou\".",
        "Add 1 for each matching character.",
      ],
      tests: {
        type: "function",
        functionName: "count_vowels",
        cases: [
          { args: ["CodeQuest"], expected: 4, label: "CodeQuest" },
          { args: ["xyz"], expected: 0, label: "xyz" },
          { args: ["AeIoU"], expected: 5, label: "AeIoU" },
        ],
      },
    },
  },
  {
    id: "py-fizz",
    language: "python",
    title: "Beacon Pattern",
    summary: "Classic FizzBuzz for a single number.",
    difficulty: "senior",
    xp: 80,
    requiresLessons: 4,
    blocks: [
      {
        type: "p",
        text: "Multiples of 3 become Fizz, multiples of 5 become Buzz, and multiples of both become FizzBuzz. Every other number comes back as text.",
      },
      {
        type: "ul",
        items: [
          "Check 15 first, because those numbers are multiples of both 3 and 5.",
          "str(n) turns a number into text.",
        ],
      },
    ],
    exercise: {
      prompt:
        'Write fizzbuzz_line(n). Return "FizzBuzz", "Fizz", "Buzz", or the number as text.',
      starterCode: "def fizzbuzz_line(n):\n    return str(n)\n",
      hints: [
        "n % 15 == 0 catches multiples of both.",
        "Then test 3, then 5.",
        "Otherwise return str(n).",
      ],
      tests: {
        type: "function",
        functionName: "fizzbuzz_line",
        cases: [
          { args: [3], expected: "Fizz", label: "3" },
          { args: [5], expected: "Buzz", label: "5" },
          { args: [15], expected: "FizzBuzz", label: "15" },
          { args: [2], expected: "2", label: "2" },
        ],
      },
    },
  },
  {
    id: "js-sum",
    language: "javascript",
    title: "Cargo Total",
    summary: "Sum every number in an array.",
    difficulty: "beginner",
    xp: 50,
    requiresLessons: 0,
    blocks: [
      {
        type: "p",
        text: "reduce walks an array and keeps a running value. Start it at 0 so an empty array returns 0 instead of failing.",
      },
    ],
    exercise: {
      prompt: "Write sum(nums) and return the total of the array.",
      starterCode: "function sum(nums) {\n  return 0;\n}\n",
      hints: [
        "A for loop can add each value.",
        "reduce needs a starting value.",
        "An empty array totals 0.",
      ],
      tests: {
        type: "function",
        functionName: "sum",
        cases: [
          { args: [[1, 2, 3]], expected: 6, label: "1, 2, 3" },
          { args: [[4, -4]], expected: 0, label: "4, -4" },
          { args: [[]], expected: 0, label: "empty" },
        ],
      },
    },
  },
  {
    id: "js-palindrome",
    language: "javascript",
    title: "Palindrome Gate",
    summary: "Tell whether text reads the same backward.",
    difficulty: "beginner",
    xp: 55,
    requiresLessons: 0,
    blocks: [
      {
        type: "p",
        text: "Lowercase the text, reverse it, and compare. Level and level should both pass. This challenge does not strip spaces.",
      },
    ],
    exercise: {
      prompt:
        "Write isPalindrome(text). Return true when the lowercased text equals its reverse.",
      starterCode: "function isPalindrome(text) {\n  return false;\n}\n",
      hints: [
        "toLowerCase() removes the case difference.",
        "split, reverse, and join rebuild the string backward.",
        "Compare the cleaned text with ===.",
      ],
      tests: {
        type: "function",
        functionName: "isPalindrome",
        cases: [
          { args: ["Level"], expected: true, label: "Level" },
          { args: ["quest"], expected: false, label: "quest" },
          { args: ["a"], expected: true, label: "a" },
        ],
      },
    },
  },
  {
    id: "js-grade",
    language: "javascript",
    title: "Letter Grades",
    summary: "Turn a score into A, B, C, D, or F.",
    difficulty: "expert",
    xp: 70,
    requiresLessons: 4,
    blocks: [
      {
        type: "p",
        text: "Check the highest band first. 90 and above is A, 80 is B, 70 is C, 60 is D, and everything lower is F.",
      },
    ],
    exercise: {
      prompt:
        'Write letterGrade(score). Return "A", "B", "C", "D", or "F" using 90, 80, 70, and 60 as the cutoffs.',
      starterCode: "function letterGrade(score) {\n  return \"F\";\n}\n",
      hints: [
        "Start with score >= 90.",
        "Each following check is the next lower band.",
        "The final return is F.",
      ],
      tests: {
        type: "function",
        functionName: "letterGrade",
        cases: [
          { args: [90], expected: "A", label: "90" },
          { args: [80], expected: "B", label: "80" },
          { args: [70], expected: "C", label: "70" },
          { args: [60], expected: "D", label: "60" },
          { args: [59], expected: "F", label: "59" },
        ],
      },
    },
  },
  {
    id: "js-double",
    language: "javascript",
    title: "Double the Lanterns",
    summary: "Return a new array with every number doubled.",
    difficulty: "expert",
    xp: 75,
    requiresLessons: 4,
    blocks: [
      {
        type: "p",
        text: "map builds a new array by running a function on each item. It does not change the original. Multiply each number by 2.",
      },
    ],
    exercise: {
      prompt: "Write doubleAll(nums) and return a new array where each number is doubled.",
      starterCode: "function doubleAll(nums) {\n  return nums;\n}\n",
      hints: [
        "map returns a new array.",
        "Multiply the current number by 2.",
        "An empty array should return an empty array.",
      ],
      tests: {
        type: "function",
        functionName: "doubleAll",
        cases: [
          { args: [[1, 2, 3]], expected: [2, 4, 6], label: "1, 2, 3" },
          { args: [[0, -2]], expected: [0, -4], label: "0, -2" },
          { args: [[]], expected: [], label: "empty" },
        ],
      },
    },
  },
  {
    id: "ts-initial",
    language: "typescript",
    guideTopicId: "typescript",
    title: "Typed Initials",
    summary: "Return the first letter of a name in uppercase.",
    difficulty: "beginner",
    xp: 50,
    requiresLessons: 0,
    blocks: [
      {
        type: "p",
        text: "Strings have charAt(0) for the first character and toUpperCase() to capitalize it.",
      },
    ],
    exercise: {
      prompt: "Write initial(name) that returns the first character uppercased.",
      starterCode: "function initial(name: string): string {\n  return \"\";\n}\n",
      hints: [
        "name.charAt(0) gets the first letter.",
        "return name.charAt(0).toUpperCase();",
      ],
      tests: {
        type: "function",
        functionName: "initial",
        cases: [
          { args: ["nova"], expected: "N", label: "nova" },
          { args: ["Ada"], expected: "A", label: "Ada" },
        ],
      },
    },
  },
  {
    id: "ts-clamp",
    language: "typescript",
    guideTopicId: "typescript",
    title: "Level Cap",
    summary: "Keep a level between 1 and 99.",
    difficulty: "beginner",
    xp: 55,
    requiresLessons: 0,
    blocks: [
      {
        type: "p",
        text: "Compare the value: if it is below 1 return 1, if above 99 return 99, otherwise return the value.",
      },
    ],
    exercise: {
      prompt: "Write clampLevel(level) that returns level capped between 1 and 99.",
      starterCode: "function clampLevel(level: number): number {\n  return level;\n}\n",
      hints: [
        "if (level < 1) return 1;",
        "if (level > 99) return 99;",
      ],
      tests: {
        type: "function",
        functionName: "clampLevel",
        cases: [
          { args: [0], expected: 1, label: "0" },
          { args: [50], expected: 50, label: "50" },
          { args: [120], expected: 99, label: "120" },
        ],
      },
    },
  },
  {
    id: "ts-even",
    language: "typescript",
    guideTopicId: "typescript",
    title: "Even Check",
    summary: "Tell whether a number is even.",
    difficulty: "mid",
    xp: 65,
    requiresLessons: 3,
    blocks: [
      {
        type: "p",
        text: "A number is even when n % 2 === 0. Return a boolean.",
      },
    ],
    exercise: {
      prompt: "Write isEven(n) that returns true when n is even.",
      starterCode: "function isEven(n: number): boolean {\n  return false;\n}\n",
      hints: ["return n % 2 === 0;"],
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
    id: "ts-merge",
    language: "typescript",
    guideTopicId: "typescript",
    title: "Tag Merge",
    summary: "Join two string tags with a comma.",
    difficulty: "mid",
    xp: 70,
    requiresLessons: 3,
    blocks: [
      {
        type: "p",
        text: "Template literals or + can build a string like \"quest,daily\".",
      },
    ],
    exercise: {
      prompt: 'Write mergeTags(a, b) that returns a + "," + b.',
      starterCode: "function mergeTags(a: string, b: string): string {\n  return \"\";\n}\n",
      hints: ['return a + "," + b;'],
      tests: {
        type: "function",
        functionName: "mergeTags",
        cases: [
          { args: ["quest", "daily"], expected: "quest,daily", label: "quest,daily" },
          { args: ["a", "b"], expected: "a,b", label: "a,b" },
        ],
      },
    },
  },
  {
    id: "java-banner",
    language: "java",
    guideTopicId: "java",
    title: "Quest Banner",
    summary: "Print a two-line banner from main.",
    difficulty: "beginner",
    xp: 50,
    requiresLessons: 0,
    blocks: [
      {
        type: "p",
        text: "Use two println calls. The output must match exactly, including line breaks.",
      },
    ],
    exercise: {
      prompt: 'Print "CodeQuest" on the first line and "Arena" on the second.',
      starterCode: "public class Main {\n  public static void main(String[] args) {\n    // Print two lines.\n  }\n}\n",
      hints: [
        'System.out.println("CodeQuest");',
        'System.out.println("Arena");',
      ],
      tests: { type: "stdout", expected: "CodeQuest\nArena" },
    },
  },
  {
    id: "java-double",
    language: "java",
    guideTopicId: "java",
    title: "Double Print",
    summary: "Print a number doubled.",
    difficulty: "beginner",
    xp: 55,
    requiresLessons: 0,
    blocks: [
      {
        type: "p",
        text: "Set n to 6 and print n * 2.",
      },
    ],
    exercise: {
      prompt: "Set n to 6 and print its double (12).",
      starterCode: "public class Main {\n  public static void main(String[] args) {\n    int n = 0;\n    // Print n * 2.\n  }\n}\n",
      hints: ["n = 6;", "System.out.println(n * 2);"],
      tests: { type: "stdout", expected: "12" },
    },
  },
  {
    id: "java-stars",
    language: "java",
    guideTopicId: "java",
    title: "Star Row",
    summary: "Print five asterisks on one line.",
    difficulty: "mid",
    xp: 65,
    requiresLessons: 3,
    blocks: [
      {
        type: "p",
        text: 'Use a loop or println("*****") — either works if the output matches.',
      },
    ],
    exercise: {
      prompt: 'Print exactly five asterisks: *****',
      starterCode: "public class Main {\n  public static void main(String[] args) {\n    // Print five stars.\n  }\n}\n",
      hints: ['System.out.println("*****");'],
      tests: { type: "stdout", expected: "*****" },
    },
  },
  {
    id: "java-count",
    language: "java",
    guideTopicId: "java",
    title: "Count to Five",
    summary: "Print 1 through 5 on separate lines.",
    difficulty: "senior",
    xp: 75,
    requiresLessons: 3,
    blocks: [
      {
        type: "p",
        text: "A for loop from 1 to 5 with println inside produces five lines.",
      },
    ],
    exercise: {
      prompt: "Print the numbers 1, 2, 3, 4, and 5 each on their own line.",
      starterCode: "public class Main {\n  public static void main(String[] args) {\n    // Count 1 to 5.\n  }\n}\n",
      hints: [
        "for (int i = 1; i <= 5; i++)",
        "System.out.println(i);",
      ],
      tests: { type: "stdout", expected: "1\n2\n3\n4\n5" },
    },
  },
];
