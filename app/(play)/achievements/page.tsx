import { AchievementGrid } from "@/components/achievements/AchievementGrid";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Achievements" };

export default function AchievementsPage() {
  return <AchievementGrid />;
}
