import { CatalogBrowser } from "@/components/guides/CatalogBrowser";
import { GuideCourseTabs } from "@/components/guides/GuideChrome";

export default function GuidesCatalogPage() {
  return (
    <div>
      <GuideCourseTabs />
      <div className="mt-8">
        <CatalogBrowser />
      </div>
    </div>
  );
}
