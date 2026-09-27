import { PathMap } from "@/components/learn/LearnViews";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Learning path" };

export default async function LanguagePathPage({
  params,
}: {
  params: Promise<{ language: string }>;
}) {
  const { language } = await params;
  return <PathMap language={language} />;
}
