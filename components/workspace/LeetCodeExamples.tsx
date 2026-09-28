"use client";

import { cn } from "@/lib/cn";
import {
  formatExampleInput,
  formatExampleOutput,
  hiddenTestCount,
  parseParamNames,
  visibleExampleCases,
} from "@/lib/exercise/leetcode-examples";
import type { Exercise, LanguageId } from "@/lib/types";

function ExampleBlock({
  index,
  input,
  output,
  explanation,
  variant = "light",
}: {
  index: number;
  input: string;
  output: string;
  explanation?: string;
  variant?: "light" | "dark";
}) {
  const dark = variant === "dark";

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border font-mono text-xs leading-relaxed",
        dark ? "border-slate-700 bg-slate-950" : "border-line bg-surface-2",
      )}
    >
      <div
        className={cn(
          "border-b px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider",
          dark ? "border-slate-800 text-slate-400" : "border-line text-muted",
        )}
      >
        Example {index}
      </div>
      <div className="space-y-2 px-3 py-2.5">
        <div>
          <p className={cn("text-[10px] font-bold uppercase", dark ? "text-slate-500" : "text-muted")}>
            Input
          </p>
          <pre className={cn("mt-0.5 whitespace-pre-wrap break-words", dark ? "text-slate-100" : "text-ink")}>
            {input}
          </pre>
        </div>
        <div>
          <p className={cn("text-[10px] font-bold uppercase", dark ? "text-slate-500" : "text-muted")}>
            Output
          </p>
          <pre className={cn("mt-0.5 whitespace-pre-wrap break-words", dark ? "text-emerald-300" : "text-primary")}>
            {output}
          </pre>
        </div>
        {explanation ? (
          <div>
            <p className={cn("text-[10px] font-bold uppercase", dark ? "text-slate-500" : "text-muted")}>
              Explanation
            </p>
            <p className={cn("mt-0.5 text-[11px] leading-relaxed font-sans", dark ? "text-slate-300" : "text-muted")}>
              {explanation}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function LeetCodeExamples({
  exercise,
  language,
  variant = "light",
  className,
}: {
  exercise: Exercise;
  language: LanguageId;
  variant?: "light" | "dark";
  className?: string;
}) {
  const dark = variant === "dark";
  const hidden = hiddenTestCount(exercise);
  const { tests, starterCode, performance } = exercise;

  if (tests.type === "stdout") {
    const stdin = tests.stdin?.trim();
    return (
      <div className={cn("space-y-2", className)}>
        <p className={cn("text-[10px] font-bold uppercase tracking-[0.2em]", dark ? "text-slate-400" : "text-muted")}>
          Examples
        </p>
        <ExampleBlock
          index={1}
          variant={variant}
          input={stdin ? `stdin = ${JSON.stringify(stdin)}` : "// main() runs your code"}
          output={tests.expected}
          explanation={
            language === "java"
              ? "Match the expected stdout exactly — including line breaks."
              : "Your program output must match exactly."
          }
        />
      </div>
    );
  }

  const paramNames = parseParamNames(starterCode);
  const examples = visibleExampleCases(tests);

  if (examples.length === 0) return null;

  return (
    <div className={cn("space-y-2.5", className)}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className={cn("text-[10px] font-bold uppercase tracking-[0.2em]", dark ? "text-slate-400" : "text-muted")}>
          Examples
        </p>
        <code
          className={cn(
            "rounded-md px-2 py-0.5 text-[10px] font-semibold",
            dark ? "bg-slate-800 text-cyan-300" : "bg-primary-50 text-primary",
          )}
        >
          {tests.functionName}(…)
        </code>
      </div>

      {examples.map((example, index) => (
        <ExampleBlock
          key={`${example.label ?? index}-${index}`}
          index={index + 1}
          variant={variant}
          input={formatExampleInput(tests.functionName, paramNames, example.args)}
          output={formatExampleOutput(example.expected)}
          explanation={example.explanation}
        />
      ))}

      {hidden > 0 ? (
        <p className={cn("text-[10px] leading-relaxed", dark ? "text-slate-500" : "text-muted")}>
          + {hidden} hidden test{hidden === 1 ? "" : "s"} on Submit
          {performance ? ` · must run in ${performance.expectedComplexity}` : ""}
        </p>
      ) : null}
    </div>
  );
}
