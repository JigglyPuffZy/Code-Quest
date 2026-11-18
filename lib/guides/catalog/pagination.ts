import type { CatalogSection } from "@/lib/guides/catalog/types";

/** Limit mounted rows while preserving the catalog's section and entry order. */
export function catalogPage(sections: CatalogSection[], page: number, size = 60): CatalogSection[] {
  if (!Number.isInteger(page) || page < 0 || !Number.isInteger(size) || size < 1) return [];
  let skip = page * size;
  let remaining = size;
  const result: CatalogSection[] = [];
  for (const section of sections) {
    if (!remaining) break;
    if (skip >= section.entries.length) { skip -= section.entries.length; continue; }
    const entries = section.entries.slice(skip, skip + remaining);
    if (entries.length) result.push({ ...section, entries });
    remaining -= entries.length;
    skip = 0;
  }
  return result;
}
