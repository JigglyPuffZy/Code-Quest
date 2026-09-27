import type { Achievement } from "@/lib/types";

export const achievements: Achievement[] = [
  {
    id: "first-words",
    title: "First Words",
    description: "Clear your first lesson.",
    xp: 20,
    icon: "spark",
  },
  {
    id: "dedicated",
    title: "Dedicated",
    description: "Clear 5 lessons.",
    xp: 25,
    icon: "book",
  },
  {
    id: "scholar",
    title: "Scholar",
    description: "Clear 12 lessons.",
    xp: 40,
    icon: "scroll",
  },
  {
    id: "world-warden",
    title: "World Warden",
    description: "Finish a world.",
    xp: 40,
    icon: "crown",
  },
  {
    id: "duel-won",
    title: "Duel Won",
    description: "Clear a challenge.",
    xp: 20,
    icon: "sword",
  },
  {
    id: "arena-regular",
    title: "Arena Regular",
    description: "Clear 3 challenges.",
    xp: 30,
    icon: "star",
  },
  {
    id: "hot-streak",
    title: "Hot Streak",
    description: "Reach a 3-day streak.",
    xp: 25,
    icon: "flame",
  },
  {
    id: "week-flame",
    title: "Week Flame",
    description: "Reach a 7-day streak.",
    xp: 50,
    icon: "flame",
  },
  {
    id: "polyglot",
    title: "Polyglot",
    description: "Clear a lesson in Python and JavaScript.",
    xp: 30,
    icon: "globe",
  },
  {
    id: "quest-hunter",
    title: "Quest Hunter",
    description: "Claim 3 quests.",
    xp: 25,
    icon: "scroll",
  },
];
