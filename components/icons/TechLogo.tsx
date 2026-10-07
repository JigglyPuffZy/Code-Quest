"use client";

import { getSimpleIcon, resolveIconSlug, resolveTopicIconSlugs } from "@/lib/tech-logos";
import type { GuideTopicId } from "@/lib/guides/types";
import { cn } from "@/lib/cn";

function SingleLogo({
  slug,
  size,
  className,
  label,
}: {
  slug: string;
  size: number;
  className?: string;
  label?: string;
}) {
  const icon = getSimpleIcon(slug);
  if (!icon) return null;

  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={cn("shrink-0", className)}
      aria-label={label || icon.title}
    >
      <title>{label || icon.title}</title>
      <path d={icon.path} fill={`#${icon.hex}`} />
    </svg>
  );
}

function FallbackLogo({
  label,
  size,
  className,
}: {
  label: string;
  size: number;
  className?: string;
}) {
  const letter = label.trim().charAt(0).toUpperCase() || "?";
  return (
    <span
      className={cn(
        "inline-grid shrink-0 place-items-center rounded-md bg-surface-2 text-[10px] font-bold text-muted",
        className,
      )}
      style={{ width: size, height: size }}
      aria-hidden
    >
      {letter}
    </span>
  );
}

export function TechLogo({
  topicId,
  slug,
  name,
  size = 20,
  className,
  label,
}: {
  topicId?: GuideTopicId;
  slug?: string;
  name?: string;
  size?: number;
  className?: string;
  label?: string;
}) {
  const iconSlugs = topicId
    ? resolveTopicIconSlugs(topicId)
    : resolveIconSlug({ slug, name });

  if (iconSlugs.length === 0) {
    return <FallbackLogo label={label || name || slug || "?"} size={size} className={className} />;
  }

  if (iconSlugs.length === 1) {
    const single = (
      <SingleLogo slug={iconSlugs[0]} size={size} className={className} label={label || name} />
    );
    return single ?? <FallbackLogo label={label || name || iconSlugs[0]} size={size} className={className} />;
  }

  const dualSize = Math.max(12, Math.round(size * 0.62));
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)}>
      {iconSlugs.map((iconSlug) => (
        <SingleLogo
          key={iconSlug}
          slug={iconSlug}
          size={dualSize}
          label={label || name}
        />
      ))}
    </span>
  );
}

export function TechLogoBadge({
  topicId,
  slug,
  name,
  size = 22,
  soft,
  ring,
  className,
}: {
  topicId?: GuideTopicId;
  slug?: string;
  name?: string;
  size?: number;
  soft?: string;
  ring?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-grid place-items-center rounded-xl bg-surface ring-1 ring-line",
        soft,
        ring,
        className,
      )}
      style={{ width: size + 14, height: size + 14 }}
    >
      <TechLogo topicId={topicId} slug={slug} name={name} size={size} label={name} />
    </span>
  );
}
