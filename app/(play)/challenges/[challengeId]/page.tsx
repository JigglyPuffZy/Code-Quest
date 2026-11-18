import { getLabMission } from "@/lib/lab/missions";
import { redirect } from "next/navigation";
import { ChallengePlayer } from "@/components/challenges/ChallengeViews";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Challenge" };

export default async function ChallengePage({
  params,
}: {
  params: Promise<{ challengeId: string }>;
}) {
  const { challengeId } = await params;
  if (getLabMission(challengeId)) redirect(`/lab/mission/${challengeId}`);
  return <ChallengePlayer challengeId={challengeId} />;
}
