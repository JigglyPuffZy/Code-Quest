import * as icons from "simple-icons";

const slugs = [
  "python", "javascript", "typescript", "openjdk", "c", "cplusplus", "dotnet", "go", "rust", "php",
  "ruby", "swift", "kotlin", "r", "gnubash", "react", "html5", "css", "postgresql", "mysql",
  "sqlite", "mongodb", "supabase", "mariadb", "redis", "firebase", "docker", "kubernetes",
  "nodedotjs", "dart", "flutter", "lua", "scratch", "graphql", "oracle", "microsoftsqlserver",
  "apachecassandra", "apachecouchdb", "couchbase", "elasticsearch", "neo4j", "amazondynamodb",
  "snowflake", "databricks", "duckdb", "cockroachlabs", "tidb", "angular", "vuedotjs", "svelte",
  "nextdotjs", "express", "django", "flask", "rubyonrails", "laravel", "spring", "unity",
  "unrealengine", "git", "github", "gitlab", "amazonaws", "microsoftazure", "googlecloud",
  "vercel", "netlify", "heroku", "terraform", "ansible", "linux", "ubuntu", "debian", "windows",
  "macos", "android", "ios", "perl", "scala", "haskell", "clojure", "elixir", "erlang",
  "mathworks", "julia", "powershell", "xml", "json", "yaml",
];

const imports = [];
const entries = [];

for (const slug of slugs) {
  const key = Object.keys(icons).find((name) => icons[name]?.slug === slug);
  if (!key) {
    console.warn("missing", slug);
    continue;
  }
  imports.push(key);
  entries.push(`  ["${slug}", ${key}],`);
}

import { writeFileSync } from "node:fs";

const output = `import type { SimpleIcon } from "simple-icons";
import {
  ${imports.join(",\n  ")},
} from "simple-icons";

const ICON_BY_SLUG = new Map<string, SimpleIcon>([
${entries.join("\n")}
]);

export function getSimpleIcon(slug: string): SimpleIcon | undefined {
  return ICON_BY_SLUG.get(slug);
}
`;

writeFileSync(new URL("../lib/tech-icon-registry.ts", import.meta.url), output);
