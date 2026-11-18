import { cn } from "@/lib/cn";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export type PageHeroStat = { label: string; value: string | number; icon?: LucideIcon };

/** Shared gradient page header used across the workspace, so every page opens the same way. */
export function PageHero({
  eyebrow,
  title,
  accent,
  description,
  icon: Icon,
  stats,
  action,
  children,
  className,
}: {
  eyebrow: string;
  title: string;
  /** Second line of the title, shown with the cyan accent colour. */
  accent?: string;
  description?: string;
  icon?: LucideIcon;
  stats?: PageHeroStat[];
  action?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("pg-hero", className)}>
      <div className="pg-hero-main">
        <p className="pg-hero-eyebrow">
          {Icon ? <Icon size={14} aria-hidden /> : null}
          {eyebrow}
        </p>
        <h1 className="pg-hero-title">
          {title}
          {accent ? <span> {accent}</span> : null}
        </h1>
        {description ? <p className="pg-hero-desc">{description}</p> : null}
        {stats?.length ? (
          <ul className="pg-hero-stats">
            {stats.map(({ label, value, icon: StatIcon }) => (
              <li key={label}>
                {StatIcon ? <StatIcon size={15} aria-hidden /> : null}
                <b>{value}</b>
                <span>{label}</span>
              </li>
            ))}
          </ul>
        ) : null}
        {children}
      </div>
      {action ? <div className="pg-hero-action">{action}</div> : null}
    </header>
  );
}
