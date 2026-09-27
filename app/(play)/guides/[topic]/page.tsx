import { TopicGuideList } from "@/components/guides/GuideViews";

export default async function TopicGuidesPage({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic } = await params;
  return <TopicGuideList topicId={topic} />;
}
