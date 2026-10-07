import { storageKey } from "@/lib/storage-keys";

export type ThemeMode = "light" | "dark";

export const THEME_STORAGE_KEY = storageKey("theme");

export function readStoredTheme(): ThemeMode {
  if (typeof window === "undefined") return "light";
  try {
    const raw = window.localStorage.getItem(THEME_STORAGE_KEY);
    return raw === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}

export function applyTheme(mode: ThemeMode) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", mode === "dark");
  document.documentElement.style.colorScheme = mode;
}

export function persistTheme(mode: ThemeMode) {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, mode);
  } catch {
    /* ignore quota / private mode */
  }
  applyTheme(mode);
}
