import { generatedDatabaseGuides } from "@/lib/guides/factory-db";
import { generatedLanguageGuides } from "@/lib/guides/factory-lang";
import { javaGuides } from "@/lib/guides/java";
import { javascriptGuides } from "@/lib/guides/javascript";
import { pythonGuides } from "@/lib/guides/python";
import { reactGuides } from "@/lib/guides/react";
import { guideTopics, topicsByCategory, GUIDE_CATEGORY_LABELS } from "@/lib/guides/topics";
import type { GuideCategory, GuideLesson, GuideTopicId } from "@/lib/guides/types";

export const allGuides: GuideLesson[] = [
  ...pythonGuides,
  ...javascriptGuides,
  ...reactGuides,
  ...javaGuides,
  ...generatedLanguageGuides,
  ...generatedDatabaseGuides,
].sort((a, b) => a.order - b.order);

export { guideTopics, topicsByCategory, GUIDE_CATEGORY_LABELS };

const TOPIC_IDS = new Set(guideTopics.map((t) => t.id));

export function isGuideTopic(value: string): value is GuideTopicId {
  return TOPIC_IDS.has(value as GuideTopicId);
}

export function getGuideTopic(id: GuideTopicId) {
  return guideTopics.find((topic) => topic.id === id)!;
}

export function guidesForTopic(topicId: GuideTopicId) {
  return allGuides
    .filter((guide) => guide.topicId === topicId)
    .sort((a, b) => a.order - b.order);
}

export function getGuide(topicId: GuideTopicId, slug: string) {
  return allGuides.find((guide) => guide.topicId === topicId && guide.slug === slug);
}

export function totalGuideMinutes(topicId: GuideTopicId) {
  return guidesForTopic(topicId).reduce((sum, guide) => sum + guide.minutes, 0);
}

export function totalGuidesStats() {
  const lessons = allGuides.length;
  const courses = guideTopics.length;
  const minutes = guideTopics.reduce((sum, t) => sum + totalGuideMinutes(t.id), 0);
  return { lessons, courses, minutes };
}

export function topicsInCategory(category: GuideCategory | "all") {
  if (category === "all") return guideTopics;
  return topicsByCategory(category);
}

export {
  catalogStats,
  catalogSections,
  sectionsByPart,
  getCatalogEntry,
  searchCatalog,
  catalogEntriesWithCourses,
  CATALOG_PART_LABELS,
} from "@/lib/guides/catalog";
export type { CatalogEntry, CatalogPart, CatalogSection, CatalogKind } from "@/lib/guides/catalog";
