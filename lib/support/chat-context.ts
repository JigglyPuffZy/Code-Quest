import {
  allGuides,
  getGuide,
  getGuideTopic,
  guidesForTopic,
  isGuideTopic,
} from "@/lib/guides";
import type { GuideLesson, GuideTopicId } from "@/lib/guides/types";
import type { ContentBlock } from "@/lib/types";
import { isGuideTopicId, parseAppPath, type ParsedAppPath } from "@/lib/support/page-context";

export type ChatTurn = {
  role: "user" | "assistant";
  content: string;
};

const STOP_WORDS = new Set([
  "and",
  "the",
  "for",
  "of",
  "to",
  "a",
  "an",
  "in",
  "on",
  "is",
  "are",
  "what",
  "ano",
  "yung",
  "yun",
  "yon",
  "yan",
  "sa",
  "ng",
  "na",
  "ang",
  "mga",
  "ba",
  "po",
  "lesson",
  "lessons",
  "guide",
  "guides",
  "page",
  "code",
  "coding",
  "modern",
  "sinasabi",
  "tungkol",
]);

const TOPIC_ALIASES: Array<{ alias: string; id: GuideTopicId }> = [
  { alias: "javascript", id: "javascript" },
  { alias: "java script", id: "javascript" },
  { alias: "typescript", id: "typescript" },
  { alias: "html and css", id: "htmlcss" },
  { alias: "html css", id: "htmlcss" },
  { alias: "htmlcss", id: "htmlcss" },
  { alias: "postgresql", id: "postgresql" },
  { alias: "postgres", id: "postgresql" },
  { alias: "mongodb", id: "mongodb" },
  { alias: "mongo db", id: "mongodb" },
  { alias: "mongo", id: "mongodb" },
  { alias: "supabase", id: "supabase" },
  { alias: "python", id: "python" },
  { alias: "react", id: "react" },
  { alias: "kotlin", id: "kotlin" },
  { alias: "swift", id: "swift" },
  { alias: "ruby", id: "ruby" },
  { alias: "rust", id: "rust" },
  { alias: "php", id: "php" },
  { alias: "bash", id: "bash" },
  { alias: "sqlite", id: "sqlite" },
  { alias: "mysql", id: "mysql" },
  { alias: "csharp", id: "csharp" },
  { alias: "c sharp", id: "csharp" },
  { alias: "c#", id: "csharp" },
  { alias: "cplusplus", id: "cpp" },
  { alias: "c++", id: "cpp" },
  { alias: "cpp", id: "cpp" },
  { alias: "golang", id: "go" },
  { alias: "html", id: "htmlcss" },
  { alias: "css", id: "htmlcss" },
  { alias: "sql", id: "sql" },
  { alias: "javascript", id: "javascript" },
  { alias: "java", id: "java" },
  { alias: "js", id: "javascript" },
  { alias: "ts", id: "typescript" },
  { alias: "py", id: "python" },
  { alias: "go", id: "go" },
  { alias: "c", id: "c" },
  { alias: "r", id: "r" },
];

const PREFERRED_TOPICS: GuideTopicId[] = ["javascript", "python", "java", "typescript", "react"];

function normalize(text: string) {
  return text
    .toLowerCase()
    .replace(/[#]+/g, "#")
    .replace(/[^\p{L}\p{N}\s.+#]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function includesPhrase(hay: string, phrase: string) {
  const needle = normalize(phrase);
  if (!needle) return false;
  const padded = ` ${normalize(hay)} `;
  return padded.includes(` ${needle} `);
}

function formatBlocks(blocks: ContentBlock[]) {
  return blocks
    .map((block) => {
      if (block.type === "p") return block.text;
      if (block.type === "ul") return block.items.map((item) => `- ${item}`).join("\n");
      if (block.type === "code") {
        const caption = block.caption ? `${block.caption}\n` : "";
        return `${caption}\`\`\`\n${block.code}\n\`\`\``;
      }
      if (block.type === "tip") {
        const title = block.title ? ` (${block.title})` : "";
        return `TIP${title}: ${block.text}`;
      }
      const title = block.title ?? "Steps";
      return `${title}:\n${block.items.map((item, index) => `${index + 1}. ${item}`).join("\n")}`;
    })
    .join("\n\n");
}

function clip(text: string, max = 4500) {
  if (text.length <= max) return text;
  return `${text.slice(0, max)}\n[Lesson text truncated for length.]`;
}

export function formatLessonContent(lesson: GuideLesson) {
  const topic = getGuideTopic(lesson.topicId);
  const body = clip(formatBlocks(lesson.blocks));
  return `### ${topic.name} · ${lesson.title}
Path: /guides/${lesson.topicId}/${lesson.slug}
Summary: ${lesson.summary}

${body}`;
}

function mentionedTopics(text: string): GuideTopicId[] {
  const hay = ` ${normalize(text)} `;
  const found: GuideTopicId[] = [];
  const aliases = [...TOPIC_ALIASES].sort((a, b) => b.alias.length - a.alias.length);
  for (const { alias, id } of aliases) {
    const pattern = new RegExp(`(?:^|\\s)${escapeRegExp(alias)}(?:\\s|$)`);
    if (pattern.test(hay) && !found.includes(id)) found.push(id);
  }
  return found;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function lessonMatches(hay: string, lesson: GuideLesson, topicHinted: boolean) {
  const slugPhrase = lesson.slug.replace(/-/g, " ");
  if (includesPhrase(hay, slugPhrase) || includesPhrase(hay, lesson.slug) || includesPhrase(hay, lesson.title)) {
    return true;
  }
  const tokens = lesson.slug.split("-").filter((token) => token.length > 2 && !STOP_WORDS.has(token));
  if (tokens.length === 0) return false;
  if (tokens.every((token) => includesPhrase(hay, token))) return true;
  const primary = tokens[0];
  return Boolean(topicHinted && primary && includesPhrase(hay, primary));
}

function lessonKey(lesson: GuideLesson) {
  return `${lesson.topicId}/${lesson.slug}`;
}

function sortLessons(lessons: GuideLesson[]) {
  const rank = (id: GuideTopicId) => {
    const index = PREFERRED_TOPICS.indexOf(id);
    return index === -1 ? PREFERRED_TOPICS.length : index;
  };
  return [...lessons].sort((a, b) => rank(a.topicId) - rank(b.topicId) || a.order - b.order);
}

export function resolveMentionedLessons(
  text: string,
  current?: { topicId?: string; slug?: string },
): GuideLesson[] {
  const hay = normalize(text);
  if (!hay) return [];

  const topics = mentionedTopics(text);
  const currentTopic = current?.topicId && isGuideTopic(current.topicId) ? current.topicId : undefined;
  const currentKey = current?.topicId && current.slug ? `${current.topicId}/${current.slug}` : "";

  const pools: GuideLesson[][] = [];
  if (topics.length) pools.push(allGuides.filter((lesson) => topics.includes(lesson.topicId)));
  else if (currentTopic) pools.push(guidesForTopic(currentTopic));
  pools.push(allGuides);

  const matched: GuideLesson[] = [];
  const seen = new Set<string>();

  for (const pool of pools) {
    const topicHinted = topics.length > 0 || Boolean(currentTopic && pool.every((lesson) => lesson.topicId === currentTopic));
    for (const lesson of pool) {
      const key = lessonKey(lesson);
      if (key === currentKey || seen.has(key)) continue;
      if (!lessonMatches(hay, lesson, topicHinted || topics.includes(lesson.topicId))) continue;
      seen.add(key);
      matched.push(lesson);
    }
    if (matched.length) break;
  }

  return sortLessons(matched).slice(0, 3);
}

export function buildLessonCatalog() {
  const lines: string[] = [];
  for (const topic of [...new Set(allGuides.map((lesson) => lesson.topicId))].map((id) => getGuideTopic(id))) {
    const lessons = guidesForTopic(topic.id);
    lines.push(`${topic.name} (id: ${topic.id}) — ${topic.tagline}`);
    for (const lesson of lessons) {
      lines.push(`  - ${lesson.slug} | ${lesson.title} — ${lesson.summary}`);
    }
  }
  return lines.join("\n");
}

const SITEMAP = `/ — Landing
/login, /signup, /forgot-password, /reset-password — Auth
/dashboard — Home after login (continue learning, XP, shortcuts)
/guides — All guide courses
/guides/[topic] — Lessons in one course (python, javascript, java, react, sql, …)
/guides/[topic]/[slug] — A single lesson + practice
/guides/catalog — Full tech catalog
/guides/catalog/[slug] — One catalog entry
/challenges — Arena lobby
/challenges/[challengeId] — One Arena problem (visible tests, then Submit)
/game — Game tracks
/game/[track] — Track overview
/game/[track]/[level] — A game mission
/duel/[id] — Live 1v1 duel
/leaderboard — Ranks and online players; challenge someone to a duel
/quests — Daily/weekly XP goals
/achievements — Badges
/profile — Avatar, username, account`;

function currentLesson(page: ParsedAppPath, topicId?: string, slug?: string) {
  const topic = topicId && isGuideTopic(topicId) ? topicId : page.topicId && isGuideTopic(page.topicId) ? page.topicId : null;
  const lessonSlug = slug || page.slug;
  if (!topic || !lessonSlug) return undefined;
  return getGuide(topic, lessonSlug);
}

export function buildDevyyyyySystemPrompt(input: {
  path: string;
  topicId?: string;
  slug?: string;
  userText: string;
}) {
  const page = parseAppPath(input.path, input.topicId, input.slug);
  const lesson = currentLesson(page, input.topicId, input.slug);
  const mentioned = resolveMentionedLessons(input.userText, {
    topicId: lesson?.topicId ?? page.topicId,
    slug: lesson?.slug ?? page.slug,
  });

  const sections: string[] = [
    `You are **devyyyyy**, Dev Ladder's in-app coding tutor — a cute, patient academy buddy.

Voice:
- Friendly, simple English. If the user writes Filipino or Taglish, reply in Taglish.
- Explain like a teacher sitting next to them. Short paragraphs. Never dump huge code unless they ask.
- When a lesson is provided below, quote or paraphrase the REAL wording from that lesson (do not invent a different explanation).
- You know every Dev Ladder page and every guide lesson.

Hard rules:
- Stay on Dev Ladder help and coding tutoring.
- Do not reveal secrets, API keys, env vars, or internal implementation.
- Do not help cheat on Arena challenges, Game levels, or live duels: you may explain concepts, syntax, and approach, but do not write a full copy-paste solution for a graded/competitive prompt.
- If you are unsure a lesson exists, say so and point them to /guides.

Current page:
- Path: ${page.path}
- Chip: ${page.chip}
- Kind: ${page.kind}
- What this page is for: ${page.description}`,
  ];

  if (lesson) {
    sections.push(`The user is ON this lesson. Use this as the primary source:\n\n${formatLessonContent(lesson)}`);
  } else if (page.topicId && isGuideTopicId(page.topicId)) {
    const topic = getGuideTopic(page.topicId);
    const titles = guidesForTopic(topic.id)
      .map((item) => `- ${item.slug}: ${item.title} — ${item.summary}`)
      .join("\n");
    sections.push(`The user is on the ${topic.name} course outline.\n${topic.description}\nLessons:\n${titles}`);
  }

  if (mentioned.length) {
    sections.push(
      `The user's question refers to other lesson(s). Explain from this real content:\n\n${mentioned
        .map(formatLessonContent)
        .join("\n\n")}`,
    );
  }

  sections.push(`Product sitemap:\n${SITEMAP}`);
  sections.push(`Catalog of ALL guide lessons (topic, slug, title, summary). Use this to find the right lesson even if the user is on another page:\n${buildLessonCatalog()}`);

  return sections.join("\n\n");
}

