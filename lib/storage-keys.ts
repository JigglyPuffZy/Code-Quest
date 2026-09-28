/** Browser storage prefix — lowercase to avoid case-sensitive key drift. */
export const STORAGE_PREFIX = "devladder";

const LEGACY_PREFIXES = ["codequest", "DevLadder"];

export function storageKey(...parts: string[]) {
  return [STORAGE_PREFIX, ...parts].join(".");
}

/** One-time migration from older branding keys (Code Quest / DevLadder). */
export function migrateStorageKey(legacySuffixes: string[], newKey: string, literalLegacyKeys: string[] = []) {
  if (typeof window === "undefined") return;
  if (window.localStorage.getItem(newKey)) return;

  for (const legacyKey of literalLegacyKeys) {
    const value = window.localStorage.getItem(legacyKey);
    if (value) {
      window.localStorage.setItem(newKey, value);
      window.localStorage.removeItem(legacyKey);
      return;
    }
  }

  for (const legacyPrefix of LEGACY_PREFIXES) {
    for (const suffix of legacySuffixes) {
      const legacyKey = suffix ? `${legacyPrefix}.${suffix}` : legacyPrefix;
      const value = window.localStorage.getItem(legacyKey);
      if (value) {
        window.localStorage.setItem(newKey, value);
        window.localStorage.removeItem(legacyKey);
        return;
      }
    }
  }
}

export function migrateSessionKey(legacySuffixes: string[], newKey: string) {
  if (typeof window === "undefined") return;
  if (window.sessionStorage.getItem(newKey)) return;

  for (const legacyPrefix of LEGACY_PREFIXES) {
    for (const suffix of legacySuffixes) {
      const legacyKey = suffix ? `${legacyPrefix}.${suffix}` : legacyPrefix;
      const value = window.sessionStorage.getItem(legacyKey);
      if (value) {
        window.sessionStorage.setItem(newKey, value);
        window.sessionStorage.removeItem(legacyKey);
        return;
      }
    }
  }
}
