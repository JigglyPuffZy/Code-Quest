import { usernameError } from "@/lib/username";

export function normalizeUsername(value: string) {
  return value.trim();
}

export function loginUsernameError(value: string) {
  const name = normalizeUsername(value);
  if (!name) return "Enter your username.";
  return usernameError(name);
}
