"use client";
import { usePlayer } from "@/components/player/PlayerProvider";
import { labPanel, useLabProgress } from "@/components/lab/LabShell";
import Link from "next/link";

const features = [
  ["detective", "01", "Debug Detective", "Follow the bug report, reproduce failures, fix the code, and explain why it works."],
  ["time-machine", "02", "Code Time Machine", "Rewind loops, inspect changing variables, and follow function calls in three supported programs."],
  ["boss", "03", "Adaptive boss battles", "Three rounds chosen from your weak concepts. Earn fewer hints as your practice improves."],
  ["projects", "04", "Project evolution", "Build one task tracker through three tested stages, carrying your code forward."],
  ["coop", "05", "Co-op coding quests", "Pair up in a private room. One learner drives, the other reviews, then swap roles."],
  ["portfolio", "06", "Your practice portfolio", "Choose which completed work to include in a shareable HTML page with source and test evidence."],
];
export function LabOverview() {
  const { player } = usePlayer();
  const progress = useLabProgress(player!.id);
  return <div className="space-y-6">
    <section className={`${labPanel} flex flex-wrap gap-8`} aria-label="Lab progress">
      <div><p className="text-3xl font-bold text-primary">{Object.keys(progress.evidence).length}</p><p className="text-sm text-muted">Missions explained</p></div>
      <div><p className="text-3xl font-bold text-primary">{progress.bossWins}</p><p className="text-sm text-muted">Boss battles completed</p></div>
      <p className="max-w-lg self-center text-sm leading-6 text-muted">Every lab mission ends with an explanation checkpoint: pass the tests, answer two concept questions, and describe your fix in your own words.</p>
    </section>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{features.map(([path, number, title, text]) => <Link href={`/lab/${path}`} key={path} className={`${labPanel} group transition hover:-translate-y-1 hover:border-primary motion-reduce:transform-none`}>
      <p className="font-mono text-xs font-bold text-primary">LAB {number}</p><h2 className="mt-3 text-lg font-bold group-hover:text-primary">{title}</h2><p className="mt-3 text-sm leading-6 text-muted">{text}</p><p className="mt-5 text-sm font-semibold text-primary">Open experience →</p>
    </Link>)}</div>
    <p className="text-xs leading-5 text-muted">Solo lab progress is saved for your player on this browser and included in learning backups. Co-op requires a signed-in account and the Developer Lab Supabase migration. Portfolio records describe practice results, not an independently verified certification.</p>
  </div>;
}
