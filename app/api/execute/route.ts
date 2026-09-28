import { findExercise } from "@/lib/curriculum/index";
import { isSkillDifficulty, normalizeSkillDifficulty } from "@/lib/difficulty";
import type { GameStackPrefs } from "@/lib/game/banks";
import { gradeExercise } from "@/lib/execute/grade";
import { runInSandbox } from "@/lib/execute/sandbox";
import type { LanguageId } from "@/lib/types";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

const MAX_CODE = 8_000;
const RATE_LIMIT = 40;
const RATE_WINDOW_MS = 60_000;

const rateBuckets = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "local";
  const now = Date.now();
  const bucket = rateBuckets.get(ip);
  if (!bucket || now >= bucket.resetAt) {
    rateBuckets.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  bucket.count += 1;
  return bucket.count > RATE_LIMIT;
}

function isLanguage(value: unknown): value is LanguageId {
  return (
    value === "python" ||
    value === "javascript" ||
    value === "typescript" ||
    value === "java"
  );
}

export async function POST(request: Request) {
  if (isRateLimited(request)) {
    return NextResponse.json(
      { error: "Too many code runs. Wait a minute and try again." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Send a JSON body." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Send a JSON body." }, { status: 400 });
  }

  const payload = body as {
    mode?: string;
    language?: string;
    code?: string;
    kind?: string;
    id?: string;
    difficulty?: string;
    stack?: GameStackPrefs;
  };

  if (typeof payload.code !== "string" || payload.code.length > MAX_CODE) {
    return NextResponse.json(
      { error: "Code must be a string under 8000 characters." },
      { status: 400 },
    );
  }

  try {
    if (payload.mode === "run") {
      if (!isLanguage(payload.language)) {
        return NextResponse.json({ error: "Choose a supported language." }, { status: 400 });
      }
      const run = await runInSandbox(payload.language, payload.code);
      return NextResponse.json({ engine: "wandbox", ...run });
    }

    if (payload.mode === "grade") {
      if (payload.kind !== "lesson" && payload.kind !== "challenge" && payload.kind !== "game") {
        return NextResponse.json({ error: "Unknown exercise." }, { status: 400 });
      }
      const difficulty = payload.difficulty && isSkillDifficulty(payload.difficulty)
        ? payload.difficulty
        : normalizeSkillDifficulty(payload.difficulty);
      const stack = payload.kind === "game" ? payload.stack : undefined;
      if (
        !payload.id ||
        !findExercise(
          payload.kind,
          payload.id,
          payload.kind === "game" ? { stack } : undefined,
        )
      ) {
        return NextResponse.json({ error: "Unknown exercise." }, { status: 404 });
      }
      const result = await gradeExercise(payload.kind, payload.id, payload.code, difficulty, stack);
      return NextResponse.json(result);
    }

    return NextResponse.json({ error: "Unknown mode." }, { status: 400 });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "The sandbox could not run your code.";
    return NextResponse.json(
      {
        error: `${message} Nothing was marked correct.`,
      },
      { status: 502 },
    );
  }
}
