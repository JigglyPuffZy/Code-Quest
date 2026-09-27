import { cn } from "@/lib/cn";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function DashboardZone({
  step,
  title,
  hint,
  icon: Icon,
  action,
  children,
  className,
  panel = false,
}: {
  step?: number;
  title: string;
  hint?: string;
  icon?: LucideIcon;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  panel?: boolean;
}) {
  return (
    <section className={cn("space-y-4", className)}>
      <div className="flex flex-wrap items-start justify-between gap-3 px-1">
        <div className="flex min-w-0 items-start gap-3">
          {step !== undefined ? (
            <span
              className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow-sm shadow-primary/20"
              aria-hidden
            >
              {step}
            </span>
          ) : Icon ? (
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-line bg-white text-primary">
              <Icon size={17} />
            </span>
          ) : null}
          <div className="min-w-0">
            <h2 className="text-lg font-bold tracking-tight text-ink sm:text-xl">{title}</h2>
            {hint ? <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted">{hint}</p> : null}
          </div>
        </div>
        {action}
      </div>
      <div
        className={cn(
          panel && "rounded-2xl border border-line bg-surface-2/50 p-4 sm:p-5",
        )}
      >
        {children}
      </div>
    </section>
  );
}
