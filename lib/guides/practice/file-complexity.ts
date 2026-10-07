import type { Exercise, FunctionCase, LanguageId } from "@/lib/types";

import {
  formatCallExamples,
  functionExercise,
  goalSteps,
  requireCount,
} from "@/lib/guides/practice/build";

type TextFnSeed = {
  goal: string;
  name: string;
  hint: string;
  starter?: string;
  cases: FunctionCase[];
};

const FILE_SEEDS: TextFnSeed[] = [
  {
    goal: "Return how many lines are in the text (split by newline).",
    name: "count_lines",
    hint: "return len(text.split('\\n'))",
    cases: [
      { args: ["a\nb\nc"], expected: 3 },
      { args: ["solo"], expected: 1 },
    ],
  },
  {
    goal: "Return the first line of the text.",
    name: "first_line",
    hint: "return text.split('\\n')[0]",
    cases: [
      { args: ["hello\nworld"], expected: "hello" },
      { args: ["only"], expected: "only" },
    ],
  },
  {
    goal: "Return the last line of the text.",
    name: "last_line",
    hint: "lines = text.split('\\n'); return lines[-1]",
    cases: [
      { args: ["a\nb\nc"], expected: "c" },
      { args: ["one"], expected: "one" },
    ],
  },
  {
    goal: "Return the second line (index 1). Empty string if missing.",
    name: "second_line",
    hint: "lines = text.split('\\n'); return lines[1] if len(lines) > 1 else ''",
    cases: [
      { args: ["x\ny\nz"], expected: "y" },
      { args: ["solo"], expected: "" },
    ],
  },
  {
    goal: "Return total characters including newlines.",
    name: "char_count",
    hint: "return len(text)",
    cases: [
      { args: ["hi"], expected: 2 },
      { args: ["a\nb"], expected: 3 },
    ],
  },
  {
    goal: "Return how many words (split on spaces).",
    name: "word_count",
    hint: "return len(text.split())",
    cases: [
      { args: ["one two three"], expected: 3 },
      { args: ["hello"], expected: 1 },
    ],
  },
  {
    goal: "Return lines joined into one string with spaces instead of newlines.",
    name: "lines_to_sentence",
    hint: "return ' '.join(text.split('\\n'))",
    cases: [
      { args: ["Hello\nWorld"], expected: "Hello World" },
      { args: ["a\nb\nc"], expected: "a b c" },
    ],
  },
  {
    goal: "Return True if any line is exactly empty.",
    name: "has_blank_line",
    hint: "return '' in text.split('\\n')",
    cases: [
      { args: ["a\n\nb"], expected: true },
      { args: ["a\nb"], expected: false },
    ],
  },
  {
    goal: "Return how many non-empty lines there are.",
    name: "count_nonempty_lines",
    hint: "return sum(1 for line in text.split('\\n') if line)",
    cases: [
      { args: ["a\n\nb"], expected: 2 },
      { args: ["x\ny\nz"], expected: 3 },
    ],
  },
  {
    goal: "Return the longest line (by character count).",
    name: "longest_line",
    hint: "return max(text.split('\\n'), key=len)",
    cases: [
      { args: ["hi\nhello\nyo"], expected: "hello" },
      { args: ["a\nbb\nccc"], expected: "ccc" },
    ],
  },
  {
    goal: "Return lines in reverse order, joined with newlines.",
    name: "reverse_lines",
    hint: "return '\\n'.join(reversed(text.split('\\n')))",
    cases: [
      { args: ["a\nb\nc"], expected: "c\nb\na" },
      { args: ["x\ny"], expected: "y\nx" },
    ],
  },
  {
    goal: "Return the first character of each line joined together.",
    name: "line_initials",
    hint: "return ''.join(line[0] for line in text.split('\\n') if line)",
    cases: [
      { args: ["cat\ndog\nant"], expected: "cda" },
      { args: ["hi\nyo"], expected: "hy" },
    ],
  },
  {
    goal: "Return how many lines start with the given prefix.",
    name: "lines_starting_with",
    hint: "return sum(1 for line in text.split('\\n') if line.startswith(prefix))",
    starter: "def lines_starting_with(text, prefix):\n    pass\n",
    cases: [
      { args: ["todo: a\ntodo: b\ndone: c", "todo:"], expected: 2 },
      { args: ["x\ny\nz", "a"], expected: 0 },
    ],
  },
  {
    goal: "Return True if the target word appears anywhere in the text.",
    name: "contains_word",
    hint: "return target in text.split()",
    starter: "def contains_word(text, target):\n    pass\n",
    cases: [
      { args: ["the cat sat", "cat"], expected: true },
      { args: ["hello world", "bye"], expected: false },
    ],
  },
  {
    goal: "Return each line uppercased, joined with newlines.",
    name: "uppercase_lines",
    hint: "return '\\n'.join(line.upper() for line in text.split('\\n'))",
    cases: [
      { args: ["hi\nyo"], expected: "HI\nYO" },
      { args: ["a"], expected: "A" },
    ],
  },
  {
    goal: "Return the line at index n, or empty string if out of range.",
    name: "line_at",
    hint: "lines = text.split('\\n'); return lines[n] if n < len(lines) else ''",
    starter: "def line_at(text, n):\n    pass\n",
    cases: [
      { args: ["a\nb\nc", 1], expected: "b" },
      { args: ["solo", 2], expected: "" },
    ],
  },
  {
    goal: "Return total length of all lines combined (no newline characters).",
    name: "chars_without_newlines",
    hint: "return sum(len(line) for line in text.split('\\n'))",
    cases: [
      { args: ["ab\ncd"], expected: 4 },
      { args: ["a\nb\nc"], expected: 3 },
    ],
  },
  {
    goal: "Return how many lines equal the target exactly.",
    name: "count_matching_lines",
    hint: "return sum(1 for line in text.split('\\n') if line == target)",
    starter: "def count_matching_lines(text, target):\n    pass\n",
    cases: [
      { args: ["go\ngo\nstop", "go"], expected: 2 },
      { args: ["a\nb", "c"], expected: 0 },
    ],
  },
  {
    goal: "Prefix every line with '> ' and join with newlines.",
    name: "quote_lines",
    hint: "return '\\n'.join('> ' + line for line in text.split('\\n'))",
    cases: [
      { args: ["hi\nyo"], expected: "> hi\n> yo" },
      { args: ["one"], expected: "> one" },
    ],
  },
  {
    goal: "Return the middle line of a 3-line file (index 1).",
    name: "middle_line",
    hint: "return text.split('\\n')[1]",
    cases: [
      { args: ["top\nmid\nbot"], expected: "mid" },
      { args: ["a\nb\nc"], expected: "b" },
    ],
  },
];

type NumFnSeed = {
  goal: string;
  name: string;
  hint: string;
  starter: string;
  cases: FunctionCase[];
};

const COMPLEXITY_SEEDS: NumFnSeed[] = [
  {
    goal: "Return how many vowels (a,e,i,o,u) are in text — one pass O(n).",
    name: "count_vowels",
    hint: "loop each char, check if lower in 'aeiou'",
    starter: "def count_vowels(text):\n    pass\n",
    cases: [
      { args: ["hello"], expected: 2 },
      { args: ["xyz"], expected: 0 },
    ],
  },
  {
    goal: "Return the sum of all numbers in nums with one loop.",
    name: "sum_all",
    hint: "total = 0; for n in nums: total += n; return total",
    starter: "def sum_all(nums):\n    pass\n",
    cases: [
      { args: [[1, 2, 3]], expected: 6 },
      { args: [[10, -2]], expected: 8 },
    ],
  },
  {
    goal: "Return the largest number using a single loop (no built-in max).",
    name: "find_max",
    hint: "best = nums[0]; for n in nums: if n > best: best = n",
    starter: "def find_max(nums):\n    pass\n",
    cases: [
      { args: [[3, 9, 2]], expected: 9 },
      { args: [[5, 5]], expected: 5 },
    ],
  },
  {
    goal: "Return the smallest number using a single loop.",
    name: "find_min",
    hint: "best = nums[0]; for n in nums: if n < best: best = n",
    starter: "def find_min(nums):\n    pass\n",
    cases: [
      { args: [[3, 9, 2]], expected: 2 },
      { args: [[7]], expected: 7 },
    ],
  },
  {
    goal: "Return how many numbers are greater than 0.",
    name: "count_positive",
    hint: "count n where n > 0",
    starter: "def count_positive(nums):\n    pass\n",
    cases: [
      { args: [[-1, 2, 0, 4]], expected: 2 },
      { args: [[3, 3]], expected: 2 },
    ],
  },
  {
    goal: "Return how many even numbers are in nums.",
    name: "count_evens",
    hint: "n % 2 == 0",
    starter: "def count_evens(nums):\n    pass\n",
    cases: [
      { args: [[1, 2, 3, 4]], expected: 2 },
      { args: [[2, 8, 1]], expected: 2 },
    ],
  },
  {
    goal: "Return True if target appears in nums (linear search).",
    name: "contains",
    hint: "for n in nums: if n == target: return True",
    starter: "def contains(nums, target):\n    pass\n",
    cases: [
      { args: [[1, 2, 3], 2], expected: true },
      { args: [[1, 2, 3], 9], expected: false },
    ],
  },
  {
    goal: "Return the index of target, or -1 if not found.",
    name: "index_of",
    hint: "for i, n in enumerate(nums): if n == target: return i",
    starter: "def index_of(nums, target):\n    pass\n",
    cases: [
      { args: [[10, 20, 30], 20], expected: 1 },
      { args: [[4, 5], 9], expected: -1 },
    ],
  },
  {
    goal: "Return how many zeros are in nums.",
    name: "count_zeros",
    hint: "count n == 0",
    starter: "def count_zeros(nums):\n    pass\n",
    cases: [
      { args: [[0, 1, 0, 2]], expected: 2 },
      { args: [[1, 2]], expected: 0 },
    ],
  },
  {
    goal: "Return the sum of squares (n*n) for each item — one loop.",
    name: "sum_squares",
    hint: "total += n * n",
    starter: "def sum_squares(nums):\n    pass\n",
    cases: [
      { args: [[1, 2, 3]], expected: 14 },
      { args: [[2, 2]], expected: 8 },
    ],
  },
  {
    goal: "Return True if every number is greater than 0.",
    name: "all_positive",
    hint: "if any n <= 0: return False; else return True",
    starter: "def all_positive(nums):\n    pass\n",
    cases: [
      { args: [[1, 2, 3]], expected: true },
      { args: [[1, 0, 2]], expected: false },
    ],
  },
  {
    goal: "Return how many times char appears in text.",
    name: "count_char",
    hint: "for ch in text: if ch == char: count += 1",
    starter: "def count_char(text, char):\n    pass\n",
    cases: [
      { args: ["banana", "a"], expected: 3 },
      { args: ["hello", "z"], expected: 0 },
    ],
  },
  {
    goal: "Return text reversed using a loop or slice.",
    name: "reverse_text",
    hint: "return text[::-1]",
    starter: "def reverse_text(text):\n    pass\n",
    cases: [
      { args: ["abc"], expected: "cba" },
      { args: ["hi"], expected: "ih" },
    ],
  },
  {
    goal: "Return 1 + 2 + ... + n using a loop (not a formula).",
    name: "sum_to_n",
    hint: "total = 0; for i in range(1, n + 1): total += i",
    starter: "def sum_to_n(n):\n    pass\n",
    cases: [
      { args: [5], expected: 15 },
      { args: [3], expected: 6 },
    ],
  },
  {
    goal: "Return the first number greater than limit, or -1 if none.",
    name: "first_above",
    hint: "for n in nums: if n > limit: return n",
    starter: "def first_above(nums, limit):\n    pass\n",
    cases: [
      { args: [[1, 5, 3], 2], expected: 5 },
      { args: [[1, 2], 9], expected: -1 },
    ],
  },
  {
    goal: "Return True if text contains at least one vowel.",
    name: "has_vowel",
    hint: "any ch.lower() in 'aeiou' for ch in text",
    starter: "def has_vowel(text):\n    pass\n",
    cases: [
      { args: ["sky"], expected: false },
      { args: ["hi"], expected: true },
    ],
  },
  {
    goal: "Return the product of all numbers (multiply in one loop).",
    name: "product_all",
    hint: "total = 1; for n in nums: total *= n",
    starter: "def product_all(nums):\n    pass\n",
    cases: [
      { args: [[2, 3, 4]], expected: 24 },
      { args: [[5, 2]], expected: 10 },
    ],
  },
  {
    goal: "Return how many items equal target.",
    name: "count_equal",
    hint: "count n == target",
    starter: "def count_equal(nums, target):\n    pass\n",
    cases: [
      { args: [[1, 2, 2, 3], 2], expected: 2 },
      { args: [[4, 5], 9], expected: 0 },
    ],
  },
  {
    goal: "Return the last even number in nums, or -1 if none.",
    name: "last_even",
    hint: "track last even while looping",
    starter: "def last_even(nums):\n    pass\n",
    cases: [
      { args: [[1, 2, 3, 4]], expected: 4 },
      { args: [[1, 3, 5]], expected: -1 },
    ],
  },
  {
    goal: "Return True if nums is sorted ascending (each item <= next).",
    name: "is_sorted",
    hint: "for i in range(len(nums)-1): if nums[i] > nums[i+1]: return False",
    starter: "def is_sorted(nums):\n    pass\n",
    cases: [
      { args: [[1, 2, 3]], expected: true },
      { args: [[3, 2, 1]], expected: false },
    ],
  },
];

function textFnExercise(seed: TextFnSeed): Exercise {
  const starter = seed.starter ?? `def ${seed.name}(text):\n    pass\n`;
  return functionExercise(
    goalSteps(seed.goal, [
      "Treat text like file contents — lines are split by \\n.",
      `Return using: ${seed.hint}`,
    ], formatCallExamples(seed.name, seed.cases)),
    starter,
    seed.name,
    seed.cases,
    [
      "Think of text.split('\\n') as reading lines from a file.",
      seed.hint,
      "One loop or split is enough — no nested loops needed.",
    ],
  );
}

function complexityFnExercise(seed: NumFnSeed): Exercise {
  return functionExercise(
    goalSteps(`${seed.goal} Avoid nested loops over the same data.`, [
      "Use one pass over the input when possible.",
      `Hint: ${seed.hint}`,
    ], formatCallExamples(seed.name, seed.cases)),
    seed.starter,
    seed.name,
    seed.cases,
    [
      "This is O(n) — one loop over n items.",
      seed.hint,
      "Nested loops on the same list are often O(n²) — too slow for big inputs.",
    ],
  );
}

export function fileHandlingExercises(language: LanguageId): Exercise[] {
  if (language !== "python") return [];
  return requireCount(
    FILE_SEEDS.map(textFnExercise),
    "file-handling",
    language,
  );
}

export function timeComplexityExercises(language: LanguageId): Exercise[] {
  if (language !== "python") return [];
  return requireCount(
    COMPLEXITY_SEEDS.map(complexityFnExercise),
    "time-complexity",
    language,
  );
}
