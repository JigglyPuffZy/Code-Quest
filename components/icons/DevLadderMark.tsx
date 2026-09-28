"use client";

import { cn } from "@/lib/cn";
import { useId } from "react";

export function DevLadderMark({
  size = 36,
  className,
  glow = false,
}: {
  size?: number;
  className?: string;
  glow?: boolean;
}) {
  const id = useId().replace(/:/g, "");
  const gradId = `dl-grad-${id}`;
  const shineId = `dl-shine-${id}`;

  return (
    <span
      className={cn("relative inline-flex shrink-0", glow && "dl-mark-glow", className)}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="block"
      >
        <defs>
          <linearGradient id={gradId} x1="6" y1="4" x2="34" y2="36" gradientUnits="userSpaceOnUse">
            <stop stopColor="#4f46e5" />
            <stop offset="0.55" stopColor="#6366f1" />
            <stop offset="1" stopColor="#7c3aed" />
          </linearGradient>
          <linearGradient id={shineId} x1="8" y1="6" x2="28" y2="30" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ffffff" stopOpacity="0.35" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="36" height="36" rx="11" fill={`url(#${gradId})`} />
        <rect x="2" y="2" width="36" height="18" rx="11" fill={`url(#${shineId})`} />
        <path
          d="M14.5 11.5C11.5 11.5 11 14.5 11 20C11 25.5 11.5 28.5 14.5 28.5"
          stroke="white"
          strokeWidth="2.75"
          strokeLinecap="round"
        />
        <path
          d="M18.5 13.5L26.5 20L18.5 26.5"
          stroke="white"
          strokeWidth="2.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="28.5" cy="11.5" r="2.25" fill="#fbbf24" />
        <circle cx="28.5" cy="11.5" r="4.5" stroke="#fbbf24" strokeOpacity="0.35" />
      </svg>
    </span>
  );
}
