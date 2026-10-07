import type { GuideLesson } from "@/lib/guides/types";

const PRACTICE_NOTE =
  "Scroll to Practice this lesson below when you're ready. Read first, then type the code yourself — that's how it sticks.";

export const javascriptGuides: GuideLesson[] = [
  {
    slug: "introduction",
    topicId: "javascript",
    title: "Introduction to JavaScript",
    summary: "What JS is, where it runs, and your first script.",
    minutes: 8,
    order: 1,
    blocks: [
      {
        type: "p",
        text: "JavaScript (often shortened to JS) is the language that makes websites interactive. When you click a button, see a popup, or watch content update without reloading the page — that's usually JavaScript at work.",
      },
      {
        type: "p",
        text: "JS runs inside every web browser (Chrome, Firefox, Safari, Edge). It can also run on servers with Node.js. You don't need to install anything special to start learning — Dev Ladder runs your code for you in the practice section.",
      },
      {
        type: "code",
        caption: "Your first line of JavaScript",
        code: 'console.log("Hello from JavaScript!");',
      },
      {
        type: "p",
        text: "console.log() prints a message. Think of it as talking to the screen. The text inside quotes is a string — a piece of text.",
      },
      {
        type: "steps",
        title: "How to read code",
        items: [
          "Read from top to bottom — the computer follows that order.",
          "Text in quotes is literal text (a string).",
          "Parentheses () mean \"run this\" — you're calling console.log.",
          "A semicolon ; at the end is optional but helps keep lines clear.",
        ],
      },
      {
        type: "tip",
        title: "Good to know",
        text: "JavaScript is case-sensitive: hello and Hello are different. Use // for comments — notes the computer ignores.",
      },
      { type: "tip", title: "Ready to try?", text: PRACTICE_NOTE },
    ],
  },
  {
    slug: "variables-and-types",
    topicId: "javascript",
    title: "Variables: let, const, and Types",
    summary: "Declare variables and understand JS data types.",
    minutes: 12,
    order: 2,
    blocks: [
      {
        type: "p",
        text: "A variable is a named box that stores a value. You give it a name so you can use that value later without retyping it.",
      },
      {
        type: "ul",
        items: [
          "const — use when the value should not change (like an app name).",
          "let — use when the value might change later (like a score).",
          "Avoid var in modern code — let and const are clearer.",
        ],
      },
      {
        type: "code",
        caption: "Declaring variables",
        code: 'const appName = "DevLadder";  // stays the same\nlet score = 0;                 // can change\nscore = 10;\n\nlet name = "Jordan";   // string (text)\nlet active = true;     // boolean (true/false)\nlet price = 9.99;      // number',
      },
      {
        type: "p",
        text: "Main types you'll use every day: number, string, boolean. typeof tells you what type a value is:",
      },
      {
        type: "code",
        code: 'console.log(typeof name);   // "string"\nconsole.log(typeof score);  // "number"\nconsole.log(typeof active); // "boolean"',
      },
      {
        type: "tip",
        title: "Remember",
        text: "const must be given a value right away. let can be updated later with score = 20.",
      },
      { type: "tip", title: "Practice", text: PRACTICE_NOTE },
    ],
  },
  {
    slug: "operators",
    topicId: "javascript",
    title: "Operators and Expressions",
    summary: "Math, strings, comparisons, and logical operators.",
    minutes: 10,
    order: 3,
    blocks: [
      {
        type: "p",
        text: "Operators let you calculate and compare values. An expression is anything that produces a value — like 7 + 4 or score >= 60.",
      },
      {
        type: "code",
        caption: "Math operators",
        code: "let a = 10, b = 3;\nconsole.log(a + b);  // 13 (add)\nconsole.log(a - b);  // 7\nconsole.log(a * b);  // 30\nconsole.log(a / b);  // 3.333...\nconsole.log(a % b);  // 1 (remainder)",
      },
      {
        type: "p",
        text: "The + operator also joins strings together. Template literals (backticks) let you embed variables inside text:",
      },
      {
        type: "code",
        code: 'let user = "Mia";\nconsole.log("Hello, " + user);     // join with +\nconsole.log(`Hello, ${user}!`);  // template literal',
      },
      {
        type: "p",
        text: "Comparisons return true or false. Use === and !== to check both value and type. This avoids surprises:",
      },
      {
        type: "code",
        code: 'console.log(5 === 5);    // true\nconsole.log(5 === "5");  // false — number vs string\nconsole.log(5 == "5");   // true — avoid == in modern JS',
      },
      { type: "tip", title: "Practice", text: PRACTICE_NOTE },
    ],
  },
  {
    slug: "conditionals",
    topicId: "javascript",
    title: "Conditionals",
    summary: "if, else if, else, and the ternary operator.",
    minutes: 10,
    order: 4,
    blocks: [
      {
        type: "p",
        text: "Programs need to make decisions. Conditionals let you run different code depending on whether something is true or false.",
      },
      {
        type: "steps",
        title: "How if / else works",
        items: [
          "if (condition) { ... } — runs when condition is true.",
          "else if (other) { ... } — checks another option.",
          "else { ... } — runs when nothing above matched.",
        ],
      },
      {
        type: "code",
        caption: "Temperature example",
        code: 'let temp = 32;\n\nif (temp > 30) {\n  console.log("Hot");\n} else if (temp > 20) {\n  console.log("Warm");\n} else {\n  console.log("Cool");\n}',
      },
      {
        type: "p",
        text: "The ternary operator is a one-line shortcut for simple if/else:",
      },
      {
        type: "code",
        code: 'let score = 75;\nlet status = score >= 60 ? "Pass" : "Fail";\n// If score >= 60, status is "Pass". Otherwise "Fail".',
      },
      {
        type: "tip",
        title: "Tip",
        text: "Put the most specific checks first. Only one branch runs — the first condition that is true wins.",
      },
      { type: "tip", title: "Practice", text: PRACTICE_NOTE },
    ],
  },
  {
    slug: "loops",
    topicId: "javascript",
    title: "Loops",
    summary: "for, while, for...of, and break/continue.",
    minutes: 12,
    order: 5,
    blocks: [
      {
        type: "p",
        text: "Loops repeat code so you don't have to copy-paste the same lines. Use them to count, process lists, or run until a condition changes.",
      },
      {
        type: "code",
        caption: "Classic for loop — count 0 to 4",
        code: "for (let i = 0; i < 5; i++) {\n  console.log(i);\n}",
      },
      {
        type: "p",
        text: "Break it down: let i = 0 starts the counter. i < 5 is the condition — keep going while true. i++ adds 1 after each round.",
      },
      {
        type: "code",
        caption: "for...of — loop over an array",
        code: 'const colors = ["red", "green", "blue"];\nfor (const color of colors) {\n  console.log(color);\n}',
      },
      {
        type: "code",
        caption: "while — repeat while a condition is true",
        code: "let n = 3;\nwhile (n > 0) {\n  console.log(n);\n  n--;  // decrease n so the loop eventually stops\n}",
      },
      {
        type: "tip",
        title: "Watch out",
        text: "Every loop must be able to end. If the condition never becomes false, you get an infinite loop and the program hangs.",
      },
      { type: "tip", title: "Practice", text: PRACTICE_NOTE },
    ],
  },
  {
    slug: "functions",
    topicId: "javascript",
    title: "Functions",
    summary: "Declarations, arrow functions, and parameters.",
    minutes: 14,
    order: 6,
    blocks: [
      {
        type: "p",
        text: "A function is a reusable block of code with a name. You define it once, then call it whenever you need that logic. Parameters pass data in; return sends a result back.",
      },
      {
        type: "code",
        caption: "Function declaration and arrow function",
        code: 'function add(a, b) {\n  return a + b;\n}\n\nconst multiply = (a, b) => a * b;\n\nconsole.log(add(2, 3));       // 5\nconsole.log(multiply(4, 5));  // 20',
      },
      {
        type: "p",
        text: "Arrow functions are shorter — great for simple one-liners. Default parameters give a fallback when the caller doesn't pass a value:",
      },
      {
        type: "code",
        code: 'const greet = (name = "Guest") => `Hi, ${name}`;\nconsole.log(greet());        // "Hi, Guest"\nconsole.log(greet("Sam"));   // "Hi, Sam"',
      },
      {
        type: "tip",
        title: "Best practice",
        text: "One function, one job. Name functions clearly: calculateTotal, formatName, isValidEmail.",
      },
      { type: "tip", title: "Practice", text: PRACTICE_NOTE },
    ],
  },
  {
    slug: "arrays",
    topicId: "javascript",
    title: "Arrays",
    summary: "Create, access, and transform lists of data.",
    minutes: 12,
    order: 7,
    blocks: [
      {
        type: "p",
        text: "An array stores multiple values in order — like a shopping list. Index starts at 0: the first item is nums[0], the second is nums[1].",
      },
      {
        type: "code",
        caption: "Create and use an array",
        code: 'const nums = [1, 2, 3];\nnums.push(4);           // add to the end\nconsole.log(nums.length); // 4\nconsole.log(nums[0]);      // 1',
      },
      {
        type: "p",
        text: "These methods are used constantly in real apps:",
      },
      {
        type: "ul",
        items: [
          "map — transform each item into something new.",
          "filter — keep only items that pass a test.",
          "find — get the first matching item.",
          "reduce — combine all items into one value (like a sum).",
        ],
      },
      {
        type: "code",
        caption: "map and filter",
        code: "const doubled = nums.map(n => n * 2);   // [2, 4, 6, 8]\nconst evens = nums.filter(n => n % 2 === 0); // [2, 4]",
      },
      { type: "tip", title: "Practice", text: PRACTICE_NOTE },
    ],
  },
  {
    slug: "objects",
    topicId: "javascript",
    title: "Objects",
    summary: "Key-value data and destructuring.",
    minutes: 12,
    order: 8,
    blocks: [
      {
        type: "p",
        text: "An object groups related data under named keys — like a profile card with name, age, and methods. Use dot notation to read values: user.name.",
      },
      {
        type: "code",
        code: 'const user = {\n  name: "Alex",\n  age: 20,\n  greet() {\n    return `I am ${this.name}`;\n  }\n};\n\nconsole.log(user.name);\nconsole.log(user.greet());',
      },
      {
        type: "p",
        text: "Destructuring pulls values out in one line — handy when you need several fields at once:",
      },
      {
        type: "code",
        code: "const { name, age } = user;\nconst [first, second] = nums;  // arrays use square brackets",
      },
      { type: "tip", title: "Practice", text: PRACTICE_NOTE },
    ],
  },
  {
    slug: "dom-basics",
    topicId: "javascript",
    title: "DOM Basics",
    summary: "Select elements and respond to user events.",
    minutes: 14,
    order: 9,
    blocks: [
      {
        type: "p",
        text: "The DOM (Document Object Model) is the page the browser builds from your HTML. JavaScript can read it, change text, add classes, and react when users click or type.",
      },
      {
        type: "steps",
        title: "Typical flow",
        items: [
          "Select an element with querySelector or getElementById.",
          "Change it — textContent, classList, style, etc.",
          "Listen for events with addEventListener (click, submit, input).",
        ],
      },
      {
        type: "code",
        code: 'const btn = document.querySelector("#myButton");\nconst title = document.getElementById("title");\n\ntitle.textContent = "Updated!";\nbtn.addEventListener("click", () => {\n  alert("Clicked!");\n});',
      },
      {
        type: "tip",
        title: "Tip",
        text: "IDs should be unique on the page. querySelector returns the first match for a CSS selector like .card or #header.",
      },
    ],
  },
  {
    slug: "async-basics",
    topicId: "javascript",
    title: "Async JavaScript",
    summary: "Promises, async/await, and fetching data.",
    minutes: 14,
    order: 10,
    blocks: [
      {
        type: "p",
        text: "Some tasks take time — loading data from a server, reading a file, waiting on a timer. JavaScript doesn't freeze the whole page; it uses async code. async/await lets you write it in a readable, top-to-bottom style.",
      },
      {
        type: "code",
        caption: "Fetching data from an API",
        code: 'async function loadData() {\n  const response = await fetch("/api/users");\n  const data = await response.json();\n  console.log(data);\n}',
      },
      {
        type: "p",
        text: "await pauses inside an async function until the result is ready. Always wrap risky network code in try/catch so errors don't crash your app silently.",
      },
      {
        type: "code",
        caption: "Error handling",
        code: 'async function loadSafe() {\n  try {\n    const res = await fetch("/api/users");\n    const data = await res.json();\n    console.log(data);\n  } catch (err) {\n    console.log("Could not load data");\n  }\n}',
      },
    ],
  },
];
