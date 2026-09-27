"use client";

import { Avatar } from "@/components/player/Avatar";
import { cn } from "@/lib/cn";
import { AVATARS } from "@/lib/avatars";

export function AvatarPicker({
  value,
  onChange,
  size = "md",
}: {
  value: string;
  onChange: (id: string) => void;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <div className="grid grid-cols-4 gap-2.5 sm:grid-cols-8 sm:gap-2">
      {AVATARS.map((item) => {
        const selected = value === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            aria-label={item.label}
            aria-pressed={selected}
            title={item.label}
            className={cn(
              "inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl transition sm:min-h-0 sm:min-w-0",
              selected
                ? "ring-2 ring-primary ring-offset-2 ring-offset-white"
                : "opacity-70 hover:opacity-100",
            )}
          >
            <Avatar id={item.id} size={size} />
          </button>
        );
      })}
    </div>
  );
}
