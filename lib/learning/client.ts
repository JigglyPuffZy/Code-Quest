"use client";
import { useEffect, useState, useSyncExternalStore } from "react";
const subscribeReady = () => () => {};
export function useClientReady() { return useSyncExternalStore(subscribeReady, () => true, () => false); }
export function useLearningClock() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const refresh = () => setNow(Date.now());
    const timer = window.setInterval(refresh, 60000);
    window.addEventListener("focus", refresh);
    return () => { window.clearInterval(timer); window.removeEventListener("focus", refresh); };
  }, []);
  return now;
}
export function requestedQuestion(total: number) {
  const value = new URLSearchParams(window.location.search).get("question");
  const index = value === null ? NaN : Number(value);
  return Number.isInteger(index) && index >= 0 && index < total ? index : null;
}
