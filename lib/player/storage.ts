import { createPlayer } from "@/lib/gamification";
import type { Player } from "@/lib/types";

const GUEST_KEY = "codequest.guest.v1";

function userKey(id: string) {
  return `codequest.user.${id}.v1`;
}

function read(key: string): Player | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(key);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Player;
    if (!parsed || typeof parsed.id !== "string") return null;
    return {
      ...parsed,
      username: parsed.username || "Apprentice",
      avatar: parsed.avatar || "nova",
      streak: parsed.streak ?? 0,
      bestStreak: parsed.bestStreak ?? parsed.streak ?? 0,
      lastActive: parsed.lastActive ?? null,
      completedLessons: Array.isArray(parsed.completedLessons) ? parsed.completedLessons : [],
      completedChallenges: Array.isArray(parsed.completedChallenges) ? parsed.completedChallenges : [],
      claimedQuests: Array.isArray(parsed.claimedQuests) ? parsed.claimedQuests : [],
      unlockedAchievements: Array.isArray(parsed.unlockedAchievements) ? parsed.unlockedAchievements : [],
      lastLessonId: parsed.lastLessonId ?? null,
      createdAt: parsed.createdAt ?? new Date().toISOString(),
      updatedAt: parsed.updatedAt ?? new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export function readGuest() {
  return read(GUEST_KEY);
}

export function writeGuest(player: Player) {
  window.localStorage.setItem(GUEST_KEY, JSON.stringify(player));
}

export function clearGuest() {
  window.localStorage.removeItem(GUEST_KEY);
}

export function readUserCache(id: string) {
  return read(userKey(id));
}

export function writeUserCache(player: Player) {
  window.localStorage.setItem(userKey(player.id), JSON.stringify(player));
}

export function loadGuestOrCreate() {
  return readGuest() ?? createPlayer();
}
