import type { GuideTopicId } from "@/lib/guides/types";
import type { LanguageId } from "@/lib/types";

export const LANGUAGE_TO_GUIDE: Record<LanguageId, GuideTopicId> = {
  python: "python",
  javascript: "javascript",
  typescript: "typescript",
  java: "java",
};

export const GUIDE_TO_LANGUAGE: Partial<Record<GuideTopicId, LanguageId>> = {
  python: "python",
  javascript: "javascript",
  typescript: "typescript",
  java: "java",
};

export function hasCodePractice(topicId: string): boolean {
  return topicId in GUIDE_TO_LANGUAGE;
}

export function practiceLanguageForGuide(topicId: string): LanguageId | null {
  return GUIDE_TO_LANGUAGE[topicId as GuideTopicId] ?? null;
}
