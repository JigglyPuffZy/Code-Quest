import {
  BookOpen,
  Compass,
  LayoutDashboard,
  Medal,
  ScrollText,
  Swords,
  Trophy,
  UserRound,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  mobile?: boolean;
};

export const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, mobile: true },
  { href: "/learn", label: "Learn", icon: Compass, mobile: true },
  { href: "/guides", label: "Guides", icon: BookOpen, mobile: true },
  { href: "/quests", label: "Quests", icon: ScrollText },
  { href: "/challenges", label: "Challenges", icon: Swords, mobile: true },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/achievements", label: "Achievements", icon: Medal },
  { href: "/profile", label: "Profile", icon: UserRound, mobile: true },
];

export function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}
