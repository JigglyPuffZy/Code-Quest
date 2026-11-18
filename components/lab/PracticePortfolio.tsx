"use client";
import { usePlayer } from "@/components/player/PlayerProvider";
import { labButton, labInput, labPanel, useLabProgress } from "@/components/lab/LabShell";
import { getLabMission } from "@/lib/lab/missions";
import { buildPortfolioHtml, buildTaskDemo } from "@/lib/lab/portfolio";
import Link from "next/link";
import { useState } from "react";

export function PracticePortfolio() {
  const { player } = usePlayer();
  const progress = useLabProgress(player!.id);
  const entries = Object.values(progress.evidence).sort((a, b) => b.at.localeCompare(a.at));
  const [selected, setSelected] = useState<string[]>([]);
  const [title, setTitle] = useState(`${player!.username}'s developer lab`);
  const [includeCode, setIncludeCode] = useState(false);
  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState("");
  const finishedProject = progress.evidence["lab-project-reducer"];
  function build() {
    return buildPortfolioHtml({ author: player!.username, title: title.trim() || "My practice portfolio", entries: entries.filter((entry) => selected.includes(entry.missionId)), includeCode, exportedAt: new Date().toISOString() });
  }
  function download() {
    const url = URL.createObjectURL(new Blob([build()], { type: "text/html;charset=utf-8" }));
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = "devladder-practice-portfolio.html"; anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setMessage("Portfolio downloaded. You can share the HTML file or host it yourself. Nothing was published automatically.");
  }
  return <div className="space-y-5"><section className={labPanel}><h2 className="text-2xl font-bold">Show the work behind your progress.</h2><p className="mt-3 text-sm leading-6 text-muted">Choose completed lab missions and export a standalone portfolio page with your explanations and saved test results. Include source code to add a working task tracker demo after the final project stage. These are learner-managed practice records, not verified credentials.</p></section>
    {!entries.length ? <section className={labPanel}><p className="font-semibold">Your portfolio starts with your first explained fix.</p><Link href="/lab/detective" className={`${labButton} mt-4`}>Solve a detective mission</Link></section> : <section className={`${labPanel} space-y-4`}><label className="block text-sm font-semibold" htmlFor="portfolio-title">Portfolio title</label><input id="portfolio-title" maxLength={100} className={labInput} value={title} onChange={(event) => { setTitle(event.target.value); setPreview(""); }} /><fieldset><legend className="mb-3 text-sm font-semibold">Choose the work to include</legend><div className="space-y-3">{entries.map((entry) => <label key={entry.missionId} className="flex items-start gap-3 rounded-xl border border-line p-3 text-sm"><input type="checkbox" className="mt-1" checked={selected.includes(entry.missionId)} onChange={(event) => { setSelected((current) => event.target.checked ? [...current, entry.missionId] : current.filter((id) => id !== entry.missionId)); setPreview(""); }} /><span><strong>{getLabMission(entry.missionId)?.title}</strong><span className="mt-1 block text-xs text-muted">{entry.tests.filter((test) => test.passed).length}/{entry.tests.length} tests passed · Explanation checkpoint completed</span></span></label>)}</div></fieldset>
      <label className="flex items-start gap-3 text-sm"><input className="mt-1" type="checkbox" checked={includeCode} onChange={(event) => { setIncludeCode(event.target.checked); setPreview(""); }} />Include my source code and the runnable project demo, if selected. Review code and reflections for private information before sharing.</label>
      <div className="flex flex-wrap gap-2"><button type="button" className={labButton} disabled={!selected.length} onClick={() => setPreview(build())}>Preview selected work</button><button type="button" className={labButton} disabled={!selected.length} onClick={download}>Download shareable HTML page</button></div><p role="status" className="text-sm text-primary">{message}</p>
    </section>}
    {preview ? <section className={labPanel}><h3 className="mb-3 font-semibold">Portfolio preview</h3><iframe title="Selected portfolio preview" sandbox="allow-scripts" srcDoc={preview} className="h-[650px] w-full rounded-xl border border-line bg-white" /></section> : null}
    {finishedProject ? <section className={labPanel}><h3 className="text-xl font-bold">Play with your finished task tracker</h3><p className="mt-2 text-sm text-muted">This demo calls your saved taskReducer implementation in an isolated worker. It does not access your account or save tasks.</p><iframe title="Your task tracker implementation" sandbox="allow-scripts" srcDoc={buildTaskDemo(finishedProject.code)} className="mt-4 h-[420px] w-full rounded-xl border border-line bg-white" /></section> : null}
  </div>;
}
