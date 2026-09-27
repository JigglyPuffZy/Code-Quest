import { redirect } from "next/navigation";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ language: string }>;
}) {
  const { language } = await params;
  redirect(`/guides/${language}`);
}
