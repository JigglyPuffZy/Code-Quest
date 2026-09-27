import { guidePaths } from "@/lib/curriculum/guide-paths";
import { guidesForTopic } from "@/lib/guides/index";
import { isGuideRead } from "@/lib/guides/progress";
import type { GuideTopicId } from "@/lib/guides/types";

const CORE_TOPICS: GuideTopicId[] = ["python", "javascript", "typescript", "java"];

export type ContinueGuide = {
  topicId: GuideTopicId;
  slug: string;
  title: string;
  summary: string;
  minutes: number;
};

function topicOrder(): GuideTopicId[] {
  const extra = guidePaths
    .map((path) => path.topicId)
    .filter((topicId) => !CORE_TOPICS.includes(topicId));
  return [...CORE_TOPICS, ...extra];
}

export function continueGuide(): ContinueGuide | null {
  if (typeof window === "undefined") {
    const first = guidesForTopic("python")[0];
    return first
      ? {
          topicId: "python",
          slug: first.slug,
          title: first.title,
          summary: first.summary,
          minutes: first.minutes,
        }
      : null;
  }

  for (const topicId of topicOrder()) {
    for (const lesson of guidesForTopic(topicId)) {
      if (!isGuideRead(topicId, lesson.slug)) {
        return {
          topicId,
          slug: lesson.slug,
          title: lesson.title,
          summary: lesson.summary,
          minutes: lesson.minutes,
        };
      }
    }
  }

  const fallback = guidesForTopic("python")[0];
  return fallback
    ? {
        topicId: "python",
        slug: fallback.slug,
        title: fallback.title,
        summary: fallback.summary,
        minutes: fallback.minutes,
      }
    : null;
}

export function continueGuideHref() {
  const next = continueGuide();
  return next ? `/guides/${next.topicId}/${next.slug}` : "/guides";
}
