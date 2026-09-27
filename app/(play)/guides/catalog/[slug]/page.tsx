import { CatalogEntryView } from "@/components/guides/CatalogEntryView";

export default async function CatalogEntryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <CatalogEntryView slug={slug} />;
}
