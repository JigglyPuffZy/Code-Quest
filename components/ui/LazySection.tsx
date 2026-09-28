"use client";

import { cn } from "@/lib/cn";
import { useEffect, useRef, useState, type ReactNode } from "react";

export function LazySection({
  children,
  className,
  minHeight = 280,
  label = "Loading section",
}: {
  children: ReactNode;
  className?: string;
  minHeight?: number;
  label?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "240px 0px", threshold: 0.01 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn("dash-lazy-section", className)}
      style={visible ? undefined : { minHeight }}
      aria-busy={!visible}
    >
      {visible ? (
        children
      ) : (
        <div
          className="animate-pulse rounded-2xl border border-line bg-surface-2"
          style={{ minHeight }}
          aria-label={label}
        />
      )}
    </div>
  );
}
