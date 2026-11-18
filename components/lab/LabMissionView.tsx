"use client";

import { usePlayer } from "@/components/player/PlayerProvider";
import { CodeWorkspace } from "@/components/workspace/CodeWorkspace";
import { VisibleTestCases } from "@/components/workspace/VisibleTestCases";
import { labButton, labInput, labPanel, useLabProgress } from "@/components/lab/LabShell";
import { explanationPasses, projectMissions, type LabMission } from "@/lib/lab/missions";
import { recordLabAttempt, storeLabEvidence, topicStrength } from "@/lib/lab/progress";
import type { GradeResponse, GradeTest } from "@/lib/types";
import Link from "next/link";
import { useState } from "react";

export function LabMissionView({ mission, onCompleted, hintBudget }: { mission: LabMission; onCompleted?: () => void; hintBudget?: number }) {
  const { player } = usePlayer();
  const progress = useLabProgress(player!.id);
  const stage = projectMissions.findIndex((item) => item.id === mission.id);
  const prior = stage > 0 ? progress.evidence[projectMissions[stage - 1].id] : undefined;
  if (stage > 0 && !prior) return <section className={labPanel}><h2 className="text-xl font-bold">Finish the previous stage first</h2><p className="mt-3 text-sm text-muted">Your tested implementation carries forward into this stage.</p><Link href={`/lab/mission/${projectMissions[stage - 1].id}`} className={`${labButton} mt-4`}>Open previous stage</Link></section>;
  const starter = prior ? `${prior.code}\n\n${mission.exercise.starterCode}` : mission.exercise.starterCode;
  const hints = hintBudget ?? Math.max(0, 3 - topicStrength(progress, mission.topic));
  return <MissionSession key={mission.id} mission={mission} starter={starter} hintBudget={hints} onCompleted={onCompleted} />;
}

function MissionSession({ mission, starter, hintBudget, onCompleted }: { mission: LabMission; starter: string; hintBudget: number; onCompleted?: () => void }) {
  const { player, completeChallenge } = usePlayer();
  const progress = useLabProgress(player!.id);
  const [revealed, setRevealed] = useState(0);
  const [runResults, setRunResults] = useState<GradeTest[] | null>(null);
  const [running, setRunning] = useState(false);
  const [pending, setPending] = useState<{ result: GradeResponse; code: string } | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [reflection, setReflection] = useState("");
  const [message, setMessage] = useState("");
  const [checked, setChecked] = useState(false);
  const maxHints = Math.min(hintBudget, mission.exercise.hints.length);
  const completed = Boolean(progress.evidence[mission.id]);

  function finish() {
    setChecked(true);
    if (!pending || !explanationPasses(mission, answers, reflection)) {
      setMessage("Pass the full tests, answer both concept questions correctly, and write at least 30 characters about your fix.");
      return;
    }
    try {
      storeLabEvidence(player!.id, { missionId: mission.id, code: pending.code, tests: pending.result.tests, reflection: reflection.trim(), answers, at: new Date().toISOString() });
      const reward = completeChallenge(mission.id);
      setPending(null);
      setMessage(reward.awarded ? `Mission completed! +${reward.xp} XP. Your code and explanation are in your portfolio.` : "Practice record updated. First-clear XP was already awarded.");
      onCompleted?.();
    } catch { setMessage("Could not save your work. Check browser storage and try again; your code is still in the editor."); }
  }

  return <div className="space-y-5">
    <section className={labPanel}><p className="text-xs font-bold uppercase tracking-widest text-primary">{mission.mode === "detective" ? "Bug report" : "Project milestone"} / {mission.topic}</p><h2 className="mt-2 text-2xl font-bold">{mission.title}</h2><p className="mt-3 text-sm leading-6 text-muted">{mission.symptom}</p><p className="mt-4 text-sm leading-6">{mission.exercise.prompt}</p><p className="mt-4 text-xs font-semibold text-primary">{completed ? "Previously completed — practice again or improve your explanation." : `First clear: ${mission.xp} XP after tests and explanation.`}</p></section>
    <section className={labPanel}><h3 className="font-semibold">Investigation hints</h3><p className="mt-2 text-sm text-muted">{maxHints ? `${maxHints} hints available. As you complete missions on this concept, you rely on fewer hints.` : "Challenge mode: no hints left for this concept. Trace the inputs and inspect the failed tests."}</p><ol className="mt-3 list-decimal space-y-2 pl-5 text-sm" aria-live="polite">{mission.exercise.hints.slice(0, revealed).map((hint) => <li key={hint}>{hint}</li>)}</ol><button type="button" className={`${labButton} mt-4`} disabled={revealed >= maxHints} onClick={() => setRevealed(revealed + 1)}>Reveal hint ({revealed}/{maxHints})</button><Link className="ml-4 text-sm font-semibold text-primary" href="/lab/time-machine">Inspect an execution example</Link></section>
    <VisibleTestCases exercise={mission.exercise} results={runResults} running={running} completionNote="Run tests previews the examples. Submit, then complete the explanation checkpoint to save lab progress and earn first-clear XP." />
    <section className={labPanel} aria-label="Mission editor"><CodeWorkspace language="javascript" starterCode={starter} kind="challenge" exerciseId={mission.id} draftNamespace={player!.id} alreadyCleared={completed} tests={mission.exercise.tests}
      passedMessage="Tests passed. Complete the explanation checkpoint below."
      onCleared={() => ({ awarded: false, xp: 0 })}
      onSourceChange={() => { setPending(null); setChecked(false); setMessage(""); }}
      onRunStateChange={({ running, results }) => { setRunning(running); setRunResults(results); }}
      onGradeResult={(result, mode, source) => {
        if (mode !== "grade") return;
        if (result.passed) { setPending({ result, code: source }); setAnswers([]); setChecked(false); setMessage("Tests passed. Explain your fix to finish this mission."); }
        else { setPending(null); try { recordLabAttempt(player!.id, mission.id); } catch { setMessage("Your attempt could not be saved on this device."); } }
      }} /></section>
    {pending ? <section className={labPanel} aria-labelledby="explanation-heading" data-tour="explanation"><p className="text-xs font-bold uppercase tracking-widest text-primary">Explain your code</p><h3 id="explanation-heading" className="mt-2 text-xl font-bold">Passing tests is the first checkpoint.</h3><p className="mt-2 text-sm text-muted">Answer the concept checks, then explain the fix. The written reflection is saved for review; it is not automatically judged for semantic correctness.</p>
      <div className="mt-5 space-y-5">{mission.checks.map((check, index) => <fieldset key={check.question}><legend className="mb-2 text-sm font-semibold">{index + 1}. {check.question}</legend><div className="space-y-2">{check.options.map((option, optionIndex) => <label key={option} className="flex items-start gap-3 rounded-xl border border-line p-3 text-sm"><input className="mt-1" type="radio" name={`${mission.id}-concept-${index}`} checked={answers[index] === optionIndex} onChange={() => { setAnswers((current) => { const next = [...current]; next[index] = optionIndex; return next; }); setChecked(false); }} />{option}</label>)}</div>{checked && answers[index] !== check.correct ? <p className="mt-2 text-sm text-danger">{check.explanation} Try this question again.</p> : null}</fieldset>)}</div>
      <label htmlFor="lab-reflection" className="mt-5 block text-sm font-semibold">What caused the problem, what changed, and which edge case did you test?</label><textarea id="lab-reflection" maxLength={2000} minLength={30} rows={4} value={reflection} onChange={(event) => setReflection(event.target.value)} className={`${labInput} mt-2`} /><p className="mt-1 text-xs text-muted">{reflection.trim().length}/2000 characters (minimum 30)</p><button type="button" onClick={finish} className={`${labButton} mt-4`}>Complete checkpoint</button>
    </section> : null}
    <p role="status" className="text-sm font-medium text-primary">{message}</p>
    <Link href="/lab/portfolio" className={labButton}>View practice portfolio</Link>
  </div>;
}
