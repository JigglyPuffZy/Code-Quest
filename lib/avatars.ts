import type { AvatarPreset } from "@/lib/types";

/** Cartoon character avatars — each seed renders a consistent face via DiceBear. */
export const AVATARS: AvatarPreset[] = [
  { id: "nova", label: "Nova", seed: "Nova", background: "b6e3f4" },
  { id: "ember", label: "Ember", seed: "Ember", background: "ffd5b4" },
  { id: "moss", label: "Moss", seed: "Moss", background: "c0f2d8" },
  { id: "volt", label: "Volt", seed: "Volt", background: "fde68a" },
  { id: "luna", label: "Luna", seed: "Luna", background: "ddd6fe" },
  { id: "byte", label: "Byte", seed: "Byte", background: "bae6fd" },
  { id: "rune", label: "Rune", seed: "Rune", background: "f5d0fe" },
  { id: "fox", label: "Fox", seed: "Fox", background: "fecdd3" },
];

export function avatarById(id: string) {
  return AVATARS.find((avatar) => avatar.id === id) ?? AVATARS[0];
}

export function avatarImageUrl(id: string, size = 128) {
  const avatar = avatarById(id);
  const params = new URLSearchParams({
    seed: avatar.seed,
    size: String(size),
    backgroundColor: avatar.background,
    backgroundType: "solid",
  });
  return `https://api.dicebear.com/9.x/adventurer/png?${params.toString()}`;
}
