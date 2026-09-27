import type { GuideTopicId } from "@/lib/guides/types";

export type GuidePathInfo = {
  topicId: GuideTopicId;
  name: string;
  tagline: string;
  blurb: string;
  category: "web" | "databases";
};

/** Guide-only practice paths — read lessons, track progress, earn quest credit. */
export const guidePaths: GuidePathInfo[] = [
  {
    topicId: "react",
    name: "React",
    tagline: "Modern UI",
    blurb: "Components, props, state, and hooks — then practice in the full guide.",
    category: "web",
  },
  {
    topicId: "htmlcss",
    name: "HTML & CSS",
    tagline: "Web foundations",
    blurb: "Structure pages and style them before diving into JavaScript frameworks.",
    category: "web",
  },
  {
    topicId: "sql",
    name: "SQL Basics",
    tagline: "Query data",
    blurb: "SELECT, INSERT, and JOINs — the core database skills every dev needs.",
    category: "databases",
  },
  {
    topicId: "mysql",
    name: "MySQL",
    tagline: "Popular SQL DB",
    blurb: "Tables, queries, and real-world patterns with the world's most used SQL database.",
    category: "databases",
  },
  {
    topicId: "postgresql",
    name: "PostgreSQL",
    tagline: "Advanced SQL",
    blurb: "Production-grade SQL with JSON, indexes, and powerful features.",
    category: "databases",
  },
  {
    topicId: "mongodb",
    name: "MongoDB",
    tagline: "Documents",
    blurb: "Store flexible JSON-like documents for modern apps.",
    category: "databases",
  },
];

export function getGuidePath(topicId: GuideTopicId) {
  return guidePaths.find((path) => path.topicId === topicId);
}
