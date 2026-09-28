export type GradeProgressPhase = "prepare" | "visible" | "performance" | "finalize";

export type GradeProgress = {
  percent: number;
  label: string;
  phase: GradeProgressPhase;
  completedTests?: number;
  totalTests?: number;
};

export type GradeStreamEvent =
  | ({ type: "progress" } & GradeProgress)
  | { type: "result"; data: import("@/lib/types").GradeResponse }
  | { type: "error"; message: string };
