import type { GuideTopicId, TopicStyle } from "@/lib/guides/types";

export const TOPIC_STYLES: Record<GuideTopicId, TopicStyle> = {
  python: { accent: "text-emerald-600", soft: "bg-emerald-50", ring: "ring-emerald-200", bar: "bg-emerald-400" },
  javascript: { accent: "text-amber-600", soft: "bg-amber-50", ring: "ring-amber-200", bar: "bg-amber-400" },
  typescript: { accent: "text-blue-600", soft: "bg-blue-50", ring: "ring-blue-200", bar: "bg-blue-400" },
  java: { accent: "text-orange-600", soft: "bg-orange-50", ring: "ring-orange-200", bar: "bg-orange-400" },
  c: { accent: "text-slate-700", soft: "bg-slate-100", ring: "ring-slate-200", bar: "bg-slate-400" },
  cpp: { accent: "text-slate-700", soft: "bg-slate-100", ring: "ring-slate-200", bar: "bg-slate-500" },
  csharp: { accent: "text-violet-600", soft: "bg-violet-50", ring: "ring-violet-200", bar: "bg-violet-400" },
  go: { accent: "text-cyan-600", soft: "bg-cyan-50", ring: "ring-cyan-200", bar: "bg-cyan-400" },
  rust: { accent: "text-orange-700", soft: "bg-orange-50", ring: "ring-orange-200", bar: "bg-orange-500" },
  php: { accent: "text-indigo-600", soft: "bg-indigo-50", ring: "ring-indigo-200", bar: "bg-indigo-400" },
  ruby: { accent: "text-rose-600", soft: "bg-rose-50", ring: "ring-rose-200", bar: "bg-rose-400" },
  swift: { accent: "text-red-600", soft: "bg-red-50", ring: "ring-red-200", bar: "bg-red-400" },
  kotlin: { accent: "text-purple-600", soft: "bg-purple-50", ring: "ring-purple-200", bar: "bg-purple-400" },
  r: { accent: "text-sky-600", soft: "bg-sky-50", ring: "ring-sky-200", bar: "bg-sky-400" },
  bash: { accent: "text-green-700", soft: "bg-green-50", ring: "ring-green-200", bar: "bg-green-500" },
  react: { accent: "text-sky-600", soft: "bg-sky-50", ring: "ring-sky-200", bar: "bg-sky-400" },
  htmlcss: { accent: "text-orange-600", soft: "bg-orange-50", ring: "ring-orange-200", bar: "bg-orange-400" },
  sql: { accent: "text-blue-600", soft: "bg-blue-50", ring: "ring-blue-200", bar: "bg-blue-400" },
  mysql: { accent: "text-blue-700", soft: "bg-blue-50", ring: "ring-blue-200", bar: "bg-blue-500" },
  postgresql: { accent: "text-teal-700", soft: "bg-teal-50", ring: "ring-teal-200", bar: "bg-teal-400" },
  sqlite: { accent: "text-slate-600", soft: "bg-slate-100", ring: "ring-slate-200", bar: "bg-slate-400" },
  mongodb: { accent: "text-green-600", soft: "bg-green-50", ring: "ring-green-200", bar: "bg-green-400" },
  supabase: { accent: "text-emerald-600", soft: "bg-emerald-50", ring: "ring-emerald-200", bar: "bg-emerald-400" },
};

export function getTopicStyle(id: GuideTopicId): TopicStyle {
  return TOPIC_STYLES[id];
}
