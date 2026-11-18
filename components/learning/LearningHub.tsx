"use client";

import { readLabProgress } from "@/lib/lab/progress";
import { useLearningClock } from "@/lib/learning/client";
import { usePlayer } from "@/components/player/PlayerProvider";
import { exportGuideProgress } from "@/lib/guides/progress";
import { guideTopics, guidesForTopic } from "@/lib/guides";
import { exportLessonNotes } from "@/lib/learning/notes";
import { listPracticeMistakes, reviewDueTime } from "@/lib/learning/mistakes";
import { readLog } from "@/lib/learning/practice-log";
import { learningProjects } from "@/lib/learning/projects";
import { storageKey } from "@/lib/storage-keys";
import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { PageHero } from "@/components/ui/PageHero";
import { CalendarClock } from "lucide-react";

const events = ["storage", "devladder:guide-progress-updated", "devladder:practice-log-updated", "devladder:mistakes-updated"];
function subscribe(refresh: () => void) {
  events.forEach((event) => window.addEventListener(event, refresh));
  return () => events.forEach((event) => window.removeEventListener(event, refresh));
}
function snapshot() {
  try { return JSON.stringify(["guide-progress", "practice-log", "practice-mistakes"].map((key) => window.localStorage.getItem(storageKey(key)))); }
  catch { return "unavailable"; }
}
const card = "rounded-2xl border border-line bg-surface p-5 sm:p-6";
const button = "inline-flex items-center justify-center rounded-xl border border-line bg-surface-2 px-4 py-2 text-sm font-semibold hover:border-primary";

export function LearningHub() {
  const ready = useSyncExternalStore(subscribe, () => true, () => false);
  return ready ? <LearningContent /> : <p className="text-sm text-muted">Loading your learning progress...</p>;
}

function LearningContent() {
  const { player } = usePlayer();
  const now = useLearningClock();
  useSyncExternalStore(subscribe, snapshot, () => "");
  const [message, setMessage] = useState("");
  if (!player) return null;
  const progress = exportGuideProgress();
  const mistakes = listPracticeMistakes();
  const due = mistakes.filter((item) => reviewDueTime(item) <= now);
  const since = now - 7 * 86400000;
  const recent = readLog().filter((item) => Date.parse(item.at) >= since && Date.parse(item.at) <= now);
  const unique = new Set(recent.map((item) => `${item.topicId}:${item.slug}:${item.index}`));
  const topics = new Set(recent.map((item) => item.topicId));
  const completions = [...player.completedLessons, ...player.completedChallenges, ...player.completedGameLevels].filter((item) => Date.parse(item.at) >= since && Date.parse(item.at) <= now);
  const skills = guideTopics.map((topic) => {
    const guides = guidesForTopic(topic.id);
    const slugs = new Set(guides.map((guide) => guide.slug));
    const practiced = (progress.practiced[topic.id] ?? []).filter((slug) => slugs.has(slug)).length;
    const read = (progress.read[topic.id] ?? []).filter((slug) => slugs.has(slug)).length;
    const weak = due.filter((item) => item.topicId === topic.id).length;
    return { topic, total: guides.length, practiced, read, weak };
  }).filter((item) => item.total > 0);
  const next = due[0];

  function downloadBackup() {
    try {
      const drafts: Record<string, string> = {};
      for (let i = 0; i < window.sessionStorage.length; i++) {
        const key = window.sessionStorage.key(i);
        if (key?.startsWith(storageKey("draft") + ".")) drafts[key] = window.sessionStorage.getItem(key) ?? "";
      }
      const data = { format: "devladder-learning-backup", version: 1, exportedAt: new Date().toISOString(), player,
        guides: exportGuideProgress(), notes: exportLessonNotes(), reviews: listPracticeMistakes(), practiceLog: readLog(), drafts,
        developerLab: readLabProgress(player!.id),
        projects: JSON.parse(window.localStorage.getItem(storageKey("projects", player!.id)) ?? "{}") };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `devladder-backup-${new Date().toISOString().slice(0, 10)}.json`;
      anchor.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      setMessage("Backup downloaded. Keep it for your records; automatic restore is not available yet.");
    } catch { setMessage("Could not export the backup. Check that browser storage is available and try again."); }
  }

  return <div className="mx-auto max-w-5xl space-y-8">
    <PageHero icon={CalendarClock} eyebrow="Learning planner" title="Your next step," accent="planned." description="Review weak areas, track your practice, and turn lessons into projects." />
    <section className={card} aria-labelledby="weekly-heading">
      <h2 id="weekly-heading" className="text-xl font-bold">Your last seven days</h2>
      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">{[[unique.size, "Unique practice passes"], [topics.size, "Topics practiced"], [completions.length, "New completions"], [due.length, "Reviews due"]].map(([value, label]) => <div key={label}><p className="text-2xl font-bold text-primary">{value}</p><p className="text-xs text-muted">{label}</p></div>)}</div>
      <p className="mt-4 text-sm text-muted">{recent.length ? "Keep building on this week's practice." : "No practice passes recorded this week yet. Start with a short lesson."} Guide practice history reflects activity recorded on this browser.</p>
      <Link className={`${button} mt-4`} href={next ? `/guides/${next.topicId}/${next.slug}?question=${next.questionIndex}#practice` : "/guides"}>{next ? "Review your next missed question" : "Choose your next lesson"}</Link>
      <Link className="ml-4 inline-block py-2 text-sm font-semibold text-primary" href="/review">View review queue</Link>
    </section>
    <section aria-labelledby="skills-heading"><h2 id="skills-heading" className="text-xl font-bold">Skill practice map</h2><p className="mt-2 text-sm text-muted">Practice coverage shows lessons with at least one passed question. It is a progress signal, not a certification of mastery.</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{skills.map(({ topic, total, practiced, read, weak }) => <Link key={topic.id} href={`/guides/${topic.id}`} className={card}>
        <h3 className="font-bold">{topic.name}</h3><p className="mt-2 text-sm text-muted">{practiced}/{total} lessons practiced - {read} read</p><progress className="mt-3 h-2 w-full accent-violet-500" max={total} value={practiced} aria-label={`${topic.name} practice coverage`} /><p className="mt-2 text-xs text-primary">{weak ? `${weak} reviews need attention` : practiced === total ? "Keep practicing to retain it" : practiced ? "In progress" : "Ready to start"}</p>
      </Link>)}</div>
    </section>
    <Link href="/lab" className={`${card} block`}><h2 className="text-xl font-bold text-primary">Try the developer lab</h2><p className="mt-2 text-sm text-muted">Build a tested task tracker across three milestones, debug broken programs, and create a portfolio from your work.</p></Link>
    <section aria-labelledby="projects-heading"><h2 id="projects-heading" className="text-xl font-bold">Mini-project workshop</h2><p className="mt-2 text-sm text-muted">Build and test these in your own environment. Save code or notes here and check off requirements after testing. Checklists are self-assessed and do not award XP.</p><div className="mt-4 space-y-4">{learningProjects.map((project) => <ProjectCard key={`${player.id}:${project.id}`} playerId={player.id} project={project} />)}</div></section>
    <section className={card}><h2 className="text-xl font-bold">Keep a copy of your work</h2><p className="mt-2 text-sm text-muted">Download your profile progress, guide completions, notes, review schedule, practice history, editor drafts, and project work as JSON. This export contains your work and profile identifier; store it privately.</p><button className={`${button} mt-4`} type="button" onClick={downloadBackup}>Download learning backup</button><p role="status" className="mt-3 text-sm text-muted">{message}</p></section>
  </div>;
}

type Project = (typeof learningProjects)[number];
type ProjectWork = { code: string; checks: number[] };
function ProjectCard({ playerId, project }: { playerId: string; project: Project }) {
  const key = storageKey("projects", playerId);
  const [work, setWork] = useState<ProjectWork>(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(key) ?? "{}")[project.id];
      return { code: typeof saved?.code === "string" ? saved.code : project.starter, checks: Array.isArray(saved?.checks) ? saved.checks.filter((index: unknown) => Number.isInteger(index) && Number(index) >= 0 && Number(index) < project.checks.length) : [] };
    } catch { return { code: project.starter, checks: [] }; }
  });
  const [status, setStatus] = useState("");
  function save() {
    try {
      const store = JSON.parse(window.localStorage.getItem(key) ?? "{}");
      window.localStorage.setItem(key, JSON.stringify({ ...store, [project.id]: work }));
      setStatus("Saved on this device.");
    } catch { setStatus("Could not save. Copy your work somewhere safe and try again."); }
  }
  return <article className={card}>
    <h3 className="text-lg font-bold">{project.title}</h3><p className="mt-1 text-xs text-muted">{project.topic} - about {project.minutes} minutes</p><p className="mt-3 text-sm leading-relaxed">{project.brief}</p>
    <details className="mt-4"><summary className="cursor-pointer text-sm font-semibold text-primary">Open workspace and checklist</summary>
      <label className="mt-4 block text-sm font-semibold" htmlFor={`project-${project.id}`}>Your code or project notes</label><textarea id={`project-${project.id}`} spellCheck={false} value={work.code} onChange={(event) => { setWork({ ...work, code: event.target.value }); setStatus("Unsaved changes"); }} className="mt-2 min-h-48 w-full rounded-xl border border-line bg-surface-2 p-3 font-mono text-sm" />
      <fieldset className="mt-4 space-y-3"><legend className="mb-2 text-sm font-semibold">Acceptance checklist ({work.checks.length}/{project.checks.length})</legend>{project.checks.map((check, index) => <label key={check} className="flex items-start gap-3 text-sm"><input type="checkbox" checked={work.checks.includes(index)} onChange={(event) => { setWork({ ...work, checks: event.target.checked ? [...work.checks, index] : work.checks.filter((item) => item !== index) }); setStatus("Unsaved changes"); }} className="mt-1" />{check}</label>)}</fieldset>
      <div className="mt-4 flex flex-wrap items-center gap-3"><button type="button" className={button} onClick={save}>Save project work</button><Link href={`/guides/${project.topic}`} className="text-sm font-semibold text-primary">Study related guides</Link></div><p role="status" className="mt-3 text-sm text-muted">{status}</p>
    </details>
  </article>;
}
