import catalogData from "@/lib/guides/catalog/catalog.json";
import { enrichSection } from "@/lib/guides/catalog/enrich";
import type {
  CatalogEntry,
  CatalogPart,
  CatalogSection,
  CatalogSectionRaw,
} from "@/lib/guides/catalog/types";
import { CATALOG_PART_LABELS } from "@/lib/guides/catalog/types";

export { CATALOG_PART_LABELS };
export type { CatalogEntry, CatalogPart, CatalogSection, CatalogKind } from "@/lib/guides/catalog/types";

const rawSections = catalogData.sections as CatalogSectionRaw[];

export const catalogSections: CatalogSection[] = rawSections.map(enrichSection);

const entryBySlug = new Map<string, CatalogEntry>();
for (const section of catalogSections) {
  for (const entry of section.entries) {
    entryBySlug.set(entry.slug, entry);
  }
}

export function catalogStats() {
  const entries = catalogSections.reduce((sum, s) => sum + s.entries.length, 0);
  const languageSections = catalogSections.filter((s) => s.part === "languages").length;
  const databaseSections = catalogSections.filter((s) => s.part === "databases").length;
  return {
    entries,
    sections: catalogSections.length,
    languageSections,
    databaseSections,
  };
}

export function sectionsByPart(part: CatalogPart) {
  return catalogSections.filter((s) => s.part === part);
}

export function getCatalogEntry(slug: string) {
  return entryBySlug.get(slug);
}

export function searchCatalog(query: string, part: CatalogPart | "all" = "all") {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const results: CatalogEntry[] = [];
  for (const section of catalogSections) {
    if (part !== "all" && section.part !== part) continue;
    for (const entry of section.entries) {
      const hay = `${entry.name} ${entry.use} ${entry.kind} ${entry.sectionTitle}`.toLowerCase();
      if (hay.includes(q)) results.push(entry);
    }
  }
  return results;
}

export function catalogEntriesWithCourses() {
  return [...entryBySlug.values()].filter((e) => e.guideTopicId);
}
