import { cn } from "@/lib/cn";
import type { ButtonHTMLAttributes } from "react";

const variants = {
  primary: "bg-primary text-primary-foreground shadow-sm shadow-primary/20 hover:bg-primary-hover disabled:bg-primary/40",
  gold: "bg-primary text-primary-foreground shadow-sm shadow-primary/20 hover:bg-primary-hover disabled:bg-primary/40",
  ghost: "border border-line bg-white text-ink hover:bg-primary-50 hover:border-primary-200 disabled:opacity-50",
  arena:
    "border border-slate-600 bg-slate-800 text-slate-50 hover:border-slate-500 hover:bg-slate-700 disabled:opacity-50",
  danger: "border border-danger/20 bg-danger/5 text-danger hover:bg-danger/10 disabled:opacity-50",
  mint: "bg-primary text-primary-foreground shadow-sm shadow-primary/20 hover:bg-primary-hover disabled:bg-primary/40",
};

export function Button({
  variant = "primary",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
}) {
  return (
    <button
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed sm:min-h-0",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
