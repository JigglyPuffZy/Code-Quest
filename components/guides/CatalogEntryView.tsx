"use client";

import { TechLogoBadge } from "@/components/icons/TechLogo";
import { GuideCourseTabs } from "@/components/guides/GuideChrome";
import { ErrorState } from "@/components/ui/States";
import { getCatalogEntry, CATALOG_PART_LABELS } from "@/lib/guides/catalog";
import { ArrowLeft, ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";

function renderMarkdownish(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

export function CatalogEntryView({ slug }: { slug: string }) {
  const entry = getCatalogEntry(slug);
  if (!entry) return <ErrorState message="Catalog entry not found." />;

  return (
    <div>
      <GuideCourseTabs />

      <article className="mt-8 max-w-3xl">
        <Link
          href="/guides/catalog"
          className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-muted transition hover:text-ink"
        >
          <ArrowLeft size={15} />
          Back to catalog
        </Link>

        <header className="border-b border-line pb-8">
          <div className="mb-3 flex flex-wrap gap-2">
            <span className="rounded-full border border-line bg-surface-2 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-muted">
              {CATALOG_PART_LABELS[entry.part]}
            </span>
            <span className="rounded-full border border-line bg-white px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-muted">
              {entry.kind}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <TechLogoBadge
              slug={entry.slug}
              name={entry.name}
              topicId={entry.guideTopicId}
              size={28}
              soft="bg-white"
              ring="ring-line"
            />
            <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">{entry.name}</h1>
          </div>
          <p className="mt-2 text-sm text-muted">{entry.sectionTitle}</p>
        </header>

        <div className="mt-8 overflow-hidden rounded-2xl border border-line bg-white">
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-line">
                <th className="w-40 bg-surface-2/60 px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-muted">
                  Name
                </th>
                <td className="px-4 py-3 font-semibold text-ink">{entry.name}</td>
              </tr>
              <tr className="border-b border-line">
                <th className="bg-surface-2/60 px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-muted">
                  Typical use
                </th>
                <td className="px-4 py-3 leading-relaxed text-muted">{entry.use}</td>
              </tr>
              <tr className="border-b border-line">
                <th className="bg-surface-2/60 px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-muted">
                  Category
                </th>
                <td className="px-4 py-3 text-muted">{entry.sectionTitle}</td>
              </tr>
              <tr>
                <th className="bg-surface-2/60 px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-muted">
                  Type
                </th>
                <td className="px-4 py-3 text-muted">{entry.kind}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="prose-guide mt-8 space-y-6 text-base leading-relaxed text-ink">
          <section>
            <h2 className="text-lg font-bold tracking-tight">What is it?</h2>
            <p className="mt-2 text-muted">{renderMarkdownish(entry.whatIsIt)}</p>
          </section>
          <section>
            <h2 className="text-lg font-bold tracking-tight">When do developers use it?</h2>
            <p className="mt-2 text-muted">{renderMarkdownish(entry.whenToUse)}</p>
          </section>
          <section>
            <h2 className="text-lg font-bold tracking-tight">Beginner tip</h2>
            <p className="mt-2 text-muted">{renderMarkdownish(entry.beginnerTip)}</p>
          </section>
        </div>

        {entry.guideTopicId && (
          <div className="mt-10 rounded-2xl border border-primary/20 bg-primary/5 p-5">
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-primary">
                <BookOpen size={18} />
              </span>
              <div className="flex-1">
                <p className="font-semibold text-ink">Full course available</p>
                <p className="mt-1 text-sm text-muted">
                  Dev Ladder has a complete lesson path for {entry.name} with step-by-step explanations.
                </p>
                <Link
                  href={`/guides/${entry.guideTopicId}`}
                  className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                >
                  Open {entry.name} course
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
