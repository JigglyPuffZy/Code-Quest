"use client";
import { NAV_ITEMS } from "@/components/shell/nav";
import { ArrowUpRight, Command, Search, X } from "lucide-react";
import Link from "next/link";
import { useDeferredValue, useEffect, useId, useRef, useState } from "react";

export function WorkspaceSearch() {
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const search = useDeferredValue(query).trim().toLowerCase();
  const id = useId();
  const matches = NAV_ITEMS.filter((item) => `${item.label} ${item.href}`.toLowerCase().includes(search));
  function open() {
    if (dialog.current?.open) return;
    setQuery(""); dialog.current?.showModal(); input.current?.focus();
  }
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k" && !event.isComposing && !document.querySelector("dialog[open]")) { event.preventDefault(); setQuery(""); dialog.current?.showModal(); input.current?.focus(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return <><button type="button" className="workspace-search-trigger" onClick={open} aria-label="Find a workspace page"><Search size={16} /><span className="hidden sm:inline">Jump to a page…</span><kbd className="hidden items-center gap-0.5 sm:inline-flex"><Command size={10} />K</kbd></button><dialog ref={dialog} className="workspace workspace-dialog workspace-search-dialog" aria-labelledby={id}><div className="flex items-center justify-between border-b border-line p-5"><h2 id={id} className="text-sm font-semibold">Jump to a page</h2><button type="button" className="workspace-icon-button" aria-label="Close page search" onClick={() => dialog.current?.close()}><X size={17} /></button></div><div className="p-4"><label htmlFor={`${id}-query`} className="sr-only">Search workspace pages</label><input ref={input} id={`${id}-query`} type="search" placeholder="Search guides, lab, review, profile…" value={query} onChange={(event) => setQuery(event.target.value)} className="workspace-input" /><div className="mt-3 max-h-[50dvh] overflow-y-auto"><ul>{matches.map((item) => <li key={item.href}><Link href={item.href} prefetch={false} onClick={() => dialog.current?.close()} className="workspace-search-result"><item.icon size={17} /><span>{item.label}</span><ArrowUpRight size={14} className="ml-auto text-muted" /></Link></li>)}</ul>{!matches.length ? <p role="status" className="px-3 py-8 text-center text-sm text-muted">No matching page. Try another name.</p> : null}</div></div><p className="border-t border-line px-5 py-3 text-xs text-muted">Tab to a result, Enter to open, Escape to close.</p></dialog></>;
}
