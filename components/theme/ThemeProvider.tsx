"use client";

import {
  applyTheme,
  persistTheme,
  readStoredTheme,
  type ThemeMode,
} from "@/lib/theme";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type ThemeContextValue = {
  theme: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  ready: boolean;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>("light");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = readStoredTheme();
    setThemeState(stored);
    applyTheme(stored);
    setReady(true);
  }, []);

  const setTheme = useCallback((mode: ThemeMode) => {
    setThemeState(mode);
    persistTheme(mode);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((current) => {
      const next: ThemeMode = current === "dark" ? "light" : "dark";
      persistTheme(next);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ theme, setTheme, toggleTheme, ready }),
    [theme, setTheme, toggleTheme, ready],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider.");
  }
  return ctx;
}
