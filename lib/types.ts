import type { SkillDifficulty } from "@/lib/difficulty";
import type {
  BackendFrameworkId,
  BackendLanguage,
  FrontendFrameworkId,
  FrontendLanguage,
  GameTrackId,
} from "@/lib/game/tracks";

export type LanguageId = "python" | "javascript" | "typescript" | "java";

export type ContentBlock =
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "code"; code: string; caption?: string };

export type FunctionCase = {
  args: unknown[];
  expected: unknown;
  label?: string;
};

export type TestSpec =
  | { type: "stdout"; expected: string; stdin?: string }
  | { type: "function"; functionName: string; cases: FunctionCase[] };

export type PerformanceSpec = {
  /** Shown in Arena UI, e.g. "O(n)" */
  expectedComplexity: string;
  /** Hidden large-input cases — checked after visible tests pass */
  cases: FunctionCase[];
  /** Max milliseconds per performance case inside the sandbox */
  maxMsPerCase?: number;
};

export type Exercise = {
  prompt: string;
  starterCode: string;
  hints: string[];
  tests: TestSpec;
  performance?: PerformanceSpec;
};

export type Lesson = {
  id: string;
  language: LanguageId;
  worldId: string;
  chapterId: string;
  title: string;
  summary: string;
  xp: number;
  minutes: number;
  blocks: ContentBlock[];
  exercise: Exercise;
};

export type Chapter = {
  id: string;
  worldId: string;
  title: string;
  summary: string;
};

export type World = {
  id: string;
  language: LanguageId;
  title: string;
  summary: string;
  icon: "spark" | "trees" | "castle" | "ship" | "tower" | "blocks";
};

export type LanguageInfo = {
  id: LanguageId;
  name: string;
  tagline: string;
  blurb: string;
  guideTopicId: string;
};

export type Challenge = {
  id: string;
  language: LanguageId;
  guideTopicId?: string;
  title: string;
  summary: string;
  difficulty: SkillDifficulty;
  xp: number;
  blocks: ContentBlock[];
  exercise: Exercise;
};

export type QuestMetric =
  | { type: "lessons"; count: number }
  | { type: "language"; language: LanguageId; count: number }
  | { type: "world" }
  | { type: "challenges"; count: number }
  | { type: "streak"; days: number }
  | { type: "both" }
  | { type: "allLanguages" }
  | { type: "guides"; count: number }
  | { type: "guideTopic"; topic: string; count: number }
  | { type: "lessonsToday"; count: number }
  | { type: "challengesToday"; count: number }
  | { type: "activeToday" }
  | { type: "dailyChallenge" }
  | { type: "languagesStarted"; count: number }
  | { type: "gameLevelsToday"; count: number };

export type QuestKind = "main" | "side";

export type Quest = {
  id: string;
  title: string;
  description: string;
  xp: number;
  metric: QuestMetric;
  kind?: QuestKind;
};

export type AchievementIcon =
  | "spark"
  | "book"
  | "sword"
  | "flame"
  | "crown"
  | "globe"
  | "scroll"
  | "star";

export type Achievement = {
  id: string;
  title: string;
  description: string;
  xp: number;
  icon: AchievementIcon;
};

export type TimestampedId = {
  id: string;
  at: string;
};

export type Player = {
  id: string;
  username: string;
  avatar: string;
  streak: number;
  bestStreak: number;
  lastActive: string | null;
  completedLessons: TimestampedId[];
  completedChallenges: TimestampedId[];
  completedGameLevels: TimestampedId[];
  claimedQuests: TimestampedId[];
  unlockedAchievements: TimestampedId[];
  lastLessonId: string | null;
  skillDifficulty: SkillDifficulty;
  gameTrack: GameTrackId;
  frontendFramework: FrontendFrameworkId;
  frontendLanguage: FrontendLanguage;
  backendFramework: BackendFrameworkId;
  backendLanguage: BackendLanguage;
  createdAt: string;
  updatedAt: string;
};

export type AvatarPreset = {
  id: string;
  label: string;
  seed: string;
  background: string;
};

export type LevelInfo = {
  level: number;
  title: string;
  into: number;
  needed: number;
};

export type GradeTest = {
  name: string;
  passed: boolean;
  expected: string;
  actual: string;
  /** performance = hidden large-input timing check */
  kind?: "visible" | "performance";
};

export type GradeResponse = {
  engine: "wandbox";
  passed: boolean;
  tests: GradeTest[];
  stderr: string;
};

export type RunResponse = {
  engine: "wandbox";
  stdout: string;
  stderr: string;
  exitCode: number | null;
};
