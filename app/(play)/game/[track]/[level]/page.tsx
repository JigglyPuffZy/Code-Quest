import { GameLevelView } from "@/components/game/GameLevelView";
import { parseGameTrack } from "@/lib/game/ids";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Game level" };

export default async function GameLevelPage({
  params,
}: {
  params: Promise<{ track: string; level: string }>;
}) {
  const { track, level } = await params;
  return <GameLevelView track={parseGameTrack(track)} level={Number(level)} />;
}
