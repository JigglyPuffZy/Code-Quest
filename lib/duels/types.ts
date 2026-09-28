import type { DuelRules } from "@/lib/duels/rules";

export type DuelStatus = "pending" | "active" | "completed" | "declined" | "expired" | "cancelled";

export type DuelRoom = {
  id: string;
  challengerId: string;
  opponentId: string;
  status: DuelStatus;
  challengeId: string;
  language: string;
  winnerId: string | null;
  challengerPassed: boolean | null;
  opponentPassed: boolean | null;
  challengerSubmittedAt: string | null;
  opponentSubmittedAt: string | null;
  createdAt: string;
  startedAt: string | null;
  endedAt: string | null;
  expiresAt: string;
  targetWins: 1 | 3 | 5;
  roundTimerSec: number;
  skillDifficulty: DuelRules["skillDifficulty"];
  challengerScore: number;
  opponentScore: number;
  currentRound: number;
  roundEndsAt: string | null;
  roundWinnerId: string | null;
};

export type DuelParticipant = {
  id: string;
  username: string;
  avatar: string;
};

export type DuelSnapshot = DuelRoom & {
  challenger: DuelParticipant;
  opponent: DuelParticipant;
  youAre: "challenger" | "opponent";
};
