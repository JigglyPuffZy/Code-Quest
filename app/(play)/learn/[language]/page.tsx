import { redirect } from "next/navigation";

export default async function LanguagePathPage({
  params,
}: {
  params: Promise<{ language: string }>;
}) {
  const { language } = await params;
  redirect(`/guides/${language}`);
}
