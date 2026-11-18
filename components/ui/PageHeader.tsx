import { PageHero } from "@/components/ui/PageHero";
import type { ReactNode } from "react";

/** Backwards-compatible wrapper: every page that used PageHeader now gets the shared hero. */
export function PageHeader({
  eyebrow,
  title,
  description,
  action,
  className,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return <PageHero eyebrow={eyebrow} title={title} description={description} action={action} className={className} />;
}
