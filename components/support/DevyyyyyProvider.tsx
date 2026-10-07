"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

export type DevyyyyyOpenOptions = {
  message?: string;
  autoSend?: boolean;
  mode?: "default" | "coach" | "simplify";
};

type DevyyyyyContextValue = {
  open: boolean;
  pending: DevyyyyyOpenOptions | null;
  openChat: (options?: DevyyyyyOpenOptions) => void;
  closeChat: () => void;
  consumePending: () => DevyyyyyOpenOptions | null;
  clearPending: () => void;
};

const DevyyyyyContext = createContext<DevyyyyyContextValue | null>(null);

export function DevyyyyyProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState<DevyyyyyOpenOptions | null>(null);
  const pendingRef = useRef<DevyyyyyOpenOptions | null>(null);

  const openChat = useCallback((options?: DevyyyyyOpenOptions) => {
    pendingRef.current = options ?? null;
    setPending(options ?? null);
    setOpen(true);
  }, []);

  const closeChat = useCallback(() => setOpen(false), []);

  const consumePending = useCallback(() => {
    const value = pendingRef.current;
    pendingRef.current = null;
    setPending(null);
    return value;
  }, []);

  const clearPending = useCallback(() => {
    pendingRef.current = null;
    setPending(null);
  }, []);

  const value = useMemo(
    () => ({ open, pending, openChat, closeChat, consumePending, clearPending }),
    [open, pending, openChat, closeChat, consumePending, clearPending],
  );

  return <DevyyyyyContext.Provider value={value}>{children}</DevyyyyyContext.Provider>;
}

export function useDevyyyyy() {
  const ctx = useContext(DevyyyyyContext);
  if (!ctx) throw new Error("useDevyyyyy must be used within DevyyyyyProvider");
  return ctx;
}
