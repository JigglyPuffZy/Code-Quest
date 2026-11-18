"use client";

import { Avatar } from "@/components/player/Avatar";
import { Logo } from "@/components/shell/Logo";
import { NAV_ITEMS, isActive } from "@/components/shell/nav";
import { BookOpen, ChevronDown, House, LogOut, Menu, UserRound, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";

/** Grouped navigation with a plain-language hint for each destination. */
const MENUS = [
  {
    label: "Learn",
    items: [
      { href: "/guides", hint: "Step-by-step lessons for every language" },
      { href: "/review", hint: "Revisit questions you missed" },
      { href: "/learning", hint: "Your weekly plan and projects" },
    ],
  },
  {
    label: "Practice",
    items: [
      { href: "/challenges", hint: "Coding battles that test your skills" },
      { href: "/game", hint: "Level-based puzzle campaigns" },
      { href: "/lab", hint: "Debug, trace and build real projects" },
    ],
  },
  {
    label: "Progress",
    items: [
      { href: "/quests", hint: "Missions that reward bonus XP" },
      { href: "/achievements", hint: "Badges you have earned" },
      { href: "/leaderboard", hint: "See who is climbing and duel them" },
    ],
  },
];

export type NavigationProps = {
  username: string;
  avatar: string;
  level: number;
  connected: boolean;
  onLogout: () => void;
  logoutPending: boolean;
};

function itemFor(href: string) {
  return NAV_ITEMS.find((link) => link.href === href)!;
}

function closeAll(root: HTMLElement | null, except?: Node | null) {
  root?.querySelectorAll<HTMLDetailsElement>("details[open]").forEach((item) => {
    if (!except || !item.contains(except)) item.open = false;
  });
}

type IslandProps = NavigationProps & { actions: ReactNode; mobileMenu: ReactNode };

/** Floating, centered navigation "island" at the top of the workspace. */
export function WorkspaceIsland({ actions, mobileMenu, ...user }: IslandProps) {
  const pathname = usePathname();
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const onPointer = (event: PointerEvent) => closeAll(root.current, event.target as Node);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !document.querySelector("dialog[open]")) closeAll(root.current);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <header ref={root} className="ws-island-wrap">
      <div className="ws-island">
        <div className="flex items-center gap-1">
          {mobileMenu}
          <Logo href="/dashboard" size="sm" compact className="ws-island-logo" />
        </div>

        <nav className="ws-island-nav" aria-label="Workspace navigation" data-tour="navigation">
          <Link
            href="/dashboard"
            prefetch={false}
            aria-current={pathname === "/dashboard" ? "page" : undefined}
            className={`ws-pill-link ${pathname === "/dashboard" ? "is-active" : ""}`}
          >
            <House size={16} />
            Home
          </Link>
          {MENUS.map((menu) => {
            const active = menu.items.some((item) => isActive(pathname, item.href));
            return (
              <details key={menu.label} name="ws-menu" className="ws-menu">
                <summary className={`ws-pill-link ${active ? "is-active" : ""}`}>
                  {menu.label}
                  <ChevronDown size={14} className="ws-chevron" />
                </summary>
                <ul className="ws-popover" role="menu">
                  {menu.items.map((entry) => {
                    const item = itemFor(entry.href);
                    const Icon = item.icon;
                    const here = isActive(pathname, entry.href);
                    return (
                      <li key={entry.href} role="none">
                        <Link
                          role="menuitem"
                          href={entry.href}
                          prefetch={false}
                          aria-current={here ? "page" : undefined}
                          className={`ws-popover-item ${here ? "is-active" : ""}`}
                          onClick={(event) => {
                            const parent = event.currentTarget.closest("details");
                            if (parent) parent.open = false;
                          }}
                        >
                          <span className="ws-popover-icon"><Icon size={18} /></span>
                          <span>
                            <strong>{item.label}</strong>
                            <small>{entry.hint}</small>
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </details>
            );
          })}
        </nav>

        <div className="ws-island-actions">
          {actions}
          <details name="ws-menu" className="ws-menu ws-account">
            <summary className="ws-avatar-button" aria-label="Account menu">
              <Avatar id={user.avatar} size="sm" />
            </summary>
            <div className="ws-popover ws-popover-right" role="menu">
              <div className="ws-account-head">
                <Avatar id={user.avatar} size="md" />
                <span className="min-w-0">
                  <strong className="block truncate text-sm">{user.username}</strong>
                  <small className="text-xs text-muted">Level {user.level} · {user.connected ? "Signed in" : "Local mode"}</small>
                </span>
              </div>
              {[
                { href: "/profile", label: "Profile", icon: UserRound },
                { href: "/class", label: "Class", icon: itemFor("/class").icon },
                { href: "/help", label: "User manual", icon: BookOpen },
              ].map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  role="menuitem"
                  href={href}
                  prefetch={false}
                  className="ws-menu-row"
                  onClick={(event) => {
                    const parent = event.currentTarget.closest("details");
                    if (parent) parent.open = false;
                  }}
                >
                  <Icon size={16} />
                  {label}
                </Link>
              ))}
              <button type="button" role="menuitem" className="ws-menu-row ws-menu-row--danger" disabled={user.logoutPending} onClick={user.onLogout}>
                <LogOut size={16} />
                Sign out
              </button>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}

/** Slide-in drawer listing every destination on small screens. */
export function WorkspaceMobileMenu({ username, avatar, level, connected, onLogout, logoutPending }: NavigationProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();
  const groups = [{ label: "Overview", items: [{ href: "/dashboard" }] }, ...MENUS, { label: "Community", items: [{ href: "/class" }, { href: "/profile" }, { href: "/help" }] }];
  const close = () => dialog.current?.close();
  return (
    <>
      <button
        type="button"
        className="workspace-icon-button workspace-mobile-menu-trigger"
        data-tour="navigation"
        aria-label="Open navigation menu"
        onClick={() => dialog.current?.showModal()}
      >
        <Menu size={20} />
      </button>
      <dialog
        ref={dialog}
        className="workspace workspace-dialog workspace-drawer"
        aria-label="Workspace navigation menu"
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
      >
        <div className="workspace-drawer-inner">
          <button type="button" className="workspace-icon-button absolute right-3 top-3" aria-label="Close navigation menu" onClick={close}>
            <X size={18} />
          </button>
          <div className="workspace-sidebar-brand"><Logo href="/dashboard" subtitle="Academy" /></div>
          <nav aria-label="Workspace navigation" className="workspace-navigation">
            {groups.map((group) => (
              <div className="workspace-nav-group" key={group.label}>
                <p className="workspace-nav-label">{group.label}</p>
                <ul>
                  {group.items.map(({ href }) => {
                    const item = itemFor(href);
                    const Icon = item.icon;
                    const active = isActive(pathname, href);
                    return (
                      <li key={href}>
                        <Link prefetch={false} href={href} onClick={close} aria-current={active ? "page" : undefined} className={`workspace-nav-link ${active ? "is-active" : ""}`}>
                          <Icon size={18} strokeWidth={1.8} />
                          <span>{item.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
          <div className="workspace-sidebar-footer">
            <div className="workspace-user">
              <Avatar id={avatar} size="sm" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold">{username}</span>
                <span className="mt-0.5 block text-[11px] text-muted">Level {level} · {connected ? "Signed in" : "Local mode"}</span>
              </span>
              <button type="button" className="workspace-icon-button" aria-label="Sign out" disabled={logoutPending} onClick={onLogout}>
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}
