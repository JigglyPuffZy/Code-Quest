import { GameHub } from "@/components/game/GameHub";
import { parseGameTrack } from "@/lib/game/ids";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Game track" };

export default async function GameTrackPage({
  params,
}: {
  params: Promise<{ track: string }>;
}) {
  const { track } = await params;
  return <GameHub track={parseGameTrack(track)} />;
}
