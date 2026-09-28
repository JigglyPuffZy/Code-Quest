/** Player is online if heartbeat was within this window. */
export const ONLINE_WINDOW_MS = 90_000;

export function isOnline(lastSeenAt: string | null | undefined, now = Date.now()) {
  if (!lastSeenAt) return false;
  const seen = Date.parse(lastSeenAt);
  if (Number.isNaN(seen)) return false;
  return now - seen <= ONLINE_WINDOW_MS;
}

export function onlineLabel(lastSeenAt: string | null | undefined) {
  return isOnline(lastSeenAt) ? "Online" : "Offline";
}

/** Demo rivals appear online on a rotating schedule (no Supabase). */
export function isDemoRivalOnline(rivalId: string, now = Date.now()) {
  const hour = new Date(now).getHours();
  const slot = rivalId.split("-").pop() ?? "0";
  const n = slot.charCodeAt(0) + hour;
  return n % 3 !== 0;
}
