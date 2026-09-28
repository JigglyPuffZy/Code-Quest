import type { GuideTopicId } from "@/lib/guides/types";

export type CatalogPart = "languages" | "databases" | "starter";

export type CatalogEntryRaw = {
  name: string;
  use: string;
  slug: string;
};

export type CatalogSectionRaw = {
  id: string;
  part: CatalogPart;
  letter?: string;
  title: string;
  entries: CatalogEntryRaw[];
};

export type CatalogKind =
  | "Programming language"
  | "Markup / styling"
  | "Query language"
  | "Shell / automation"
  | "Framework / library"
  | "Data format"
  | "Platform / service"
  | "Database"
  | "Tool / runtime"
  | "Other";

export type CatalogEntry = CatalogEntryRaw & {
  sectionId: string;
  sectionTitle: string;
  part: CatalogPart;
  kind: CatalogKind;
  summary: string;
  whatIsIt: string;
  whenToUse: string;
  beginnerTip: string;
  guideTopicId?: GuideTopicId;
};

export type CatalogSection = Omit<CatalogSectionRaw, "entries"> & {
  entries: CatalogEntry[];
};

export const CATALOG_PART_LABELS: Record<CatalogPart, string> = {
  languages: "Programming Languages & Related Technologies",
  databases: "Database Systems & Platforms",
  starter: "Suggested Starters for Dev Ladder",
};
