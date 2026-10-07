"use client";

import { Avatar } from "@/components/player/Avatar";
import { usePlayer } from "@/components/player/PlayerProvider";
import { Button } from "@/components/ui/Button";
import { DuelQuitConfirmModal } from "@/components/duels/DuelQuitConfirmModal";
import { DuelReplayCard } from "@/components/duels/DuelReplayCard";
import { DuelRulesCard } from "@/components/duels/DuelRulesCard";
import { CodeEditor } from "@/components/workspace/CodeEditor";
import { VisibleTestCases } from "@/components/workspace/VisibleTestCases";
import { getChallenge } from "@/lib/curriculum/index";
import {
  advanceDemoRound,
  clearDemoDuel,
  forfeitDemoDuel,
  isDemoDuelId,
  readDemoDuel,
  writeDemoDuel,
  type DemoDuelState,
} from "@/lib/duels/demo";
import { fetchDuel, quitDuel, submitDuelCode, syncDuelRound } from "@/lib/duels/client";
import type { DuelSnapshot } from "@/lib/duels/types";
import { cn } from "@/lib/cn";
import { createClient } from "@/lib/supabase/client";
import type { GradeTest } from "@/lib/types";
import { Check, Crown, Loader2, LogOut, Swords, Timer, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

function Scoreboard({ duel }: { duel: DuelSnapshot }) {
  return (
    <div className="mt-4 flex items-center justify-center gap-4">
      <div className="rounded-xl border border-line bg-surface px-4 py-2 text-center shadow-sm">
        <p className="text-[10px] font-bold uppercase text-muted">{duel.challenger.username}</p>
        <p className="text-2xl font-extrabold tabular-nums text-primary">{duel.challengerScore}</p>
      </div>
      <p className="text-xs font-bold uppercase text-muted">First to {duel.targetWins}</p>
      <div className="rounded-xl border border-line bg-surface px-4 py-2 text-center shadow-sm">
        <p className="text-[10px] font-bold uppercase text-muted">{duel.opponent.username}</p>
        <p className="text-2xl font-extrabold tabular-nums text-primary">{duel.opponentScore}</p>
      </div>
    </div>
  );
}

function VsHeader({ duel }: { duel: DuelSnapshot }) {
  const you = duel.youAre === "challenger" ? duel.challenger : duel.opponent;
  const foe = duel.youAre === "challenger" ? duel.opponent : duel.challenger;
  const youWon = duel.winnerId === you.id;
  const foeWon = duel.winnerId === foe.id;

  return (
    <div className="overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-rose-50 via-surface to-violet-50 p-5 shadow-sm">
      <p className="text-center text-[10px] font-bold uppercase tracking-[0.28em] text-rose-500">
        Round {duel.currentRound} · Live duel
      </p>
      <div className="mt-4 flex items-center justify-center gap-4 sm:gap-8">
        <div className="flex flex-col items-center gap-2">
          <div className="relative">
            <Avatar id={you.avatar} size="lg" />
            {youWon ? (
              <span className="absolute -right-1 -top-1 grid size-6 place-items-center rounded-full bg-amber-400 text-white shadow">
                <Crown size={12} />
              </span>
            ) : null}
          </div>
          <p className="text-sm font-bold text-ink">{you.username}</p>
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase text-primary">You</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-rose-500 to-violet-500 text-white shadow-lg shadow-rose-500/30">
            <Swords size={22} />
          </span>
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted">VS</p>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="relative">
            <Avatar id={foe.avatar} size="lg" />
            {foeWon ? (
              <span className="absolute -right-1 -top-1 grid size-6 place-items-center rounded-full bg-amber-400 text-white shadow">
                <Crown size={12} />
              </span>
            ) : null}
          </div>
          <p className="text-sm font-bold text-ink">{foe.username}</p>
          <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[10px] font-bold uppercase text-muted">Rival</span>
        </div>
      </div>
      {duel.status !== "pending" ? <Scoreboard duel={duel} /> : null}
    </div>
  );
}

export function DuelArenaView({ duelId }: { duelId: string }) {
  const { player, supabaseEnabled } = usePlayer();
  const router = useRouter();
  const [duel, setDuel] = useState<DuelSnapshot | DemoDuelState | null>(null);
  const [demo, setDemo] = useState(false);
  const [code, setCode] = useState("");
  const [running, setRunning] = useState(false);
  const [error, setError] = useState("");
  const [runResults, setRunResults] = useState<GradeTest[] | null>(null);
  const [roundSecondsLeft, setRoundSecondsLeft] = useState(0);
  const [quitOpen, setQuitOpen] = useState(false);
  const [quitting, setQuitting] = useState(false);
  const lastRoundKey = useRef("");
  const challenge = useMemo(() => (duel ? getChallenge(duel.challengeId) : null), [duel]);

  function loadStarter(next: DuelSnapshot | DemoDuelState) {
    const record = getChallenge(next.challengeId);
    if (record) setCode(record.exercise.starterCode);
    setRunResults(null);
    setError("");
  }

  useEffect(() => {
    if (!player) return;
    if (isDemoDuelId(duelId)) {
      const state = readDemoDuel(duelId);
      if (state) {
        setDuel(state);
        setDemo(true);
        loadStarter(state);
      }
      return;
    }
    if (!supabaseEnabled) return;
    let cancelled = false;
    (async () => {
      try {
        const snapshot = await fetchDuel(duelId);
        if (cancelled) return;
        setDuel(snapshot);
        loadStarter(snapshot);
      } catch (loadError) {
        if (!cancelled) setError(loadError instanceof Error ? loadError.message : "Could not load duel.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [duelId, player, supabaseEnabled]);

  useEffect(() => {
    if (!duel) return;
    const key = `${duel.currentRound}:${duel.challengeId}`;
    if (lastRoundKey.current && lastRoundKey.current !== key) {
      loadStarter(duel);
    }
    lastRoundKey.current = key;
  }, [duel]);

  useEffect(() => {
    if (!duel || demo || !supabaseEnabled || duel.status === "completed") return;
    const timer = window.setInterval(() => {
      void syncDuelRound(duelId)
        .then(({ duel: next }) => setDuel(next))
        .catch(() => fetchDuel(duelId).then(setDuel).catch(() => {}));
    }, 3_000);
    return () => window.clearInterval(timer);
  }, [duel, demo, duelId, supabaseEnabled]);

  useEffect(() => {
    if (!duel || demo || !supabaseEnabled || !player) return;
    const supabase = createClient();
    const channel = supabase
      .channel(`duel-room-${duelId}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "duel_rooms", filter: `id=eq.${duelId}` },
        async () => {
          try {
            const snapshot = await fetchDuel(duelId);
            setDuel(snapshot);
          } catch {
            // ignore
          }
        },
      )
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [duel, demo, duelId, player, supabaseEnabled]);

  useEffect(() => {
    if (!duel?.roundEndsAt) return;
    const tick = () => {
      const left = Math.max(0, Math.floor((Date.parse(duel.roundEndsAt!) - Date.now()) / 1000));
      setRoundSecondsLeft(left);
      if (left === 0 && duel.status === "active" && !duel.roundWinnerId && !demo) {
        void syncDuelRound(duelId).then(({ duel: next }) => setDuel(next)).catch(() => {});
      }
      if (left === 0 && demo && duel.status === "active" && !duel.roundWinnerId) {
        const next = advanceDemoRound(duel as DemoDuelState, null);
        writeDemoDuel(next);
        setDuel(next);
      }
    };
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [duel, demo, duelId]);

  useEffect(() => {
    if (!demo || !duel || duel.status !== "active" || duel.winnerId || duel.roundWinnerId) return;
    const demoState = duel as DemoDuelState;
    const timer = window.setInterval(() => {
      if (Date.now() < demoState.cpuDeadlineMs) return;
      if (duel.roundWinnerId || duel.winnerId) return;
      const winnerId = demoState.cpuWins ? demoState.opponent.id : null;
      if (winnerId) {
        const next = advanceDemoRound(demoState, winnerId);
        writeDemoDuel(next);
        setDuel(next);
      } else {
        const next = advanceDemoRound(demoState, null);
        writeDemoDuel(next);
        setDuel(next);
      }
    }, 500);
    return () => window.clearInterval(timer);
  }, [demo, duel]);

  async function confirmQuit() {
    if (!duel || !player) return;
    setQuitting(true);
    setError("");
    try {
      if (demo) {
        const next = forfeitDemoDuel(duel as DemoDuelState, player.id);
        writeDemoDuel(next);
        setDuel(next);
        setQuitOpen(false);
        return;
      }
      const { duel: next } = await quitDuel(duel.id);
      setDuel(next);
      setQuitOpen(false);
      if (next.status === "cancelled") {
        router.push("/leaderboard");
      }
    } catch (quitError) {
      setError(quitError instanceof Error ? quitError.message : "Could not leave duel.");
    } finally {
      setQuitting(false);
    }
  }

  async function submit() {
    if (!duel || !challenge || duel.status !== "active" || duel.winnerId || duel.roundWinnerId) return;
    if (duel.roundEndsAt && Date.parse(duel.roundEndsAt) <= Date.now()) {
      setError("Round timer ended.");
      return;
    }
    setRunning(true);
    setError("");
    try {
      if (demo) {
        const { gradeCode } = await import("@/lib/execute/client");
        const grade = await gradeCode("challenge", duel.challengeId, code, duel.skillDifficulty);
        setRunResults(grade.tests);
        const passed = grade.passed;
        const demoState = duel as DemoDuelState;
        const now = new Date().toISOString();
        if (passed) {
          const next = advanceDemoRound(
            { ...demoState, challengerPassed: true, challengerSubmittedAt: now },
            player!.id,
          );
          writeDemoDuel(next);
          setDuel(next);
        } else {
          const next = { ...demoState, challengerPassed: false, challengerSubmittedAt: now };
          writeDemoDuel(next);
          setDuel(next);
          setError("Wrong answer — fix your code and submit again before the timer or rival wins!");
        }
        return;
      }
      const result = await submitDuelCode(duel.id, code);
      setDuel(result.duel);
      if (result.roundWon && !result.won) {
        setError("");
      } else if (!result.passed) {
        setError("Wrong answer — server checked your code. Try again before time runs out!");
      }
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Submit failed.");
    } finally {
      setRunning(false);
    }
  }

  if (!player) return null;
  if (!duel) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        {error ? <p className="text-danger">{error}</p> : <Loader2 className="animate-spin text-primary" />}
      </div>
    );
  }

  if (!challenge) {
    return <p className="text-danger">Duel question missing.</p>;
  }

  const you = duel.youAre === "challenger" ? duel.challenger : duel.opponent;
  const foe = duel.youAre === "challenger" ? duel.opponent : duel.challenger;
  const youWon = duel.winnerId === you.id;
  const waiting = duel.status === "pending";
  const active = duel.status === "active";
  const done = duel.status === "completed";
  const cancelled = duel.status === "cancelled";
  const canQuit = active || (waiting && duel.youAre === "challenger");
  const quitMode = waiting ? "cancel" : "forfeit";
  const rules = {
    targetWins: duel.targetWins,
    roundTimerSec: duel.roundTimerSec as 60 | 120 | 180 | 300,
    skillDifficulty: duel.skillDifficulty,
  };

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <VsHeader duel={duel} />
        </div>
        {canQuit ? (
          <Button
            type="button"
            variant="ghost"
            className="shrink-0 border-rose-200 text-danger hover:border-rose-300 hover:bg-rose-50"
            onClick={() => setQuitOpen(true)}
          >
            <LogOut size={15} />
            {waiting ? "Cancel" : "Quit"}
          </Button>
        ) : null}
      </div>
      <DuelRulesCard rules={rules} hostName={duel.challenger.username} />

      <DuelQuitConfirmModal
        open={quitOpen}
        busy={quitting}
        mode={quitMode}
        rivalName={foe.username}
        onClose={() => {
          if (!quitting) setQuitOpen(false);
        }}
        onConfirm={() => void confirmQuit()}
      />

      {cancelled ? (
        <div className="rounded-2xl border border-line bg-surface-2 px-5 py-5 text-center">
          <p className="text-lg font-bold text-ink">Duel cancelled</p>
          <p className="mt-2 text-sm text-muted">This invite was withdrawn before the match started.</p>
          <Link
            href="/leaderboard"
            className="mt-4 inline-flex rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground"
          >
            Back to leaderboard
          </Link>
        </div>
      ) : null}

      {waiting ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-950">
          Waiting for <strong>{foe.username}</strong> to accept your rules…
        </div>
      ) : null}

      {active ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-surface px-4 py-3">
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-ink">
            <Timer size={16} className={roundSecondsLeft <= 10 ? "text-danger" : "text-primary"} />
            {roundSecondsLeft > 0 ? `${roundSecondsLeft}s left this round` : "Round over — next question loading…"}
          </p>
          <p className="text-xs text-muted">
            First correct submit wins the round · Server grades on every submit
          </p>
        </div>
      ) : null}

      {done ? (
        <div className="space-y-3">
          <div
            className={cn(
              "rounded-2xl border px-5 py-5 text-center",
              youWon ? "border-emerald-200 bg-emerald-50" : "border-rose-200 bg-rose-50",
            )}
          >
            <p className={cn("text-xl font-extrabold", youWon ? "text-ok" : "text-danger")}>
              {youWon ? "You won the series!" : `${foe.username} won the series`}
            </p>
          </div>
          <DuelReplayCard duel={duel} />
          {demo ? (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => clearDemoDuel()}
                className="rounded-xl border border-line px-4 py-2 text-sm font-semibold"
              >
                Clear practice
              </button>
            </div>
          ) : null}
        </div>
      ) : null}

      {!waiting && !done && !cancelled ? (
        <div className="grid gap-5 xl:grid-cols-2">
          <div className="space-y-4">
            <article className="rounded-2xl border border-rose-200 bg-gradient-to-br from-rose-50/80 via-surface to-surface p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-rose-500">Random duel question</p>
              <p className="mt-3 text-base font-semibold leading-relaxed text-ink">{challenge.exercise.prompt}</p>
              <p className="mt-2 text-xs text-muted">
                {challenge.title} · {challenge.language} · {duel.skillDifficulty} difficulty
              </p>
            </article>
            <VisibleTestCases exercise={challenge.exercise} results={runResults} running={running} />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <p className="tag font-mono">{challenge.language}</p>
              {active && !duel.winnerId ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-cyan-50 px-2.5 py-1 text-[10px] font-bold uppercase text-cyan-700">
                  <span className="size-1.5 animate-pulse rounded-full bg-cyan-500" />
                  Race live
                </span>
              ) : null}
            </div>
            <CodeEditor code={code} language={challenge.language} onChange={setCode} onSubmit={() => void submit()} />
            <Button
              variant="primary"
              className="w-full shadow-lg shadow-primary/25"
              disabled={running || !active || Boolean(duel.winnerId) || Boolean(duel.roundWinnerId) || roundSecondsLeft === 0}
              onClick={() => void submit()}
            >
              {running ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Server checking…
                </>
              ) : (
                <>
                  <Swords size={16} />
                  Submit answer
                </>
              )}
            </Button>
            {error ? <p className="text-sm text-danger">{error}</p> : null}
            {runResults ? (
              <p className={cn("text-sm font-semibold", runResults.every((t) => t.passed) ? "text-ok" : "text-danger")}>
                {runResults.every((t) => t.passed) ? (
                  <span className="inline-flex items-center gap-1"><Check size={14} /> All visible tests passed</span>
                ) : (
                  <span className="inline-flex items-center gap-1"><X size={14} /> Tests failed — keep trying</span>
                )}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
