"use client";

import { ProgressBar } from "@/components/ui/ProgressBar";
import { cn } from "@/lib/cn";
import { hiddenTestCount } from "@/lib/exercise/leetcode-examples";
import {
  listVisibleTestDisplay,
  matchRunResultsToDisplay,
  summarizeRunResults,
} from "@/lib/execute/visible-tests";
import type { Exercise, GradeTest } from "@/lib/types";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Circle,
  FlaskConical,
  Loader2,
  Play,
  Shield,
  X,
  XCircle,
} from "lucide-react";

function StatusBadge({
  running,
  passed,
  failed,
  variant = "light",
}: {
  running?: boolean;
  passed?: boolean;
  failed?: boolean;
  variant?: "light" | "dark";
}) {
  const dark = variant === "dark";

  if (running) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
          dark ? "bg-cyan-500/15 text-cyan-300" : "bg-primary/10 text-primary",
        )}
      >
        <Loader2 size={10} className="animate-spin" />
        Checking
      </span>
    );
  }
  if (passed) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
          dark ? "bg-emerald-500/15 text-emerald-300" : "bg-emerald-100 text-emerald-700",
        )}
      >
        <Check size={10} />
        Passed
      </span>
    );
  }
  if (failed) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
          dark ? "bg-rose-500/15 text-rose-300" : "bg-rose-100 text-rose-700",
        )}
      >
        <X size={10} />
        Failed
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
        dark ? "bg-slate-800 text-slate-500" : "bg-surface-2 text-muted",
      )}
    >
      <Circle size={8} className="fill-current" />
      Not run
    </span>
  );
}

function ExampleCard({
  index,
  title,
  input,
  expected,
  actual,
  running,
  passed,
  failed,
  variant = "light",
}: {
  index: number;
  title: string;
  input: string;
  expected: string;
  actual?: string;
  running?: boolean;
  passed?: boolean;
  failed?: boolean;
  variant?: "light" | "dark";
}) {
  const dark = variant === "dark";

  return (
    <li
      className={cn(
        "overflow-hidden rounded-xl border font-mono text-xs leading-relaxed transition-colors",
        dark ? "border-slate-800 bg-slate-950" : "border-line bg-surface-2",
        passed && (dark ? "border-emerald-500/50 ring-1 ring-emerald-500/20" : "border-emerald-300 bg-emerald-50/50"),
        failed && (dark ? "border-rose-500/50 ring-1 ring-rose-500/20" : "border-rose-300 bg-rose-50/50"),
        running && !passed && !failed && "animate-pulse",
      )}
    >
      <div
        className={cn(
          "flex items-center justify-between gap-2 border-b px-3 py-2",
          dark ? "border-slate-800 bg-slate-900/80" : "border-line bg-surface",
        )}
      >
        <p className={cn("font-sans text-xs font-semibold", dark ? "text-slate-200" : "text-ink")}>
          Example {index}
          {title && title !== `Example ${index}` ? (
            <span className={cn("ml-1.5 font-normal", dark ? "text-slate-400" : "text-muted")}>
              · {title}
            </span>
          ) : null}
        </p>
        <StatusBadge running={running} passed={passed} failed={failed} variant={variant} />
      </div>

      <div className="space-y-3 px-3 py-3">
        <div>
          <p className={cn("text-[10px] font-bold uppercase tracking-wider", dark ? "text-slate-500" : "text-muted")}>
            Input
          </p>
          <pre
            className={cn(
              "mt-1 whitespace-pre-wrap break-words font-mono text-[11px] leading-5",
              dark ? "text-slate-100" : "text-ink",
            )}
          >
            {input}
          </pre>
        </div>

        <div>
          <p className={cn("text-[10px] font-bold uppercase tracking-wider", dark ? "text-slate-500" : "text-muted")}>
            Expected output
          </p>
          <pre
            className={cn(
              "mt-1 whitespace-pre-wrap break-words font-mono text-[11px] leading-5",
              dark ? "text-emerald-300" : "text-primary",
            )}
          >
            {expected}
          </pre>
        </div>

        {failed && actual ? (
          <div
            className={cn(
              "rounded-lg border px-2.5 py-2",
              dark ? "border-rose-500/30 bg-rose-950/40" : "border-rose-200 bg-rose-50",
            )}
          >
            <p className="text-[10px] font-bold uppercase tracking-wider text-danger">Your output</p>
            <pre className="mt-1 whitespace-pre-wrap break-words font-mono text-[11px] leading-5 text-danger">
              {actual}
            </pre>
          </div>
        ) : null}
      </div>
    </li>
  );
}

export function VisibleTestCases({
  exercise,
  results,
  running = false,
  variant = "light",
}: {
  exercise: Exercise;
  results?: GradeTest[] | null;
  running?: boolean;
  variant?: "light" | "dark";
}) {
  const dark = variant === "dark";
  const { tests, performance } = exercise;
  const hidden = hiddenTestCount(exercise);
  const items = results
    ? matchRunResultsToDisplay(exercise, results)
    : listVisibleTestDisplay(exercise).map((caseItem) => ({ case: caseItem, result: undefined }));
  const summary = summarizeRunResults(results);
  const hasRun = Boolean(results?.length);
  const functionName = tests.type === "function" ? tests.functionName : null;

  return (
    <article
      className={cn(
        "overflow-hidden rounded-2xl border shadow-sm",
        dark ? "border-slate-700 bg-slate-900/60" : "border-line bg-surface",
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "border-b px-4 py-4 sm:px-5",
          dark ? "border-slate-800 bg-slate-950/50" : "border-line bg-gradient-to-r from-surface-2 to-surface",
        )}
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p
              className={cn(
                "inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em]",
                dark ? "text-slate-400" : "text-muted",
              )}
            >
              <FlaskConical size={12} className={dark ? "text-cyan-400" : "text-primary"} />
              Examples to try
            </p>
            <p className={cn("mt-1.5 text-sm leading-relaxed", dark ? "text-slate-300" : "text-ink")}>
              These are the checks <strong className="font-semibold">Run tests</strong> will grade.
            </p>
          </div>
          {functionName ? (
            <code
              className={cn(
                "shrink-0 rounded-lg px-2.5 py-1 text-[11px] font-semibold",
                dark ? "bg-slate-800 text-cyan-300" : "bg-primary-50 text-primary",
              )}
            >
              {functionName}(…)
            </code>
          ) : null}
        </div>

        {/* How it works */}
        <ol className="mt-4 flex flex-wrap items-center gap-1.5 text-[11px] font-medium">
          {[
            { step: 1, label: "Write code", icon: null },
            { step: 2, label: "Run tests", icon: Play },
            { step: 3, label: "Submit", icon: Shield },
          ].map((item, index) => (
            <li key={item.step} className="flex items-center gap-1.5">
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2 py-1",
                  dark ? "bg-slate-800 text-slate-300" : "bg-surface-2 text-ink",
                )}
              >
                <span
                  className={cn(
                    "flex size-4 items-center justify-center rounded-full text-[9px] font-bold",
                    dark ? "bg-slate-700 text-cyan-300" : "bg-primary text-primary-foreground",
                  )}
                >
                  {item.step}
                </span>
                {item.icon ? <item.icon size={10} className={dark ? "text-cyan-400" : "text-primary"} /> : null}
                {item.label}
              </span>
              {index < 2 ? (
                <ArrowRight size={12} className={cn("shrink-0", dark ? "text-slate-600" : "text-muted")} />
              ) : null}
            </li>
          ))}
        </ol>
      </div>

      {/* Run summary */}
      {hasRun || running ? (
        <div
          className={cn(
            "border-b px-4 py-3 sm:px-5",
            dark ? "border-slate-800 bg-slate-900/40" : "border-line bg-surface-2/60",
          )}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {running ? (
                <Loader2 size={16} className={cn("animate-spin", dark ? "text-cyan-300" : "text-primary")} />
              ) : summary.allPassed ? (
                <CheckCircle2 size={16} className="text-ok" />
              ) : summary.failed > 0 ? (
                <XCircle size={16} className="text-danger" />
              ) : null}
              <p className={cn("text-sm font-semibold", dark ? "text-slate-200" : "text-ink")}>
                {running
                  ? "Running your code against examples…"
                  : summary.allPassed
                    ? `All ${summary.total} examples passed`
                    : `${summary.passed} of ${summary.total} examples passed`}
              </p>
            </div>
            {!running && hasRun ? (
              <span
                className={cn(
                  "shrink-0 text-xs font-bold tabular-nums",
                  summary.allPassed ? "text-ok" : "text-danger",
                )}
              >
                {summary.passed}/{summary.total}
              </span>
            ) : null}
          </div>
          {!running && hasRun ? (
            <ProgressBar
              value={summary.total ? (summary.passed / summary.total) * 100 : 0}
              label={`${summary.passed} of ${summary.total} passed`}
              fast
              className={cn("mt-2.5", dark ? "bg-slate-800" : undefined)}
              barClassName={
                summary.allPassed
                  ? dark
                    ? "bg-emerald-400"
                    : "bg-emerald-500"
                  : dark
                    ? "bg-gradient-to-r from-rose-400 to-amber-400"
                    : "bg-gradient-to-r from-rose-400 to-primary"
              }
            />
          ) : null}
          {!running && hasRun && !summary.allPassed ? (
            <p className={cn("mt-2 text-xs leading-relaxed", dark ? "text-slate-400" : "text-muted")}>
              Fix the failing examples, then run again. Submit only when you are ready for hidden checks.
            </p>
          ) : null}
          {!running && hasRun && summary.allPassed ? (
            <p className={cn("mt-2 text-xs leading-relaxed", dark ? "text-emerald-400/90" : "text-ok")}>
              Looking good — hit Submit when you are ready for the full grade.
            </p>
          ) : null}
        </div>
      ) : null}

      {/* Example cards */}
      <ul className="space-y-3 p-4 sm:p-5">
        {items.map(({ case: caseItem, result }, index) => {
          const pending = running && !result;
          const passed = result?.passed === true;
          const failed = result?.passed === false;

          return (
            <ExampleCard
              key={caseItem.id}
              index={index + 1}
              title={caseItem.title}
              input={caseItem.input}
              expected={caseItem.expected}
              actual={failed ? result?.actual : undefined}
              running={pending}
              passed={passed}
              failed={failed}
              variant={variant}
            />
          );
        })}
      </ul>

      {/* Footer */}
      <div
        className={cn(
          "border-t px-4 py-3 sm:px-5",
          dark ? "border-slate-800 bg-slate-950/30" : "border-line bg-surface-2/40",
        )}
      >
        {hidden > 0 ? (
          <p className={cn("text-[11px] leading-relaxed", dark ? "text-slate-500" : "text-muted")}>
            <Shield size={11} className="mr-1 inline -mt-0.5" />
            Submit runs <strong className={dark ? "text-slate-400" : "text-ink"}>{hidden} more hidden check{hidden === 1 ? "" : "s"}</strong>
            {performance ? (
              <>
                {" "}
                and verifies{" "}
                <strong className={dark ? "text-slate-400" : "text-ink"}>{performance.expectedComplexity}</strong> speed
              </>
            ) : null}
            .
          </p>
        ) : (
          <p className={cn("text-[11px] leading-relaxed", dark ? "text-slate-500" : "text-muted")}>
            Run tests is a safe preview — your XP and progress only update on Submit.
          </p>
        )}
      </div>
    </article>
  );
}
