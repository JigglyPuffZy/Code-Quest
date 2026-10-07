import type { GuideLesson, GuideTopicId } from "@/lib/guides/types";
import { guideHasPractice } from "@/lib/guides/practice";

const PRACTICE_NOTE =
  "Scroll to Practice this lesson below when you're ready. Read first, then type the code yourself — that's how it sticks.";

function practiceTip(topicId: GuideTopicId, slug: string) {
  return guideHasPractice(topicId, slug)
    ? [{ type: "tip" as const, title: "Practice", text: PRACTICE_NOTE }]
    : [];
}

type LangProfile = {
  id: GuideTopicId;
  name: string;
  fileExt: string;
  runHow: string;
  hello: string;
  variables: string;
  operators: string;
  condition: string;
  loop: string;
  collection: string;
  function: string;
  types: string[];
  usedFor: string[];
  tip: string;
  collectionNotes?: string[];
};

function buildLanguageCourse(cfg: LangProfile): GuideLesson[] {
  const { id, name } = cfg;
  const usesStrictEquality = id === "typescript";
  const operatorIntro = usesStrictEquality
    ? "Operators let you calculate and compare values. + - * / do math. === and !== check value and type; prefer them over == and != in TypeScript."
    : "Operators let you calculate and compare values. + - * / do math. == != > < compare values and return true or false.";
  const collectionNotes = cfg.collectionNotes ?? [
    "Index often starts at 0 (first item)",
    "Length tells you how many items",
    "Loop with for-each style when possible",
  ];

  return [
    {
      slug: "introduction",
      topicId: id,
      title: `What is ${name}?`,
      summary: `What ${name} is, where it's used, and your first program.`,
      minutes: 8,
      order: 1,
      blocks: [
        { type: "p", text: `${name} is a programming language. You write instructions in a text file (${cfg.fileExt}), and the computer runs them step by step.` },
        { type: "p", text: `People use ${name} for: ${cfg.usedFor.join(", ")}.` },
        { type: "p", text: `To run code: ${cfg.runHow}` },
        { type: "code", caption: "Your first program", code: cfg.hello },
        { type: "p", text: "Don't worry if you don't understand every symbol yet. Copy the example, run it, then change one word and run again. That is how you learn." },
        { type: "ul", items: ["Read code from top to bottom", "Fix one error at a time", "Practice a little every day"] },
        ...practiceTip(id, "introduction"),
      ],
    },
    {
      slug: "variables-and-types",
      topicId: id,
      title: "Variables and data types",
      summary: "Store values, name them, and understand basic types.",
      minutes: 10,
      order: 2,
      blocks: [
        { type: "p", text: "A variable is a named place that holds a value — like a labeled box. You can read it later or change what's inside." },
        { type: "code", caption: "Variables", code: cfg.variables },
        { type: "p", text: `Common types in ${name}:` },
        { type: "ul", items: cfg.types },
        { type: "p", text: cfg.tip },
        ...practiceTip(id, "variables-and-types"),
      ],
    },
    {
      slug: "operators",
      topicId: id,
      title: "Operators and expressions",
      summary: "Math, comparisons, and combining values.",
      minutes: 9,
      order: 3,
      blocks: [
        { type: "p", text: operatorIntro },
        { type: "p", text: "An expression is anything that produces a value: 2 + 2, name + \"!\", score >= 60." },
        { type: "code", caption: "Examples", code: cfg.operators },
        { type: "p", text: "Comparisons return true or false. You use those results in if statements next." },
        ...practiceTip(id, "operators"),
      ],
    },
    {
      slug: "conditionals",
      topicId: id,
      title: "Making decisions (if / else)",
      summary: "Run different code based on conditions.",
      minutes: 10,
      order: 4,
      blocks: [
        { type: "p", text: "Programs need to make choices. If the user is logged in, show the dashboard. Otherwise, show login. That is what conditionals do." },
        { type: "code", caption: "If / else", code: cfg.condition },
        { type: "p", text: "Only one branch runs. Put the most specific checks first. Use else for the default case." },
        { type: "ul", items: ["if — runs when condition is true", "else if — checks another condition", "else — runs when nothing matched"] },
        ...practiceTip(id, "conditionals"),
      ],
    },
    {
      slug: "loops",
      topicId: id,
      title: "Loops — repeat without copy-paste",
      summary: "Run the same logic many times.",
      minutes: 11,
      order: 5,
      blocks: [
        { type: "p", text: "Loops save you from writing the same code 100 times. Use them for lists, counting, and processing data." },
        { type: "code", caption: "Loop example", code: cfg.loop },
        { type: "p", text: "Always make sure the loop can end. An infinite loop freezes your program." },
        { type: "ul", items: ["for — repeat a set number of times or over a collection", "while — repeat while a condition stays true", "break — exit early when you're done"] },
        ...practiceTip(id, "loops"),
      ],
    },
    {
      slug: "functions",
      topicId: id,
      title: "Functions — reusable blocks",
      summary: "Name a chunk of code and call it whenever you need.",
      minutes: 12,
      order: 6,
      blocks: [
        { type: "p", text: "A function is a mini-program inside your program. You define it once, then call it by name. Parameters pass data in; return sends a result back." },
        { type: "code", caption: "Define and call", code: cfg.function },
        { type: "p", text: "Good functions do one clear job. Short names like calculateTotal or greetUser help you remember what they do." },
        ...practiceTip(id, "functions"),
      ],
    },
    {
      slug: "data-structures",
      topicId: id,
      title: "Lists, arrays, and collections",
      summary: "Store many values together.",
      minutes: 11,
      order: 7,
      blocks: [
        { type: "p", text: "Real apps handle lists: users, products, messages. Collections let you store many items under one variable." },
        { type: "p", text: "You can add items, remove items, loop over them, and search. Each language has its own collection types — arrays, lists, maps, or dictionaries." },
        { type: "code", caption: "Working with a list", code: cfg.collection },
        { type: "ul", items: collectionNotes },
        ...practiceTip(id, "data-structures"),
      ],
    },
    {
      slug: "next-steps",
      topicId: id,
      title: "What to learn next",
      summary: "Ecosystem, tools, and how to keep improving.",
      minutes: 7,
      order: 8,
      blocks: [
        { type: "p", text: `You now know the core ideas of ${name}: variables, conditions, loops, functions, and collections. These exist in almost every language.` },
        { type: "p", text: "Next steps:" },
        { type: "ul", items: [
          "Build a tiny project (calculator, todo list, quiz game)",
          "Read official docs when you get stuck",
          "Learn one library or framework for your goal (web, mobile, data)",
          "Practice in Dev Ladder Arena or Game mode to check your code",
        ] },
        { type: "p", text: "Mistakes are normal. Every professional developer still searches Google daily. Keep going." },
      ],
    },
  ];
}

const LANGUAGE_PROFILES: LangProfile[] = [
  {
    id: "typescript",
    name: "TypeScript",
    fileExt: ".ts",
    runHow: "Compile with tsc, then run with node, or use a tool like Vite.",
    hello: 'const message: string = "Hello, TypeScript!";\nconsole.log(message);',
    variables: 'let count: number = 0;\nconst name: string = "Alex";\nlet active: boolean = true;\n\ncount = count + 1;\nconsole.log(name, count);',
    operators: 'const score = 85;\nconst name = "Alex";\nconst total = 10 + 5;\nconst pass = score >= 60;\nconst same = name === "Alex";',
    condition: 'const score = 85;\n\nif (score >= 90) {\n  console.log("A");\n} else if (score >= 80) {\n  console.log("B");\n} else {\n  console.log("Keep practicing");\n}',
    loop: 'const nums = [1, 2, 3, 4, 5];\nlet sum = 0;\n\nfor (const n of nums) {\n  sum += n;\n}\nconsole.log(sum); // 15',
    collection: 'const fruits = ["apple", "banana", "cherry"];\nfor (const fruit of fruits) {\n  console.log(fruit);\n}',
    function: 'function greet(name: string): string {\n  return `Hello, ${name}!`;\n}\n\nconsole.log(greet("World"));',
    types: ["number — integers and decimals", "string — text", "boolean — true or false", "arrays — lists like number[]", "objects — grouped fields"],
    usedFor: ["large web apps", "React and Node.js projects", "catching bugs before runtime"],
    tip: "TypeScript is JavaScript with types. Types describe what a value should be — they help your editor catch mistakes early.",
  },
  {
    id: "c",
    name: "C",
    fileExt: ".c",
    runHow: "Compile with gcc hello.c -o hello, then run ./hello",
    hello: '#include <stdio.h>\n\nint main() {\n    printf("Hello, C!\\n");\n    return 0;\n}',
    variables: 'int age = 16;\nfloat price = 9.99;\nchar grade = \'A\';\n\nprintf("%d %.2f %c\\n", age, price, grade);',
    operators: 'int score = 85;\nint age = 16;\nint total = 10 + 5;\nint pass = score >= 60;\nint same = (age == 16);',
    condition: 'int score = 85;\n\nif (score >= 90) {\n    printf("A\\n");\n} else if (score >= 80) {\n    printf("B\\n");\n} else {\n    printf("C\\n");\n}',
    loop: 'int i;\nfor (i = 1; i <= 5; i++) {\n    printf("%d\\n", i);\n}',
    collection: 'int nums[] = {1, 2, 3};\nint i;\nfor (i = 0; i < 3; i++) {\n    printf("%d\\n", nums[i]);\n}',
    function: 'int add(int a, int b) {\n    return a + b;\n}\n\nint main() {\n    printf("%d\\n", add(3, 4));\n    return 0;\n}',
    types: ["int — whole numbers", "float / double — decimals", "char — single character", "arrays — fixed-size lists", "pointers — memory addresses (advanced)"],
    usedFor: ["operating systems", "embedded devices", "game engines", "learning how computers work"],
    tip: "C is close to the machine. You manage memory yourself. It's harder but teaches fundamentals other languages hide.",
  },
  {
    id: "cpp",
    name: "C++",
    fileExt: ".cpp",
    runHow: "Compile with g++ main.cpp -o app, then run ./app",
    hello: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, C++!" << endl;\n    return 0;\n}',
    variables: 'int level = 1;\nstring name = "Player";\ndouble health = 99.5;\n\nlevel++;\ncout << name << " Lv." << level;',
    operators: 'int score = 85;\nint level = 1;\nint total = 10 + 5;\nbool pass = score >= 60;\nbool same = (level == 1);',
    condition: 'int hp = 30;\n\nif (hp <= 0) {\n    cout << "Game over";\n} else {\n    cout << "Keep fighting";\n}',
    loop: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nvector<int> scores = {10, 20, 30};\nfor (int s : scores) {\n    cout << s << "\\n";\n}',
    collection: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nvector<string> items = {"sword", "shield"};\nfor (const string& item : items) {\n    cout << item << "\\n";\n}',
    function: 'int multiply(int a, int b) {\n    return a * b;\n}',
    types: ["int, double, bool", "std::string — text", "vector — dynamic array", "class — custom types with methods"],
    usedFor: ["games (Unreal)", "high-performance software", "competitive programming"],
    tip: "C++ builds on C and adds classes, templates, and the STL (standard library).",
  },
  {
    id: "csharp",
    name: "C#",
    fileExt: ".cs",
    runHow: "Use dotnet run in a .NET project folder.",
    hello: 'using System;\n\nclass Program {\n    static void Main() {\n        Console.WriteLine("Hello, C#!");\n    }\n}',
    variables: 'int score = 100;\nstring player = "Alex";\nbool isReady = true;\n\nConsole.WriteLine($"{player}: {score}");',
    operators: 'int score = 85;\nstring player = "Alex";\nint total = 10 + 5;\nbool pass = score >= 60;\nbool same = player == "Alex";',
    condition: 'int coins = 50;\n\nif (coins >= 100) {\n    Console.WriteLine("Buy item");\n} else {\n    Console.WriteLine("Need more coins");\n}',
    loop: 'for (int i = 0; i < 3; i++) {\n    Console.WriteLine($"Round {i + 1}");\n}',
    collection: 'var items = new List<string> { "apple", "banana" };\nforeach (var item in items) {\n    Console.WriteLine(item);\n}',
    function: 'static int Add(int a, int b) {\n    return a + b;\n}',
    types: ["int, double, bool", "string", "List<T> — growable lists", "class — objects and methods"],
    usedFor: ["Windows apps", "Unity games", ".NET web APIs", "enterprise software"],
    tip: "C# uses curly braces like Java. The .NET runtime runs your code on Windows, Mac, and Linux.",
  },
  {
    id: "go",
    name: "Go",
    fileExt: ".go",
    runHow: "Run go run main.go",
    hello: 'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, Go!")\n}',
    variables: 'name := "Alex"\nage := 16\nactive := true\n\nfmt.Println(name, age, active)',
    operators: 'score := 85\nname := "Alex"\ntotal := 10 + 5\npass := score >= 60\nsame := name == "Alex"',
    condition: 'score := 72\n\nif score >= 60 {\n    fmt.Println("Pass")\n} else {\n    fmt.Println("Fail")\n}',
    loop: 'nums := []int{1, 2, 3}\nfor _, n := range nums {\n    fmt.Println(n * 2)\n}',
    collection: 'fruits := []string{"apple", "banana"}\nfor _, fruit := range fruits {\n    fmt.Println(fruit)\n}',
    function: 'func greet(name string) string {\n    return "Hello, " + name\n}',
    types: ["int, float64, bool", "string", "slice — dynamic array", "map — key-value pairs", "struct — grouped fields"],
    usedFor: ["cloud servers", "Docker and Kubernetes tools", "fast network services"],
    tip: "Go uses := for short variable declaration. It compiles to a single binary — easy to deploy.",
  },
  {
    id: "rust",
    name: "Rust",
    fileExt: ".rs",
    runHow: "Run rustc main.rs or cargo run in a Cargo project.",
    hello: 'fn main() {\n    println!("Hello, Rust!");\n}',
    variables: 'let name = "Alex";\nlet mut count = 0;\ncount += 1;\nprintln!("{} {}", name, count);',
    operators: 'let score = 85;\nlet name = "Alex";\nlet total = 10 + 5;\nlet pass = score >= 60;\nlet same = name == "Alex";',
    condition: 'let hp = 10;\n\nif hp > 0 {\n    println!("Alive");\n} else {\n    println!("Defeated");\n}',
    loop: 'let nums = vec![1, 2, 3];\nfor n in nums {\n    println!("{}", n * 2);\n}',
    collection: 'let fruits = vec!["apple", "banana"];\nfor fruit in fruits {\n    println!("{}", fruit);\n}',
    function: 'fn add(a: i32, b: i32) -> i32 {\n    a + b\n}',
    types: ["i32, f64, bool", "String / &str — text", "Vec — vector", "HashMap — dictionary", "Option / Result — safe errors"],
    usedFor: ["systems programming", "WebAssembly", "CLI tools", "when safety and speed both matter"],
    tip: "let is immutable by default. Use mut when you need to change a value. The compiler prevents many crashes.",
  },
  {
    id: "php",
    name: "PHP",
    fileExt: ".php",
    runHow: "Run php file.php on a server or locally with PHP installed.",
    hello: '<?php\necho "Hello, PHP!";\n?>',
    variables: '$name = "Alex";\n$age = 16;\n$active = true;\n\necho $name . " is " . $age;',
    operators: '$score = 85;\n$name = "Alex";\n$total = 10 + 5;\n$pass = $score >= 60;\n$same = $name === "Alex";',
    condition: '$score = 88;\n\nif ($score >= 90) {\n    echo "A";\n} elseif ($score >= 80) {\n    echo "B";\n} else {\n    echo "C";\n}',
    loop: '$items = ["apple", "banana", "cherry"];\nforeach ($items as $item) {\n    echo $item . "\\n";\n}',
    collection: '$fruits = ["apple", "banana"];\nforeach ($fruits as $fruit) {\n    echo $fruit . "\\n";\n}',
    function: 'function greet($name) {\n    return "Hello, " . $name;\n}\n\necho greet("World");',
    types: ["int, float", "string", "bool", "array — lists and maps"],
    usedFor: ["WordPress", "Laravel websites", "server-side HTML generation"],
    tip: "Variables start with $. On the web, $_GET and $_POST carry form data — they are not variable types.",
  },
  {
    id: "ruby",
    name: "Ruby",
    fileExt: ".rb",
    runHow: "Run ruby file.rb",
    hello: 'puts "Hello, Ruby!"',
    variables: 'name = "Alex"\nage = 16\nactive = true\n\nputs "#{name} is #{age}"',
    operators: 'score = 85\nname = "Alex"\ntotal = 10 + 5\npass = score >= 60\nsame = name == "Alex"',
    condition: 'score = 75\n\nif score >= 90\n  puts "A"\nelsif score >= 80\n  puts "B"\nelse\n  puts "Keep going"\nend',
    loop: '[1, 2, 3].each do |n|\n  puts n * 2\nend',
    collection: 'fruits = ["apple", "banana"]\nfruits.each do |fruit|\n  puts fruit\nend',
    function: 'def greet(name)\n  "Hello, #{name}"\nend\n\nputs greet("World")',
    types: ["Integer, Float", "String", "true / false", "Array — lists", "Hash — key-value pairs", "Symbol — lightweight labels"],
    usedFor: ["Ruby on Rails web apps", "scripting", "startups and MVPs"],
    tip: "Ruby reads like English. Blocks end with `end` — indentation helps readability but does not define blocks like Python.",
  },
  {
    id: "swift",
    name: "Swift",
    fileExt: ".swift",
    runHow: "Use Xcode on Mac, or swift file.swift in Terminal.",
    hello: 'print("Hello, Swift!")',
    variables: 'var score = 0\nlet name = "Alex"\nscore += 10\nprint(name, score)',
    operators: 'let score = 85\nlet name = "Alex"\nlet total = 10 + 5\nlet pass = score >= 60\nlet same = name == "Alex"',
    condition: 'let temp = 32\n\nif temp > 30 {\n    print("Hot")\n} else {\n    print("Cool")\n}',
    loop: 'let nums = [1, 2, 3, 4]\nfor n in nums {\n    print(n * n)\n}',
    collection: 'let fruits = ["apple", "banana"]\nfor fruit in fruits {\n    print(fruit)\n}',
    function: 'func greet(name: String) -> String {\n    return "Hello, \\(name)"\n}',
    types: ["Int, Double, Bool", "String", "Array — lists", "Dictionary — maps", "Optional — value or nil"],
    usedFor: ["iOS and iPad apps", "macOS apps", "SwiftUI interfaces"],
    tip: "let is constant; var can change. Optionals handle missing values safely.",
  },
  {
    id: "kotlin",
    name: "Kotlin",
    fileExt: ".kt",
    runHow: "Use Android Studio, or kotlinc + java to run.",
    hello: 'fun main() {\n    println("Hello, Kotlin!")\n}',
    variables: 'val name = "Alex"   // cannot reassign\nvar score = 0       // can change\nscore += 5\nprintln("$name: $score")',
    operators: 'val score = 85\nval name = "Alex"\nval total = 10 + 5\nval pass = score >= 60\nval same = name == "Alex"',
    condition: 'val level = 5\n\nif (level >= 10) {\n    println("Expert")\n} else {\n    println("Growing")\n}',
    loop: 'val items = listOf("a", "b", "c")\nfor (item in items) {\n    println(item)\n}',
    collection: 'val fruits = listOf("apple", "banana")\nfor (fruit in fruits) {\n    println(fruit)\n}',
    function: 'fun add(a: Int, b: Int): Int = a + b',
    types: ["Int, Double, Boolean", "String", "List — read-only lists", "MutableList — changeable", "data class — simple objects"],
    usedFor: ["Android apps", "Kotlin Multiplatform", "server-side with Ktor"],
    tip: "Kotlin is concise and null-safe. Google recommends it for new Android projects.",
  },
  {
    id: "r",
    name: "R",
    fileExt: ".R",
    runHow: "Open R or RStudio and run scripts line by line or with source().",
    hello: 'message <- "Hello, R!"\nprint(message)',
    variables: 'name <- "Alex"\nage <- 16\nscores <- c(88, 92, 75)\n\nmean(scores)',
    operators: 'score <- 85\nname <- "Alex"\ntotal <- 10 + 5\npass <- score >= 60\nsame <- name == "Alex"',
    condition: 'score <- 85\n\nif (score >= 90) {\n  print("A")\n} else if (score >= 80) {\n  print("B")\n} else {\n  print("C")\n}',
    loop: 'for (n in 1:5) {\n  print(n * 2)\n}',
    collection: 'fruits <- c("apple", "banana")\nfor (fruit in fruits) {\n  print(fruit)\n}',
    collectionNotes: ["In R, vector index starts at 1", "length() tells you how many items", "Use for or apply-style functions on collections"],
    function: 'greet <- function(name) {\n  paste("Hello,", name)\n}\n\ngreet("World")',
    types: ["numeric — numbers", "character — text", "logical — TRUE/FALSE", "vector — c(1,2,3)", "data.frame — table of columns"],
    usedFor: ["statistics", "data science", "research charts and reports"],
    tip: "R is built for data. Use <- to assign. c() creates vectors. ggplot2 makes beautiful charts.",
  },
  {
    id: "bash",
    name: "Bash",
    fileExt: ".sh",
    runHow: "Save as script.sh, run chmod +x script.sh then ./script.sh",
    hello: '#!/bin/bash\necho "Hello, Bash!"',
    variables: 'NAME="Alex"\nCOUNT=0\nCOUNT=$((COUNT + 1))\necho "$NAME count: $COUNT"',
    operators: 'SCORE=85\nTOTAL=$((10 + 5))\nif [ "$SCORE" -ge 60 ]; then echo "Pass"; fi',
    condition: 'SCORE=85\n\nif [ "$SCORE" -ge 90 ]; then\n  echo "A"\nelif [ "$SCORE" -ge 80 ]; then\n  echo "B"\nelse\n  echo "C"\nfi',
    loop: 'for file in *.txt; do\n  echo "Processing $file"\ndone',
    collection: 'for item in apple banana cherry; do\n  echo "$item"\ndone',
    function: 'greet() {\n  echo "Hello, $1"\n}\n\ngreet "World"',
    types: ["strings — text in quotes", "integers — for math with $(( ))", "arrays — advanced", "exit codes — 0 means success"],
    usedFor: ["server automation", "git hooks", "deploy scripts", "file batch jobs"],
    tip: "Bash runs in the terminal. $1, $2 are function arguments. Quote variables: \"$NAME\".",
  },
  {
    id: "htmlcss",
    name: "HTML & CSS",
    fileExt: ".html",
    runHow: "Open the .html file in any web browser — no compile step.",
    hello: '<!DOCTYPE html>\n<html>\n  <head>\n    <title>My Page</title>\n  </head>\n  <body>\n    <h1>Hello, Web!</h1>\n    <p>Welcome to HTML.</p>\n  </body>\n</html>',
    variables: '<!-- HTML has no variables — use CSS for style -->\n<p class="highlight">Styled text</p>\n\n<style>\n.highlight {\n  color: navy;\n  font-size: 1.2rem;\n}\n</style>',
    operators: '<!-- HTML/CSS do not have math operators like + in variables -->\n<style>\n.card { padding: calc(1rem + 4px); }\n</style>',
    condition: '<!-- Use different classes for different looks -->\n<button class="primary">Save</button>\n<button class="ghost">Cancel</button>',
    loop: '<!-- Repeat structure with copy, or generate with JavaScript later -->\n<ul>\n  <li>Item 1</li>\n  <li>Item 2</li>\n  <li>Item 3</li>\n</ul>',
    collection: '<ul class="fruit-list">\n  <li>Apple</li>\n  <li>Banana</li>\n  <li>Cherry</li>\n</ul>',
    collectionNotes: ["Lists use <ul> or <ol> with <li> items", "CSS can style groups with classes", "For dynamic lists, use JavaScript later"],
    function: '/* CSS "functions" like flexbox layout */\n.card {\n  display: flex;\n  gap: 1rem;\n  padding: 1rem;\n  border-radius: 12px;\n  background: #f8fafc;\n}',
    types: ["HTML tags — structure (h1, p, div, a)", "CSS properties — color, margin, padding", "classes — reusable styles", "ids — unique elements"],
    usedFor: ["every website", "landing pages", "the foundation before React or JavaScript"],
    tip: "HTML = what is on the page. CSS = how it looks. Learn both together.",
  },
];

export const generatedLanguageGuides: GuideLesson[] = LANGUAGE_PROFILES.flatMap(buildLanguageCourse);
