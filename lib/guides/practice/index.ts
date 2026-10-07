import { practiceLanguageForGuide } from "@/lib/curriculum/links";
import { GUIDE_PRACTICE_PER_LESSON } from "@/lib/guides/practice/build";
import { coreExercises } from "@/lib/guides/practice/core";
import {
  classExercises,
  dictionaryExercises,
  encapsulationExercises,
  errorHandlingExercises,
  exceptionExercises,
  inheritanceExercises,
  objectExercises,
} from "@/lib/guides/practice/extra";
import { practiceKind, type PracticeKind } from "@/lib/guides/practice/kinds";
import type { Exercise, LanguageId } from "@/lib/types";

export const GUIDE_PRACTICE_XP = 15;
export { GUIDE_PRACTICE_PER_LESSON };

export type GuidePracticeRecord = {
  language: LanguageId;
  exercise: Exercise;
  exerciseId: string;
  xp: number;
  index: number;
  total: number;
};

const cache = new Map<string, Exercise[]>();

function buildQuestions(language: LanguageId, kind: PracticeKind): Exercise[] {
  switch (kind) {
    case "introduction":
    case "variables":
    case "operators":
    case "conditionals":
    case "loops":
    case "functions":
    case "collections":
      return coreExercises(language, kind);
    case "objects":
      return objectExercises(language);
    case "dictionaries":
      return dictionaryExercises(language);
    case "error-handling":
      return errorHandlingExercises(language);
    case "classes":
      return classExercises(language);
    case "inheritance":
      return inheritanceExercises(language);
    case "encapsulation":
      return encapsulationExercises(language);
    case "exceptions":
      return exceptionExercises(language);
    case "control-flow": {
      const cond = coreExercises(language, "conditionals").filter((_, index) => index % 2 === 0);
      const loops = coreExercises(language, "loops").filter((_, index) => index % 2 === 0);
      return [...cond, ...loops];
    }
  }
}

function questionsFor(language: LanguageId, kind: PracticeKind): Exercise[] {
  const key = `${language}:${kind}`;
  const cached = cache.get(key);
  if (cached) return cached;
  const built = buildQuestions(language, kind);
  cache.set(key, built);
  return built;
}

export function parseGuideExerciseId(id: string) {
  const parts = id.split("/").filter(Boolean);
  if (parts.length < 2) return null;
  const topicId = parts[0]!;
  if (parts.length === 2) {
    return { topicId, slug: parts[1]!, index: 0 };
  }
  const indexRaw = parts[parts.length - 1]!;
  const index = Number(indexRaw);
  if (!Number.isInteger(index) || index < 0) return null;
  const slug = parts.slice(1, -1).join("/");
  if (!slug) return null;
  return { topicId, slug, index };
}

export function guideExerciseId(topicId: string, slug: string, index = 0) {
  return `${topicId}/${slug}/${index}`;
}

export function getGuidePractice(
  topicId: string,
  slug: string,
  index = 0,
): GuidePracticeRecord | null {
  const language = practiceLanguageForGuide(topicId);
  if (!language) return null;

  const kind = practiceKind(slug);
  if (!kind) return null;

  const questions = questionsFor(language, kind);
  if (!questions.length) return null;
  if (!Number.isInteger(index) || index < 0 || index >= questions.length) return null;

  const exercise = questions[index];
  if (!exercise) return null;

  return {
    language,
    exercise,
    exerciseId: guideExerciseId(topicId, slug, index),
    xp: GUIDE_PRACTICE_XP,
    index,
    total: questions.length,
  };
}

export function guidePracticeCount(topicId: string, slug: string) {
  const language = practiceLanguageForGuide(topicId);
  if (!language) return 0;
  const kind = practiceKind(slug);
  if (!kind) return 0;
  return questionsFor(language, kind).length;
}

export function guideHasPractice(topicId: string, slug: string) {
  return guidePracticeCount(topicId, slug) > 0;
}
