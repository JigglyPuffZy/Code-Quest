import { createClient } from "@/lib/supabase/client";
import type { BoardEntry } from "@/lib/leaderboard";

const CACHE_MS = 5 * 60 * 1000;

let cache: { at: number; rows: BoardEntry[] } | null = null;
let inflight: Promise<BoardEntry[]> | null = null;

export function readLeaderboardCache() {
  if (!cache) return null;
  if (Date.now() - cache.at > CACHE_MS) return null;
  return cache.rows;
}

export async function fetchLeaderboard(limit = 25, force = false) {
  const cached = readLeaderboardCache();
  if (!force && cached) return cached;

  if (!force && inflight) return inflight;

  inflight = (async () => {
    const { data, error } = await createClient()
      .from("profiles")
      .select("id, username, avatar, xp, streak")
      .order("xp", { ascending: false })
      .limit(limit);

    if (error) throw error;
    const rows = (data ?? []) as BoardEntry[];
    cache = { at: Date.now(), rows };
    return rows;
  })();

  try {
    return await inflight;
  } finally {
    inflight = null;
  }
}

export function patchLeaderboardEntry(entry: BoardEntry) {
  if (!cache) return;
  cache.rows = cache.rows.map((row) => (row.id === entry.id ? { ...row, ...entry } : row));
}
