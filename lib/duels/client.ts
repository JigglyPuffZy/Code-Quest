import type { DuelRules } from "@/lib/duels/rules";
import type { DuelSnapshot } from "@/lib/duels/types";

async function post<T>(url: string, body?: unknown): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const payload = await response.json();
  if (!response.ok) {
    throw new Error(typeof payload.error === "string" ? payload.error : "Request failed.");
  }
  return payload as T;
}

export async function heartbeatPresence() {
  await post("/api/presence/heartbeat");
}

export async function inviteToDuel(opponentId: string, rules: DuelRules) {
  return post<{ duelId: string; rules: DuelRules }>("/api/duels/invite", {
    opponentId,
    targetWins: rules.targetWins,
    roundTimerSec: rules.roundTimerSec,
    skillDifficulty: rules.skillDifficulty,
  });
}

export async function syncDuelRound(duelId: string) {
  return post<{ duel: DuelSnapshot }>(`/api/duels/${duelId}/sync`);
}

export async function respondToDuel(duelId: string, accept: boolean) {
  return post<{ duel: DuelSnapshot }>(`/api/duels/${duelId}/respond`, { accept });
}

export async function fetchDuel(duelId: string) {
  const response = await fetch(`/api/duels/${duelId}`);
  const payload = await response.json();
  if (!response.ok) {
    throw new Error(typeof payload.error === "string" ? payload.error : "Could not load duel.");
  }
  return payload.duel as DuelSnapshot;
}

export async function submitDuelCode(duelId: string, code: string) {
  return post<{ duel: DuelSnapshot; passed: boolean; won: boolean; roundWon?: boolean }>(
    `/api/duels/${duelId}/submit`,
    { code },
  );
}

export async function quitDuel(duelId: string) {
  return post<{ duel: DuelSnapshot }>(`/api/duels/${duelId}/quit`);
}
