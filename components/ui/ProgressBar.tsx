import { cn } from "@/lib/cn";

export function ProgressBar({
  value,
  label,
  className,
  fast = false,
  barClassName,
}: {
  value: number;
  label?: string;
  className?: string;
  fast?: boolean;
  barClassName?: string;
}) {
  const width = Math.max(0, Math.min(100, value));
  return (
    <div
      className={cn("h-2 overflow-hidden rounded-full bg-surface-3", className)}
      role="progressbar"
      aria-valuenow={Math.round(width)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label ?? "Progress"}
    >
      <div
        className={cn(
          "xp-fill h-full rounded-full ease-out",
          fast ? "transition-[width] duration-300" : "transition-[width] duration-700",
          barClassName,
        )}
        style={{ width: `${width}%` }}
      />
    </div>
  );
}
