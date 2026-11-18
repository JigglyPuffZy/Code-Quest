import { storageKey } from "@/lib/storage-keys";
import { detectiveMissions, getLabMission, type LabMission, type LabTopic } from "@/lib/lab/missions";
import type { GradeTest } from "@/lib/types";

export type LabEvidence = { missionId: string; code: string; tests: GradeTest[]; reflection: string; answers: number[]; at: string };
export type LabProgress = { evidence: Record<string, LabEvidence>; attempts: Record<string, number>; bossWins: number; bossRun?: { ids: string[]; round: number } };
const empty = (): LabProgress => ({ evidence: {}, attempts: {}, bossWins: 0 });
const key = (playerId: string) => storageKey("lab", playerId, "v1");

export function readLabProgress(playerId: string): LabProgress {
  if (typeof window === "undefined") return empty();
  try {
    const parsed = JSON.parse(window.localStorage.getItem(key(playerId)) ?? "null");
    if (!parsed || typeof parsed !== "object") return empty();
    const evidence = Object.fromEntries(Object.entries(parsed.evidence ?? {}).filter(([id, value]) => {
      const item = value as Partial<LabEvidence> | null;
      return getLabMission(id) && item && item.missionId === id && typeof item.code === "string" && typeof item.reflection === "string" &&
        typeof item.at === "string" && Array.isArray(item.answers) && Array.isArray(item.tests) && item.tests.length > 0 &&
        item.tests.every((test) => test && test.passed === true && typeof test.name === "string" && typeof test.expected === "string" && typeof test.actual === "string");
    })) as Record<string, LabEvidence>;
    const run = parsed.bossRun;
    const bossRun = run && Array.isArray(run.ids) && run.ids.length === 3 && new Set(run.ids).size === 3 && run.ids.every((id: string) => detectiveMissions.some((item) => item.id === id)) && Number.isInteger(run.round) && run.round >= 0 && run.round <= 3 ? run : undefined;
    return { evidence, attempts: parsed.attempts && typeof parsed.attempts === "object" ? parsed.attempts : {}, bossWins: Number.isInteger(parsed.bossWins) && parsed.bossWins >= 0 ? parsed.bossWins : 0, bossRun };
  } catch { return empty(); }
}

export function writeLabProgress(playerId: string, progress: LabProgress) {
  window.localStorage.setItem(key(playerId), JSON.stringify(progress));
  window.dispatchEvent(new CustomEvent("devladder:lab-updated"));
}
export function recordLabAttempt(playerId: string, id: string) {
  const progress = readLabProgress(playerId);
  progress.attempts[id] = (Number(progress.attempts[id]) || 0) + 1;
  writeLabProgress(playerId, progress);
}
export function storeLabEvidence(playerId: string, evidence: LabEvidence) {
  const progress = readLabProgress(playerId);
  progress.evidence[evidence.missionId] = evidence;
  writeLabProgress(playerId, progress);
}

export function topicStrength(progress: LabProgress, topic: LabTopic) {
  return Object.values(progress.evidence).filter((item) => getLabMission(item.missionId)?.topic === topic).length;
}

/** Prioritize missed guide concepts and repeatedly failed, unfinished missions. */
export function planBoss(progress: LabProgress, weakSlugs: string[]): LabMission[] {
  const weight = (mission: LabMission) => {
    const matching = weakSlugs.filter((slug) => mission.topic === "loops" ? /loop|iteration/.test(slug) : mission.topic === "collections" ? /array|list|collection|dictionar/.test(slug) : /function|return|scope/.test(slug)).length;
    return matching * 5 + Math.min(5, Number(progress.attempts[mission.id]) || 0) - (progress.evidence[mission.id] ? 10 : 0) - topicStrength(progress, mission.topic);
  };
  return [...detectiveMissions].sort((a, b) => weight(b) - weight(a) || a.id.localeCompare(b.id)).slice(0, 3);
}
