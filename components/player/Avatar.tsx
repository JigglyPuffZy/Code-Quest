import { avatarById, avatarImageUrl } from "@/lib/avatars";
import { cn } from "@/lib/cn";

const SIZE_PX = { sm: 64, md: 80, lg: 112 } as const;

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
  const box = size === "lg" ? "h-14 w-14" : size === "sm" ? "h-8 w-8" : "h-10 w-10";
  const px = SIZE_PX[size];

  return (
    <span
      className={cn("relative shrink-0 overflow-hidden rounded-xl border border-line bg-surface", box, className)}
      title={avatar.label}
    >
      <img
        src={avatarImageUrl(id, px)}
        alt={`${avatar.label} avatar`}
        className="h-full w-full object-cover"
        draggable={false}
        loading="lazy"
        decoding="async"
      />
    </span>
  );
}
