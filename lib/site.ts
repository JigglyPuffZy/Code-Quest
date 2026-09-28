import { APP_NAME } from "@/lib/branding";

/** Public site URL — set NEXT_PUBLIC_SITE_URL in Vercel after renaming the project. */
export function siteUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  }
  return "http://localhost:3000";
}

export const siteMetadata = {
  name: APP_NAME,
  description:
    "Read coding guides, complete quests, and practice in Arena and Game mode — a calm, focused coding academy.",
  url: siteUrl(),
};
