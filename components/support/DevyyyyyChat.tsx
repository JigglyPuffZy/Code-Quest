"use client";

import { cn } from "@/lib/cn";
import { parseAppPath } from "@/lib/support/page-context";
import { storageKey } from "@/lib/storage-keys";
import { Loader2, Send, Sparkles, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type ChatRole = "user" | "assistant";
type ChatMessage = { id: string; role: ChatRole; content: string };

const STORAGE_KEY = storageKey("devyyyyy", "messages");
const WELCOME =
  "Hi, I'm devyyyyy. Ask me anything about this lesson — or any page on Dev Ladder.";

function newId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function readStored(): ChatMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item): item is ChatMessage => {
        return (
          Boolean(item) &&
          typeof item === "object" &&
          (item as ChatMessage).role !== undefined &&
          ((item as ChatMessage).role === "user" || (item as ChatMessage).role === "assistant") &&
          typeof (item as ChatMessage).content === "string"
        );
      })
      .map((item) => ({ ...item, id: item.id || newId() }))
      .slice(-20);
  } catch {
    return [];
  }
}

function DevyyyyyAvatar({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "grid place-items-center rounded-2xl bg-gradient-to-br from-primary-400 via-primary-600 to-violet-800 text-white shadow-inner",
        className,
      )}
      aria-hidden
    >
      <span className="relative flex h-[1.15em] w-[1.15em] items-center justify-center">
        <Sparkles size="0.85em" strokeWidth={2.4} />
      </span>
    </span>
  );
}

export function DevyyyyyChat({ variant = "app" }: { variant?: "app" | "landing" }) {
  const pathname = usePathname() || "/";
  const page = parseAppPath(pathname);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setMessages(readStored());
  }, []);

  useEffect(() => {
    if (!messages.length) return;
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-20)));
  }, [messages]);

  useEffect(() => {
    const node = listRef.current;
    if (!node) return;
    node.scrollTop = node.scrollHeight;
  }, [messages, busy, open]);

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => inputRef.current?.focus(), 40);
    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isLesson = page.kind === "guides-lesson";
  const dockedHigh = variant === "app";

  async function send() {
    const text = draft.trim();
    if (!text || busy) return;

    const nextMessages: ChatMessage[] = [...messages, { id: newId(), role: "user", content: text }];
    setMessages(nextMessages);
    setDraft("");
    setError("");
    setBusy(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: pathname,
          topicId: page.topicId,
          slug: page.slug,
          messages: nextMessages.slice(-10).map((item) => ({ role: item.role, content: item.content })),
        }),
      });
      const data = (await response.json()) as { reply?: string; error?: string };
      if (!response.ok || !data.reply) {
        setError(data.error || "devyyyyy couldn't reply. Try again.");
        return;
      }
      setMessages((current) => [...current, { id: newId(), role: "assistant", content: data.reply! }]);
    } catch {
      setError("Network hiccup — devyyyyy didn't get that. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className={cn(
        "pointer-events-none fixed z-[60] flex flex-col items-end gap-3",
        dockedHigh
          ? cn(
              "right-3 sm:right-4",
              isLesson ? "bottom-[5.75rem] md:bottom-28" : "bottom-[5.5rem] md:bottom-24",
            )
          : "bottom-5 right-4 sm:bottom-6 sm:right-6",
      )}
    >
      {open ? (
        <section
          className={cn(
            "pointer-events-auto flex w-[min(100vw-1.5rem,24rem)] flex-col overflow-hidden border border-primary-100 bg-white shadow-[0_18px_50px_rgba(79,70,229,0.18)]",
            "max-sm:fixed max-sm:inset-x-0 max-sm:bottom-0 max-sm:w-full max-sm:rounded-t-3xl",
            "sm:max-h-[min(560px,70vh)] sm:rounded-3xl",
            "max-sm:h-[min(92dvh,640px)]",
          )}
          aria-label="devyyyyy chat"
        >
          <header className="flex items-start gap-3 border-b border-primary-50 bg-gradient-to-br from-primary-50 via-white to-white px-4 py-3.5">
            <DevyyyyyAvatar className="mt-0.5 h-10 w-10 text-base" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold tracking-tight text-ink">devyyyyy</p>
              <p className="text-[11px] font-medium text-muted">Your coding buddy · knows this page</p>
              <span className="mt-1.5 inline-flex max-w-full truncate rounded-full border border-primary-100 bg-primary-50/80 px-2 py-0.5 text-[10px] font-semibold text-primary-700">
                {page.chip}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="grid h-9 w-9 place-items-center rounded-xl text-muted transition hover:bg-primary-50 hover:text-ink"
              aria-label="Close chat"
            >
              <X size={16} />
            </button>
          </header>

          <div ref={listRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-surface-2/70 px-3.5 py-3.5">
            {messages.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-primary-100 bg-white px-3.5 py-3 text-sm leading-relaxed text-muted">
                {WELCOME}
              </div>
            ) : null}
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}
              >
                {message.role === "assistant" ? (
                  <DevyyyyyAvatar className="mr-2 mt-1 h-7 w-7 shrink-0 text-[11px]" />
                ) : null}
                <p
                  className={cn(
                    "max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed",
                    message.role === "user"
                      ? "rounded-br-md bg-primary text-white"
                      : "rounded-bl-md border border-line bg-white text-ink",
                  )}
                >
                  {message.content}
                </p>
              </div>
            ))}
            {busy ? (
              <div className="flex items-center gap-2 text-xs font-medium text-primary">
                <Loader2 size={14} className="animate-spin" />
                devyyyyy is thinking…
              </div>
            ) : null}
            {error ? <p className="text-xs font-medium text-danger">{error}</p> : null}
          </div>

          <form
            className="border-t border-line bg-white p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
            onSubmit={(event) => {
              event.preventDefault();
              void send();
            }}
          >
            <div className="flex items-end gap-2 rounded-2xl border border-line bg-surface-2 px-2.5 py-1.5 focus-within:border-primary-300 focus-within:ring-2 focus-within:ring-primary-100">
              <textarea
                ref={inputRef}
                value={draft}
                rows={1}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    void send();
                  }
                }}
                placeholder="Ask about this page, or any lesson…"
                className="max-h-28 min-h-10 flex-1 resize-none bg-transparent px-1.5 py-2 text-sm text-ink outline-none placeholder:text-muted"
              />
              <button
                type="submit"
                disabled={busy || !draft.trim()}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary text-white shadow-sm shadow-primary/25 transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:bg-primary/40"
                aria-label="Send message"
              >
                {busy ? <Loader2 size={16} className="animate-spin" /> : <Send size={15} />}
              </button>
            </div>
          </form>
        </section>
      ) : null}

      {open ? null : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-primary-100 bg-white py-2 pl-2 pr-3.5 text-sm font-bold text-ink shadow-[0_10px_28px_rgba(79,70,229,0.22)] transition hover:-translate-y-0.5 hover:border-primary-200"
          aria-expanded={false}
          aria-label="Open devyyyyy chat"
        >
          <DevyyyyyAvatar className="h-9 w-9 text-sm" />
          <span className="pr-0.5">devyyyyy</span>
        </button>
      )}
    </div>
  );
}
