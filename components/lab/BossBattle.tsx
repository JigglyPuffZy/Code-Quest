"use client";
import { usePlayer } from "@/components/player/PlayerProvider";
import { LabMissionView } from "@/components/lab/LabMissionView";
import { labButton, labPanel, useLabProgress } from "@/components/lab/LabShell";
import { getLabMission } from "@/lib/lab/missions";
import { planBoss, readLabProgress, topicStrength, writeLabProgress } from "@/lib/lab/progress";
import { listPracticeMistakes } from "@/lib/learning/mistakes";
import { useState } from "react";

export function BossBattle() {
  const { player } = usePlayer();
  const progress = useLabProgress(player!.id);
  const [error, setError] = useState("");
  const run = progress.bossRun;
  const mission = run && run.round < 3 ? getLabMission(run.ids[run.round]) : undefined;
  function start() {
    try {
      const current = readLabProgress(player!.id);
      const plan = planBoss(current, listPracticeMistakes().map((item) => item.slug));
      writeLabProgress(player!.id, { ...current, bossRun: { ids: plan.map((item) => item.id), round: 0 } });
      setError("");
    } catch { setError("Could not save a battle on this device. Check browser storage and try again."); }
  }
  function finishRound() {
    try {
      const current = readLabProgress(player!.id);
      const active = current.bossRun;
      if (!active || active.round >= 3 || active.ids[active.round] !== mission?.id) return;
      const round = active.round + 1;
      writeLabProgress(player!.id, { ...current, bossRun: { ...active, round }, bossWins: current.bossWins + (round === 3 ? 1 : 0) });
    } catch { setError("Your mission was saved, but the battle could not advance. Retry after browser storage is available."); }
  }
  return <div className="space-y-5"><section className={labPanel}><p className="text-xs font-bold uppercase tracking-widest text-primary">Adaptive boss battle</p><h2 className="mt-2 text-2xl font-bold">Face the concepts that need practice.</h2><p className="mt-3 text-sm leading-6 text-muted">Three debugging rounds are ranked using missed guide topics, failed lab attempts, and completed missions. The roster is fixed when a battle starts. Concept mastery reduces available hints; first-clear XP is awarded only once per mission.</p>
    {run ? <div className="mt-4 flex flex-wrap gap-2">{run.ids.map((id, index) => <span key={id} className={`rounded-full border px-3 py-1.5 text-xs ${index < run.round ? "border-emerald-500 text-ok" : "border-line text-muted"}`}>{index < run.round ? "✓ " : ""}Round {index + 1}: {getLabMission(id)?.topic}</span>)}</div> : null}
    {!run || run.round === 3 ? <div className="mt-5">{run?.round === 3 ? <p className="mb-3 font-semibold text-ok">Boss defeated! All three fixes passed their explanation checkpoints.</p> : null}<button type="button" className={labButton} onClick={start}>{run ? "Start another battle" : "Build my boss battle"}</button></div> : <p className="mt-4 text-sm font-semibold text-primary">Round {run.round + 1} of 3 · {Math.round(run.round / 3 * 100)}% complete</p>}
    <p role="alert" className="mt-3 text-sm text-danger">{error}</p>
  </section>{mission ? <LabMissionView key={`${mission.id}:${run!.round}`} mission={mission} onCompleted={finishRound} hintBudget={Math.max(0, 2 - topicStrength(progress, mission.topic))} /> : null}</div>;
}
