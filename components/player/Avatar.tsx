import { avatarById } from "@/lib/avatars";
import { cn } from "@/lib/cn";

export function Avatar({
  id,
  size = "md",
  className,
}: {
  id: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const avatar = avatarById(id);
  const box = size === "lg" ? "h-14 w-14 text-xl" : size === "sm" ? "h-8 w-8 text-xs" : "h-10 w-10 text-sm";
  return (
    <span
      className={cn("grid shrink-0 place-items-center rounded-xl border border-line font-semibold text-mist", box, className)}
      style={{ background: `linear-gradient(145deg, ${avatar.from}88, ${avatar.to}44)` }}
      aria-hidden
    >
      {avatar.mark}
    </span>
  );
}
