import { CatalogBrowser } from "@/components/guides/CatalogBrowser";
import Link from "next/link";
export const metadata = { title: "Technology catalog" };
export default function GuidesCatalogPage() {
  return <div><Link href="/guides" className="workspace-text-link mb-5">← Back to guide library</Link><CatalogBrowser /></div>;
}
