import { ChallengeList } from "@/components/challenges/ChallengeViews";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Challenges" };

export default function ChallengesPage() {
  return <ChallengeList />;
}
