"use client";

import { cn } from "@/lib/cn";
import { useEffect, useRef, type ReactNode } from "react";

type MarqueeLaneProps = {
  children: ReactNode;
  className?: string;
  trackClassName?: string;
};

export function MarqueeLane({ children, className, trackClassName }: MarqueeLaneProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    const media = window.matchMedia("(max-width: 767px)");

    function bindMobileScroll() {
      const lane = viewportRef.current;
      const rail = trackRef.current;
      if (!media.matches || !lane || !rail) return () => {};

      let raf = 0;
      const pause = () => {
        pausedRef.current = true;
      };
      const resume = () => {
        window.setTimeout(() => {
          pausedRef.current = false;
        }, 1800);
      };

      lane.addEventListener("touchstart", pause, { passive: true });
      lane.addEventListener("touchend", resume, { passive: true });
      lane.addEventListener("touchcancel", resume, { passive: true });

      const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
      const onVisibility = () => {
        pausedRef.current = document.visibilityState !== "visible";
      };

      const tick = () => {
        if (!pausedRef.current && !motion.matches) {
          lane.scrollLeft += 0.55;
          const half = rail.scrollWidth / 2;
          if (half > 0 && lane.scrollLeft >= half - 1) {
            lane.scrollLeft = 0;
          }
        }
        raf = window.requestAnimationFrame(tick);
      };

      document.addEventListener("visibilitychange", onVisibility);
      raf = window.requestAnimationFrame(tick);

      return () => {
        window.cancelAnimationFrame(raf);
        document.removeEventListener("visibilitychange", onVisibility);
        lane.removeEventListener("touchstart", pause);
        lane.removeEventListener("touchend", resume);
        lane.removeEventListener("touchcancel", resume);
      };
    }

    let cleanup = bindMobileScroll();
    const onChange = () => {
      cleanup();
      pausedRef.current = false;
      if (viewportRef.current) viewportRef.current.scrollLeft = 0;
      cleanup = bindMobileScroll();
    };

    media.addEventListener("change", onChange);
    return () => {
      cleanup();
      media.removeEventListener("change", onChange);
    };
  }, []);

  return (
    <div ref={viewportRef} className={cn("marquee-viewport marquee-viewport--touch -mx-1", className)}>
      <div ref={trackRef} className={cn("marquee-track", trackClassName)}>
        {children}
      </div>
    </div>
  );
}
