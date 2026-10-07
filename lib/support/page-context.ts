import { guideTopics } from "@/lib/guides/topics";
import type { GuideTopicId } from "@/lib/guides/types";

export type AppPageKind =
  | "landing"
  | "login"
  | "signup"
  | "forgot-password"
  | "reset-password"
  | "dashboard"
  | "guides-home"
  | "guides-catalog"
  | "guides-catalog-entry"
  | "guides-topic"
  | "guides-lesson"
  | "challenges-home"
  | "challenge"
  | "game-home"
  | "game-track"
  | "game-level"
  | "duel"
  | "leaderboard"
  | "quests"
  | "achievements"
  | "profile"
  | "other";

export type ParsedAppPath = {
  path: string;
  kind: AppPageKind;
  topicId?: string;
  slug?: string;
  extra?: string;
  chip: string;
  description: string;
};

export function topicDisplayName(topicId: string) {
  const topic = guideTopics.find((item) => item.id === topicId);
  if (topic) return topic.name;
  if (topicId === "htmlcss") return "HTML & CSS";
  return prettyPhrase(topicId);
}

export function prettyPhrase(value: string) {
  return value
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (ch) => ch.toUpperCase());
}

function cleanPath(path: string) {
  if (!path) return "/";
  const trimmed = path.split("?")[0]?.split("#")[0] ?? "/";
  if (trimmed.length > 1 && trimmed.endsWith("/")) return trimmed.slice(0, -1);
  return trimmed || "/";
}

export function parseAppPath(rawPath: string, topicId?: string, slug?: string): ParsedAppPath {
  const path = cleanPath(rawPath);
  const parts = path.split("/").filter(Boolean);

  const lessonTopic = topicId || (parts[0] === "guides" && parts[1] && parts[1] !== "catalog" ? parts[1] : undefined);
  const lessonSlug = slug || (parts[0] === "guides" && parts[1] && parts[1] !== "catalog" && parts[2] ? parts[2] : undefined);

  if (path === "/") {
    return {
      path,
      kind: "landing",
      chip: "Home",
      description: "Marketing landing page for Dev Ladder — explains guides, visible tests, duels, and the leaderboard.",
    };
  }

  if (path === "/login") {
    return {
      path,
      kind: "login",
      chip: "Log in",
      description: "Sign-in page for existing Dev Ladder accounts.",
    };
  }

  if (path === "/signup") {
    return {
      path,
      kind: "signup",
      chip: "Sign up",
      description: "Create a Dev Ladder account.",
    };
  }

  if (path === "/forgot-password") {
    return {
      path,
      kind: "forgot-password",
      chip: "Forgot password",
      description: "Request a password reset email.",
    };
  }

  if (path === "/reset-password") {
    return {
      path,
      kind: "reset-password",
      chip: "Reset password",
      description: "Set a new password after using the reset link.",
    };
  }

  if (path === "/dashboard") {
    return {
      path,
      kind: "dashboard",
      chip: "Dashboard",
      description: "Logged-in home: continue guides, see XP, quests, and shortcuts into Arena, Game, and duels.",
    };
  }

  if (path === "/guides") {
    return {
      path,
      kind: "guides-home",
      chip: "Guides",
      description: "Course catalog of step-by-step coding guides (languages, web, databases).",
    };
  }

  if (path === "/guides/catalog") {
    return {
      path,
      kind: "guides-catalog",
      chip: "Tech catalog",
      description: "Browse the full technology catalog (languages and databases) with short explainers.",
    };
  }

  if (parts[0] === "guides" && parts[1] === "catalog" && parts[2]) {
    return {
      path,
      kind: "guides-catalog-entry",
      slug: parts[2],
      chip: `Catalog · ${prettyPhrase(parts[2])}`,
      description: `A single catalog entry page about ${prettyPhrase(parts[2])}.`,
    };
  }

  if (parts[0] === "guides" && parts[1] && parts[2]) {
    const topic = lessonTopic ?? parts[1];
    const lesson = lessonSlug ?? parts[2];
    return {
      path,
      kind: "guides-lesson",
      topicId: topic,
      slug: lesson,
      chip: `${topicDisplayName(topic)} · ${prettyPhrase(lesson)}`,
      description: `Guide lesson page for ${topicDisplayName(topic)} → ${prettyPhrase(lesson)}. The user is reading this lesson and can practice below it.`,
    };
  }

  if (parts[0] === "guides" && parts[1]) {
    const topic = lessonTopic ?? parts[1];
    return {
      path,
      kind: "guides-topic",
      topicId: topic,
      chip: topicDisplayName(topic),
      description: `Course outline for the ${topicDisplayName(topic)} guide — list of lessons in this topic.`,
    };
  }

  if (path === "/challenges") {
    return {
      path,
      kind: "challenges-home",
      chip: "Arena",
      description: "Arena / challenges lobby. Pick a coding challenge to solve against tests.",
    };
  }

  if (parts[0] === "challenges" && parts[1]) {
    return {
      path,
      kind: "challenge",
      extra: parts[1],
      chip: `Arena · ${prettyPhrase(parts[1])}`,
      description: `An Arena challenge exercise (${parts[1]}). Help with concepts, syntax, and approach — not with dumping a full cheating solution.`,
    };
  }

  if (path === "/game") {
    return {
      path,
      kind: "game-home",
      chip: "Game",
      description: "Game mode lobby — pick a track and play leveled coding missions.",
    };
  }

  if (parts[0] === "game" && parts[1] && parts[2]) {
    return {
      path,
      kind: "game-level",
      extra: `${parts[1]}/${parts[2]}`,
      chip: `Game · ${prettyPhrase(parts[1])} Lv ${parts[2]}`,
      description: `A Game level on the ${prettyPhrase(parts[1])} track (level ${parts[2]}). Explain ideas; don't write the full graded solution unless they ask to learn the pattern.`,
    };
  }

  if (parts[0] === "game" && parts[1]) {
    return {
      path,
      kind: "game-track",
      extra: parts[1],
      chip: `Game · ${prettyPhrase(parts[1])}`,
      description: `Game track overview for ${prettyPhrase(parts[1])}.`,
    };
  }

  if (parts[0] === "duel" && parts[1]) {
    return {
      path,
      kind: "duel",
      extra: parts[1],
      chip: "Live duel",
      description: "A live 1v1 duel. Explain concepts and language rules, but do not solve the duel prompt for them.",
    };
  }

  if (path === "/leaderboard") {
    return {
      path,
      kind: "leaderboard",
      chip: "Leaderboard",
      description: "Ranks, online players, and duel invites.",
    };
  }

  if (path === "/quests") {
    return {
      path,
      kind: "quests",
      chip: "Quests",
      description: "Daily/weekly quests that award XP for reading guides, practicing, and playing.",
    };
  }

  if (path === "/achievements") {
    return {
      path,
      kind: "achievements",
      chip: "Achievements",
      description: "Badges and milestones the player has earned.",
    };
  }

  if (path === "/profile") {
    return {
      path,
      kind: "profile",
      chip: "Profile",
      description: "Player profile: avatar, username, stats, and account actions.",
    };
  }

  return {
    path,
    kind: "other",
    chip: prettyPhrase(parts.join(" ") || "Dev Ladder"),
    description: `A Dev Ladder page at ${path}.`,
  };
}

export function isGuideTopicId(value: string): value is GuideTopicId {
  return guideTopics.some((topic) => topic.id === value);
}
