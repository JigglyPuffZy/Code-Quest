"use client";

import { cn } from "@/lib/cn";
import { listVisibleTestCases, matchRunResultsToCases } from "@/lib/execute/visible-tests";
import type { GradeTest, TestSpec } from "@/lib/types";
import { Check, FlaskConical, Loader2, Minus, X } from "lucide-react";

export function VisibleTestCases({
  tests,
  results,
  running = false,
  theme = "default",
}: {
  tests: TestSpec;
  results?: GradeTest[] | null;
  running?: boolean;
  theme?: "default" | "game";
}) {
  const isGame = theme === "game";
  const items = results
    ? matchRunResultsToCases(tests, results)
    : listVisibleTestCases(tests).map((caseItem) => ({ case: caseItem, result: undefined }));

  return (
    <article
      className={cn(
        "rounded-2xl border p-4 sm:p-5",
        isGame ? "border-slate-700 bg-slate-900/60" : "border-line bg-white",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <p
          className={cn(
            "inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em]",
            isGame ? "text-slate-400" : "text-muted",
          )}
        >
          <FlaskConical size={11} className={isGame ? "text-cyan-400" : "text-primary"} />
          Test cases
        </p>
        <span className={cn("text-[10px] font-semibold", isGame ? "text-slate-500" : "text-muted")}>
          {items.length} visible
        </span>
      </div>
      <p className={cn("mt-2 text-xs leading-relaxed", isGame ? "text-slate-400" : "text-muted")}>
        Tap <strong className={isGame ? "text-slate-200" : "text-ink"}>Run</strong> to check these cases. Submit still runs hidden checks.
      </p>

      <ul className="mt-4 space-y-2">
        {items.map(({ case: caseItem, result }, index) => {
          const pending = running && !result;
          const passed = result?.passed === true;
          const failed = result?.passed === false;

          return (
            <li
              key={caseItem.id}
              className={cn(
                "rounded-xl border px-3 py-3 font-mono text-xs",
                isGame ? "border-slate-800 bg-slate-950" : "border-line bg-surface",
                passed && (isGame ? "border-emerald-500/40 bg-emerald-950/30" : "border-emerald-200 bg-emerald-50/70"),
                failed && (isGame ? "border-rose-500/40 bg-rose-950/30" : "border-rose-200 bg-rose-50/70"),
                pending && "animate-pulse",
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <p className={cn("font-semibold", isGame ? "text-slate-200" : "text-ink")}>
                  {index + 1}. {caseItem.title}
                </p>
                <span className="shrink-0">
                  {pending ? (
                    <Loader2 size={14} className={isGame ? "animate-spin text-cyan-300" : "animate-spin text-primary"} />
                  ) : passed ? (
                    <Check size={14} className="text-ok" />
                  ) : failed ? (
                    <X size={14} className="text-danger" />
                  ) : (
                    <Minus size={14} className={isGame ? "text-slate-600" : "text-muted"} />
                  )}
                </span>
              </div>
              <p className={cn("mt-2 break-all", isGame ? "text-cyan-200/90" : "text-primary")}>{caseItem.input}</p>
              <p className={cn("mt-1 break-all", isGame ? "text-slate-400" : "text-muted")}>
                expected {caseItem.expected}
              </p>
              {failed && result ? (
                <p className="mt-2 break-all text-danger">got {result.actual}</p>
              ) : null}
            </li>
          );
        })}
      </ul>
    </article>
  );
}
