import type { SkillDifficulty } from "@/lib/difficulty";
import type { GameModeId } from "@/lib/game/types";
import type { FrontendFrameworkId, FrontendLanguage } from "@/lib/game/tracks";
import { FRONTEND_FRAMEWORKS } from "@/lib/game/tracks";
import type { Exercise } from "@/lib/types";
import { jsFn, scale } from "@/lib/game/banks/shared";

function fw(framework: FrontendFrameworkId) {
  return FRONTEND_FRAMEWORKS[framework].label;
}

function typed(language: FrontendLanguage) {
  return language === "typescript";
}

function componentTitle(
  framework: FrontendFrameworkId,
  difficulty: SkillDifficulty,
  level: number,
  task: string,
) {
  return `[${fw(framework)} · ${difficulty} L${level}] ${task}`;
}

function byteBlitz(
  framework: FrontendFrameworkId,
  language: FrontendLanguage,
  difficulty: SkillDifficulty,
  level: number,
): Exercise {
  const s = scale(level);
  const t = typed(language);
  if (difficulty === "beginner") {
    return jsFn(
      "renderLabel",
      "label",
      componentTitle(framework, difficulty, level, "renderLabel(label) returns the label with '!' appended."),
      ["Template literal or concatenation.", "Return label + '!'."],
      [
        { args: ["Quest"], expected: "Quest!", label: "Quest" },
        { args: ["Go"], expected: "Go!", label: "Go" },
      ],
      t,
    );
  }
  if (difficulty === "mid") {
    return jsFn(
      "badgeCount",
      "count",
      componentTitle(framework, difficulty, level, "badgeCount(count) returns `x${count}`."),
      ["Use a template string.", "Prefix with x."],
      [
        { args: [s.a], expected: `x${s.a}`, label: "main" },
        { args: [0], expected: "x0", label: "zero" },
      ],
      t,
    );
  }
  if (difficulty === "expert") {
    return jsFn(
      "truncate",
      "text, max",
      componentTitle(framework, difficulty, level, "truncate(text, max) returns text sliced to max chars with '…' if longer."),
      ["Compare length to max.", "Slice and add ellipsis when needed."],
      [
        { args: ["CodeQuest", 4], expected: "Code…", label: "long" },
        { args: ["Hi", 5], expected: "Hi", label: "short" },
      ],
      t,
    );
  }
  return jsFn(
    "titleCase",
    "text",
    componentTitle(framework, difficulty, level, "titleCase(text) capitalizes the first letter of each word."),
    ["Split on spaces.", "Uppercase first char of each piece."],
    [
      { args: ["code quest"], expected: "Code Quest", label: "two words" },
      { args: ["a"], expected: "A", label: "single" },
    ],
    t,
  );
}

function functionForge(
  framework: FrontendFrameworkId,
  language: FrontendLanguage,
  difficulty: SkillDifficulty,
  level: number,
): Exercise {
  const s = scale(level);
  const t = typed(language);
  if (difficulty === "beginner") {
    return jsFn(
      "doubleXp",
      "xp",
      componentTitle(framework, difficulty, level, "doubleXp(xp) doubles quest XP for a reward popup."),
      ["Return xp * 2."],
      [{ args: [s.a], expected: s.a * 2, label: "main" }],
      t,
    );
  }
  if (difficulty === "mid") {
    return jsFn(
      "mergeProps",
      "a, b",
      componentTitle(framework, difficulty, level, "mergeProps(a,b) returns `${a}-${b}` for a display tag."),
      ["Template string with dash."],
      [{ args: ["hero", "nova"], expected: "hero-nova", label: "main" }],
      t,
    );
  }
  if (difficulty === "expert") {
    return jsFn(
      "clampPercent",
      "value",
      componentTitle(framework, difficulty, level, "clampPercent(value) keeps a progress bar between 0 and 100."),
      ["If below 0 return 0.", "If above 100 return 100."],
      [
        { args: [120], expected: 100, label: "high" },
        { args: [-5], expected: 0, label: "low" },
        { args: [42], expected: 42, label: "mid" },
      ],
      t,
    );
  }
  return jsFn(
    "scoreTier",
    "score",
    componentTitle(framework, difficulty, level, "scoreTier(score) returns S/A/B/C/F using 90/80/70/60 cutoffs."),
    ["Check from highest band down."],
    [
      { args: [90], expected: "S", label: "90" },
      { args: [80], expected: "A", label: "80" },
      { args: [59], expected: "F", label: "59" },
    ],
    t,
  );
}

function stringSurge(
  framework: FrontendFrameworkId,
  language: FrontendLanguage,
  difficulty: SkillDifficulty,
  level: number,
): Exercise {
  const s = scale(level);
  const t = typed(language);
  if (difficulty === "beginner") {
    return jsFn(
      "buttonText",
      "action",
      componentTitle(framework, difficulty, level, "buttonText(action) returns action uppercased for a CTA."),
      ["toUpperCase() on the string."],
      [{ args: [s.word], expected: s.word.toUpperCase(), label: s.word }],
      t,
    );
  }
  if (difficulty === "mid") {
    return jsFn(
      "initials",
      "name",
      componentTitle(framework, difficulty, level, "initials(name) returns the first character uppercased."),
      ["charAt(0) and toUpperCase()."],
      [
        { args: ["nova"], expected: "N", label: "nova" },
        { args: ["Ada"], expected: "A", label: "Ada" },
      ],
      t,
    );
  }
  if (difficulty === "expert") {
    return jsFn(
      "maskEmail",
      "email",
      componentTitle(framework, difficulty, level, "maskEmail(email) replaces the part before @ with '***'."),
      ["Split on @.", "Return '***@' + domain."],
      [
        { args: ["hero@quest.io"], expected: "***@quest.io", label: "main" },
      ],
      t,
    );
  }
  return jsFn(
    "slugify",
    "text",
    componentTitle(framework, difficulty, level, "slugify(text) lowercases and swaps spaces for hyphens."),
    ["toLowerCase()", "replace spaces"],
    [{ args: ["Code Quest"], expected: "code-quest", label: "title" }],
    t,
  );
}

function loopLabyrinth(
  framework: FrontendFrameworkId,
  language: FrontendLanguage,
  difficulty: SkillDifficulty,
  level: number,
): Exercise {
  const t = typed(language);
  const n = difficulty === "beginner" ? 3 : difficulty === "mid" ? 5 : 8;
  return jsFn(
    "renderDots",
    "count",
    componentTitle(framework, difficulty, level, `renderDots(count) returns a string of ${n} dots when count=${n}.`),
    ["Build a string in a loop.", "Each iteration adds '.'."],
    [
      { args: [n], expected: ".".repeat(n), label: `n=${n}` },
      { args: [1], expected: ".", label: "one" },
    ],
    t,
  );
}

function arrayArena(
  framework: FrontendFrameworkId,
  language: FrontendLanguage,
  difficulty: SkillDifficulty,
  level: number,
): Exercise {
  const s = scale(level);
  const t = typed(language);
  if (difficulty === "beginner") {
    return jsFn(
      "firstItem",
      "items",
      componentTitle(framework, difficulty, level, "firstItem(items) returns the first list entry or '' if empty."),
      ["Check length.", "Return items[0] or ''."],
      [
        { args: [[s.word, "x"]], expected: s.word, label: "main" },
        { args: [[]], expected: "", label: "empty" },
      ],
      t,
    );
  }
  if (difficulty === "mid") {
    return jsFn(
      "joinTags",
      "tags",
      componentTitle(framework, difficulty, level, "joinTags(tags) joins tags with commas."),
      ["tags.join(',')"],
      [
        { args: [["quest", "daily"]], expected: "quest,daily", label: "two" },
        { args: [[]], expected: "", label: "empty" },
      ],
      t,
    );
  }
  if (difficulty === "expert") {
    return jsFn(
      "activeCount",
      "flags",
      componentTitle(framework, difficulty, level, "activeCount(flags) counts how many booleans are true."),
      ["Loop and increment when true."],
      [
        { args: [[true, false, true]], expected: 2, label: "mix" },
        { args: [[false]], expected: 0, label: "zero" },
      ],
      t,
    );
  }
  return jsFn(
    "topScores",
    "scores, n",
    componentTitle(framework, difficulty, level, "topScores(scores,n) returns the n highest numbers sorted desc."),
    ["Sort descending.", "Slice first n items."],
    [
      { args: [[9, 1, 7, 3], 2], expected: [9, 7], label: "main" },
    ],
    t,
  );
}

function logicLair(
  framework: FrontendFrameworkId,
  language: FrontendLanguage,
  difficulty: SkillDifficulty,
  level: number,
): Exercise {
  const s = scale(level);
  const t = typed(language);
  if (difficulty === "beginner") {
    return jsFn(
      "canPlay",
      "loggedIn",
      componentTitle(framework, difficulty, level, "canPlay(loggedIn) returns loggedIn for a gated play button."),
      ["Return the boolean as-is."],
      [
        { args: [true], expected: true, label: "yes" },
        { args: [false], expected: false, label: "no" },
      ],
      t,
    );
  }
  if (difficulty === "mid") {
    return jsFn(
      "showBadge",
      "level",
      componentTitle(framework, difficulty, level, "showBadge(level) true when level is 5 or higher."),
      ["Compare with >= 5."],
      [
        { args: [s.cap], expected: s.cap >= 5, label: "main" },
        { args: [1], expected: false, label: "low" },
      ],
      t,
    );
  }
  if (difficulty === "expert") {
    return jsFn(
      "themeClass",
      "dark",
      componentTitle(framework, difficulty, level, "themeClass(dark) returns 'dark' or 'light'."),
      ["Return the matching string."],
      [
        { args: [true], expected: "dark", label: "dark" },
        { args: [false], expected: "light", label: "light" },
      ],
      t,
    );
  }
  return jsFn(
    "accessLevel",
    "role",
    componentTitle(framework, difficulty, level, "accessLevel(role) maps admin→3, mod→2, else 1."),
    ["if/else or switch on role string."],
    [
      { args: ["admin"], expected: 3, label: "admin" },
      { args: ["mod"], expected: 2, label: "mod" },
      { args: ["user"], expected: 1, label: "user" },
    ],
    t,
  );
}

function bossGate(
  framework: FrontendFrameworkId,
  language: FrontendLanguage,
  difficulty: SkillDifficulty,
  level: number,
): Exercise {
  const s = scale(level);
  const t = typed(language);
  const bonus = difficulty === "beginner" ? 1 : difficulty === "mid" ? s.c : difficulty === "expert" ? s.c + 2 : s.c + 6;
  return jsFn(
    "bossReward",
    "base, mult",
    componentTitle(framework, difficulty, level, `BOSS: bossReward(base,mult) returns base*mult+${bonus}.`),
    ["Multiply then add bonus constant."],
    [
      { args: [s.a, s.b], expected: s.a * s.b + bonus, label: "main" },
      { args: [2, 3], expected: 6 + bonus, label: "2,3" },
    ],
    t,
  );
}

const BUILDERS: Record<
  GameModeId,
  (fw: FrontendFrameworkId, lang: FrontendLanguage, d: SkillDifficulty, l: number) => Exercise
> = {
  "byte-blitz": byteBlitz,
  "function-forge": functionForge,
  "string-surge": stringSurge,
  "loop-labyrinth": loopLabyrinth,
  "array-arena": arrayArena,
  "logic-lair": logicLair,
  "boss-gate": bossGate,
};

export function buildFrontendQuestion(
  framework: FrontendFrameworkId,
  language: FrontendLanguage,
  difficulty: SkillDifficulty,
  mode: GameModeId,
  level: number,
) {
  return BUILDERS[mode](framework, language, difficulty, level);
}
