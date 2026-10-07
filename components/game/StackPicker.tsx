"use client";

import { TechLogo } from "@/components/icons/TechLogo";
import { cn } from "@/lib/cn";
import {
  BACKEND_FRAMEWORKS,
  BACKEND_LANGUAGES,
  FRONTEND_FRAMEWORKS,
  FRONTEND_LANGUAGES,
  type BackendFrameworkId,
  type BackendLanguage,
  type FrontendFrameworkId,
  type FrontendLanguage,
  type GameTrackId,
} from "@/lib/game/tracks";
import { Code2, Layers } from "lucide-react";

const FRONTEND_ICON: Record<FrontendFrameworkId, string> = {
  react: "react",
  vue: "vuedotjs",
  angular: "angular",
  svelte: "svelte",
};

const BACKEND_ICON: Record<BackendFrameworkId, string> = {
  express: "express",
  django: "django",
  spring: "spring",
  fastapi: "fastapi",
};

const LANG_LABEL: Record<string, string> = {
  javascript: "JavaScript",
  typescript: "TypeScript",
  python: "Python",
  java: "Java",
};

function LanguageBar<T extends string>({
  options,
  value,
  onChange,
  accent,
}: {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  accent: "sky" | "violet";
}) {
  const active =
    accent === "sky"
      ? "border-sky-300 bg-sky-50 text-sky-800 shadow-sm shadow-sky-100"
      : "border-violet-300 bg-violet-50 text-violet-800 shadow-sm shadow-violet-100";

  return (
    <div className="rounded-2xl border border-line bg-surface p-3 sm:p-4">
      <p className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-muted">Language</p>
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}>
        {options.map((lang) => {
          const selected = value === lang;
          return (
            <button
              key={lang}
              type="button"
              onClick={() => onChange(lang)}
              className={cn(
                "rounded-xl border px-2 py-2.5 text-center text-xs font-bold transition sm:px-3 sm:py-3 sm:text-sm",
                selected ? active : "border-line bg-surface-2/50 text-muted hover:border-slate-300 hover:bg-white hover:text-ink",
              )}
            >
              {LANG_LABEL[lang] ?? lang}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function FrameworkGrid<T extends string>({
  items,
  value,
  onSelect,
  icons,
  accent,
}: {
  items: Record<T, { label: string; blurb: string }>;
  value: T;
  onSelect: (id: T) => void;
  icons: Record<T, string>;
  accent: "sky" | "violet";
}) {
  const activeRing =
    accent === "sky"
      ? "border-sky-300 bg-gradient-to-br from-sky-50 via-surface to-cyan-50/60 ring-2 ring-sky-100"
      : "border-violet-300 bg-gradient-to-br from-violet-50 via-surface to-primary-50/40 ring-2 ring-violet-100";

  const activeText = accent === "sky" ? "text-sky-800" : "text-violet-800";

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {(Object.entries(items) as [T, { label: string; blurb: string }][]).map(([id, meta]) => {
        const active = value === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onSelect(id)}
            className={cn(
              "group flex flex-col items-start rounded-2xl border p-4 text-left transition duration-200",
              "hover:-translate-y-0.5 hover:shadow-md",
              active ? activeRing : "border-line bg-surface hover:border-line",
            )}
          >
            <span
              className={cn(
                "mb-3 grid size-10 place-items-center rounded-xl border border-line bg-surface shadow-sm transition",
                active && (accent === "sky" ? "border-sky-200" : "border-violet-200"),
              )}
            >
              <TechLogo slug={icons[id]} name={meta.label} size={22} />
            </span>
            <span className={cn("text-sm font-bold", active ? activeText : "text-ink")}>{meta.label}</span>
            <span className="mt-1 line-clamp-2 text-[11px] leading-snug text-muted">{meta.blurb}</span>
          </button>
        );
      })}
    </div>
  );
}

export function StackPicker({
  track,
  frontendFramework,
  frontendLanguage,
  backendFramework,
  backendLanguage,
  onFrontendChange,
  onBackendChange,
}: {
  track: GameTrackId;
  frontendFramework: FrontendFrameworkId;
  frontendLanguage: FrontendLanguage;
  backendFramework: BackendFrameworkId;
  backendLanguage: BackendLanguage;
  onFrontendChange: (patch: {
    framework: FrontendFrameworkId;
    language: FrontendLanguage;
  }) => void;
  onBackendChange: (patch: {
    framework: BackendFrameworkId;
    language: BackendLanguage;
  }) => void;
}) {
  if (track === "core") {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-surface to-teal-50/50 p-5">
        <div className="flex items-start gap-4">
          <span className="grid size-12 shrink-0 place-items-center rounded-xl border border-emerald-200 bg-surface text-2xl shadow-sm">
            🐍
          </span>
          <div>
            <p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-700">
              <Code2 size={12} />
              Core track
            </p>
            <h3 className="mt-1 text-base font-bold text-ink">Python only</h3>
            <p className="mt-1 text-sm leading-relaxed text-muted">
              No framework picker needed — this campaign focuses on pure Python logic drills.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (track === "frontend") {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3 px-0.5">
          <p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-muted">
            <Layers size={12} />
            Frontend stack
          </p>
          <p className="text-[10px] font-semibold text-muted">
            {FRONTEND_FRAMEWORKS[frontendFramework].label} · {LANG_LABEL[frontendLanguage]}
          </p>
        </div>

        <FrameworkGrid
          items={FRONTEND_FRAMEWORKS}
          value={frontendFramework}
          icons={FRONTEND_ICON}
          accent="sky"
          onSelect={(framework) =>
            onFrontendChange({ framework, language: frontendLanguage })
          }
        />

        <LanguageBar
          options={FRONTEND_LANGUAGES}
          value={frontendLanguage}
          accent="sky"
          onChange={(language) =>
            onFrontendChange({ framework: frontendFramework, language })
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 px-0.5">
        <p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-muted">
          <Layers size={12} />
          Backend stack
        </p>
        <p className="text-[10px] font-semibold text-muted">
          {BACKEND_FRAMEWORKS[backendFramework].label} · {LANG_LABEL[backendLanguage]}
        </p>
      </div>

      <FrameworkGrid
        items={BACKEND_FRAMEWORKS}
        value={backendFramework}
        icons={BACKEND_ICON}
        accent="violet"
        onSelect={(framework) =>
          onBackendChange({ framework, language: backendLanguage })
        }
      />

      <LanguageBar
        options={BACKEND_LANGUAGES}
        value={backendLanguage}
        accent="violet"
        onChange={(language) =>
          onBackendChange({ framework: backendFramework, language })
        }
      />
    </div>
  );
}
