import type { GuideTopicId } from "@/lib/guides/types";
import { getSimpleIcon } from "@/lib/tech-icon-registry";

export { getSimpleIcon };

export const TOPIC_ICON_SLUGS: Record<GuideTopicId, string | string[]> = {
  python: "python",
  javascript: "javascript",
  typescript: "typescript",
  java: "openjdk",
  c: "c",
  cpp: "cplusplus",
  csharp: "dotnet",
  go: "go",
  rust: "rust",
  php: "php",
  ruby: "ruby",
  swift: "swift",
  kotlin: "kotlin",
  r: "r",
  bash: "gnubash",
  react: "react",
  htmlcss: ["html5", "css"],
  sql: "postgresql",
  mysql: "mysql",
  postgresql: "postgresql",
  sqlite: "sqlite",
  mongodb: "mongodb",
  supabase: "supabase",
};

/** Explicit catalog / technology name → simple-icons slug */
const NAME_ICON_SLUGS: Record<string, string> = {
  python: "python",
  javascript: "javascript",
  typescript: "typescript",
  java: "openjdk",
  c: "c",
  cpp: "cplusplus",
  "c++": "cplusplus",
  csharp: "dotnet",
  "c#": "dotnet",
  go: "go",
  golang: "go",
  rust: "rust",
  php: "php",
  ruby: "ruby",
  swift: "swift",
  kotlin: "kotlin",
  r: "r",
  bash: "gnubash",
  shell: "gnubash",
  react: "react",
  html: "html5",
  css: "css",
  "html-css": "html5",
  sql: "postgresql",
  mysql: "mysql",
  mariadb: "mariadb",
  postgresql: "postgresql",
  postgres: "postgresql",
  sqlite: "sqlite",
  mongodb: "mongodb",
  redis: "redis",
  supabase: "supabase",
  firebase: "firebase",
  docker: "docker",
  kubernetes: "kubernetes",
  nodejs: "nodedotjs",
  "node.js": "nodedotjs",
  dart: "dart",
  flutter: "flutter",
  lua: "lua",
  scratch: "scratch",
  graphql: "graphql",
  oracle: "oracle",
  "microsoft sql server": "microsoftsqlserver",
  "sql server": "microsoftsqlserver",
  cassandra: "apachecassandra",
  couchdb: "apachecouchdb",
  couchbase: "couchbase",
  elasticsearch: "elasticsearch",
  neo4j: "neo4j",
  dynamodb: "amazondynamodb",
  snowflake: "snowflake",
  databricks: "databricks",
  duckdb: "duckdb",
  cockroachdb: "cockroachlabs",
  tidb: "tidb",
  angular: "angular",
  vue: "vuedotjs",
  svelte: "svelte",
  nextjs: "nextdotjs",
  "next.js": "nextdotjs",
  express: "express",
  django: "django",
  flask: "flask",
  rails: "rubyonrails",
  "ruby on rails": "rubyonrails",
  laravel: "laravel",
  spring: "spring",
  unity: "unity",
  unreal: "unrealengine",
  git: "git",
  github: "github",
  gitlab: "gitlab",
  aws: "amazonaws",
  azure: "microsoftazure",
  gcp: "googlecloud",
  "google cloud": "googlecloud",
  vercel: "vercel",
  netlify: "netlify",
  heroku: "heroku",
  terraform: "terraform",
  ansible: "ansible",
  linux: "linux",
  ubuntu: "ubuntu",
  debian: "debian",
  windows: "windows",
  macos: "macos",
  android: "android",
  ios: "ios",
  xamarin: "dotnet",
  "visual basic": "dotnet",
  "visual basic .net": "dotnet",
  perl: "perl",
  scala: "scala",
  haskell: "haskell",
  clojure: "clojure",
  elixir: "elixir",
  erlang: "erlang",
  matlab: "mathworks",
  julia: "julia",
  powershell: "powershell",
  xml: "xml",
  json: "json",
  yaml: "yaml",
};

function normalizeKey(value: string) {
  return value
    .toLowerCase()
    .replace(/\([^)]*\)/g, "")
    .replace(/[^a-z0-9+#.\s-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function resolveTopicIconSlugs(topicId: GuideTopicId): string[] {
  const value = TOPIC_ICON_SLUGS[topicId];
  return Array.isArray(value) ? value : [value];
}

export function resolveIconSlug(input: {
  topicId?: GuideTopicId;
  slug?: string;
  name?: string;
}): string[] {
  if (input.topicId) {
    return resolveTopicIconSlugs(input.topicId);
  }

  if (input.slug) {
    const fromSlug = NAME_ICON_SLUGS[input.slug];
    if (fromSlug) return [fromSlug];
    if (getSimpleIcon(input.slug)) return [input.slug];
  }

  if (input.name) {
    const norm = normalizeKey(input.name);
    if (NAME_ICON_SLUGS[norm]) return [NAME_ICON_SLUGS[norm]];

    const compact = norm.replace(/\s+/g, "");
    if (NAME_ICON_SLUGS[compact]) return [NAME_ICON_SLUGS[compact]];

    if (getSimpleIcon(compact)) return [compact];

    const hyphen = norm.replace(/\s+/g, "-");
    if (getSimpleIcon(hyphen)) return [hyphen];

    const firstWord = norm.split(" ")[0];
    if (NAME_ICON_SLUGS[firstWord]) return [NAME_ICON_SLUGS[firstWord]];
    if (getSimpleIcon(firstWord)) return [firstWord];
  }

  return [];
}
