import type { Exercise, FunctionCase, LanguageId } from "@/lib/types";

import {
  arrayFnStarter,
  comment,
  fnStarter,
  formatCallExamples,
  functionExercise,
  goalSteps,
  langTitle,
  literal,
  logName,
  pickExpr,
  printExpr,
  printString,
  printVars,
  requireCount,
  returnHint,
  stdoutExercise,
  varDecl,
  withMain,
  type ParamKind,
  type ReturnKind,
} from "@/lib/guides/practice/build";

const INTRO_LINES: string[][] = [
  ["Hello, DevLadder!"],
  ["Welcome, coder!"],
  ["I am learning."],
  ["Practice makes progress."],
  ["Hello", "World"],
  ["Good morning!"],
  ["Let's code today."],
  ["Hi, teammate!"],
  ["Ready to learn."],
  ["Code every day."],
  ["First step", "Next step"],
  ["You can do this."],
  ["Hello from practice."],
  ["Keep going."],
  ["Start", "Finish"],
  ["Small steps count."],
  ["Welcome aboard!"],
  ["Learning is fun."],
  ["Goal", "Done"],
  ["Hello, beginner!"],
];

type VarSeed = {
  story: string;
  fields: Array<{ name: string; value: string | number }>;
};

const VAR_SEEDS: VarSeed[] = [
  { story: "Show the hero name and level on one line.", fields: [{ name: "hero", value: "Alex" }, { name: "level", value: 3 }] },
  { story: "Show the player name and score on one line.", fields: [{ name: "player", value: "Mia" }, { name: "score", value: 12 }] },
  { story: "Show the city name.", fields: [{ name: "city", value: "Manila" }] },
  { story: "Show the age.", fields: [{ name: "age", value: 16 }] },
  { story: "Show first name and last name on one line.", fields: [{ name: "first", value: "Jan" }, { name: "last", value: "Cruz" }] },
  { story: "Show the pet name and age on one line.", fields: [{ name: "pet", value: "Neko" }, { name: "years", value: 2 }] },
  { story: "Show the team name.", fields: [{ name: "team", value: "Foxes" }] },
  { story: "Show coins left.", fields: [{ name: "coins", value: 50 }] },
  { story: "Show the book title and page on one line.", fields: [{ name: "title", value: "Python" }, { name: "page", value: 8 }] },
  { story: "Show the shop name.", fields: [{ name: "shop", value: "Bean Cafe" }] },
  { story: "Show lives remaining.", fields: [{ name: "lives", value: 3 }] },
  { story: "Show the mentor name and year on one line.", fields: [{ name: "mentor", value: "Kai" }, { name: "year", value: 2026 }] },
  { story: "Show the quest name.", fields: [{ name: "quest", value: "First Print" }] },
  { story: "Show high score.", fields: [{ name: "highScore", value: 240 }] },
  { story: "Show the food and price on one line.", fields: [{ name: "food", value: "Mango" }, { name: "price", value: 25 }] },
  { story: "Show the class code.", fields: [{ name: "code", value: "CS101" }] },
  { story: "Show row and seat on one line.", fields: [{ name: "row", value: 4 }, { name: "seat", value: 12 }] },
  { story: "Show the nickname.", fields: [{ name: "nick", value: "Rio" }] },
  { story: "Show mins spent practicing.", fields: [{ name: "mins", value: 15 }] },
  { story: "Show the club name and members on one line.", fields: [{ name: "club", value: "Coders" }, { name: "members", value: 9 }] },
];

type OpSeed = {
  story: string;
  a: number | string;
  b: number | string;
  op: "+" | "-" | "*" | "%" | "concat";
  expected: string;
};

const OP_SEEDS: OpSeed[] = [
  { story: "Add 7 coins and 4 coins.", a: 7, b: 4, op: "+", expected: "11" },
  { story: "Multiply 6 sticker packs by 3.", a: 6, b: 3, op: "*", expected: "18" },
  { story: "Find the leftover candies: 10 divided by 3.", a: 10, b: 3, op: "%", expected: "1" },
  { story: "Join the two text pieces.", a: "Hi", b: "!", op: "concat", expected: "Hi!" },
  { story: "Add 15 points and 6 bonus points.", a: 15, b: 6, op: "+", expected: "21" },
  { story: "A square tile is 5 by 5. Print the area.", a: 5, b: 5, op: "*", expected: "25" },
  { story: "8 seats split into pairs — print the remainder.", a: 8, b: 2, op: "%", expected: "0" },
  { story: "Join first and last into one word.", a: "Dev", b: "Ladder", op: "concat", expected: "DevLadder" },
  { story: "Subtract 8 from 20.", a: 20, b: 8, op: "-", expected: "12" },
  { story: "4 rows of 7 chairs. Print the total.", a: 4, b: 7, op: "*", expected: "28" },
  { story: "Add a score of 100 and 25.", a: 100, b: 25, op: "+", expected: "125" },
  { story: "17 gems shared among 5 people — leftover?", a: 17, b: 5, op: "%", expected: "2" },
  { story: "Join the greeting parts.", a: "Good ", b: "job", op: "concat", expected: "Good job" },
  { story: "Start with 50, spend 19. Print what is left.", a: 50, b: 19, op: "-", expected: "31" },
  { story: "9 boxes with 8 crayons each.", a: 9, b: 8, op: "*", expected: "72" },
  { story: "3 plus 9.", a: 3, b: 9, op: "+", expected: "12" },
  { story: "22 stickers in groups of 7 — leftover?", a: 22, b: 7, op: "%", expected: "1" },
  { story: "Join Hello and World with a comma-space already in the first piece.", a: "Hello, ", b: "World", op: "concat", expected: "Hello, World" },
  { story: "11 minus 11.", a: 11, b: 11, op: "-", expected: "0" },
  { story: "2 weeks times 16 hours.", a: 2, b: 16, op: "*", expected: "32" },
];

type CondSeed = {
  story: string;
  varName: string;
  value: number;
  pythonCond: string;
  jsCond: string;
  whenTrue: string;
  whenFalse: string;
  expectTrue: boolean;
};

const COND_SEEDS: CondSeed[] = [
  { story: "Print Pass if score is 85 or higher; otherwise print Study more.", varName: "score", value: 85, pythonCond: "score >= 85", jsCond: "score >= 85", whenTrue: "Pass", whenFalse: "Study more", expectTrue: true },
  { story: "Print Hot if temp is greater than 30; otherwise print Cool.", varName: "temp", value: 32, pythonCond: "temp > 30", jsCond: "temp > 30", whenTrue: "Hot", whenFalse: "Cool", expectTrue: true },
  { story: "Print Even if n is even; otherwise print Odd.", varName: "n", value: 8, pythonCond: "n % 2 == 0", jsCond: "n % 2 === 0", whenTrue: "Even", whenFalse: "Odd", expectTrue: true },
  { story: "Print Adult if age is 18 or more; otherwise print Minor.", varName: "age", value: 18, pythonCond: "age >= 18", jsCond: "age >= 18", whenTrue: "Adult", whenFalse: "Minor", expectTrue: true },
  { story: "Print Win if points are over 50; otherwise print Try again.", varName: "points", value: 40, pythonCond: "points > 50", jsCond: "points > 50", whenTrue: "Win", whenFalse: "Try again", expectTrue: false },
  { story: "Print Open if hour is less than 18; otherwise print Closed.", varName: "hour", value: 20, pythonCond: "hour < 18", jsCond: "hour < 18", whenTrue: "Open", whenFalse: "Closed", expectTrue: false },
  { story: "Print Free if price is 0; otherwise print Paid.", varName: "price", value: 0, pythonCond: "price == 0", jsCond: "price === 0", whenTrue: "Free", whenFalse: "Paid", expectTrue: true },
  { story: "Print Cold if temp is below 15; otherwise print Warm.", varName: "temp", value: 10, pythonCond: "temp < 15", jsCond: "temp < 15", whenTrue: "Cold", whenFalse: "Warm", expectTrue: true },
  { story: "Print Odd if n is odd; otherwise print Even.", varName: "n", value: 7, pythonCond: "n % 2 != 0", jsCond: "n % 2 !== 0", whenTrue: "Odd", whenFalse: "Even", expectTrue: true },
  { story: "Print Yes if lives are greater than 0; otherwise print Game over.", varName: "lives", value: 0, pythonCond: "lives > 0", jsCond: "lives > 0", whenTrue: "Yes", whenFalse: "Game over", expectTrue: false },
  { story: "Print A if score is 90 or higher; otherwise print B.", varName: "score", value: 92, pythonCond: "score >= 90", jsCond: "score >= 90", whenTrue: "A", whenFalse: "B", expectTrue: true },
  { story: "Print Fast if speed is over 60; otherwise print Slow.", varName: "speed", value: 45, pythonCond: "speed > 60", jsCond: "speed > 60", whenTrue: "Fast", whenFalse: "Slow", expectTrue: false },
  { story: "Print Full if seats left is 0; otherwise print Available.", varName: "left", value: 2, pythonCond: "left == 0", jsCond: "left === 0", whenTrue: "Full", whenFalse: "Available", expectTrue: false },
  { story: "Print Tall if height is 170 or more; otherwise print Short.", varName: "height", value: 170, pythonCond: "height >= 170", jsCond: "height >= 170", whenTrue: "Tall", whenFalse: "Short", expectTrue: true },
  { story: "Print Night if hour is 18 or more; otherwise print Day.", varName: "hour", value: 9, pythonCond: "hour >= 18", jsCond: "hour >= 18", whenTrue: "Night", whenFalse: "Day", expectTrue: false },
  { story: "Print Pass if score is at least 60; otherwise print Fail.", varName: "score", value: 59, pythonCond: "score >= 60", jsCond: "score >= 60", whenTrue: "Pass", whenFalse: "Fail", expectTrue: false },
  { story: "Print Wet if rain is greater than 0; otherwise print Dry.", varName: "rain", value: 3, pythonCond: "rain > 0", jsCond: "rain > 0", whenTrue: "Wet", whenFalse: "Dry", expectTrue: true },
  { story: "Print Teen if age is under 20; otherwise print Grown.", varName: "age", value: 19, pythonCond: "age < 20", jsCond: "age < 20", whenTrue: "Teen", whenFalse: "Grown", expectTrue: true },
  { story: "Print Even if n splits evenly by 2; otherwise print Odd.", varName: "n", value: 11, pythonCond: "n % 2 == 0", jsCond: "n % 2 === 0", whenTrue: "Even", whenFalse: "Odd", expectTrue: false },
  { story: "Print Goal if goals are 1 or more; otherwise print Zero.", varName: "goals", value: 1, pythonCond: "goals >= 1", jsCond: "goals >= 1", whenTrue: "Goal", whenFalse: "Zero", expectTrue: true },
];

type LoopSeed =
  | { kind: "range"; from: number; to: number; story: string }
  | { kind: "evens"; max: number; story: string }
  | { kind: "repeat"; word: string; times: number; story: string }
  | { kind: "countdown"; from: number; story: string };

const LOOP_SEEDS: LoopSeed[] = [
  { kind: "range", from: 1, to: 3, story: "Print 1, 2, and 3 — each number on its own line." },
  { kind: "range", from: 1, to: 5, story: "Print 1 through 5, each on its own line." },
  { kind: "evens", max: 6, story: "Print the even numbers 2, 4, and 6, each on its own line." },
  { kind: "repeat", word: "Go", times: 3, story: "Print the word Go three times, each on its own line." },
  { kind: "countdown", from: 3, story: "Print 3, then 2, then 1 — each on its own line." },
  { kind: "range", from: 4, to: 7, story: "Print 4 through 7, each on its own line." },
  { kind: "repeat", word: "Hi", times: 4, story: "Print Hi four times, each on its own line." },
  { kind: "evens", max: 8, story: "Print even numbers from 2 through 8, each on its own line." },
  { kind: "countdown", from: 5, story: "Count down from 5 to 1, each on its own line." },
  { kind: "range", from: 10, to: 12, story: "Print 10, 11, and 12, each on its own line." },
  { kind: "repeat", word: "Yes", times: 2, story: "Print Yes twice, each on its own line." },
  { kind: "evens", max: 4, story: "Print 2 and 4, each on its own line." },
  { kind: "range", from: 0, to: 2, story: "Print 0, 1, and 2, each on its own line." },
  { kind: "repeat", word: "Code", times: 3, story: "Print Code three times, each on its own line." },
  { kind: "countdown", from: 4, story: "Count down from 4 to 1, each on its own line." },
  { kind: "range", from: 2, to: 6, story: "Print 2 through 6, each on its own line." },
  { kind: "evens", max: 10, story: "Print even numbers from 2 through 10, each on its own line." },
  { kind: "repeat", word: "Loop", times: 5, story: "Print Loop five times, each on its own line." },
  { kind: "range", from: 8, to: 10, story: "Print 8, 9, and 10, each on its own line." },
  { kind: "countdown", from: 2, story: "Print 2 then 1, each on its own line." },
];

type FnSeed = {
  goal: string;
  names: [string, string, string];
  params: Array<{ name: string; kind: ParamKind }>;
  ret: ReturnKind;
  expr: string | { python: string; javascript: string; java: string };
  cases: FunctionCase[];
};

const FN_SEEDS: FnSeed[] = [
  { goal: "Write a function that returns n multiplied by 2.", names: ["double", "double", "doubleNum"], params: [{ name: "n", kind: "int" }], ret: "int", expr: "n * 2", cases: [{ args: [2], expected: 4 }, { args: [5], expected: 10 }] },
  { goal: "Write a function that returns n multiplied by 3.", names: ["triple", "triple", "tripleNum"], params: [{ name: "n", kind: "int" }], ret: "int", expr: "n * 3", cases: [{ args: [2], expected: 6 }, { args: [4], expected: 12 }] },
  { goal: "Write a function that returns a + b.", names: ["add", "add", "addNums"], params: [{ name: "a", kind: "int" }, { name: "b", kind: "int" }], ret: "int", expr: "a + b", cases: [{ args: [3, 4], expected: 7 }, { args: [10, 5], expected: 15 }] },
  { goal: "Write a function that returns Hello, plus the name.", names: ["greet", "greet", "greetName"], params: [{ name: "name", kind: "str" }], ret: "str", expr: '"Hello, " + name', cases: [{ args: ["Mia"], expected: "Hello, Mia" }, { args: ["Alex"], expected: "Hello, Alex" }] },
  { goal: "Write a function that returns whether n is even.", names: ["is_even", "isEven", "isEven"], params: [{ name: "n", kind: "int" }], ret: "bool", expr: { python: "n % 2 == 0", javascript: "n % 2 === 0", java: "n % 2 == 0" }, cases: [{ args: [4], expected: true }, { args: [7], expected: false }] },
  { goal: "Write a function that returns n times itself (n squared).", names: ["square", "square", "squareNum"], params: [{ name: "n", kind: "int" }], ret: "int", expr: "n * n", cases: [{ args: [3], expected: 9 }, { args: [6], expected: 36 }] },
  { goal: "Write a function that returns n plus 1.", names: ["plus_one", "plusOne", "plusOne"], params: [{ name: "n", kind: "int" }], ret: "int", expr: "n + 1", cases: [{ args: [8], expected: 9 }, { args: [0], expected: 1 }] },
  { goal: "Write a function that returns n minus 1.", names: ["minus_one", "minusOne", "minusOne"], params: [{ name: "n", kind: "int" }], ret: "int", expr: "n - 1", cases: [{ args: [8], expected: 7 }, { args: [1], expected: 0 }] },
  { goal: "Write a function that returns width times height (area).", names: ["area", "area", "rectArea"], params: [{ name: "width", kind: "int" }, { name: "height", kind: "int" }], ret: "int", expr: "width * height", cases: [{ args: [3, 4], expected: 12 }, { args: [5, 2], expected: 10 }] },
  { goal: "Write a function that returns the larger of a and b.", names: ["max_of", "maxOf", "maxOf"], params: [{ name: "a", kind: "int" }, { name: "b", kind: "int" }], ret: "int", expr: { python: "max(a, b)", javascript: "Math.max(a, b)", java: "Math.max(a, b)" }, cases: [{ args: [3, 9], expected: 9 }, { args: [12, 4], expected: 12 }] },
  { goal: "Write a function that returns the smaller of a and b.", names: ["min_of", "minOf", "minOf"], params: [{ name: "a", kind: "int" }, { name: "b", kind: "int" }], ret: "int", expr: { python: "min(a, b)", javascript: "Math.min(a, b)", java: "Math.min(a, b)" }, cases: [{ args: [3, 9], expected: 3 }, { args: [12, 4], expected: 4 }] },
  { goal: "Write a function that returns whether n is greater than 0.", names: ["is_positive", "isPositive", "isPositive"], params: [{ name: "n", kind: "int" }], ret: "bool", expr: "n > 0", cases: [{ args: [4], expected: true }, { args: [-2], expected: false }] },
  { goal: "Write a function that returns whether n is zero.", names: ["is_zero", "isZero", "isZero"], params: [{ name: "n", kind: "int" }], ret: "bool", expr: { python: "n == 0", javascript: "n === 0", java: "n == 0" }, cases: [{ args: [0], expected: true }, { args: [3], expected: false }] },
  { goal: "Write a function that returns n multiplied by 10.", names: ["times_ten", "timesTen", "timesTen"], params: [{ name: "n", kind: "int" }], ret: "int", expr: "n * 10", cases: [{ args: [3], expected: 30 }, { args: [7], expected: 70 }] },
  { goal: "Write a function that returns half of n (use whole-number division).", names: ["half", "half", "halfOf"], params: [{ name: "n", kind: "int" }], ret: "int", expr: { python: "n // 2", javascript: "Math.floor(n / 2)", java: "n / 2" }, cases: [{ args: [8], expected: 4 }, { args: [10], expected: 5 }] },
  { goal: "Write a function that returns a + b + c.", names: ["sum_three", "sumThree", "sumThree"], params: [{ name: "a", kind: "int" }, { name: "b", kind: "int" }, { name: "c", kind: "int" }], ret: "int", expr: "a + b + c", cases: [{ args: [1, 2, 3], expected: 6 }, { args: [5, 5, 5], expected: 15 }] },
  { goal: "Write a function that returns whether age is 18 or more.", names: ["is_adult", "isAdult", "isAdult"], params: [{ name: "age", kind: "int" }], ret: "bool", expr: "age >= 18", cases: [{ args: [18], expected: true }, { args: [15], expected: false }] },
  { goal: "Write a function that joins first and last with a space.", names: ["full_name", "fullName", "fullName"], params: [{ name: "first", kind: "str" }, { name: "last", kind: "str" }], ret: "str", expr: 'first + " " + last', cases: [{ args: ["Jan", "Cruz"], expected: "Jan Cruz" }, { args: ["Mia", "Tan"], expected: "Mia Tan" }] },
  { goal: "Write a function that returns Welcome, plus the name.", names: ["welcome", "welcome", "welcomeName"], params: [{ name: "name", kind: "str" }], ret: "str", expr: '"Welcome, " + name', cases: [{ args: ["Kai"], expected: "Welcome, Kai" }, { args: ["Noa"], expected: "Welcome, Noa" }] },
  { goal: "Write a function that returns a minus b.", names: ["difference", "difference", "difference"], params: [{ name: "a", kind: "int" }, { name: "b", kind: "int" }], ret: "int", expr: "a - b", cases: [{ args: [10, 3], expected: 7 }, { args: [4, 4], expected: 0 }] },
];

type ColSeed = {
  goal: string;
  names: [string, string, string];
  expr: string | { python: string; javascript: string; java: string };
  cases: Array<{ nums: number[]; expected: number }>;
  hint: { python: string; javascript: string; java: string };
};

const COL_SEEDS: ColSeed[] = [
  { goal: "Return the total of every number in the list.", names: ["sum_list", "sumArray", "sumArray"], expr: { python: "sum(nums)", javascript: "nums.reduce((a, b) => a + b, 0)", java: "total" }, cases: [{ nums: [1, 2, 3], expected: 6 }, { nums: [10, -2], expected: 8 }], hint: { python: "return sum(nums)", javascript: "let total = 0; for (const n of nums) total += n; return total;", java: "int total = 0; for (int n : nums) total += n; return total;" } },
  { goal: "Return how many items are in the list.", names: ["count_items", "countItems", "countItems"], expr: { python: "len(nums)", javascript: "nums.length", java: "nums.length" }, cases: [{ nums: [1, 2, 3], expected: 3 }, { nums: [8], expected: 1 }], hint: { python: "return len(nums)", javascript: "return nums.length;", java: "return nums.length;" } },
  { goal: "Return the first item in the list.", names: ["first_item", "firstItem", "firstItem"], expr: "nums[0]", cases: [{ nums: [9, 8, 7], expected: 9 }, { nums: [4, 1], expected: 4 }], hint: { python: "return nums[0]", javascript: "return nums[0];", java: "return nums[0];" } },
  { goal: "Return the last item in the list.", names: ["last_item", "lastItem", "lastItem"], expr: { python: "nums[-1]", javascript: "nums[nums.length - 1]", java: "nums[nums.length - 1]" }, cases: [{ nums: [9, 8, 7], expected: 7 }, { nums: [4, 1], expected: 1 }], hint: { python: "return nums[-1]", javascript: "return nums[nums.length - 1];", java: "return nums[nums.length - 1];" } },
  { goal: "Return the biggest number in the list.", names: ["max_of", "maxOf", "maxOf"], expr: { python: "max(nums)", javascript: "Math.max(...nums)", java: "biggest" }, cases: [{ nums: [3, 9, 2], expected: 9 }, { nums: [5, 5], expected: 5 }], hint: { python: "return max(nums)", javascript: "return Math.max(...nums);", java: "int biggest = nums[0]; for (int n : nums) if (n > biggest) biggest = n; return biggest;" } },
  { goal: "Return the smallest number in the list.", names: ["min_of", "minOf", "minOf"], expr: { python: "min(nums)", javascript: "Math.min(...nums)", java: "smallest" }, cases: [{ nums: [3, 9, 2], expected: 2 }, { nums: [5, 5], expected: 5 }], hint: { python: "return min(nums)", javascript: "return Math.min(...nums);", java: "int smallest = nums[0]; for (int n : nums) if (n < smallest) smallest = n; return smallest;" } },
  { goal: "Return all numbers multiplied together.", names: ["product_of", "productOf", "productOf"], expr: { python: "total", javascript: "total", java: "total" }, cases: [{ nums: [2, 3, 4], expected: 24 }, { nums: [5, 2], expected: 10 }], hint: { python: "total = 1\nfor n in nums:\n    total *= n\nreturn total", javascript: "let total = 1; for (const n of nums) total *= n; return total;", java: "int total = 1; for (int n : nums) total *= n; return total;" } },
  { goal: "Return the second item (index 1).", names: ["second_item", "secondItem", "secondItem"], expr: "nums[1]", cases: [{ nums: [9, 8, 7], expected: 8 }, { nums: [0, 15], expected: 15 }], hint: { python: "return nums[1]", javascript: "return nums[1];", java: "return nums[1];" } },
  { goal: "Return the third item (index 2).", names: ["third_item", "thirdItem", "thirdItem"], expr: "nums[2]", cases: [{ nums: [1, 2, 9], expected: 9 }, { nums: [4, 5, 6, 7], expected: 6 }], hint: { python: "return nums[2]", javascript: "return nums[2];", java: "return nums[2];" } },
  { goal: "Return the sum of the first two items.", names: ["sum_first_two", "sumFirstTwo", "sumFirstTwo"], expr: "nums[0] + nums[1]", cases: [{ nums: [4, 6, 9], expected: 10 }, { nums: [1, 2], expected: 3 }], hint: { python: "return nums[0] + nums[1]", javascript: "return nums[0] + nums[1];", java: "return nums[0] + nums[1];" } },
  { goal: "Return biggest minus smallest.", names: ["spread", "spread", "spreadOf"], expr: { python: "max(nums) - min(nums)", javascript: "Math.max(...nums) - Math.min(...nums)", java: "max - min" }, cases: [{ nums: [3, 9, 2], expected: 7 }, { nums: [10, 4], expected: 6 }], hint: { python: "return max(nums) - min(nums)", javascript: "return Math.max(...nums) - Math.min(...nums);", java: "int max = nums[0], min = nums[0]; for (int n : nums) { if (n > max) max = n; if (n < min) min = n; } return max - min;" } },
  { goal: "Return the first item plus 1.", names: ["first_plus_one", "firstPlusOne", "firstPlusOne"], expr: "nums[0] + 1", cases: [{ nums: [7, 2], expected: 8 }, { nums: [0, 9], expected: 1 }], hint: { python: "return nums[0] + 1", javascript: "return nums[0] + 1;", java: "return nums[0] + 1;" } },
  { goal: "Return the first item multiplied by 2.", names: ["double_first", "doubleFirst", "doubleFirst"], expr: "nums[0] * 2", cases: [{ nums: [7, 2], expected: 14 }, { nums: [3], expected: 6 }], hint: { python: "return nums[0] * 2", javascript: "return nums[0] * 2;", java: "return nums[0] * 2;" } },
  { goal: "Return last minus first.", names: ["last_minus_first", "lastMinusFirst", "lastMinusFirst"], expr: { python: "nums[-1] - nums[0]", javascript: "nums[nums.length - 1] - nums[0]", java: "nums[nums.length - 1] - nums[0]" }, cases: [{ nums: [2, 5, 9], expected: 7 }, { nums: [10, 3], expected: -7 }], hint: { python: "return nums[-1] - nums[0]", javascript: "return nums[nums.length - 1] - nums[0];", java: "return nums[nums.length - 1] - nums[0];" } },
  { goal: "Return how many even numbers are in the list.", names: ["count_evens", "countEvens", "countEvens"], expr: { python: "total", javascript: "total", java: "total" }, cases: [{ nums: [1, 2, 3, 4], expected: 2 }, { nums: [2, 8, 1], expected: 2 }], hint: { python: "total = 0\nfor n in nums:\n    if n % 2 == 0:\n        total += 1\nreturn total", javascript: "let total = 0; for (const n of nums) if (n % 2 === 0) total += 1; return total;", java: "int total = 0; for (int n : nums) if (n % 2 == 0) total++; return total;" } },
  { goal: "Return the middle item of a 3-item list (index 1).", names: ["middle_of_three", "middleOfThree", "middleOfThree"], expr: "nums[1]", cases: [{ nums: [10, 20, 30], expected: 20 }, { nums: [5, 1, 9], expected: 1 }], hint: { python: "return nums[1]", javascript: "return nums[1];", java: "return nums[1];" } },
  { goal: "Return only the positive count (numbers greater than 0).", names: ["count_positive", "countPositive", "countPositive"], expr: { python: "total", javascript: "total", java: "total" }, cases: [{ nums: [-1, 2, 0, 4], expected: 2 }, { nums: [3, 3], expected: 2 }], hint: { python: "total = 0\nfor n in nums:\n    if n > 0:\n        total += 1\nreturn total", javascript: "let total = 0; for (const n of nums) if (n > 0) total += 1; return total;", java: "int total = 0; for (int n : nums) if (n > 0) total++; return total;" } },
  { goal: "Return the first item of a tiny score list (high-score board).", names: ["top_score", "topScore", "topScore"], expr: "nums[0]", cases: [{ nums: [99, 70, 12], expected: 99 }, { nums: [50, 50], expected: 50 }], hint: { python: "return nums[0]", javascript: "return nums[0];", java: "return nums[0];" } },
  { goal: "Return the total of a tiny shopping-list of prices.", names: ["cart_total", "cartTotal", "cartTotal"], expr: { python: "sum(nums)", javascript: "nums.reduce((a, b) => a + b, 0)", java: "total" }, cases: [{ nums: [12, 8], expected: 20 }, { nums: [5, 5, 5], expected: 15 }], hint: { python: "return sum(nums)", javascript: "let total = 0; for (const n of nums) total += n; return total;", java: "int total = 0; for (int n : nums) total += n; return total;" } },
  { goal: "Return the hottest temperature (the max).", names: ["hottest", "hottest", "hottest"], expr: { python: "max(nums)", javascript: "Math.max(...nums)", java: "biggest" }, cases: [{ nums: [28, 31, 27], expected: 31 }, { nums: [19, 19], expected: 19 }], hint: { python: "return max(nums)", javascript: "return Math.max(...nums);", java: "int biggest = nums[0]; for (int n : nums) if (n > biggest) biggest = n; return biggest;" } },
];

function fnName(language: LanguageId, names: [string, string, string]) {
  if (language === "python") return names[0];
  if (language === "java") return names[2];
  return names[1];
}

function introExercises(language: LanguageId): Exercise[] {
  const items = INTRO_LINES.map((lines, index) => {
    const expected = lines.join("\n");
    const two = lines.length > 1;
    const sample = two
      ? `${printString(language, lines[0]!)}\n${printString(language, lines[1]!)}`
      : printString(language, lines[0]!);
    const goal = two
      ? `Print exactly these two lines:\n${expected}`
      : `Print exactly this line of text:\n${expected}`;
    const steps = two
      ? [
          `Use ${logName(language)} from the lesson — twice, once per line.`,
          "Put each message inside quotes.",
          "Run tests — the output must match exactly, including both lines.",
        ]
      : [
          `Use ${logName(language)} from the lesson.`,
          "Put the greeting inside quotes.",
          "Run tests — the output must match exactly.",
        ];
    if (index === 2) {
      steps[1] = `A language-specific hello is fine too, but this task wants exactly: ${lines[0]}`;
    }
    return stdoutExercise(
      goalSteps(goal, steps),
      withMain(language, `${comment(language, two ? "Print both lines." : "Print the greeting.")}\n`),
      expected,
      [
        `${logName(language)} shows text on the screen.`,
        two ? `Print the first line, then the second line.` : `Copy carefully — spelling and punctuation must match.`,
        sample,
      ],
      two
        ? "No extra input. Your program should print both lines exactly."
        : `No extra input. Your program should print:\n${expected}`,
    );
  });

  const branded = INTRO_LINES[2] ? items : items;
  if (language !== "javascript") {
    const hello = `Hello, ${langTitle(language)}!`;
    branded[2] = stdoutExercise(
      goalSteps(`Print exactly this line of text:\n${hello}`, [
        `Use ${logName(language)} from the lesson.`,
        "Put the greeting inside quotes.",
        "Run tests — the output must match exactly.",
      ]),
      withMain(language, `${comment(language, "Print the greeting.")}\n`),
      hello,
      [
        `${logName(language)} shows text on the screen.`,
        `Copy carefully — spelling and punctuation must match.`,
        printString(language, hello),
      ],
      `No extra input. Your program should print:\n${hello}`,
    );
  }

  return requireCount(branded, "introduction", language);
}

function variablesExercises(language: LanguageId): Exercise[] {
  const items = VAR_SEEDS.map((seed) => {
    const names = seed.fields.map((field) => field.name);
    const expected = seed.fields.map((field) => String(field.value)).join(" ");
    const assignLines = seed.fields.map(
      (field) => `${field.name} = ${literal(field.value)}`,
    );
    const emptyBody = [
      ...seed.fields.map((field) => varDecl(language, field.name, field.value, "empty")),
      comment(language, "Assign the values, then print them."),
    ].join("\n");
    const steps = [
      ...seed.fields.map((field) => `Set ${field.name} = ${literal(field.value)}`),
      `Print ${names.length > 1 ? "them together" : "it"} with ${printVars(language, names)}`,
    ];
    return stdoutExercise(
      goalSteps(seed.story, steps),
      withMain(language, `${emptyBody}\n`),
      expected,
      [
        assignLines.join(" and "),
        `${printVars(language, names)} prints ${names.length > 1 ? "values with a space" : "the value"}.`,
        "Spelling of names and values must match the task.",
      ],
      `Starter boxes are empty. After you assign values, output should be:\n${expected}`,
    );
  });
  return requireCount(items, "variables", language);
}

function operatorsExercises(language: LanguageId): Exercise[] {
  const items = OP_SEEDS.map((seed) => {
    const expr = seed.op === "concat" ? "a + b" : `a ${seed.op} b`;
    const aDecl = varDecl(language, "a", seed.a, "filled");
    const bDecl = varDecl(language, "b", seed.b, "filled");
    const body = `${aDecl}\n${bDecl}\n${comment(language, `Print ${expr}.`)}\n`;
    return stdoutExercise(
      goalSteps(`${seed.story} Print the result.`, [
        "a and b are already set in the starter code.",
        `Print ${expr} — the answer should be ${seed.expected}.`,
      ]),
      withMain(language, body),
      seed.expected,
      [
        seed.op === "concat" ? "Use + to join two pieces of text." : `Use ${seed.op} on the two numbers.`,
        printExpr(language, expr),
        `Expected output is exactly ${seed.expected}.`,
      ],
      `a = ${literal(seed.a)}, b = ${literal(seed.b)} (already in the starter code)`,
    );
  });
  return requireCount(items, "operators", language);
}

function condFor(language: LanguageId, seed: CondSeed) {
  if (language === "python") return seed.pythonCond;
  return seed.jsCond;
}

function conditionalsExercises(language: LanguageId): Exercise[] {
  const items = COND_SEEDS.map((seed) => {
    const cond = condFor(language, seed);
    const expected = seed.expectTrue ? seed.whenTrue : seed.whenFalse;
    const decl = varDecl(language, seed.varName, seed.value, "filled");
    const ifSample =
      language === "python"
        ? `if ${cond}:\n    print(${JSON.stringify(seed.whenTrue)})\nelse:\n    print(${JSON.stringify(seed.whenFalse)})`
        : language === "java"
          ? `if (${cond}) {\n      System.out.println(${JSON.stringify(seed.whenTrue)});\n    } else {\n      System.out.println(${JSON.stringify(seed.whenFalse)});\n    }`
          : `if (${cond}) {\n  console.log(${JSON.stringify(seed.whenTrue)});\n} else {\n  console.log(${JSON.stringify(seed.whenFalse)});\n}`;
    return stdoutExercise(
      goalSteps(seed.story, [
        `${seed.varName} is already ${seed.value}.`,
        `Write if ${language === "python" ? `${cond}:` : `(${cond})`} and print ${JSON.stringify(seed.whenTrue)}.`,
        `Add else and print ${JSON.stringify(seed.whenFalse)}.`,
      ]),
      withMain(language, `${decl}\n${comment(language, "Write if / else below.")}\n`),
      expected,
      [
        `The condition to check is ${cond}.`,
        `With ${seed.varName} = ${seed.value}, the printed line should be ${expected}.`,
        ifSample,
      ],
      `${seed.varName} = ${seed.value} (already in the starter code)`,
    );
  });
  return requireCount(items, "conditionals", language);
}

function loopExpected(seed: LoopSeed) {
  if (seed.kind === "range") {
    const lines: string[] = [];
    for (let i = seed.from; i <= seed.to; i += 1) lines.push(String(i));
    return lines.join("\n");
  }
  if (seed.kind === "evens") {
    const lines: string[] = [];
    for (let i = 2; i <= seed.max; i += 2) lines.push(String(i));
    return lines.join("\n");
  }
  if (seed.kind === "repeat") {
    return Array.from({ length: seed.times }, () => seed.word).join("\n");
  }
  const lines: string[] = [];
  for (let i = seed.from; i >= 1; i -= 1) lines.push(String(i));
  return lines.join("\n");
}

function loopSteps(language: LanguageId, seed: LoopSeed): string[] {
  if (seed.kind === "range") {
    if (language === "python") {
      return [
        `Use for i in range(${seed.from}, ${seed.to + 1}): — that gives ${seed.from} through ${seed.to}.`,
        "Inside the loop, print(i).",
      ];
    }
    if (language === "java") {
      return [
        `Use for (int i = ${seed.from}; i <= ${seed.to}; i++)`,
        "System.out.println(i); inside the loop.",
      ];
    }
    return [
      `Use for (let i = ${seed.from}; i <= ${seed.to}; i++)`,
      "Inside the loop, console.log(i).",
    ];
  }
  if (seed.kind === "evens") {
    if (language === "python") {
      return [
        `Use for i in range(2, ${seed.max + 1}, 2): — that walks 2, 4, …`,
        "Inside the loop, print(i).",
      ];
    }
    if (language === "java") {
      return [
        `Use for (int i = 2; i <= ${seed.max}; i += 2)`,
        "System.out.println(i); inside the loop.",
      ];
    }
    return [
      `Use for (let i = 2; i <= ${seed.max}; i += 2)`,
      "Inside the loop, console.log(i).",
    ];
  }
  if (seed.kind === "repeat") {
    if (language === "python") {
      return [
        `Use for i in range(${seed.times}):`,
        `Inside the loop, print(${JSON.stringify(seed.word)}).`,
      ];
    }
    if (language === "java") {
      return [
        `Use for (int i = 0; i < ${seed.times}; i++)`,
        `System.out.println(${JSON.stringify(seed.word)}); inside the loop.`,
      ];
    }
    return [
      `Use for (let i = 0; i < ${seed.times}; i++)`,
      `Inside the loop, console.log(${JSON.stringify(seed.word)}).`,
    ];
  }
  if (language === "python") {
    return [
      `Use for i in range(${seed.from}, 0, -1):`,
      "Inside the loop, print(i).",
    ];
  }
  if (language === "java") {
    return [
      `Use for (int i = ${seed.from}; i >= 1; i--)`,
      "System.out.println(i); inside the loop.",
    ];
  }
  return [
    `Use for (let i = ${seed.from}; i >= 1; i--)`,
    "Inside the loop, console.log(i).",
  ];
}

function loopsExercises(language: LanguageId): Exercise[] {
  const items = LOOP_SEEDS.map((seed) => {
    const expected = loopExpected(seed);
    return stdoutExercise(
      goalSteps(seed.story, loopSteps(language, seed)),
      withMain(language, `${comment(language, "Write a loop here.")}\n`),
      expected,
      [
        "A loop repeats the print line so you do not copy-paste.",
        loopSteps(language, seed)[0]!,
        `Expected output:\n${expected}`,
      ],
      `No extra input. Your program should print:\n${expected}`,
    );
  });
  return requireCount(items, "loops", language);
}

function functionsExercises(language: LanguageId): Exercise[] {
  const items = FN_SEEDS.map((seed) => {
    const name = fnName(language, seed.names);
    const expr = pickExpr(language, seed.expr);
    const hint = returnHint(language, expr);
    const starter =
      language === "python"
        ? `def ${name}(${seed.params.map((item) => item.name).join(", ")}):\n    pass\n`
        : fnStarter(language, name, seed.params, seed.ret);
    const steps = [
      language === "python" ? `Replace pass with ${hint}.` : `Inside the function, ${hint}`,
      "Run tests — both examples must match.",
    ];
    return functionExercise(
      goalSteps(seed.goal, steps, formatCallExamples(name, seed.cases)),
      starter,
      name,
      seed.cases,
      [
        language === "python" ? "Delete pass and use return." : "Use return to send the result back.",
        hint,
        "Do not print inside the function — return the value.",
      ],
    );
  });
  return requireCount(items, "functions", language);
}

function collectionsExercises(language: LanguageId): Exercise[] {
  const items = COL_SEEDS.map((seed) => {
    const name = fnName(language, seed.names);
    const cases: FunctionCase[] = seed.cases.map((item) => ({
      args: [item.nums],
      expected: item.expected,
    }));
    const hintKey = language === "typescript" ? "javascript" : language;
    const hint = seed.hint[hintKey];
    return functionExercise(
      goalSteps(seed.goal, [
        "The list/array is passed in as nums.",
        `Return the answer. Hint: ${hint.split("\n")[0]}`,
      ], formatCallExamples(name, cases)),
      arrayFnStarter(language, name),
      name,
      cases,
      [
        language === "python" ? "Replace pass with a return." : "Return the computed number.",
        hint,
        "Index 0 is the first item.",
      ],
    );
  });
  return requireCount(items, "collections", language);
}

export function coreExercises(language: LanguageId, kind: "introduction" | "variables" | "operators" | "conditionals" | "loops" | "functions" | "collections"): Exercise[] {
  switch (kind) {
    case "introduction":
      return introExercises(language);
    case "variables":
      return variablesExercises(language);
    case "operators":
      return operatorsExercises(language);
    case "conditionals":
      return conditionalsExercises(language);
    case "loops":
      return loopsExercises(language);
    case "functions":
      return functionsExercises(language);
    case "collections":
      return collectionsExercises(language);
  }
}
