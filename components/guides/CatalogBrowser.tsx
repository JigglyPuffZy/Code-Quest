"use client";

import { TechLogo } from "@/components/icons/TechLogo";
import {
  CATALOG_PART_LABELS,
  catalogStats,
  sectionsByPart,
  type CatalogEntry,
  type CatalogPart,
  type CatalogSection,
} from "@/lib/guides/catalog";
import { cn } from "@/lib/cn";
import { ArrowRight, BookOpen, Database, Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

const PART_TABS: Array<{ id: CatalogPart | "all"; label: string }> = [
  { id: "all", label: "All" },
  { id: "languages", label: "Languages" },
  { id: "databases", label: "Databases" },
  { id: "starter", label: "Starters" },
];

function CatalogTable({ section }: { section: CatalogSection }) {
  const isDb = section.part === "databases";

  return (
    <section id={section.id} className="scroll-mt-24">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          {section.letter && (
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">
              Section {section.letter}
            </p>
          )}
          <h3 className="text-base font-bold tracking-tight text-ink sm:text-lg">{section.title}</h3>
        </div>
        <span className="text-xs text-muted">{section.entries.length} entries</span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="catalog-table w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-line bg-surface-2/80">
                <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-muted">
                  {isDb ? "Database / platform" : "Language / technology"}
                </th>
                <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-muted">
                  {isDb ? "Type or typical use" : "Typical use or category"}
                </th>
                <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-muted">Kind</th>
                <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-muted">Learn</th>
              </tr>
            </thead>
            <tbody>
              {section.entries.map((entry) => (
                <tr key={entry.slug} className="border-b border-line/70 last:border-0 transition hover:bg-surface-2/40">
                  <td className="px-4 py-3 align-top font-semibold text-ink">
                    <Link
                      href={`/guides/catalog/${entry.slug}`}
                      className="inline-flex items-center gap-2.5 hover:text-primary"
                    >
                      <TechLogo
                        slug={entry.slug}
                        name={entry.name}
                        topicId={entry.guideTopicId}
                        size={18}
                      />
                      <span>{entry.name}</span>
                    </Link>
                  </td>
                  <td className="px-4 py-3 align-top leading-relaxed text-muted">{entry.use}</td>
                  <td className="px-4 py-3 align-top">
                    <span className="inline-flex rounded-full border border-line bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted">
                      {entry.kind}
                    </span>
                  </td>
                  <td className="px-4 py-3 align-top">
                    {entry.guideTopicId ? (
                      <Link
                        href={`/guides/${entry.guideTopicId}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                      >
                        Course
                        <ArrowRight size={12} />
                      </Link>
                    ) : (
                      <Link
                        href={`/guides/catalog/${entry.slug}`}
                        className="inline-flex items-center gap-1 text-xs font-medium text-muted hover:text-ink"
                      >
                        Details
                        <ArrowRight size={12} />
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export function CatalogBrowser({ compact = false }: { compact?: boolean }) {
  const stats = catalogStats();
  const [part, setPart] = useState<CatalogPart | "all">("all");
  const [query, setQuery] = useState("");

  const visibleSections = useMemo(() => {
    const sections =
      part === "all" ? sectionsByPart("languages").concat(sectionsByPart("databases"), sectionsByPart("starter")) : sectionsByPart(part);

    const q = query.trim().toLowerCase();
    if (!q) return sections;

    return sections
      .map((section): CatalogSection => ({
        ...section,
        entries: section.entries.filter((entry: CatalogEntry) => {
          const hay = `${entry.name} ${entry.use} ${entry.kind} ${entry.sectionTitle}`.toLowerCase();
          return hay.includes(q);
        }),
      }))
      .filter((section) => section.entries.length > 0);
  }, [part, query]);

  const visibleCount = visibleSections.reduce((sum, s) => sum + s.entries.length, 0);

  return (
    <div className={cn(!compact && "pb-10")}>
      <header className={cn("mb-8", compact && "mb-6")}>
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-line bg-surface-2 px-3 py-1 text-xs font-medium text-muted">
          <Database size={13} />
          {stats.entries} technologies · {stats.sections} sections
        </div>
        <h2 className={cn("font-bold tracking-tight text-ink", compact ? "text-2xl" : "text-3xl sm:text-4xl")}>
          Programming Languages &amp; Database Catalog
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted sm:text-base">
          The full reference from the Dev Ladder catalog document — organized in tables so you can quickly see what each
          language or database is for, in plain and understandable language.
        </p>
      </header>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1">
          {PART_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setPart(tab.id)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-[11px] font-semibold transition",
                part === tab.id ? "bg-primary text-primary-foreground" : "text-muted hover:bg-surface-2 hover:text-ink",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <label className="relative block w-full sm:max-w-xs">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Python, MongoDB, SQL..."
            className="w-full rounded-xl border border-line bg-white py-2 pl-9 pr-3 text-sm outline-none ring-primary/30 transition focus:ring-2"
          />
        </label>
      </div>

      <p className="mb-8 text-xs text-muted">
        Showing <strong className="text-ink">{visibleCount}</strong> entries
        {part !== "all" ? ` in ${CATALOG_PART_LABELS[part]}` : ""}.
      </p>

      {!compact && (
        <div className="mb-10 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-line bg-white p-4">
            <div className="mb-2 flex items-center gap-2 text-primary">
              <BookOpen size={16} />
              <span className="text-xs font-bold uppercase tracking-wide">Part I</span>
            </div>
            <p className="text-sm font-semibold">Programming languages</p>
            <p className="mt-1 text-xs leading-relaxed text-muted">
              General-purpose, web, mobile, games, systems, data science, AI, shell, and more.
            </p>
          </div>
          <div className="rounded-2xl border border-line bg-white p-4">
            <div className="mb-2 flex items-center gap-2 text-primary">
              <Database size={16} />
              <span className="text-xs font-bold uppercase tracking-wide">Part II</span>
            </div>
            <p className="text-sm font-semibold">Database systems</p>
            <p className="mt-1 text-xs leading-relaxed text-muted">
              SQL, document, graph, key-value, vector, warehouse, embedded, and cloud platforms.
            </p>
          </div>
          <div className="rounded-2xl border border-line bg-white p-4">
            <div className="mb-2 text-primary">
              <span className="text-xs font-bold uppercase tracking-wide">Part III</span>
            </div>
            <p className="text-sm font-semibold">Suggested starters</p>
            <p className="mt-1 text-xs leading-relaxed text-muted">
              Beginner-friendly picks for learning paths inside Dev Ladder.
            </p>
          </div>
        </div>
      )}

      <div className="space-y-10">
        {visibleSections.map((section) => (
          <CatalogTable key={section.id} section={section} />
        ))}
        {visibleSections.length === 0 && (
          <div className="rounded-2xl border border-dashed border-line bg-surface-2/50 px-6 py-12 text-center text-sm text-muted">
            No matches for &ldquo;{query}&rdquo;. Try another name or category.
          </div>
        )}
      </div>
    </div>
  );
}
