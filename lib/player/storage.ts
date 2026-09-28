import { createPlayer } from "@/lib/gamification";
import { normalizeSkillDifficulty } from "@/lib/difficulty";
import { parseGameTrack } from "@/lib/game/ids";
import { migrateStorageKey, storageKey } from "@/lib/storage-keys";
import type { Player } from "@/lib/types";

const GUEST_KEY = storageKey("guest", "v1");

function userKey(id: string) {
  return storageKey("user", id, "v1");
}

function ensureMigrated() {
  migrateStorageKey(["guest.v1"], GUEST_KEY);
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
      completedGameLevels: Array.isArray(parsed.completedGameLevels) ? parsed.completedGameLevels : [],
      claimedQuests: Array.isArray(parsed.claimedQuests) ? parsed.claimedQuests : [],
      unlockedAchievements: Array.isArray(parsed.unlockedAchievements) ? parsed.unlockedAchievements : [],
      lastLessonId: parsed.lastLessonId ?? null,
      skillDifficulty: normalizeSkillDifficulty(parsed.skillDifficulty),
      gameTrack: parseGameTrack(parsed.gameTrack),
      frontendFramework: parsed.frontendFramework ?? "react",
      frontendLanguage: parsed.frontendLanguage ?? "typescript",
      backendFramework: parsed.backendFramework ?? "express",
      backendLanguage: parsed.backendLanguage ?? "javascript",
      createdAt: parsed.createdAt ?? new Date().toISOString(),
      updatedAt: parsed.updatedAt ?? new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export function readGuest() {
  ensureMigrated();
  return read(GUEST_KEY);
}

export function writeGuest(player: Player) {
  window.localStorage.setItem(GUEST_KEY, JSON.stringify(player));
}

export function clearGuest() {
  window.localStorage.removeItem(GUEST_KEY);
}

export function readUserCache(id: string) {
  const key = userKey(id);
  migrateStorageKey([`user.${id}.v1`], key);
  return read(key);
}

export function writeUserCache(player: Player) {
  window.localStorage.setItem(userKey(player.id), JSON.stringify(player));
}

export function loadGuestOrCreate() {
  return readGuest() ?? createPlayer();
}
