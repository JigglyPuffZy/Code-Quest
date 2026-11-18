import type { Challenge, FunctionCase } from "@/lib/types";

export type LabTopic = "loops" | "collections" | "functions";
export type ConceptCheck = { question: string; options: string[]; correct: number; explanation: string };
export type LabMission = Challenge & {
  topic: LabTopic;
  mode: "detective" | "project";
  symptom: string;
  checks: ConceptCheck[];
};

function mission(
  id: string, title: string, topic: LabTopic, symptom: string,
  prompt: string, starterCode: string, functionName: string,
  cases: FunctionCase[], hints: string[], checks: ConceptCheck[],
  mode: "detective" | "project" = "detective",
): LabMission {
  return { id: `lab-${id}`, title, language: "javascript", guideTopicId: "javascript",
    summary: symptom, difficulty: "beginner", xp: mode === "project" ? 80 : 50,
    blocks: [], topic, mode, symptom, checks,
    exercise: { prompt, starterCode, tests: { type: "function", functionName, cases }, hints } };
}

export const labMissions: LabMission[] = [
  mission("sum", "The disappearing last item", "loops", "The checkout total misses the last item in every cart.",
    "Fix cartTotal(prices) to return the sum of all prices. Empty carts total 0. Prices may be negative (refunds).",
    "function cartTotal(prices) {\n  let total = 0;\n  for (let i = 0; i < prices.length - 1; i++) {\n    total += prices[i];\n  }\n  return total;\n}", "cartTotal",
    [{ args: [[4, 7, 2]], expected: 13 }, { args: [[]], expected: 0 }, { args: [[9]], expected: 9 }, { args: [[-4, 7]], expected: 3 }],
    ["Trace which indexes the loop visits.", "The last valid index is length - 1.", "The condition must allow that last valid index."],
    [{ question: "Which indexes should a length-3 array visit?", options: ["0, 1", "0, 1, 2", "1, 2, 3"], correct: 1, explanation: "Array indexes start at 0 and end at length - 1." },
      { question: "Why test an empty cart?", options: ["It should skip the loop and return 0", "It should throw an error", "It should add undefined"], correct: 0, explanation: "The accumulator starts at 0, and an empty input has no items to add." }]),
  mission("count", "The counter that forgets", "loops", "The analytics counter reports 1 even when several events match.",
    "Fix countMatches(items, target). Return how many values strictly equal target; do not reset the count inside the loop.",
    "function countMatches(items, target) {\n  let count = 0;\n  for (const item of items) {\n    if (item === target) count = 1;\n  }\n  return count;\n}", "countMatches",
    [{ args: [[1, 2, 1, 1], 1], expected: 3 }, { args: [[], 1], expected: 0 }, { args: [["1", 1], 1], expected: 1 }, { args: [[0, 0, 0], 0], expected: 3 }],
    ["Watch the count after the first and second match.", "Assignment replaces a value. Increment adds to it.", "Use a counter that increases once per match."],
    [{ question: "What should the counter do on every match?", options: ["Reset to 0", "Become 1", "Increase by 1"], correct: 2, explanation: "Each match contributes one to the accumulated count." },
      { question: "Should the string '1' match the number 1?", options: ["Yes, always", "No, strict equality preserves types", "Only in an array"], correct: 1, explanation: "The task uses strict equality, so differing types do not match." }]),
  mission("largest", "Negative scores disappear", "collections", "The leaderboard gives a player 0 even though every recorded score is negative.",
    "Fix largest(scores) to return the greatest score, or null for an empty array. Inputs are finite numbers.",
    "function largest(scores) {\n  let best = 0;\n  for (const score of scores) {\n    if (score > best) best = score;\n  }\n  return best;\n}", "largest",
    [{ args: [[-9, -2, -7]], expected: -2 }, { args: [[]], expected: null }, { args: [[3, 8, 4]], expected: 8 }, { args: [[-5]], expected: -5 }],
    ["An initial value of 0 can beat every negative score.", "Handle the empty array before reading its first element.", "Initialize your candidate using an actual input score."],
    [{ question: "Why is 0 a bad starting maximum?", options: ["Zero cannot be compared", "It fails when all inputs are negative", "It always causes a syntax error"], correct: 1, explanation: "The initial candidate should not introduce a score absent from the input." },
      { question: "What does the empty-input contract require?", options: ["0", "undefined", "null"], correct: 2, explanation: "The explicit empty-array result is null." }]),
  mission("unique", "The duplicate invite", "collections", "The invite list contains repeated usernames, and its order matters.",
    "Fix uniqueNames(names) to return each distinct string once, preserving first-seen order. Do not mutate names.",
    "function uniqueNames(names) {\n  const result = [];\n  for (const name of names) {\n    if (result.includes(name)) result.push(name);\n  }\n  return result;\n}", "uniqueNames",
    [{ args: [["A", "B", "A", "C"]], expected: ["A", "B", "C"] }, { args: [[]], expected: [] }, { args: [["x", "x"]], expected: ["x"] }, { args: [["b", "a"]], expected: ["b", "a"] }],
    ["Ask when a name should be added to the output.", "includes returns true for names already present.", "Add a name only when it is not already in the result."],
    [{ question: "When should a name be appended?", options: ["Only if it is already present", "Only if it is not present", "On every iteration"], correct: 1, explanation: "Appending unseen names removes duplicates while preserving order." },
      { question: "Why not sort the input first?", options: ["It changes first-seen order", "Strings cannot be sorted", "Sorting removes all duplicates"], correct: 0, explanation: "Sorting changes the required order and may also mutate the input." }]),
  mission("discount", "The missing return", "functions", "Discounts print correctly in the console, but the receipt gets no value.",
    "Fix discountedPrice(price, percent) to return price after a percentage discount. Inputs are non-negative; percent is between 0 and 100.",
    "function discountedPrice(price, percent) {\n  const result = price * (1 - percent / 100);\n  console.log(result);\n}", "discountedPrice",
    [{ args: [200, 25], expected: 150 }, { args: [50, 0], expected: 50 }, { args: [80, 100], expected: 0 }, { args: [0, 20], expected: 0 }],
    ["Printing and returning serve different purposes.", "The caller needs a value it can use in another calculation.", "Return the calculated result from the function."],
    [{ question: "What does console.log return to the receipt calculation?", options: ["The printed number", "The discount percentage", "No usable result; return is needed"], correct: 2, explanation: "Logging displays a value; return supplies a value to the caller." },
      { question: "What should a 100% discount return?", options: ["The original price", "0", "100"], correct: 1, explanation: "A full discount removes the entire price." }]),
  mission("greet", "The greeting with no space", "functions", "Personalized greetings run words together, and blank names produce awkward messages.",
    "Fix greet(name): trim surrounding whitespace and return 'Hello, NAME!' for a non-blank name, or 'Hello, friend!' for a blank name.",
    "function greet(name) {\n  return 'Hello,' + name + '!';\n}", "greet",
    [{ args: ["Ada"], expected: "Hello, Ada!" }, { args: ["  Lin  "], expected: "Hello, Lin!" }, { args: [""], expected: "Hello, friend!" }, { args: ["   "], expected: "Hello, friend!" }],
    ["The contract includes exact spacing and punctuation.", "Trim before deciding whether the name is empty.", "Use a fallback name after trimming, then build the greeting."],
    [{ question: "When should whitespace be trimmed?", options: ["After returning", "Before testing for a blank name", "Only for nonempty names"], correct: 1, explanation: "A whitespace-only string becomes empty after trimming." },
      { question: "Why test the exact greeting string?", options: ["Spacing and punctuation are part of the contract", "All strings are equivalent", "The function must log it"], correct: 0, explanation: "A correct output includes the requested spaces and punctuation." }]),
  mission("project-add", "Task tracker: create tasks", "collections", "Stage 1 of 3: build the data model behind a task tracker.",
    "Implement addTask(tasks, title). Return a new array with a task {id, title, completed:false}. Trim title; blank titles return an unchanged-value array. Use max existing ID + 1, starting at 1. Do not mutate inputs.",
    "function addTask(tasks, title) {\n  // Return a new task list\n  return tasks;\n}", "addTask",
    [{ args: [[], " Learn "], expected: [{ id: 1, title: "Learn", completed: false }] }, { args: [[], "   "], expected: [] }, { args: [[{ id: 4, title: "Read", completed: true }], "Build"], expected: [{ id: 4, title: "Read", completed: true }, { id: 5, title: "Build", completed: false }] }],
    ["Trim the title first.", "Find the highest ID instead of using array length.", "Return a new array with the new task appended."],
    [{ question: "Why use maximum ID + 1?", options: ["To reuse deleted IDs", "To avoid collisions after deletions", "To sort task titles"], correct: 1, explanation: "Array length does not guarantee a unique ID when tasks have been deleted." },
      { question: "How should a blank title behave?", options: ["Add an empty task", "Delete all tasks", "Keep the same task values"], correct: 2, explanation: "Blank titles are rejected without changing task values." }], "project"),
  mission("project-toggle", "Task tracker: toggle completion", "functions", "Stage 2 of 3: add reversible task completion without mutating old state.",
    "Implement toggleTask(tasks, id). Return tasks with only the matching task's completed flag inverted. Unknown IDs leave values unchanged. Do not mutate inputs.",
    "function toggleTask(tasks, id) {\n  // Return a new list, updating only the matching task\n  return tasks;\n}", "toggleTask",
    [{ args: [[{ id: 1, title: "Learn", completed: false }], 1], expected: [{ id: 1, title: "Learn", completed: true }] }, { args: [[{ id: 1, title: "Learn", completed: true }], 1], expected: [{ id: 1, title: "Learn", completed: false }] }, { args: [[], 1], expected: [] }, { args: [[{ id: 1, title: "Read", completed: false }], 9], expected: [{ id: 1, title: "Read", completed: false }] }],
    ["Map over the existing tasks.", "Compare IDs and invert only the matching flag.", "Copy the matching object before replacing completed."],
    [{ question: "What does toggling twice do?", options: ["Restores the original completion flag", "Deletes the task", "Creates two tasks"], correct: 0, explanation: "Boolean inversion twice restores the original value." },
      { question: "Why copy the updated object?", options: ["To change its ID", "To preserve the previous state", "To remove its title"], correct: 1, explanation: "Immutable updates let older state snapshots remain accurate." }], "project"),
  mission("project-reducer", "Task tracker: connect the app", "functions", "Stage 3 of 3: combine your earlier functions into a working interactive task tracker.",
    "Implement taskReducer(tasks, action). Support {type:'add',title}, {type:'toggle',id}, and {type:'clearCompleted'}. Unknown actions keep task values unchanged. Include your addTask and toggleTask implementations. Return a new state without mutating inputs.",
    "function taskReducer(tasks, action) {\n  // Call addTask / toggleTask or filter completed tasks\n  return tasks;\n}", "taskReducer",
    [{ args: [[], { type: "add", title: "Ship" }], expected: [{ id: 1, title: "Ship", completed: false }] }, { args: [[{ id: 1, title: "Ship", completed: false }], { type: "toggle", id: 1 }], expected: [{ id: 1, title: "Ship", completed: true }] }, { args: [[{ id: 1, title: "Ship", completed: true }, { id: 2, title: "Read", completed: false }], { type: "clearCompleted" }], expected: [{ id: 2, title: "Read", completed: false }] }, { args: [[], { type: "unknown" }], expected: [] }],
    ["Dispatch according to action.type.", "Reuse your earlier functions for add and toggle.", "Use filter to retain only unfinished tasks for clearCompleted."],
    [{ question: "What does a reducer return?", options: ["The next state", "A DOM element", "Only console output"], correct: 0, explanation: "A reducer derives the next state from the previous state and an action." },
      { question: "Why handle an unknown action?", options: ["To erase user data", "To keep state stable for unsupported events", "To force a browser reload"], correct: 1, explanation: "An unsupported action should preserve the task values." }], "project"),
];

export const detectiveMissions = labMissions.filter((item) => item.mode === "detective");
export const projectMissions = labMissions.filter((item) => item.mode === "project");
export function getLabMission(id: string) { return labMissions.find((item) => item.id === id); }

export function explanationPasses(mission: LabMission, answers: number[], reflection: string) {
  return reflection.trim().length >= 30 && reflection.trim().length <= 2000 &&
    mission.checks.every((check, index) => answers[index] === check.correct);
}
