import { QuestBoard } from "@/components/quests/QuestBoard";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Quests" };

export default function QuestsPage() {
  return <QuestBoard />;
}
