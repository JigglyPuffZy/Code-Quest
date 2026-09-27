import { LearnHome } from "@/components/learn/LearnViews";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Learn" };

export default function LearnPage() {
  return <LearnHome />;
}
