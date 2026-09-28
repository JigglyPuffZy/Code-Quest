import type { GuideTopicId } from "@/lib/guides/types";
import type { CatalogEntry, CatalogEntryRaw, CatalogKind, CatalogPart, CatalogSectionRaw } from "@/lib/guides/catalog/types";

const NAME_TO_TOPIC: Record<string, GuideTopicId> = {
  python: "python",
  javascript: "javascript",
  typescript: "typescript",
  java: "java",
  c: "c",
  cpp: "cpp",
  csharp: "csharp",
  go: "go",
  rust: "rust",
  php: "php",
  ruby: "ruby",
  swift: "swift",
  kotlin: "kotlin",
  r: "r",
  bash: "bash",
  html: "htmlcss",
  css: "htmlcss",
  "html-css": "htmlcss",
  react: "react",
  sql: "sql",
  mysql: "mysql",
  postgresql: "postgresql",
  sqlite: "sqlite",
  mongodb: "mongodb",
  supabase: "supabase",
};

function normalizeName(name: string) {
  return name
    .toLowerCase()
    .replace(/\([^)]*\)/g, "")
    .replace(/[^a-z0-9+#]+/g, " ")
    .trim();
}

function resolveGuideTopic(slug: string, name: string): GuideTopicId | undefined {
  if (NAME_TO_TOPIC[slug]) return NAME_TO_TOPIC[slug];
  const norm = normalizeName(name);
  if (NAME_TO_TOPIC[norm]) return NAME_TO_TOPIC[norm];
  if (norm.includes("html") || norm.includes("css")) return "htmlcss";
  if (norm.includes("postgresql") || norm.includes("postgres")) return "postgresql";
  if (norm.includes("javascript")) return "javascript";
  if (norm.includes("typescript")) return "typescript";
  return undefined;
}

function detectKind(part: CatalogPart, sectionTitle: string, name: string, use: string): CatalogKind {
  const hay = `${sectionTitle} ${name} ${use}`.toLowerCase();

  if (part === "databases") return "Database";

  if (hay.includes("markup") || hay.includes("html") || hay.includes("css") || hay.includes("xml")) {
    return "Markup / styling";
  }
  if (hay.includes("json") || hay.includes("yaml") || hay.includes("toml") || hay.includes("data format")) {
    return "Data format";
  }
  if (hay.includes("query") || hay.includes("sql") || hay.includes("graphql") || hay.includes("sparql")) {
    return "Query language";
  }
  if (hay.includes("shell") || hay.includes("scripting") || hay.includes("automation") || hay.includes("powershell")) {
    return "Shell / automation";
  }
  if (
    hay.includes("framework") ||
    hay.includes("library") ||
    hay.includes("runtime") ||
    hay.includes("react") ||
    hay.includes("angular") ||
    hay.includes("vue")
  ) {
    return "Framework / library";
  }
  if (hay.includes("service") || hay.includes("platform") || hay.includes("cloud") || hay.includes("backend as")) {
    return "Platform / service";
  }
  if (hay.includes("visual programming") || hay.includes("blockly") || hay.includes("scratch")) {
    return "Tool / runtime";
  }
  if (part === "languages") return "Programming language";
  return "Other";
}

function humanizeUse(use: string) {
  const cleaned = use.replace(/;/g, " —").replace(/\s+/g, " ").trim();
  if (!cleaned) return "used in many areas of software development";
  const lower = cleaned.charAt(0).toLowerCase() + cleaned.slice(1);
  return lower.endsWith(".") ? lower.slice(0, -1) : lower;
}

function buildWhatIsIt(name: string, kind: CatalogKind, sectionTitle: string, part: CatalogPart) {
  if (part === "databases") {
    return `${name} is a database technology listed under **${sectionTitle}**. Databases store information your apps need — user accounts, posts, products, scores, and more — so programs can save, search, and update data reliably.`;
  }

  switch (kind) {
    case "Markup / styling":
      return `${name} is a markup or styling technology in the **${sectionTitle}** group. It describes structure, content, or appearance on the web rather than running like a full programming language.`;
    case "Query language":
      return `${name} is a query or data-access language in **${sectionTitle}**. You use it to ask databases or APIs for the exact data you need, often with statements like SELECT or GraphQL queries.`;
    case "Shell / automation":
      return `${name} is a shell or automation tool in **${sectionTitle}**. It helps developers run commands, script repetitive tasks, and manage servers or local files faster.`;
    case "Framework / library":
      return `${name} is a framework, library, or runtime in **${sectionTitle}**. It builds on a base language to give you ready-made tools for common jobs like web pages, mobile apps, or game logic.`;
    case "Data format":
      return `${name} is a data format in **${sectionTitle}**. It is a standard way to write and exchange information between programs, APIs, and config files.`;
    case "Platform / service":
      return `${name} is a platform or service in **${sectionTitle}**. Teams use it as managed infrastructure instead of building every backend piece from scratch.`;
    case "Tool / runtime":
      return `${name} is a learning tool or runtime in **${sectionTitle}**. It is especially helpful when you are starting out or teaching programming ideas visually.`;
    default:
      return `${name} is a programming language in **${sectionTitle}**. A programming language is a set of rules and words developers use to tell computers what to do — from simple scripts to large apps.`;
  }
}

function buildWhenToUse(name: string, use: string, part: CatalogPart, kind: CatalogKind) {
  const useText = humanizeUse(use);
  if (part === "databases") {
    return `Teams pick **${name}** when they need ${useText}. In practice, that means choosing the right balance of reliability, speed, scale, and how your data is shaped (tables, documents, graphs, vectors, and so on).`;
  }
  if (kind === "Data format") {
    return `You will see **${name}** whenever programs need to share structured data. It is common in APIs, config files, and storing settings because ${useText}.`;
  }
  return `Developers reach for **${name}** when they want ${useText}. It is a solid option when your project goals match that focus area.`;
}

function buildBeginnerTip(name: string, guideTopicId?: GuideTopicId, part?: CatalogPart) {
  if (guideTopicId) {
    return `Dev Ladder already has a full step-by-step course for **${name}**. Start there if you want lessons instead of a quick reference.`;
  }
  if (part === "databases") {
    return `New to databases? Learn **SQL basics** first, then explore how ${name} fits the problem you are solving.`;
  }
  return `Treat **${name}** as a reference entry for now. Search the catalog for related tools, or follow a starter path like Python or JavaScript if you are just beginning.`;
}

function buildSummary(name: string, kind: CatalogKind, use: string) {
  return `${name} (${kind}) — ${humanizeUse(use)}.`;
}

export function enrichEntry(section: CatalogSectionRaw, raw: CatalogEntryRaw): CatalogEntry {
  const kind = detectKind(section.part, section.title, raw.name, raw.use);
  const guideTopicId = resolveGuideTopic(raw.slug, raw.name);

  return {
    ...raw,
    sectionId: section.id,
    sectionTitle: section.title,
    part: section.part,
    kind,
    summary: buildSummary(raw.name, kind, raw.use),
    whatIsIt: buildWhatIsIt(raw.name, kind, section.title, section.part),
    whenToUse: buildWhenToUse(raw.name, raw.use, section.part, kind),
    beginnerTip: buildBeginnerTip(raw.name, guideTopicId, section.part),
    guideTopicId,
  };
}

export function enrichSection(section: CatalogSectionRaw) {
  return {
    ...section,
    entries: section.entries.map((entry) => enrichEntry(section, entry)),
  };
}
