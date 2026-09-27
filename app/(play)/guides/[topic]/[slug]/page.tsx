import { GuideReader } from "@/components/guides/GuideViews";

export default async function GuideLessonPage({
  params,
}: {
  params: Promise<{ topic: string; slug: string }>;
}) {
  const { topic, slug } = await params;
  return <GuideReader topicId={topic} slug={slug} />;
}
