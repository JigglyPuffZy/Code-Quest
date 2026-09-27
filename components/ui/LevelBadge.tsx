import { cn } from "@/lib/cn";

export function LevelBadge({
  level,
  title,
  size = "md",
  className,
}: {
  level: number;
  title?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const box = size === "lg" ? "h-[4.5rem] w-[4.5rem] text-2xl" : size === "sm" ? "h-10 w-10 text-sm" : "h-14 w-14 text-xl";
  return (
    <div className={cn("flex flex-col items-center gap-1.5", className)}>
      <div className={cn("level-ring", box)} aria-label={`Level ${level}`}>
        <span className="h-full w-full">{level}</span>
      </div>
      {title ? <p className="max-w-[5rem] text-center text-[10px] font-medium uppercase tracking-wider text-muted">{title}</p> : null}
    </div>
  );
}
