import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
  className,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("mb-8", className)}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="tag">{eyebrow}</p>
          <h1 className="mega-title mt-2">{title}</h1>
          {description ? <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">{description}</p> : null}
        </div>
        {action}
      </div>
    </header>
  );
}
