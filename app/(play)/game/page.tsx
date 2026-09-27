import { GameLobby } from "@/components/game/GameLobby";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Game" };

export default function GamePage() {
  return <GameLobby />;
}
