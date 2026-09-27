import { ChallengePlayer } from "@/components/challenges/ChallengeViews";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Challenge" };

export default async function ChallengePage({
  params,
}: {
  params: Promise<{ challengeId: string }>;
}) {
  const { challengeId } = await params;
  return <ChallengePlayer challengeId={challengeId} />;
}
