import { migrateStorageKey, storageKey } from "@/lib/storage-keys";

const PREFIX = storageKey("intro", "v1");

export function readIntroDismissed(playerId: string) {
  if (typeof window === "undefined") return false;
  const key = `${PREFIX}.${playerId}`;
  migrateStorageKey([`intro.v1.${playerId}`], key);
  return window.localStorage.getItem(key) === "1";
}

export function writeIntroDismissed(playerId: string) {
  window.localStorage.setItem(`${PREFIX}.${playerId}`, "1");
}
