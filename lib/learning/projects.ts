export const learningProjects = [
  { id: "calculator", title: "Build a calculator", topic: "python", minutes: 30,
    brief: "Write calculate(a, operator, b) supporting +, -, *, and /. Keep calculation separate from user input.",
    checks: ["Support all four operations", "Handle division by zero", "Reject unsupported operators", "Test 2 + 3 = 5 and -6 / 2 = -3"],
    starter: "def calculate(a, operator, b):\n    # Implement your calculator\n    pass\n" },
  { id: "quiz", title: "Build a quiz", topic: "javascript", minutes: 45,
    brief: "Create a question bank and scoreQuiz(questions, answers). Each question has a prompt, options, and correctIndex. Return the number of correct answers.",
    checks: ["Create at least five questions", "Score a completely correct set", "Handle missing answers", "Test that an empty quiz and all-wrong answers score 0"],
    starter: "const questions = [];\n\nfunction scoreQuiz(questions, answers) {\n  // Return the number of correct answers\n}\n" },
  { id: "task-tracker", title: "Build a task tracker", topic: "javascript", minutes: 60,
    brief: "Build a browser task tracker to add tasks, toggle completion, filter tasks, and persist them across reloads. Use textContent to display user input.",
    checks: ["Reject empty task titles", "Assign stable unique IDs", "Toggle and filter completed tasks", "Persist across reloads and handle invalid saved data"],
    starter: "// Build in a local HTML/JavaScript project.\n// Save your main implementation or notes here.\nconst tasks = [];\n" },
] as const;
