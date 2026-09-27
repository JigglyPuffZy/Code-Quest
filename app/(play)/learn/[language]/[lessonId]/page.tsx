import { LessonPlayer } from "@/components/learn/LearnViews";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Lesson" };

export default async function LessonPage({
  params,
}: {
  params: Promise<{ language: string; lessonId: string }>;
}) {
  const { language, lessonId } = await params;
  return <LessonPlayer language={language} lessonId={lessonId} />;
}
