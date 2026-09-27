"use client";

import { LessonCopy } from "@/components/code/CodeBlock";
import { usePlayer } from "@/components/player/PlayerProvider";
import { Button } from "@/components/ui/Button";
import { CodeWorkspace } from "@/components/workspace/CodeWorkspace";
import type { SkillDifficulty } from "@/lib/difficulty";
import { hintLimitLabel, hintsAllowedForDifficulty } from "@/lib/difficulty";
import { playerStack } from "@/lib/game/generator";
import type { ContentBlock, Exercise, LanguageId } from "@/lib/types";
import { Lightbulb, Lock } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";

export function ExerciseView({
  backHref,
  backLabel,
  eyebrow,
  title,
  meta,
  blocks,
  exercise,
  language,
  kind,
  exerciseId,
  alreadyCleared,
  locked,
  lockMessage,
  footer,
  hintDifficulty,
}: {
  backHref: string;
  backLabel: string;
  eyebrow: string;
  title: string;
  meta: string;
  blocks: ContentBlock[];
  exercise: Exercise;
  language: LanguageId;
  kind: "lesson" | "challenge" | "game";
  exerciseId: string;
  alreadyCleared: boolean;
  locked?: boolean;
  lockMessage?: string;
  footer?: ReactNode;
  hintDifficulty?: SkillDifficulty;
}) {
  const { player, completeLesson, completeChallenge, completeGameLevel } = usePlayer();
  const [hints, setHints] = useState(0);
  const maxHints = hintDifficulty
    ? Math.min(hintsAllowedForDifficulty(hintDifficulty), exercise.hints.length)
    : exercise.hints.length;

  useEffect(() => { setHints(0); }, [exerciseId]);

  if (locked) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
        <Lock className="size-10 text-primary" />
        <h2 className="mt-4 text-xl font-bold">Locked</h2>
        <p className="mt-2 max-w-sm text-sm text-muted">{lockMessage}</p>
        <Link href={backHref} className="mt-6 text-sm font-bold text-primary">← {backLabel}</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <Link href={backHref} className="text-xs font-bold text-primary">← {backLabel}</Link>
        <p className="tag mt-3">{eyebrow}</p>
        <h1 className="mt-2 text-2xl font-bold sm:text-3xl">{title}</h1>
        <p className="mt-1 text-xs text-muted">{meta}</p>
      </header>

      {/* Stacked on mobile, side-by-side on xl — lesson scrolls, editor sticky */}
      <div className="xl:grid xl:grid-cols-2 xl:items-start xl:gap-8">
        <div className="space-y-5 xl:max-h-[calc(100vh-12rem)] xl:overflow-y-auto xl:pr-2">
          <LessonCopy blocks={blocks} />
          <div className="hero-blob p-4">
            <p className="tag">Task</p>
            <p className="mt-2 text-sm leading-relaxed">{exercise.prompt}</p>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-muted">Hints</p>
              {maxHints > 0 ? (
                <Button
                  variant="ghost"
                  className="px-2 py-1 text-xs"
                  onClick={() => setHints((c) => Math.min(maxHints, c + 1))}
                  disabled={hints >= maxHints}
                >
                  <Lightbulb size={12} />
                  {hints >= maxHints ? "Done" : `+${hints + 1}`}
                </Button>
              ) : null}
            </div>
            {hints > 0 ? (
              <ol className="mt-2 space-y-1">
                {exercise.hints.slice(0, hints).map((h, i) => (
                  <li key={h} className="rounded-lg bg-white/80 px-3 py-2 text-sm text-muted">{i + 1}. {h}</li>
                ))}
              </ol>
            ) : hintDifficulty ? (
              <p className="mt-2 text-sm text-muted">{hintLimitLabel(hintDifficulty)}</p>
            ) : null}
          </div>
          {footer}
        </div>

        <div className="orbit-card sticky top-20 p-5">
          <CodeWorkspace
            key={exerciseId}
            language={language}
            starterCode={exercise.starterCode}
            kind={kind}
            exerciseId={exerciseId}
            alreadyCleared={alreadyCleared}
            onCleared={() => {
              if (kind === "lesson") return completeLesson(exerciseId);
              if (kind === "game") return completeGameLevel(exerciseId);
              return completeChallenge(exerciseId);
            }}
            skillDifficulty={kind === "game" ? player?.skillDifficulty : undefined}
            gameStack={kind === "game" && player ? playerStack(player) : undefined}
          />
        </div>
      </div>
    </div>
  );
}
