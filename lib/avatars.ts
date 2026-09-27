import type { AvatarPreset } from "@/lib/types";

export const AVATARS: AvatarPreset[] = [
  { id: "nova", label: "Nova", mark: "✦", from: "#134e4a", to: "#3ee0c5" },
  { id: "ember", label: "Ember", mark: "▲", from: "#7c2d12", to: "#ff8a5b" },
  { id: "moss", label: "Moss", mark: "❀", from: "#14532d", to: "#4ade80" },
  { id: "volt", label: "Volt", mark: "⚡", from: "#713f12", to: "#f0c36a" },
  { id: "luna", label: "Luna", mark: "☾", from: "#312e81", to: "#b9a6ff" },
  { id: "byte", label: "Byte", mark: "◈", from: "#0c4a6e", to: "#38bdf8" },
  { id: "rune", label: "Rune", mark: "※", from: "#701a75", to: "#f0abfc" },
  { id: "fox", label: "Fox", mark: "◆", from: "#7f1d1d", to: "#fb7185" },
];

export function avatarById(id: string) {
  return AVATARS.find((avatar) => avatar.id === id) ?? AVATARS[0];
}
