export type McqQuestion = {
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

const DOM_MCQ: McqQuestion[] = [
  {
    prompt: "What does DOM stand for?",
    options: ["Document Object Model", "Data Output Machine", "Dynamic Object Method", "Display Order Map"],
    correctIndex: 0,
    explanation: "DOM = Document Object Model — the page structure the browser builds from HTML.",
  },
  {
    prompt: "Which method selects the first element matching a CSS selector?",
    options: ["document.querySelector()", "document.getElementById()", "document.write()", "window.alert()"],
    correctIndex: 0,
    explanation: "querySelector('#id') or querySelector('.class') picks the first match.",
  },
  {
    prompt: "Which property changes the text inside an element?",
    options: ["textContent", "innerHTML only", "className", "style.color"],
    correctIndex: 0,
    explanation: "textContent sets plain text. innerHTML can include HTML tags.",
  },
  {
    prompt: "How do you listen for a button click?",
    options: ["addEventListener('click', fn)", "onclick = fn only in HTML", "click.listen(fn)", "button.onPress(fn)"],
    correctIndex: 0,
    explanation: "btn.addEventListener('click', () => { ... }) is the modern way.",
  },
  {
    prompt: "getElementById expects…",
    options: ["An id string (no #)", "A CSS selector with #", "A class name", "An array of ids"],
    correctIndex: 0,
    explanation: "document.getElementById('title') — pass the id without the # symbol.",
  },
  {
    prompt: "What does event.preventDefault() do on a form submit?",
    options: ["Stops the page from reloading", "Deletes the form", "Hides the button", "Sends email automatically"],
    correctIndex: 0,
    explanation: "It prevents the browser's default action (like a full page reload on submit).",
  },
  {
    prompt: "Which is safest for user-typed text displayed on the page?",
    options: ["textContent", "innerHTML with raw input", "document.write(userInput)", "eval(userInput)"],
    correctIndex: 0,
    explanation: "textContent treats input as text, not HTML — helps avoid XSS.",
  },
  {
    prompt: "classList.add('active')…",
    options: ["Adds a CSS class to the element", "Creates a new element", "Removes all classes", "Loads a stylesheet"],
    correctIndex: 0,
    explanation: "classList lets you add, remove, or toggle CSS classes in JavaScript.",
  },
  {
    prompt: "Where does JavaScript run when you open an HTML file in the browser?",
    options: ["In the browser", "On a database server", "Only on Node.js", "In the CSS file"],
    correctIndex: 0,
    explanation: "Browser JS runs in the browser engine. Node.js is for servers.",
  },
  {
    prompt: "What symbol starts an id selector in CSS/querySelector?",
    options: ["#", ".", "@", "$"],
    correctIndex: 0,
    explanation: "#myButton in querySelector. Classes use a dot: .card",
  },
  {
    prompt: "Creating a new element usually starts with…",
    options: ["document.createElement('div')", "new HTML()", "document.add('div')", "DOM.build('div')"],
    correctIndex: 0,
    explanation: "createElement makes the node; appendChild adds it to the page.",
  },
  {
    prompt: "Which event fires when the user types in an input?",
    options: ["input", "load", "scroll", "resize"],
    correctIndex: 0,
    explanation: "'input' fires on every keystroke; 'change' often fires when focus leaves.",
  },
  {
    prompt: "parentElement gives you…",
    options: ["The element that contains this one", "All children", "The first child only", "The document root"],
    correctIndex: 0,
    explanation: "Traverse up with parentElement, down with children or querySelector.",
  },
  {
    prompt: "Why use defer on a <script src=… defer>?",
    options: ["Run after HTML is parsed", "Run before HTML exists", "Block CSS loading", "Hide the script"],
    correctIndex: 0,
    explanation: "defer downloads in parallel but executes after the document is parsed.",
  },
  {
    prompt: "querySelectorAll returns…",
    options: ["A NodeList of all matches", "Only the first match", "A boolean", "A string"],
    correctIndex: 0,
    explanation: "Loop with forEach or for...of over the NodeList.",
  },
  {
    prompt: "To remove a class named 'hidden', use…",
    options: ["element.classList.remove('hidden')", "element.deleteClass('hidden')", "element.hidden = false only", "CSS.remove('hidden')"],
    correctIndex: 0,
    explanation: "classList.remove('hidden') removes that class from the element.",
  },
  {
    prompt: "The DOM is built from…",
    options: ["HTML (and updated by JS)", "Only JavaScript files", "The URL bar", "Cookies"],
    correctIndex: 0,
    explanation: "Browser parses HTML into a tree; JS can read and change that tree.",
  },
  {
    prompt: "Which property gets or sets HTML inside an element (including tags)?",
    options: ["innerHTML", "textContent only", "value", "href"],
    correctIndex: 0,
    explanation: "innerHTML parses HTML; use carefully with untrusted input.",
  },
  {
    prompt: "Event listener as arrow function: () => { … } is valid because…",
    options: ["It is a function reference passed to addEventListener", "Arrows cannot be used", "Only named functions work", "The browser requires async"],
    correctIndex: 0,
    explanation: "You pass a function; arrow functions work fine as callbacks.",
  },
  {
    prompt: "If getElementById returns null, that means…",
    options: ["No element with that id exists yet", "The page crashed", "JavaScript is disabled", "The id is duplicated"],
    correctIndex: 0,
    explanation: "Check for null before using the element — maybe the id is wrong or script runs too early.",
  },
];

const ASYNC_MCQ: McqQuestion[] = [
  {
    prompt: "Why do we use async/await?",
    options: ["Write async code that reads top-to-bottom", "Make code run faster on CPU", "Replace all loops", "Skip error handling"],
    correctIndex: 0,
    explanation: "async/await makes promises easier to read, like normal sequential code.",
  },
  {
    prompt: "fetch() returns…",
    options: ["A Promise", "The JSON data immediately", "undefined always", "A DOM element"],
    correctIndex: 0,
    explanation: "You await fetch(), then await response.json() to get data.",
  },
  {
    prompt: "await can only be used…",
    options: ["Inside an async function", "Anywhere in a script", "Only in HTML", "Inside CSS"],
    correctIndex: 0,
    explanation: "Mark the function async: async function load() { await fetch(...) }",
  },
  {
    prompt: "try/catch around fetch helps you…",
    options: ["Handle network errors gracefully", "Skip the request", "Cache forever", "Run sync code"],
    correctIndex: 0,
    explanation: "Network can fail — catch lets you show a friendly message instead of crashing.",
  },
  {
    prompt: "setTimeout(fn, 1000) runs fn…",
    options: ["After about 1 second", "Immediately 1000 times", "Only if await is used", "Never in browsers"],
    correctIndex: 0,
    explanation: "setTimeout schedules a callback; the rest of your code keeps running.",
  },
  {
    prompt: "A Promise can be…",
    options: ["pending, fulfilled, or rejected", "only true or false", "only a string", "only sync"],
    correctIndex: 0,
    explanation: "Promises represent a future value — success or failure.",
  },
  {
    prompt: "response.json() is async because…",
    options: ["Reading the body takes time", "JSON is illegal", "It always fails", "It returns DOM"],
    correctIndex: 0,
    explanation: "Parsing the response body is asynchronous — use await response.json().",
  },
  {
    prompt: "Parallel requests: better pattern?",
    options: ["Promise.all([fetch(a), fetch(b)])", "Two await fetch in series always", "while(true) fetch", "Never parallelize"],
    correctIndex: 0,
    explanation: "Promise.all waits for all; independent requests can run together.",
  },
  {
    prompt: "What does 'callback hell' mean?",
    options: ["Deep nested callbacks hard to read", "A virus", "A CSS bug", "A type of loop"],
    correctIndex: 0,
    explanation: "Nested .then() or callbacks get messy; async/await flattens the structure.",
  },
  {
    prompt: "async function always returns…",
    options: ["A Promise", "A number only", "void only", "HTML"],
    correctIndex: 0,
    explanation: "Even return 5 becomes Promise.resolve(5) from an async function.",
  },
  {
    prompt: "404 from fetch means…",
    options: ["Resource not found on server", "Success with empty body", "Browser offline only", "Syntax error in JS"],
    correctIndex: 0,
    explanation: "Check response.ok or response.status before parsing JSON.",
  },
  {
    prompt: "Which loads data without full page reload?",
    options: ["fetch + update DOM", "location.reload only", "document.write only", "Closing the tab"],
    correctIndex: 0,
    explanation: "SPAs and modern pages fetch JSON and update parts of the DOM.",
  },
  {
    prompt: "reject in a Promise means…",
    options: ["The async operation failed", "It succeeded twice", "Skip to finally only", "Return null always"],
    correctIndex: 0,
    explanation: "Rejected promises trigger .catch or try/catch with await.",
  },
  {
    prompt: "finally block runs…",
    options: ["After try/catch whether or not error", "Only on success", "Only on failure", "Never with async"],
    correctIndex: 0,
    explanation: "Use finally for cleanup like hiding a loading spinner.",
  },
  {
    prompt: "Debouncing a search input means…",
    options: ["Wait until user stops typing before fetch", "Fetch on every key instantly", "Block all input", "Use sync fetch"],
    correctIndex: 0,
    explanation: "Debounce reduces API calls by waiting for a pause in typing.",
  },
  {
    prompt: "CORS errors usually happen when…",
    options: ["Browser blocks cross-origin fetch without permission", "Syntax is wrong", "await is missing", "DOM is null"],
    correctIndex: 0,
    explanation: "Servers must send CORS headers to allow browser requests from other origins.",
  },
  {
    prompt: "Loading state in UI (spinner) should show…",
    options: ["While awaiting fetch", "Never", "Only after error", "Before HTML loads only"],
    correctIndex: 0,
    explanation: "Show loading before await, hide in finally or after data arrives.",
  },
  {
    prompt: "JSON.parse on bad string…",
    options: ["Throws SyntaxError", "Returns null always", "Fixes the string", "Runs fetch again"],
    correctIndex: 0,
    explanation: "Wrap JSON.parse in try/catch when parsing untrusted text.",
  },
  {
    prompt: "Microtask queue: await after fetch resumes…",
    options: ["After current sync code and microtasks", "Instantly mid-line always", "Never in Chrome", "Only on server"],
    correctIndex: 0,
    explanation: "Async continuations run after the current call stack clears.",
  },
  {
    prompt: "Best first check after fetch?",
    options: ["if (!response.ok) handle error", "Skip status codes", "Always response.json()", "Reload page"],
    correctIndex: 0,
    explanation: "response.ok is false for 4xx/5xx — handle before parsing body.",
  },
];

export function mcqQuestionsForSlug(slug: string): McqQuestion[] | null {
  if (slug === "dom-basics") return DOM_MCQ;
  if (slug === "async-basics") return ASYNC_MCQ;
  return null;
}

export function guideHasMcqPractice(topicId: string, slug: string) {
  return topicId === "javascript" && mcqQuestionsForSlug(slug) !== null;
}

export const MCQ_PER_LESSON = 20;
