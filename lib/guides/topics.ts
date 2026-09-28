import type { GuideCategory, GuideTopic } from "@/lib/guides/types";

export const guideTopics: GuideTopic[] = [
  // Languages
  {
    id: "python",
    name: "Python",
    category: "languages",
    tagline: "Best for beginners",
    description: "From your first print() to functions, lists, and error handling — explained in plain language.",
  },
  {
    id: "javascript",
    name: "JavaScript",
    category: "languages",
    tagline: "Web & apps",
    description: "Variables, functions, arrays, objects, and DOM basics — the foundation of web development.",
  },
  {
    id: "typescript",
    name: "TypeScript",
    category: "languages",
    tagline: "JavaScript + types",
    description: "Add types to JavaScript for safer, clearer code in big projects.",
  },
  {
    id: "java",
    name: "Java",
    category: "languages",
    tagline: "Enterprise & backend",
    description: "Types, classes, objects, and inheritance — a complete intro to Java.",
  },
  {
    id: "c",
    name: "C",
    category: "languages",
    tagline: "Systems foundation",
    description: "Low-level basics and how computers run your code — the foundation many languages build on.",
  },
  {
    id: "cpp",
    name: "C++",
    category: "languages",
    tagline: "Performance & games",
    description: "C with classes, STL, and modern C++ features for fast software.",
  },
  {
    id: "csharp",
    name: "C#",
    category: "languages",
    tagline: ".NET & games",
    description: "Microsoft's language for apps, games (Unity), and backend services.",
  },
  {
    id: "go",
    name: "Go",
    category: "languages",
    tagline: "Simple & fast servers",
    description: "Built by Google for clear syntax and powerful backend services.",
  },
  {
    id: "rust",
    name: "Rust",
    category: "languages",
    tagline: "Safe & fast",
    description: "Memory safety without garbage collection — great for systems and WebAssembly.",
  },
  {
    id: "php",
    name: "PHP",
    category: "languages",
    tagline: "Web backends",
    description: "Server-side scripting that powers millions of websites and WordPress.",
  },
  {
    id: "ruby",
    name: "Ruby",
    category: "languages",
    tagline: "Elegant & productive",
    description: "Readable syntax loved by startups — especially with Ruby on Rails.",
  },
  {
    id: "swift",
    name: "Swift",
    category: "languages",
    tagline: "Apple apps",
    description: "Build iPhone, iPad, and Mac apps with Apple's modern language.",
  },
  {
    id: "kotlin",
    name: "Kotlin",
    category: "languages",
    tagline: "Android & JVM",
    description: "Google's preferred language for Android — concise and safe.",
  },
  {
    id: "r",
    name: "R",
    category: "languages",
    tagline: "Data & statistics",
    description: "Analyze data, create charts, and run statistical models.",
  },
  {
    id: "bash",
    name: "Bash",
    category: "languages",
    tagline: "Shell scripting",
    description: "Automate tasks on Linux and Mac — files, servers, and dev workflows.",
  },
  // Web
  {
    id: "htmlcss",
    name: "HTML & CSS",
    category: "web",
    tagline: "Web structure & style",
    description: "Build web pages from scratch — tags, layout, colors, and responsive design.",
  },
  {
    id: "react",
    name: "React",
    category: "web",
    tagline: "Modern UI library",
    description: "Components, JSX, props, state, hooks, and forms — build real interfaces.",
  },
  // Databases
  {
    id: "sql",
    name: "SQL Basics",
    category: "databases",
    tagline: "Universal database language",
    description: "Tables, SELECT, INSERT, JOINs — the core skills every developer needs.",
  },
  {
    id: "mysql",
    name: "MySQL",
    category: "databases",
    tagline: "Popular SQL database",
    description: "Install, design tables, query data, and use MySQL in real web apps.",
  },
  {
    id: "postgresql",
    name: "PostgreSQL",
    category: "databases",
    tagline: "Advanced open-source SQL",
    description: "Powerful features, JSON support, and production-grade reliability.",
  },
  {
    id: "sqlite",
    name: "SQLite",
    category: "databases",
    tagline: "Lightweight & embedded",
    description: "A whole database in one file — perfect for mobile apps and prototypes.",
  },
  {
    id: "mongodb",
    name: "MongoDB",
    category: "databases",
    tagline: "Document database",
    description: "Store JSON-like documents — flexible schema for modern apps.",
  },
  {
    id: "supabase",
    name: "Supabase",
    category: "databases",
    tagline: "Backend as a service",
    description: "PostgreSQL + auth + APIs in the cloud — what Dev Ladder uses for accounts.",
  },
];

export const GUIDE_CATEGORY_LABELS: Record<GuideCategory, string> = {
  languages: "Programming languages",
  web: "Web & mobile",
  databases: "Databases",
};

export function topicsByCategory(category: GuideCategory) {
  return guideTopics.filter((t) => t.category === category);
}
