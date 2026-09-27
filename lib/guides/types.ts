import type { ContentBlock } from "@/lib/types";

export type GuideCategory = "languages" | "web" | "databases";

export type GuideTopicId =
  | "python"
  | "javascript"
  | "typescript"
  | "java"
  | "c"
  | "cpp"
  | "csharp"
  | "go"
  | "rust"
  | "php"
  | "ruby"
  | "swift"
  | "kotlin"
  | "r"
  | "bash"
  | "react"
  | "htmlcss"
  | "sql"
  | "mysql"
  | "postgresql"
  | "sqlite"
  | "mongodb"
  | "supabase";

export type GuideTopic = {
  id: GuideTopicId;
  name: string;
  category: GuideCategory;
  tagline: string;
  description: string;
};

export type GuideLesson = {
  slug: string;
  topicId: GuideTopicId;
  title: string;
  summary: string;
  minutes: number;
  order: number;
  blocks: ContentBlock[];
};

export type TopicStyle = {
  accent: string;
  soft: string;
  ring: string;
  bar: string;
};
