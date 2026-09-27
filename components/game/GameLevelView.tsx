"use client";

import { usePlayer } from "@/components/player/PlayerProvider";
import { ErrorState } from "@/components/ui/States";
import { GameExerciseView } from "@/components/game/GameExerciseView";
import { buildGameLevelForPlayer } from "@/lib/game";
import { isGameLevelComplete, isGameLevelUnlocked } from "@/lib/game/progress";
import { GAME_TRACKS, type GameTrackId } from "@/lib/game/tracks";
import { MAX_GAME_LEVEL } from "@/lib/game/types";
import Link from "next/link";
import { useEffect } from "react";

export function GameLevelView({ track, level }: { track: GameTrackId; level: number }) {
  const { player, setGameTrack } = usePlayer();

  useEffect(() => {
    if (player && player.gameTrack !== track) setGameTrack(track);
  }, [track, player, setGameTrack]);

  if (!player) return null;

  if (!GAME_TRACKS[track]) {
    return <ErrorState message="Unknown game track." />;
  }

  if (!Number.isFinite(level) || level < 1 || level > MAX_GAME_LEVEL) {
    return <ErrorState message="That game level does not exist." />;
  }

  const record = buildGameLevelForPlayer(player, track, level);
  const open = isGameLevelUnlocked(track, player.skillDifficulty, level, player);
  const cleared = isGameLevelComplete(track, player.skillDifficulty, level, player);
  const nextLevel = level < MAX_GAME_LEVEL ? level + 1 : null;

  return (
    <GameExerciseView
      track={track}
      record={record}
      cleared={cleared}
      locked={!open}
      lockMessage={`Beat level ${level - 1} on this track and difficulty first.`}
      footer={
        nextLevel && cleared ? (
          <Link
            href={`/game/${track}/${nextLevel}`}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700 hover:underline"
          >
            Level cleared — continue to level {nextLevel}
          </Link>
        ) : undefined
      }
    />
  );
}
