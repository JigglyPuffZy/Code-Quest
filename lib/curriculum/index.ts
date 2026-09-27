import { achievements } from "@/lib/curriculum/achievements";
import { challenges } from "@/lib/curriculum/challenges";
import { guidePaths } from "@/lib/curriculum/guide-paths";
import {
  javaChapters,
  javaLessons,
  javaWorlds,
} from "@/lib/curriculum/java";
import {
  javascriptChapters,
  javascriptLessons,
  javascriptWorlds,
} from "@/lib/curriculum/javascript";
import {
  pythonChapters,
  pythonLessons,
  pythonWorlds,
} from "@/lib/curriculum/python";
import {
  typescriptChapters,
  typescriptLessons,
  typescriptWorlds,
} from "@/lib/curriculum/typescript";
import { allQuests, quests, sideQuests } from "@/lib/curriculum/quests";
import type { SkillDifficulty } from "@/lib/difficulty";
import { buildGameLevelFromId } from "@/lib/game";
import type { GameStackPrefs } from "@/lib/game/banks";
import type {
  Challenge,
  Chapter,
  LanguageId,
  LanguageInfo,
  Lesson,
  World,
} from "@/lib/types";

export const languages: LanguageInfo[] = [
  {
    id: "python",
    name: "Python",
    tagline: "A clear first language",
    blurb: "Read like plain speech. Start here if you are new to programming.",
    guideTopicId: "python",
  },
  {
    id: "javascript",
    name: "JavaScript",
    tagline: "The language of the web",
    blurb: "Learn the scripts that run in browsers, with the same ideas as Python.",
    guideTopicId: "javascript",
  },
  {
    id: "typescript",
    name: "TypeScript",
    tagline: "JavaScript with types",
    blurb: "Safer code with types — the next step after JavaScript.",
    guideTopicId: "typescript",
  },
  {
    id: "java",
    name: "Java",
    tagline: "Enterprise & Android",
    blurb: "Classes, methods, and the JVM — a classic path for big apps.",
    guideTopicId: "java",
  },
];

export const worlds: World[] = [
  ...pythonWorlds,
  ...javascriptWorlds,
  ...typescriptWorlds,
  ...javaWorlds,
];
export const chapters: Chapter[] = [
  ...pythonChapters,
  ...javascriptChapters,
  ...typescriptChapters,
  ...javaChapters,
];
export const lessons: Lesson[] = [
  ...pythonLessons,
  ...javascriptLessons,
  ...typescriptLessons,
  ...javaLessons,
];

export { achievements, challenges, guidePaths, quests, sideQuests, allQuests };

const LANGUAGE_IDS: LanguageId[] = ["python", "javascript", "typescript", "java"];

export function isLanguage(value: string): value is LanguageId {
  return LANGUAGE_IDS.includes(value as LanguageId);
}

export function languageInfo(id: LanguageId) {
  return languages.find((language) => language.id === id)!;
}

export function lessonsFor(language: LanguageId) {
  return lessons.filter((lesson) => lesson.language === language);
}

export function worldsFor(language: LanguageId) {
  return worlds.filter((world) => world.language === language);
}

export function chaptersFor(worldId: string) {
  return chapters.filter((chapter) => chapter.worldId === worldId);
}

export function lessonsForChapter(chapterId: string) {
  return lessons.filter((lesson) => lesson.chapterId === chapterId);
}

export function getLesson(id: string) {
  return lessons.find((lesson) => lesson.id === id);
}

export function getChallenge(id: string) {
  return challenges.find((challenge) => challenge.id === id);
}

export function getWorld(id: string) {
  return worlds.find((world) => world.id === id);
}

export function findExercise(
  kind: "lesson" | "challenge" | "game",
  id: string,
  options?: { difficulty?: SkillDifficulty; stack?: GameStackPrefs },
) {
  if (kind === "game") {
    if (!options?.stack) return null;
    const record = buildGameLevelFromId(id, options.stack);
    if (!record) return null;
    return { language: record.language, exercise: record.exercise, xp: record.xp };
  }
  const record: Lesson | Challenge | undefined =
    kind === "lesson" ? getLesson(id) : getChallenge(id);
  if (!record) return null;
  return { language: record.language, exercise: record.exercise, xp: record.xp };
}
