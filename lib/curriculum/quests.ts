import { sideQuests } from "@/lib/curriculum/side-quests";
import type { Quest } from "@/lib/types";

export const quests: Quest[] = [
  {
    id: "first-spark",
    kind: "main",
    title: "First Spark",
    description: "Clear any lesson.",
    xp: 30,
    metric: { type: "lessons", count: 1 },
  },
  {
    id: "trailblazer",
    title: "Trailblazer",
    description: "Clear 5 lessons.",
    xp: 80,
    metric: { type: "lessons", count: 5 },
  },
  {
    id: "scholar",
    title: "Scholar of the Academy",
    description: "Clear 10 lessons.",
    xp: 140,
    metric: { type: "lessons", count: 10 },
  },
  {
    id: "python-path",
    title: "Python Initiate",
    description: "Clear 4 Python lessons.",
    xp: 60,
    metric: { type: "language", language: "python", count: 4 },
  },
  {
    id: "script-path",
    title: "Script Initiate",
    description: "Clear 4 JavaScript lessons.",
    xp: 60,
    metric: { type: "language", language: "javascript", count: 4 },
  },
  {
    id: "two-tongues",
    title: "Two Tongues",
    description: "Clear at least one lesson in each language.",
    xp: 90,
    metric: { type: "both" },
  },
  {
    id: "world-clear",
    title: "World Walker",
    description: "Finish every lesson in any world.",
    xp: 120,
    metric: { type: "world" },
  },
  {
    id: "arena-debut",
    title: "Arena Debut",
    description: "Clear a coding challenge.",
    xp: 40,
    metric: { type: "challenges", count: 1 },
  },
  {
    id: "arena-adept",
    title: "Arena Adept",
    description: "Clear 3 coding challenges.",
    xp: 100,
    metric: { type: "challenges", count: 3 },
  },
  {
    id: "ember-streak",
    title: "Keep the Ember",
    description: "Reach a 3-day streak.",
    xp: 70,
    metric: { type: "streak", days: 3 },
  },
  {
    id: "type-path",
    title: "Type Initiate",
    description: "Clear 3 TypeScript lessons.",
    xp: 60,
    metric: { type: "language", language: "typescript", count: 3 },
  },
  {
    id: "java-path",
    title: "Java Initiate",
    description: "Clear 3 Java lessons.",
    xp: 60,
    metric: { type: "language", language: "java", count: 3 },
  },
  {
    id: "guide-explorer",
    title: "Guide Explorer",
    description: "Finish 5 guide lessons (any topic).",
    xp: 50,
    metric: { type: "guides", count: 5 },
  },
  {
    id: "react-reader",
    title: "React Reader",
    description: "Read 4 React guide lessons.",
    xp: 70,
    metric: { type: "guideTopic", topic: "react", count: 4 },
  },
  {
    id: "sql-starter",
    title: "SQL Starter",
    description: "Read 3 SQL Basics guide lessons.",
    xp: 60,
    metric: { type: "guideTopic", topic: "sql", count: 3 },
  },
  {
    id: "four-paths",
    title: "Four Paths",
    description: "Clear at least one lesson in each code path.",
    xp: 120,
    metric: { type: "allLanguages" },
  },
];

export { sideQuests };

export const allQuests: Quest[] = [...quests, ...sideQuests];

export function getQuest(id: string) {
  return allQuests.find((quest) => quest.id === id);
}

export function mainQuests() {
  return quests;
}
