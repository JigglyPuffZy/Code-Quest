import type { Exercise, FunctionCase, LanguageId } from "@/lib/types";

import {
  comment,
  formatCallExamples,
  functionExercise,
  goalSteps,
  requireCount,
  stdoutExercise,
  withMain,
} from "@/lib/guides/practice/build";

type GetterSeed = {
  goal: string;
  py: string;
  js: string;
  key?: string;
  expr: { python: string; javascript: string };
  cases: FunctionCase[];
  hint: { python: string; javascript: string };
};

const GETTER_SEEDS: GetterSeed[] = [
  { goal: "Return the name field from a user record.", py: "get_name", js: "getName", key: "name", expr: { python: 'user["name"]', javascript: "user.name" }, cases: [{ args: [{ name: "Alex", age: 20 }], expected: "Alex" }, { args: [{ name: "Mia", age: 17 }], expected: "Mia" }], hint: { python: 'return user["name"]', javascript: "return user.name;" } },
  { goal: "Return the age field from a user record.", py: "get_age", js: "getAge", key: "age", expr: { python: 'user["age"]', javascript: "user.age" }, cases: [{ args: [{ name: "Alex", age: 20 }], expected: 20 }, { args: [{ name: "Mia", age: 17 }], expected: 17 }], hint: { python: 'return user["age"]', javascript: "return user.age;" } },
  { goal: "Return the city field from a profile.", py: "get_city", js: "getCity", expr: { python: 'profile["city"]', javascript: "profile.city" }, cases: [{ args: [{ city: "Manila", country: "PH" }], expected: "Manila" }, { args: [{ city: "Cebu", country: "PH" }], expected: "Cebu" }], hint: { python: 'return profile["city"]', javascript: "return profile.city;" } },
  { goal: "Return the title field from a book record.", py: "get_title", js: "getTitle", expr: { python: 'book["title"]', javascript: "book.title" }, cases: [{ args: [{ title: "Python", pages: 8 }], expected: "Python" }, { args: [{ title: "Java", pages: 12 }], expected: "Java" }], hint: { python: 'return book["title"]', javascript: "return book.title;" } },
  { goal: "Return the score field from a game record.", py: "get_score", js: "getScore", expr: { python: 'game["score"]', javascript: "game.score" }, cases: [{ args: [{ score: 240, lives: 3 }], expected: 240 }, { args: [{ score: 10, lives: 1 }], expected: 10 }], hint: { python: 'return game["score"]', javascript: "return game.score;" } },
  { goal: "Return the email field from a contact.", py: "get_email", js: "getEmail", expr: { python: 'contact["email"]', javascript: "contact.email" }, cases: [{ args: [{ email: "a@x.com", ok: true }], expected: "a@x.com" }, { args: [{ email: "b@y.com", ok: false }], expected: "b@y.com" }], hint: { python: 'return contact["email"]', javascript: "return contact.email;" } },
  { goal: "Return the team field from a player card.", py: "get_team", js: "getTeam", expr: { python: 'player["team"]', javascript: "player.team" }, cases: [{ args: [{ team: "Foxes", number: 9 }], expected: "Foxes" }, { args: [{ team: "Owls", number: 2 }], expected: "Owls" }], hint: { python: 'return player["team"]', javascript: "return player.team;" } },
  { goal: "Return the role field from a staff record.", py: "get_role", js: "getRole", expr: { python: 'staff["role"]', javascript: "staff.role" }, cases: [{ args: [{ role: "Guide", room: 1 }], expected: "Guide" }, { args: [{ role: "Coach", room: 4 }], expected: "Coach" }], hint: { python: 'return staff["role"]', javascript: "return staff.role;" } },
  { goal: "Return the level field from a hero card.", py: "get_level", js: "getLevel", expr: { python: 'hero["level"]', javascript: "hero.level" }, cases: [{ args: [{ level: 3, name: "Alex" }], expected: 3 }, { args: [{ level: 7, name: "Kai" }], expected: 7 }], hint: { python: 'return hero["level"]', javascript: "return hero.level;" } },
  { goal: "Return the country field from an address.", py: "get_country", js: "getCountry", expr: { python: 'place["country"]', javascript: "place.country" }, cases: [{ args: [{ country: "PH", zip: 1000 }], expected: "PH" }, { args: [{ country: "JP", zip: 100 }], expected: "JP" }], hint: { python: 'return place["country"]', javascript: "return place.country;" } },
  { goal: "Return the color field from a product.", py: "get_color", js: "getColor", expr: { python: 'item["color"]', javascript: "item.color" }, cases: [{ args: [{ color: "red", size: 2 }], expected: "red" }, { args: [{ color: "blue", size: 1 }], expected: "blue" }], hint: { python: 'return item["color"]', javascript: "return item.color;" } },
  { goal: "Return the price field from a snack.", py: "get_price", js: "getPrice", expr: { python: 'snack["price"]', javascript: "snack.price" }, cases: [{ args: [{ price: 25, name: "Mango" }], expected: 25 }, { args: [{ price: 12, name: "Banana" }], expected: 12 }], hint: { python: 'return snack["price"]', javascript: "return snack.price;" } },
  { goal: "Return the qty field from a cart line.", py: "get_qty", js: "getQty", expr: { python: 'line["qty"]', javascript: "line.qty" }, cases: [{ args: [{ qty: 4, sku: "A1" }], expected: 4 }, { args: [{ qty: 1, sku: "B2" }], expected: 1 }], hint: { python: 'return line["qty"]', javascript: "return line.qty;" } },
  { goal: "Return the id field from a ticket.", py: "get_id", js: "getId", expr: { python: 'ticket["id"]', javascript: "ticket.id" }, cases: [{ args: [{ id: 101, seat: "A" }], expected: 101 }, { args: [{ id: 7, seat: "C" }], expected: 7 }], hint: { python: 'return ticket["id"]', javascript: "return ticket.id;" } },
  { goal: "Return the status field from an order.", py: "get_status", js: "getStatus", expr: { python: 'order["status"]', javascript: "order.status" }, cases: [{ args: [{ status: "ready", n: 1 }], expected: "ready" }, { args: [{ status: "wait", n: 2 }], expected: "wait" }], hint: { python: 'return order["status"]', javascript: "return order.status;" } },
  { goal: "Return first and last joined with a space.", py: "full_name", js: "fullName", expr: { python: 'user["first"] + " " + user["last"]', javascript: 'user.first + " " + user.last' }, cases: [{ args: [{ first: "Jan", last: "Cruz" }], expected: "Jan Cruz" }, { args: [{ first: "Mia", last: "Tan" }], expected: "Mia Tan" }], hint: { python: 'return user["first"] + " " + user["last"]', javascript: 'return user.first + " " + user.last;' } },
  { goal: "Return Hi, plus the person's name.", py: "greet_user", js: "greetUser", expr: { python: '"Hi, " + user["name"]', javascript: '"Hi, " + user.name' }, cases: [{ args: [{ name: "Rio" }], expected: "Hi, Rio" }, { args: [{ name: "Elle" }], expected: "Hi, Elle" }], hint: { python: 'return "Hi, " + user["name"]', javascript: 'return "Hi, " + user.name;' } },
  { goal: "Return whether the active field is true.", py: "is_active", js: "isActive", expr: { python: 'user["active"]', javascript: "user.active" }, cases: [{ args: [{ active: true }], expected: true }, { args: [{ active: false }], expected: false }], hint: { python: 'return user["active"]', javascript: "return user.active;" } },
  { goal: "Return whether member is true.", py: "is_member", js: "isMember", expr: { python: 'club["member"]', javascript: "club.member" }, cases: [{ args: [{ member: true, name: "Foxes" }], expected: true }, { args: [{ member: false, name: "Owls" }], expected: false }], hint: { python: 'return club["member"]', javascript: "return club.member;" } },
  { goal: "Return the handle field (like a username).", py: "get_handle", js: "getHandle", expr: { python: 'user["handle"]', javascript: "user.handle" }, cases: [{ args: [{ handle: "coderjan" }], expected: "coderjan" }, { args: [{ handle: "mia" }], expected: "mia" }], hint: { python: 'return user["handle"]', javascript: "return user.handle;" } },
];

function paramName(seed: GetterSeed) {
  if (seed.js === "getCity" || seed.py === "get_city") return { py: "profile", js: "profile" };
  if (seed.js === "getTitle") return { py: "book", js: "book" };
  if (seed.js === "getScore") return { py: "game", js: "game" };
  if (seed.js === "getEmail") return { py: "contact", js: "contact" };
  if (seed.js === "getTeam") return { py: "player", js: "player" };
  if (seed.js === "getRole") return { py: "staff", js: "staff" };
  if (seed.js === "getLevel") return { py: "hero", js: "hero" };
  if (seed.js === "getCountry") return { py: "place", js: "place" };
  if (seed.js === "getColor") return { py: "item", js: "item" };
  if (seed.js === "getPrice") return { py: "snack", js: "snack" };
  if (seed.js === "getQty") return { py: "line", js: "line" };
  if (seed.js === "getId") return { py: "ticket", js: "ticket" };
  if (seed.js === "getStatus") return { py: "order", js: "order" };
  if (seed.js === "isMember") return { py: "club", js: "club" };
  return { py: "user", js: "user" };
}

export function objectExercises(language: LanguageId): Exercise[] {
  if (language !== "javascript" && language !== "typescript") return [];
  const items = GETTER_SEEDS.map((seed) => {
    const name = seed.js;
    const param = paramName(seed).js;
    const typed =
      language === "typescript"
        ? `function ${name}(${param}: { [key: string]: string | number | boolean }): string | number | boolean {\n  \n}\n`
        : `function ${name}(${param}) {\n  \n}\n`;
    return functionExercise(
      goalSteps(seed.goal, [
        `The object is passed in as ${param}.`,
        `Return ${seed.hint.javascript}`,
      ], formatCallExamples(name, seed.cases)),
      typed,
      name,
      seed.cases,
      [
        "Use dot notation: object.field",
        seed.hint.javascript,
        "Return the field — do not print it.",
      ],
    );
  });
  return requireCount(items, "objects", language);
}

export function dictionaryExercises(language: LanguageId): Exercise[] {
  if (language !== "python") return [];
  const items = GETTER_SEEDS.map((seed) => {
    const name = seed.py;
    const param = paramName(seed).py;
    return functionExercise(
      goalSteps(seed.goal, [
        `The dictionary is passed in as ${param}.`,
        `Return ${seed.hint.python}`,
      ], formatCallExamples(name, seed.cases)),
      `def ${name}(${param}):\n    pass\n`,
      name,
      seed.cases,
      [
        'Read a key with square brackets: data["name"]',
        seed.hint.python,
        "Return the value — do not print it.",
      ],
    );
  });
  return requireCount(items, "dictionaries", language);
}

type ErrorSeed = {
  story: string;
  body: string;
  expected: string;
  hints: string[];
  exampleInput: string;
  stdin?: string;
};

const ERROR_SEEDS: ErrorSeed[] = [
  { story: "Catch divide by zero and print Cannot divide by zero.", body: "n = 0\ntry:\n    print(10 // n)\nexcept ZeroDivisionError:\n    pass\n", expected: "Cannot divide by zero", hints: ['except ZeroDivisionError:', 'print("Cannot divide by zero") inside the except block.'], exampleInput: "n is already 0 in the starter code." },
  { story: "int() cannot read hello. Catch ValueError and print Not a number.", body: 'text = "hello"\ntry:\n    print(int(text))\nexcept ValueError:\n    pass\n', expected: "Not a number", hints: ["except ValueError:", 'print("Not a number")'], exampleInput: 'text is already "hello" in the starter code.' },
  { story: "The list is too short. Catch IndexError and print No such item.", body: "nums = [1, 2]\ntry:\n    print(nums[5])\nexcept IndexError:\n    pass\n", expected: "No such item", hints: ["except IndexError:", 'print("No such item")'], exampleInput: "nums is [1, 2]. Index 5 does not exist." },
  { story: "The key is missing. Catch KeyError and print Missing key.", body: 'bag = {"a": 1}\ntry:\n    print(bag["z"])\nexcept KeyError:\n    pass\n', expected: "Missing key", hints: ["except KeyError:", 'print("Missing key")'], exampleInput: 'bag is {"a": 1}. Key "z" is missing.' },
  { story: "Catch divide by zero and print Nope.", body: "try:\n    print(1 // 0)\nexcept ZeroDivisionError:\n    pass\n", expected: "Nope", hints: ["except ZeroDivisionError:", 'print("Nope")'], exampleInput: "The try block already divides 1 by 0." },
  { story: "Catch ValueError from int('abc') and print Bad input.", body: 'try:\n    print(int("abc"))\nexcept ValueError:\n    pass\n', expected: "Bad input", hints: ["except ValueError:", 'print("Bad input")'], exampleInput: 'int("abc") will raise ValueError.' },
  { story: "Catch IndexError and print Out of range.", body: 'letters = "hi"\ntry:\n    print(letters[8])\nexcept IndexError:\n    pass\n', expected: "Out of range", hints: ["except IndexError:", 'print("Out of range")'], exampleInput: '"hi" has no index 8.' },
  { story: "Catch KeyError and print Unknown player.", body: 'scores = {"Mia": 10}\ntry:\n    print(scores["Kai"])\nexcept KeyError:\n    pass\n', expected: "Unknown player", hints: ["except KeyError:", 'print("Unknown player")'], exampleInput: 'scores has "Mia" only.' },
  { story: "Catch ZeroDivisionError and print Cannot split.", body: "left = 9\nright = 0\ntry:\n    print(left // right)\nexcept ZeroDivisionError:\n    pass\n", expected: "Cannot split", hints: ["Wrap the division in try.", 'print("Cannot split") in except.'], exampleInput: "left = 9, right = 0 (already set)." },
  { story: "Catch ValueError and print Please enter a valid number.", body: 'raw = "twelve"\ntry:\n    print(int(raw))\nexcept ValueError:\n    pass\n', expected: "Please enter a valid number", hints: ["except ValueError:", 'print("Please enter a valid number")'], exampleInput: 'raw is already "twelve".' },
  { story: "Typed input is not a number. Catch ValueError and print Invalid age.", body: 'try:\n    age = int(input())\n    print(age)\nexcept ValueError:\n    pass\n', expected: "Invalid age", hints: ["input() reads the typed line.", 'except ValueError: print("Invalid age")'], exampleInput: "Typed input:\nxyz", stdin: "xyz" },
  { story: "Catch IndexError on an empty list and print Empty.", body: "items = []\ntry:\n    print(items[0])\nexcept IndexError:\n    pass\n", expected: "Empty", hints: ["except IndexError:", 'print("Empty")'], exampleInput: "items is already []." },
  { story: "Catch KeyError and print No city.", body: 'place = {"name": "Shop"}\ntry:\n    print(place["city"])\nexcept KeyError:\n    pass\n', expected: "No city", hints: ["except KeyError:", 'print("No city")'], exampleInput: 'place has "name" but not "city".' },
  { story: "Catch ZeroDivisionError and print Stop.", body: "try:\n    print(100 // 0)\nexcept ZeroDivisionError:\n    pass\n", expected: "Stop", hints: ["except ZeroDivisionError:", 'print("Stop")'], exampleInput: "100 // 0 is in the try block." },
  { story: "Catch ValueError and print Could not convert.", body: 'try:\n    print(int(""))\nexcept ValueError:\n    pass\n', expected: "Could not convert", hints: ["int('') raises ValueError.", 'print("Could not convert")'], exampleInput: "The starter tries int(\"\")." },
  { story: "Catch IndexError and print Need more items.", body: "pack = [5]\ntry:\n    print(pack[1])\nexcept IndexError:\n    pass\n", expected: "Need more items", hints: ["except IndexError:", 'print("Need more items")'], exampleInput: "pack is [5], so index 1 is missing." },
  { story: "Catch KeyError and print Missing setting.", body: 'cfg = {"theme": "dark"}\ntry:\n    print(cfg["font"])\nexcept KeyError:\n    pass\n', expected: "Missing setting", hints: ["except KeyError:", 'print("Missing setting")'], exampleInput: 'cfg has "theme" only.' },
  { story: "Typed input fails int(). Print Use digits.", body: "try:\n    print(int(input()))\nexcept ValueError:\n    pass\n", expected: "Use digits", hints: ["except ValueError:", 'print("Use digits")'], exampleInput: "Typed input:\nnope", stdin: "nope" },
  { story: "Catch ZeroDivisionError and print Math error.", body: "a = 4\nb = 0\ntry:\n    print(a // b)\nexcept ZeroDivisionError:\n    pass\n", expected: "Math error", hints: ["except ZeroDivisionError:", 'print("Math error")'], exampleInput: "a = 4, b = 0 (already set)." },
  { story: "Catch ValueError from float('x') and print Not a decimal.", body: 'try:\n    print(float("x"))\nexcept ValueError:\n    pass\n', expected: "Not a decimal", hints: ["except ValueError:", 'print("Not a decimal")'], exampleInput: 'float("x") raises ValueError.' },
];

export function errorHandlingExercises(language: LanguageId): Exercise[] {
  if (language !== "python") return [];
  const items = ERROR_SEEDS.map((seed) =>
    stdoutExercise(
      goalSteps(seed.story, [
        "Keep the try block from the starter.",
        "Replace pass in except with a print of the exact message.",
      ]),
      seed.body,
      seed.expected,
      [
        "try runs the risky line. except runs only if that error happens.",
        ...seed.hints,
      ],
      seed.exampleInput,
      seed.stdin,
    ),
  );
  return requireCount(items, "error-handling", language);
}

const PLAYERS: Array<[string, number]> = [
  ["Mia", 1], ["Alex", 3], ["Kai", 5], ["Rio", 2], ["Noa", 4],
  ["Elle", 7], ["Theo", 6], ["Suki", 8], ["Omar", 9], ["Lina", 10],
  ["Ben", 1], ["Cora", 12], ["Diego", 3], ["Hana", 4], ["Ivy", 2],
  ["Jules", 11], ["Ken", 6], ["Lara", 8], ["Mo", 5], ["Quin", 7],
];

export function classExercises(language: LanguageId): Exercise[] {
  if (language !== "java") return [];
  const items = PLAYERS.map(([name, level], index) => {
    const kind = index % 3;
    if (kind === 0) {
      const expected = `${name} ${level}`;
      return stdoutExercise(
        goalSteps(`Fill in the Player constructor so it stores name and level. main already prints them.`, [
          "Inside Player(...), set this.name = name;",
          "Set this.level = level;",
          "Do not change main.",
        ]),
        `class Player {\n  String name;\n  int level;\n\n  Player(String name, int level) {\n    ${comment("java", "Assign this.name and this.level")}\n  }\n}\n\npublic class Main {\n  public static void main(String[] args) {\n    Player p = new Player(${JSON.stringify(name)}, ${level});\n    System.out.println(p.name + " " + p.level);\n  }\n}\n`,
        expected,
        [
          "this.name means the field on this object.",
          `this.name = name; this.level = level;`,
          `Expected output: ${expected}`,
        ],
        `main already does: new Player(${JSON.stringify(name)}, ${level}) then prints name and level.`,
      );
    }
    if (kind === 1) {
      const expected = String(level + 1);
      return stdoutExercise(
        goalSteps(`Fill in levelUp so it adds 1 to level. main creates ${name} at ${level} and calls levelUp.`, [
          "Inside levelUp, write level++;",
          "Do not change main.",
        ]),
        `class Player {\n  String name;\n  int level;\n\n  Player(String name, int level) {\n    this.name = name;\n    this.level = level;\n  }\n\n  void levelUp() {\n    ${comment("java", "Increase level by 1")}\n  }\n}\n\npublic class Main {\n  public static void main(String[] args) {\n    Player p = new Player(${JSON.stringify(name)}, ${level});\n    p.levelUp();\n    System.out.println(p.level);\n  }\n}\n`,
        expected,
        [
          "level++ adds one to the field.",
          "Call is already in main: p.levelUp();",
          `Expected output: ${expected}`,
        ],
        `main: new Player(${JSON.stringify(name)}, ${level}); p.levelUp(); then prints level.`,
      );
    }
    const expected = `Hi, ${name}`;
    return stdoutExercise(
      goalSteps(`Fill in hello() so it returns "Hi, " plus name. main prints the result for ${name}.`, [
        'Inside hello, return "Hi, " + name;',
        "Do not change main.",
      ]),
      `class Player {\n  String name;\n  int level;\n\n  Player(String name, int level) {\n    this.name = name;\n    this.level = level;\n  }\n\n  String hello() {\n    return "";\n  }\n}\n\npublic class Main {\n  public static void main(String[] args) {\n    Player p = new Player(${JSON.stringify(name)}, ${level});\n    System.out.println(p.hello());\n  }\n}\n`,
      expected,
      [
        'return "Hi, " + name;',
        "main already prints p.hello().",
        `Expected output: ${expected}`,
      ],
      `main: new Player(${JSON.stringify(name)}, ${level}); then prints p.hello().`,
    );
  });
  return requireCount(items, "classes", language);
}

const ANIMALS: Array<[string, string]> = [
  ["Dog", "Woof"], ["Cat", "Meow"], ["Cow", "Moo"], ["Duck", "Quack"], ["Sheep", "Baa"],
  ["Frog", "Ribbit"], ["Bee", "Buzz"], ["Owl", "Hoot"], ["Lion", "Roar"], ["Snake", "Hiss"],
  ["Pig", "Oink"], ["Horse", "Neigh"], ["Chicken", "Cluck"], ["Mouse", "Squeak"], ["Crow", "Caw"],
  ["Wolf", "Awoo"], ["Goat", "Bleat"], ["Goose", "Honk"], ["Turkey", "Gobble"], ["Beetle", "Click"],
];

export function inheritanceExercises(language: LanguageId): Exercise[] {
  if (language !== "java") return [];
  const items = ANIMALS.map(([child, sound]) =>
    stdoutExercise(
      goalSteps(`Make ${child} extend Animal and override speak() so it returns ${JSON.stringify(sound)}.`, [
        `${child} already extends Animal.`,
        `Inside speak(), return ${JSON.stringify(sound)};`,
        "Do not change main — it prints pet.speak().",
      ]),
      `class Animal {\n  String speak() {\n    return "...";\n  }\n}\n\npublic class Main {\n  static class ${child} extends Animal {\n    @Override\n    String speak() {\n      return "";\n    }\n  }\n\n  public static void main(String[] args) {\n    Animal pet = new ${child}();\n    System.out.println(pet.speak());\n  }\n}\n`,
      sound,
      [
        "@Override replaces the parent method.",
        `return ${JSON.stringify(sound)};`,
        `Expected output: ${sound}`,
      ],
      `main creates a ${child} and prints speak().`,
    ),
  );
  return requireCount(items, "inheritance", language);
}

const ACCOUNTS: Array<[number, number]> = [
  [10, 5], [0, 20], [50, 8], [3, 3], [100, 1],
  [7, 13], [25, 25], [9, 0], [40, 10], [15, 4],
  [1, 2], [80, 20], [12, 6], [30, 15], [2, 18],
  [60, 5], [4, 4], [90, 10], [11, 9], [16, 4],
];

export function encapsulationExercises(language: LanguageId): Exercise[] {
  if (language !== "java") return [];
  const items = ACCOUNTS.map(([start, amount], index) => {
    const expected = String(start + amount);
    const depositBody =
      index % 2 === 0
        ? `    ${comment("java", "If amount > 0, add it to balance")}\n`
        : `    if (amount > 0) {\n      ${comment("java", "Add amount to balance")}\n    }\n`;
    return stdoutExercise(
      goalSteps(
        `Fill getBalance and deposit. Start at ${start}, deposit ${amount}, then print the new balance.`,
        [
          "getBalance should return balance.",
          "deposit should add amount to balance when amount > 0.",
          "Do not change main.",
        ],
      ),
      `class Account {\n  private int balance;\n\n  Account(int start) {\n    balance = start;\n  }\n\n  int getBalance() {\n    return 0;\n  }\n\n  void deposit(int amount) {\n${depositBody}  }\n}\n\npublic class Main {\n  public static void main(String[] args) {\n    Account a = new Account(${start});\n    a.deposit(${amount});\n    System.out.println(a.getBalance());\n  }\n}\n`,
      expected,
      [
        "return balance; in getBalance.",
        "balance += amount; inside deposit (you can still check amount > 0).",
        `Expected output: ${expected}`,
      ],
      `main: new Account(${start}); deposit(${amount}); then prints getBalance().`,
    );
  });
  return requireCount(items, "encapsulation", language);
}

type JavaErrorSeed = {
  story: string;
  body: string;
  expected: string;
  hints: string[];
  exampleInput: string;
};

const JAVA_ERROR_SEEDS: JavaErrorSeed[] = [
  { story: "Catch divide by zero and print Cannot divide by zero.", body: `int a = 10;\nint b = 0;\ntry {\n  System.out.println(a / b);\n} catch (ArithmeticException e) {\n  ${comment("java", "Print the message")}\n}`, expected: "Cannot divide by zero", hints: ['catch (ArithmeticException e)', 'System.out.println("Cannot divide by zero");'], exampleInput: "a = 10, b = 0 (already set)." },
  { story: "Catch Integer.parseInt on abc and print Not a number.", body: `try {\n  int n = Integer.parseInt("abc");\n  System.out.println(n);\n} catch (NumberFormatException e) {\n  ${comment("java", "Print the message")}\n}`, expected: "Not a number", hints: ["catch (NumberFormatException e)", 'System.out.println("Not a number");'], exampleInput: 'Integer.parseInt("abc") is in the try block.' },
  { story: "Catch array index 5 on a 2-item array and print No such item.", body: `int[] nums = {1, 2};\ntry {\n  System.out.println(nums[5]);\n} catch (ArrayIndexOutOfBoundsException e) {\n  ${comment("java", "Print the message")}\n}`, expected: "No such item", hints: ["catch (ArrayIndexOutOfBoundsException e)", 'System.out.println("No such item");'], exampleInput: "nums is {1, 2}. Index 5 is invalid." },
  { story: "Catch divide by zero and print Nope.", body: `try {\n  System.out.println(1 / 0);\n} catch (ArithmeticException e) {\n  ${comment("java", "Print Nope")}\n}`, expected: "Nope", hints: ["catch (ArithmeticException e)", 'System.out.println("Nope");'], exampleInput: "1 / 0 is in the try block." },
  { story: "Catch parse of twelve and print Bad input.", body: `try {\n  System.out.println(Integer.parseInt("twelve"));\n} catch (NumberFormatException e) {\n  ${comment("java", "Print the message")}\n}`, expected: "Bad input", hints: ["catch (NumberFormatException e)", 'System.out.println("Bad input");'], exampleInput: 'Integer.parseInt("twelve") will fail.' },
  { story: "Catch bad index on a short string array and print Out of range.", body: `String[] letters = {"h", "i"};\ntry {\n  System.out.println(letters[8]);\n} catch (ArrayIndexOutOfBoundsException e) {\n  ${comment("java", "Print the message")}\n}`, expected: "Out of range", hints: ["catch (ArrayIndexOutOfBoundsException e)", 'System.out.println("Out of range");'], exampleInput: "letters has 2 items. Index 8 is invalid." },
  { story: "Catch divide by zero and print Cannot split.", body: `int left = 9;\nint right = 0;\ntry {\n  System.out.println(left / right);\n} catch (ArithmeticException e) {\n  ${comment("java", "Print the message")}\n}`, expected: "Cannot split", hints: ["catch (ArithmeticException e)", 'System.out.println("Cannot split");'], exampleInput: "left = 9, right = 0 (already set)." },
  { story: "Catch parse of empty text and print Could not convert.", body: `try {\n  System.out.println(Integer.parseInt(""));\n} catch (NumberFormatException e) {\n  ${comment("java", "Print the message")}\n}`, expected: "Could not convert", hints: ["catch (NumberFormatException e)", 'System.out.println("Could not convert");'], exampleInput: 'Integer.parseInt("") is in the try block.' },
  { story: "Catch index 0 on an empty array and print Empty.", body: `int[] items = {};\ntry {\n  System.out.println(items[0]);\n} catch (ArrayIndexOutOfBoundsException e) {\n  ${comment("java", "Print the message")}\n}`, expected: "Empty", hints: ["catch (ArrayIndexOutOfBoundsException e)", 'System.out.println("Empty");'], exampleInput: "items is an empty array." },
  { story: "Catch divide by zero and print Stop.", body: `try {\n  System.out.println(100 / 0);\n} catch (ArithmeticException e) {\n  ${comment("java", "Print Stop")}\n}`, expected: "Stop", hints: ["catch (ArithmeticException e)", 'System.out.println("Stop");'], exampleInput: "100 / 0 is in the try block." },
  { story: "Catch parse of xyz and print Invalid age.", body: `try {\n  int age = Integer.parseInt("xyz");\n  System.out.println(age);\n} catch (NumberFormatException e) {\n  ${comment("java", "Print the message")}\n}`, expected: "Invalid age", hints: ["catch (NumberFormatException e)", 'System.out.println("Invalid age");'], exampleInput: 'Integer.parseInt("xyz") will fail.' },
  { story: "Catch index 1 on a 1-item array and print Need more items.", body: `int[] pack = {5};\ntry {\n  System.out.println(pack[1]);\n} catch (ArrayIndexOutOfBoundsException e) {\n  ${comment("java", "Print the message")}\n}`, expected: "Need more items", hints: ["catch (ArrayIndexOutOfBoundsException e)", 'System.out.println("Need more items");'], exampleInput: "pack is {5}, so index 1 is missing." },
  { story: "Catch divide by zero and print Math error.", body: `int a = 4;\nint b = 0;\ntry {\n  System.out.println(a / b);\n} catch (ArithmeticException e) {\n  ${comment("java", "Print the message")}\n}`, expected: "Math error", hints: ["catch (ArithmeticException e)", 'System.out.println("Math error");'], exampleInput: "a = 4, b = 0 (already set)." },
  { story: "Catch parse of nope and print Use digits.", body: `try {\n  System.out.println(Integer.parseInt("nope"));\n} catch (NumberFormatException e) {\n  ${comment("java", "Print the message")}\n}`, expected: "Use digits", hints: ["catch (NumberFormatException e)", 'System.out.println("Use digits");'], exampleInput: 'Integer.parseInt("nope") will fail.' },
  { story: "Catch divide by zero and print Cannot divide.", body: `try {\n  System.out.println(8 / 0);\n} catch (ArithmeticException e) {\n  ${comment("java", "Print the message")}\n}`, expected: "Cannot divide", hints: ["catch (ArithmeticException e)", 'System.out.println("Cannot divide");'], exampleInput: "8 / 0 is in the try block." },
  { story: "Catch bad index 3 on {10, 20} and print Missing slot.", body: `int[] row = {10, 20};\ntry {\n  System.out.println(row[3]);\n} catch (ArrayIndexOutOfBoundsException e) {\n  ${comment("java", "Print the message")}\n}`, expected: "Missing slot", hints: ["catch (ArrayIndexOutOfBoundsException e)", 'System.out.println("Missing slot");'], exampleInput: "row is {10, 20}. Index 3 is invalid." },
  { story: "Catch parse of 3.5 as int and print Whole numbers only.", body: `try {\n  System.out.println(Integer.parseInt("3.5"));\n} catch (NumberFormatException e) {\n  ${comment("java", "Print the message")}\n}`, expected: "Whole numbers only", hints: ["Integer.parseInt does not accept 3.5.", 'System.out.println("Whole numbers only");'], exampleInput: 'Integer.parseInt("3.5") will fail.' },
  { story: "Catch divide by zero and print Error.", body: `int n = 0;\ntry {\n  System.out.println(5 / n);\n} catch (ArithmeticException e) {\n  ${comment("java", "Print Error")}\n}`, expected: "Error", hints: ["catch (ArithmeticException e)", 'System.out.println("Error");'], exampleInput: "n is already 0." },
  { story: "Catch index -1 if the runtime throws, otherwise know Java still throws ArrayIndexOutOfBoundsException. Print Bad index.", body: `int[] nums = {4, 5, 6};\ntry {\n  System.out.println(nums[-1]);\n} catch (ArrayIndexOutOfBoundsException e) {\n  ${comment("java", "Print the message")}\n}`, expected: "Bad index", hints: ["catch (ArrayIndexOutOfBoundsException e)", 'System.out.println("Bad index");'], exampleInput: "nums[-1] is not a valid index." },
  { story: "Catch parse of hello and print Not a decimal.", body: `try {\n  System.out.println(Double.parseDouble("hello"));\n} catch (NumberFormatException e) {\n  ${comment("java", "Print the message")}\n}`, expected: "Not a decimal", hints: ["catch (NumberFormatException e)", 'System.out.println("Not a decimal");'], exampleInput: 'Double.parseDouble("hello") will fail.' },
];

export function exceptionExercises(language: LanguageId): Exercise[] {
  if (language !== "java") return [];
  const items = JAVA_ERROR_SEEDS.map((seed) =>
    stdoutExercise(
      goalSteps(seed.story, [
        "Keep the try block from the starter.",
        "Inside catch, print the exact message from the goal.",
      ]),
      withMain("java", `${seed.body}\n`),
      seed.expected,
      seed.hints.concat([`Expected output: ${seed.expected}`]),
      seed.exampleInput,
    ),
  );
  return requireCount(items, "exceptions", language);
}
