import { cn } from "@/lib/cn";
import type { HTMLAttributes } from "react";

export function Card({
  className,
  glow = false,
  orbit = false,
  ...props
}: HTMLAttributes<HTMLElement> & { glow?: boolean; orbit?: boolean }) {
  return (
    <section
      className={cn(
        orbit ? "orbit-card p-5" : "panel p-5",
        glow && "panel-glow",
        className,
      )}
      {...props}
    />
  );
}
