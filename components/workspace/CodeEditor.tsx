"use client";

import type { LanguageId } from "@/lib/types";
import { useRef } from "react";

export function CodeEditor({
  code,
  language,
  onChange,
  onSubmit,
  theme = "default",
}: {
  code: string;
  language: LanguageId;
  onChange: (code: string) => void;
  onSubmit: () => void;
  theme?: "default" | "game";
}) {
  const isGame = theme === "game";
  const lines = Math.max(code.split("\n").length, 12);
  const indent = language === "python" || language === "java" ? "    " : "  ";
  const gutterRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className={
        isGame
          ? "grid h-[min(52vh,300px)] grid-cols-[2rem_minmax(0,1fr)] overflow-hidden rounded-xl border border-slate-700 bg-slate-900 sm:h-[360px] sm:grid-cols-[2.25rem_minmax(0,1fr)]"
          : "grid h-[min(48vh,280px)] grid-cols-[2rem_minmax(0,1fr)] overflow-hidden rounded-xl border border-line bg-surface-2 sm:h-[340px] sm:grid-cols-[2.25rem_minmax(0,1fr)]"
      }
    >
      <div
        ref={gutterRef}
        aria-hidden
        className={
          isGame
            ? "select-none overflow-hidden border-r border-slate-700 bg-slate-950 py-3 text-right font-mono text-[11px] leading-6 text-slate-500"
            : "select-none overflow-hidden border-r border-line bg-surface-3 py-3 text-right font-mono text-[11px] leading-6 text-muted"
        }
      >
        {Array.from({ length: lines }, (_, index) => (
          <div key={index} className="px-1.5">{index + 1}</div>
        ))}
      </div>
      <label className="sr-only" htmlFor="code-editor">Code editor</label>
      <textarea
        id="code-editor"
        value={code}
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        onChange={(event) => onChange(event.target.value)}
        onScroll={(event) => {
          if (gutterRef.current) gutterRef.current.scrollTop = event.currentTarget.scrollTop;
        }}
        onKeyDown={(event) => {
          if (event.key === "Tab") {
            event.preventDefault();
            const target = event.currentTarget;
            const start = target.selectionStart;
            const end = target.selectionEnd;
            const next = `${code.slice(0, start)}${indent}${code.slice(end)}`;
            onChange(next);
            requestAnimationFrame(() => {
              target.selectionStart = start + indent.length;
              target.selectionEnd = start + indent.length;
            });
          }
          if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
            event.preventDefault();
            onSubmit();
          }
        }}
        className={
          isGame
            ? "h-full resize-none bg-transparent px-2.5 py-2.5 font-mono text-[13px] leading-6 text-slate-100 caret-cyan-300 outline-none sm:px-3 sm:py-3 sm:text-sm"
            : "h-full resize-none bg-transparent px-2.5 py-2.5 font-mono text-[13px] leading-6 text-ink outline-none sm:px-3 sm:py-3 sm:text-sm"
        }
      />
    </div>
  );
}
