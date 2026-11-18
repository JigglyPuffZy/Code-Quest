"use client";
import { usePlayer } from "@/components/player/PlayerProvider";
import { labButton, labPanel, useLabProgress } from "@/components/lab/LabShell";
import { detectiveMissions, projectMissions } from "@/lib/lab/missions";
import Link from "next/link";

export function MissionCatalog({ project = false }: { project?: boolean }) {
  const { player } = usePlayer();
  const progress = useLabProgress(player!.id);
  const missions = project ? projectMissions : detectiveMissions;
  return <div className="space-y-5"><section className={labPanel}><h2 className="text-2xl font-bold">{project ? "One project. Three real milestones." : "Debug Detective"}</h2><p className="mt-3 text-sm leading-6 text-muted">{project ? "Start with task creation, add completion, then connect the pieces into a reducer. Each stage has executable tests, an explanation checkpoint, and code carried forward from your previous stage." : "These programs already run, but their behavior is broken. Investigate the report and examples, repair the implementation, then explain the cause."}</p></section>
    <div className="grid gap-4 md:grid-cols-2">{missions.map((mission, index) => {
      const done = Boolean(progress.evidence[mission.id]);
      const locked = project && index > 0 && !progress.evidence[missions[index - 1].id];
      return <article className={labPanel} key={mission.id}><p className="font-mono text-xs font-semibold text-primary">{project ? `STAGE ${index + 1}` : mission.topic.toUpperCase()} / {done ? "COMPLETED" : locked ? "LOCKED" : "READY"}</p><h3 className="mt-3 text-lg font-bold">{mission.title}</h3><p className="mt-3 text-sm leading-6 text-muted">{mission.symptom}</p>{locked ? <p className="mt-4 text-sm text-muted">Complete the previous milestone to unlock this stage.</p> : <Link href={`/lab/mission/${mission.id}`} className={`${labButton} mt-4`}>{done ? "Revisit mission" : "Open mission"}</Link>}</article>;
    })}</div>
  </div>;
}
