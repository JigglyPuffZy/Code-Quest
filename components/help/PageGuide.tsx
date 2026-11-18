"use client";

import { ArrowLeft, ArrowRight, BookOpen, Check, Compass, MapPin, Play, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import type { PageManual } from "@/lib/help/pages";
import { storageKey } from "@/lib/storage-keys";

export function PageGuide({ manual, playerId, expanded, onToggle }: { manual: PageManual; playerId: string; expanded: boolean; onToggle: () => void }) {
  const id = useId();
  const dialog = useRef<HTMLDialogElement>(null);
  const highlighted = useRef<Element | null>(null);
  const timer = useRef<number | undefined>(undefined);
  const [index, setIndex] = useState(0);
  const [notice, setNotice] = useState("");
  const key = storageKey("manual", playerId, manual.id);
  const [read, setRead] = useState(() => { try { return window.localStorage.getItem(key) === "read"; } catch { return false; } });
  const current = manual.steps[index];
  useEffect(() => () => { highlighted.current?.removeAttribute("data-tour-highlight"); window.clearTimeout(timer.current); }, []);

  function markRead() {
    try { window.localStorage.setItem(key, "read"); setRead(true); setNotice("Guide marked as read on this device. You can reopen it anytime."); }
    catch { setNotice("You can keep using the guide. Your browser could not save the read status."); }
  }
  function showArea(target?: string) {
    const area = target ? Array.from(document.querySelectorAll(target)).find((element) => element.getClientRects().length > 0) : null;
    if (!area) { setNotice("This area appears after you open a mission or complete the previous step."); return; }
    dialog.current?.close();
    highlighted.current?.removeAttribute("data-tour-highlight");
    window.clearTimeout(timer.current);
    area.setAttribute("data-tour-highlight", "true"); highlighted.current = area;
    window.requestAnimationFrame(() => area.scrollIntoView({ block: "center", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" }));
    timer.current = window.setTimeout(() => area.removeAttribute("data-tour-highlight"), 3500);
    setNotice(`Highlighted: ${current.title}. Reopen the tutorial to continue.`);
  }
  return <section id="page-guide" className="workspace-page-guide" aria-label={`Guide for ${manual.title}`}>
    <div className="workspace-guide-summary">
      <span className="workspace-guide-icon" aria-hidden><Compass size={18} /></span>
      <div className="min-w-0 flex-1"><p className="workspace-eyebrow">Page guide {read ? <span className="ml-2 inline-flex items-center gap-1 normal-case tracking-normal text-muted"><Check size={11} /> Read</span> : null}</p><p className="mt-1 text-sm text-muted">{manual.summary}</p></div>
      <button type="button" className="workspace-button workspace-button-quiet" aria-expanded={expanded} aria-controls={`${id}-instructions`} onClick={onToggle}><BookOpen size={14} />{expanded ? "Hide guide" : "How to use"}</button>
      <button type="button" className="workspace-button" onClick={() => { setIndex(0); dialog.current?.showModal(); }}><Play size={13} />Start tutorial</button>
    </div>
    {expanded ? <div id={`${id}-instructions`} className="workspace-guide-body"><ol className="grid gap-4 md:grid-cols-3">{manual.steps.map((item, order) => <li key={item.title} className="text-sm"><span className="workspace-step-number">{String(order + 1).padStart(2, "0")}</span><h3 className="mt-3 font-semibold">{item.title}</h3><p className="mt-2 text-sm leading-6 text-muted">{item.body}</p></li>)}</ol><div className="mt-5 flex flex-wrap items-center gap-3 border-t border-line pt-4"><p className="min-w-0 flex-1 text-xs leading-5 text-muted"><strong className="text-ink">Tip: </strong>{manual.tip}</p><button type="button" className="workspace-button workspace-button-quiet" onClick={markRead}><Check size={14} />Got it</button><Link href="/help" className="workspace-text-link">Full user manual <ArrowRight size={13} /></Link></div></div> : null}
    <p role="status" className={notice ? "px-5 pb-3 text-xs text-primary" : "sr-only"}>{notice}</p>
    <dialog ref={dialog} className="workspace workspace-dialog workspace-tutorial-dialog" aria-labelledby={`${id}-title`}>
      <div className="flex items-center justify-between gap-4 border-b border-line p-5"><div><p className="workspace-eyebrow">Guided walkthrough</p><h2 id={`${id}-title`} className="mt-1 text-lg font-semibold">{manual.title}</h2></div><button type="button" className="workspace-icon-button" aria-label="Close tutorial" onClick={() => dialog.current?.close()}><X size={18} /></button></div>
      <div className="p-6"><p className="font-mono text-xs text-muted">STEP {index + 1} / {manual.steps.length}</p><div className="mt-3 flex gap-1.5" aria-hidden>{manual.steps.map((item, order) => <span key={item.title} className={`h-1 flex-1 rounded-full ${order <= index ? "bg-primary" : "bg-surface-3"}`} />)}</div><h3 className="mt-6 text-xl font-semibold">{current.title}</h3><p className="mt-3 text-sm leading-7 text-muted">{current.body}</p><button type="button" className="workspace-button mt-5" onClick={() => showArea(current.target)}><MapPin size={14} />Show this area</button></div>
      <div className="flex flex-wrap items-center gap-2 border-t border-line p-5"><button type="button" className="workspace-button" disabled={index === 0} onClick={() => setIndex(index - 1)}><ArrowLeft size={14} />Back</button><p className="flex-1 text-center text-xs text-muted">Escape closes the tutorial.</p>{index < manual.steps.length - 1 ? <button type="button" className="workspace-button workspace-button-primary" onClick={() => setIndex(index + 1)}>Next<ArrowRight size={14} /></button> : <button type="button" className="workspace-button workspace-button-primary" onClick={() => { markRead(); dialog.current?.close(); }}><Check size={14} />Finish</button>}</div>
    </dialog>
  </section>;
}
