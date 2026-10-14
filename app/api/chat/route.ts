import { buildDevyyyyySystemPrompt, type ChatTurn } from "@/lib/support/chat-context";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

const MAX_MESSAGES = 10;
const MAX_CONTENT = 4_000;
const RATE_LIMIT = 24;
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

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function parseMessages(value: unknown): ChatTurn[] | null {
  if (!Array.isArray(value)) return null;
  const messages: ChatTurn[] = [];
  for (const item of value.slice(-MAX_MESSAGES)) {
    if (!item || typeof item !== "object") return null;
    const row = item as { role?: unknown; content?: unknown };
    if (row.role !== "user" && row.role !== "assistant") return null;
    if (typeof row.content !== "string") return null;
    const content = row.content.trim().slice(0, MAX_CONTENT);
    if (!content) continue;
    messages.push({ role: row.role, content });
  }
  return messages;
}

function recentUserText(messages: ChatTurn[]) {
  return messages
    .filter((turn) => turn.role === "user")
    .slice(-2)
    .map((turn) => turn.content)
    .join("\n");
}

export async function POST(request: Request) {
  if (isRateLimited(request)) {
    return NextResponse.json(
      { error: "devyyyyy is catching their breath. Try again in a minute." },
      { status: 429 },
    );
  }

  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    return NextResponse.json(
      { error: "Chat is not configured. Add OPENAI_API_KEY on the server." },
      { status: 500 },
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
    messages?: unknown;
    path?: unknown;
    topicId?: unknown;
    slug?: unknown;
  };

  const messages = parseMessages(payload.messages);
  if (!messages || messages.length === 0) {
    return NextResponse.json({ error: "Include at least one chat message." }, { status: 400 });
  }

  const path = asString(payload.path) || "/";
  const topicId = asString(payload.topicId) || undefined;
  const slug = asString(payload.slug) || undefined;
  const system = buildDevyyyyySystemPrompt({
    path,
    topicId,
    slug,
    userText: recentUserText(messages),
  });

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.4,
        max_tokens: 1000,
        messages: [{ role: "system", content: system }, ...messages],
      }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "devyyyyy couldn't reach the tutor brain. Try again in a moment." },
        { status: 502 },
      );
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: unknown } }>;
    };
    const reply = asString(data.choices?.[0]?.message?.content);
    if (!reply) {
      return NextResponse.json(
        { error: "devyyyyy sent an empty reply. Try asking again." },
        { status: 502 },
      );
    }

    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json(
      { error: "devyyyyy hit a snag. Check your connection and try again." },
      { status: 502 },
    );
  }
}
