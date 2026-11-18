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
const GUIDES_BY_TOPIC = new Map<GuideTopicId, GuideLesson[]>();
const GUIDE_BY_KEY = new Map<string, GuideLesson>();
for (const guide of allGuides) {
  const list = GUIDES_BY_TOPIC.get(guide.topicId) ?? [];
  list.push(guide); GUIDES_BY_TOPIC.set(guide.topicId, list);
  const key = `${guide.topicId}/${guide.slug}`;
  if (!GUIDE_BY_KEY.has(key)) GUIDE_BY_KEY.set(key, guide);
}

export function isGuideTopic(value: string): value is GuideTopicId {
  return TOPIC_IDS.has(value as GuideTopicId);
}

export function getGuideTopic(id: GuideTopicId) {
  return guideTopics.find((topic) => topic.id === id)!;
}

export function guidesForTopic(topicId: GuideTopicId) {
  // Preserve the previous caller-owned-array contract without rescanning the catalog.
  return [...(GUIDES_BY_TOPIC.get(topicId) ?? [])];
}

export function getGuide(topicId: GuideTopicId, slug: string) {
  return GUIDE_BY_KEY.get(`${topicId}/${slug}`);
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
