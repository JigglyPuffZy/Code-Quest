"use client";
import { NAV_ITEMS, isActive } from "@/components/shell/nav";
import Link from "next/link";
import { usePathname } from "next/navigation";
export function MobileNav() {
  const pathname = usePathname();
  return <nav className="workspace-bottom-nav" aria-label="Mobile navigation"><ul>{NAV_ITEMS.filter((item) => item.mobile).map((item) => {
    const active = isActive(pathname, item.href); const Icon = item.icon;
    return <li key={item.href}><Link href={item.href} prefetch={false} aria-current={active ? "page" : undefined} className={active ? "is-active" : ""}><Icon size={19} strokeWidth={active ? 2 : 1.7} /><span>{item.href === "/lab" ? "Lab" : item.label}</span></Link></li>;
  })}</ul></nav>;
}
