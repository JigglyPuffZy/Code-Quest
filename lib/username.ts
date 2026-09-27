export function usernameError(value: string) {
  const name = value.trim();
  if (name.length < 2 || name.length > 20) return "Use 2 to 20 characters.";
  if (!/^[\p{L}\p{N} _.'-]+$/u.test(name)) return "Use letters, numbers, spaces, and simple punctuation.";
  return "";
}
