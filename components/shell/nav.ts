import {
  BookOpen,
  FlaskConical,
  Gamepad2,
  GraduationCap,
  LayoutDashboard,
  Medal,
  RotateCcw,
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
  { href: "/guides", label: "Guides", icon: BookOpen, mobile: true },
  { href: "/quests", label: "Quests", icon: ScrollText },
  { href: "/game", label: "Game", icon: Gamepad2, mobile: true },
  { href: "/challenges", label: "Arena", icon: Swords },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/achievements", label: "Achievements", icon: Medal },
  { href: "/review", label: "Review", icon: RotateCcw },
  { href: "/learning", label: "Learning planner", icon: BookOpen },
  { href: "/lab", label: "Developer lab", icon: FlaskConical, mobile: true },
  { href: "/class", label: "Class", icon: GraduationCap },
  { href: "/profile", label: "Profile", icon: UserRound, mobile: true },
  { href: "/help", label: "User manual", icon: BookOpen },
];

export function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function isInGameSession(pathname: string) {
  return /^\/challenges\/[^/]+$/.test(pathname) || /^\/game\/[^/]+\/\d+$/.test(pathname);
}
