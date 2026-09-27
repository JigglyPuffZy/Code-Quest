import { CodeQuestMark } from "@/components/icons/CodeQuestMark";
import { cn } from "@/lib/cn";
import Link from "next/link";

type LogoSize = "sm" | "md" | "lg";

const MARK_SIZE: Record<LogoSize, number> = {
  sm: 32,
  md: 38,
  lg: 44,
};

export function Logo({
  compact = false,
  href = "/",
  size = "md",
  subtitle,
  glow = false,
  className,
}: {
  compact?: boolean;
  href?: string;
  size?: LogoSize;
  subtitle?: string;
  glow?: boolean;
  className?: string;
}) {
  const markSize = MARK_SIZE[size];

  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex min-h-11 min-w-11 items-center gap-2.5 rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:min-h-0 sm:min-w-0",
        className,
      )}
      aria-label="CodeQuest home"
    >
      <CodeQuestMark
        size={compact ? 34 : markSize}
        glow={glow}
        className="transition-transform duration-300 group-hover:scale-[1.04] group-active:scale-95"
      />
      {compact ? null : (
        <span className="flex min-w-0 flex-col leading-none">
          <span className="flex items-baseline gap-0.5">
            <span className="text-[15px] font-bold tracking-tight text-ink sm:text-base">Code</span>
            <span className="bg-gradient-to-r from-primary-600 via-primary-500 to-violet-500 bg-clip-text text-[15px] font-extrabold tracking-tight text-transparent sm:text-base">
              Quest
            </span>
          </span>
          {subtitle ? (
            <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
              {subtitle}
            </span>
          ) : null}
        </span>
      )}
    </Link>
  );
}
