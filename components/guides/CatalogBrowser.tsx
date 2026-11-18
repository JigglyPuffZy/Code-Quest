"use client";

import { catalogPage } from "@/lib/guides/catalog/pagination";

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
import { useDeferredValue, useMemo, useState } from "react";

const PART_TABS: Array<{ id: CatalogPart | "all"; label: string }> = [
  { id: "all", label: "All" },
  { id: "languages", label: "Languages" },
  { id: "databases", label: "Databases" },
  { id: "starter", label: "Starters" },
];

function CatalogTable({ section }: { section: CatalogSection }) {
  const isDb = section.part === "databases";

  return (
    <section id={section.id} className="workspace-catalog-section scroll-mt-24">
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

      <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-sm">
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
                    <span className="inline-flex rounded-full border border-line bg-surface px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted">
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
  const Heading = compact ? "h2" : "h1";
  const stats = catalogStats();
  const [part, setPart] = useState<CatalogPart | "all">("all");
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [page, setPage] = useState(0);

  const visibleSections = useMemo(() => {
    const sections =
      part === "all" ? sectionsByPart("languages").concat(sectionsByPart("databases"), sectionsByPart("starter")) : sectionsByPart(part);

    const q = deferredQuery.trim().toLowerCase();
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
  }, [part, deferredQuery]);

  const visibleCount = visibleSections.reduce((sum, s) => sum + s.entries.length, 0);
  const pageCount = Math.max(1, Math.ceil(visibleCount / 60));
  const currentPage = Math.min(page, pageCount - 1);
  const pageSections = catalogPage(visibleSections, currentPage);
  function goToPage(next: number) {
    setPage(next);
    document.getElementById("catalog-results")?.scrollIntoView({ block: "start", behavior: "instant" });
  }
  const pagination = <nav aria-label="Catalog pages" className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-surface px-4 py-3"><p role="status" className="text-xs text-muted">{visibleCount ? `${currentPage * 60 + 1}–${Math.min((currentPage + 1) * 60, visibleCount)} of ${visibleCount} entries` : "No matching entries"} · Page {currentPage + 1} of {pageCount}</p><div className="flex gap-2"><button type="button" className="workspace-button" disabled={currentPage === 0} onClick={() => goToPage(currentPage - 1)}>Previous</button><button type="button" className="workspace-button" disabled={currentPage >= pageCount - 1} onClick={() => goToPage(currentPage + 1)}>Next</button></div></nav>;


  return (
    <div className={cn(!compact && "pb-10")}>
      <header className={cn("mb-8", compact && "mb-6")}>
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-line bg-surface-2 px-3 py-1 text-xs font-medium text-muted">
          <Database size={13} />
          {stats.entries} technologies · {stats.sections} sections
        </div>
        <Heading className={cn("font-bold tracking-tight text-ink", compact ? "text-2xl" : "text-3xl sm:text-4xl")}>
          Programming Languages &amp; Database Catalog
        </Heading>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted sm:text-base">
          A practical reference to programming languages and database systems. Search a name, compare its purpose,
          and find a beginner-friendly explanation.
        </p>
      </header>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1">
          {PART_TABS.filter((tab) => tab.id === "all" || sectionsByPart(tab.id).length > 0).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => { setPart(tab.id); setPage(0); }}
              aria-pressed={part === tab.id}
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
          <span className="sr-only">Search technology catalog</span>
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(0); }}
            placeholder="Search Python, MongoDB, SQL..."
            className="w-full rounded-xl border border-line bg-surface py-2 pl-9 pr-3 text-sm outline-none ring-primary/30 transition focus:ring-2"
          />
        </label>
      </div>

      <p className="mb-8 text-xs text-muted">
        Found <strong className="text-ink">{visibleCount}</strong> matching entries
        {part !== "all" ? ` in ${CATALOG_PART_LABELS[part]}` : ""}.
      </p>

      {!compact && (
        <div className="mb-10 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-line bg-surface p-4">
            <div className="mb-2 flex items-center gap-2 text-primary">
              <BookOpen size={16} />
              <span className="text-xs font-bold uppercase tracking-wide">Part I</span>
            </div>
            <p className="text-sm font-semibold">Programming languages</p>
            <p className="mt-1 text-xs leading-relaxed text-muted">
              General-purpose, web, mobile, games, systems, data science, AI, shell, and more.
            </p>
          </div>
          <div className="rounded-2xl border border-line bg-surface p-4">
            <div className="mb-2 flex items-center gap-2 text-primary">
              <Database size={16} />
              <span className="text-xs font-bold uppercase tracking-wide">Part II</span>
            </div>
            <p className="text-sm font-semibold">Database systems</p>
            <p className="mt-1 text-xs leading-relaxed text-muted">
              SQL, document, graph, key-value, vector, warehouse, embedded, and cloud platforms.
            </p>
          </div>

        </div>
      )}

      <div id="catalog-results" className="scroll-mt-24">
      {pagination}
      <div className="space-y-10">
        {pageSections.map((section) => (
          <CatalogTable key={section.id} section={section} />
        ))}
        {visibleSections.length === 0 && (
          <div className="rounded-2xl border border-dashed border-line bg-surface-2/50 px-6 py-12 text-center text-sm text-muted">
            No matches for &ldquo;{query}&rdquo;. Try another name or category.
          </div>
        )}
      </div>
      {pageCount > 1 ? <div className="mt-6">{pagination}</div> : null}
      </div>
    </div>
  );
}
