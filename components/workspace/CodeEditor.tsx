"use client";

import type { LanguageId } from "@/lib/types";
import { useRef } from "react";

export function CodeEditor({
  code,
  language,
  onChange,
  onSubmit,
}: {
  code: string;
  language: LanguageId;
  onChange: (code: string) => void;
  onSubmit: () => void;
}) {
  const lines = Math.max(code.split("\n").length, 12);
  const indent = language === "python" || language === "java" ? "    " : "  ";
  const gutterRef = useRef<HTMLDivElement>(null);

  return (
    <div className="grid h-[340px] grid-cols-[2.25rem_minmax(0,1fr)] overflow-hidden rounded-xl border border-line bg-surface-2">
      <div
        ref={gutterRef}
        aria-hidden
        className="select-none overflow-hidden border-r border-line bg-surface-3 py-3 text-right font-mono text-[11px] leading-6 text-muted"
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
        className="h-full resize-none bg-transparent px-3 py-3 font-mono text-sm leading-6 text-ink outline-none"
      />
    </div>
  );
}
