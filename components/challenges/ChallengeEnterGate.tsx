"use client";

import { TechLogoBadge } from "@/components/icons/TechLogo";
import { usePlayer } from "@/components/player/PlayerProvider";
import { DifficultyPicker } from "@/components/ui/DifficultyPicker";
import { languageInfo } from "@/lib/curriculum/index";
import type { SkillDifficulty } from "@/lib/difficulty";
import type { Challenge } from "@/lib/types";
import { ArrowLeft, Lock, Play, Swords, Zap } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function ChallengeEnterGate({
  challenge,
  locked,
  lockMessage,
  onStart,
}: {
  challenge: Challenge;
  locked?: boolean;
  lockMessage?: string;
  onStart: (difficulty: SkillDifficulty) => void;
}) {
  const { player } = usePlayer();
  const [difficulty, setDifficulty] = useState<SkillDifficulty>(player?.skillDifficulty ?? "mid");

  if (locked) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center rounded-2xl border border-line bg-gradient-to-b from-surface-2 to-white p-6 text-center sm:min-h-[55vh] sm:p-8">
        <div className="grid size-16 place-items-center rounded-2xl bg-slate-900 text-white shadow-lg">
          <Lock size={28} />
        </div>
        <h2 className="mt-5 text-2xl font-bold">Battle locked</h2>
        <p className="mt-2 max-w-md text-sm text-muted">{lockMessage}</p>
        <Link
          href="/challenges"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground"
        >
          <ArrowLeft size={15} />
          Back to Arena
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-2 sm:space-y-6 sm:pb-0">
      <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-primary-950 p-4 text-white sm:p-8">
        <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-primary/25 blur-3xl" aria-hidden />

        <Link
          href="/challenges"
          className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/90 transition hover:bg-white/15"
        >
          <ArrowLeft size={13} />
          Arena list
        </Link>

        <div className="relative mt-5 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">
              <Swords size={12} />
              Enter battle
            </p>
            <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-4xl">{challenge.title}</h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/75">{challenge.summary}</p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <TechLogoBadge
                topicId={challenge.language}
                name={languageInfo(challenge.language).name}
                size={18}
                soft="bg-white/10"
                ring="ring-white/15"
              />
              <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[10px] font-bold text-primary-200">
                <Zap size={10} />
                +{challenge.xp} XP
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-line bg-gradient-to-br from-white via-surface-2/40 to-primary-50/30 p-4 sm:p-6">
        <h2 className="text-base font-bold sm:text-lg">Choose difficulty</h2>
        <p className="mt-1 text-sm leading-relaxed text-muted">
          Beginner unlocks hints and guide links. Mid-level through Senior is guide-free — no hints, no cheat sheets.
        </p>
        <div className="mt-4 sm:mt-5">
          <DifficultyPicker value={difficulty} onChange={setDifficulty} />
        </div>
        <button
          type="button"
          onClick={() => onStart(difficulty)}
          className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground shadow-md shadow-primary/20 transition hover:bg-primary-hover sm:mt-6 sm:min-h-0 sm:w-auto"
        >
          <Play size={16} fill="currentColor" />
          Start coding
        </button>
      </section>
    </div>
  );
}
