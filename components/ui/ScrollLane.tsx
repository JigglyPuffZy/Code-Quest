import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

export function ScrollLane({
  title,
  subtitle,
  action,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("space-y-3", className)}>
      <div className="flex items-end justify-between gap-3 px-1">
        <div>
          <h2 className="text-lg font-bold tracking-tight">{title}</h2>
          {subtitle ? <p className="text-xs text-muted">{subtitle}</p> : null}
        </div>
        {action}
      </div>
      <div className="lane-scroll -mx-1 px-1">{children}</div>
    </section>
  );
}
