import { LeaderboardView } from "@/components/leaderboard/LeaderboardView";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Leaderboard" };

export default function LeaderboardPage() {
  return <LeaderboardView />;
}
