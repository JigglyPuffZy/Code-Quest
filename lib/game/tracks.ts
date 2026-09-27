import type { LanguageId } from "@/lib/types";

export type GameTrackId = "core" | "frontend" | "backend";

export type FrontendFrameworkId = "react" | "vue" | "angular" | "svelte";
export type BackendFrameworkId = "express" | "django" | "spring" | "fastapi";

export type FrontendLanguage = "javascript" | "typescript";
export type BackendLanguage = "javascript" | "python" | "java";

export const GAME_TRACKS: Record<
  GameTrackId,
  { label: string; emoji: string; blurb: string; accent: string }
> = {
  core: {
    label: "Core Python",
    emoji: "🐍",
    blurb: "Foundational logic drills — 100 unique levels per difficulty.",
    accent: "from-emerald-600 to-teal-500",
  },
  frontend: {
    label: "Frontend Dev",
    emoji: "🎨",
    blurb: "UI-minded puzzles — pick your framework and language.",
    accent: "from-sky-600 to-cyan-500",
  },
  backend: {
    label: "Backend Dev",
    emoji: "⚙️",
    blurb: "API and server logic — pick your stack and language.",
    accent: "from-violet-600 to-primary-500",
  },
};

export const FRONTEND_FRAMEWORKS: Record<
  FrontendFrameworkId,
  { label: string; blurb: string }
> = {
  react: { label: "React", blurb: "Components, props, and state-shaped helpers." },
  vue: { label: "Vue", blurb: "Reactive helpers and template-friendly transforms." },
  angular: { label: "Angular", blurb: "Pipe-style transforms and typed services." },
  svelte: { label: "Svelte", blurb: "Lean reactive utilities and store logic." },
};

export const BACKEND_FRAMEWORKS: Record<
  BackendFrameworkId,
  { label: string; blurb: string }
> = {
  express: { label: "Express", blurb: "Route handlers, middleware, and JSON helpers." },
  django: { label: "Django", blurb: "Views, serializers, and queryset-style logic." },
  spring: { label: "Spring", blurb: "Service methods and controller-style checks." },
  fastapi: { label: "FastAPI", blurb: "Validation, schemas, and async-ready helpers." },
};

export const FRONTEND_LANGUAGES: FrontendLanguage[] = ["javascript", "typescript"];
export const BACKEND_LANGUAGES: BackendLanguage[] = ["javascript", "python", "java"];

export function isGameTrackId(value: unknown): value is GameTrackId {
  return value === "core" || value === "frontend" || value === "backend";
}

export function trackLanguage(
  track: GameTrackId,
  prefs: {
    frontendLanguage: FrontendLanguage;
    backendLanguage: BackendLanguage;
  },
): LanguageId {
  if (track === "core") return "python";
  if (track === "frontend") return prefs.frontendLanguage;
  return prefs.backendLanguage;
}

export function stackLabel(
  track: GameTrackId,
  prefs: {
    frontendFramework: FrontendFrameworkId;
    frontendLanguage: FrontendLanguage;
    backendFramework: BackendFrameworkId;
    backendLanguage: BackendLanguage;
  },
) {
  if (track === "core") return "Python";
  if (track === "frontend") {
    return `${FRONTEND_FRAMEWORKS[prefs.frontendFramework].label} · ${prefs.frontendLanguage === "typescript" ? "TypeScript" : "JavaScript"}`;
  }
  const lang =
    prefs.backendLanguage === "python"
      ? "Python"
      : prefs.backendLanguage === "java"
        ? "Java"
        : "JavaScript";
  return `${BACKEND_FRAMEWORKS[prefs.backendFramework].label} · ${lang}`;
}
