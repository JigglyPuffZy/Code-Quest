"use client";

import { getGuide, getGuideTopic } from "@/lib/guides/index";
import type { GuideTopicId } from "@/lib/guides/types";
import { guidePracticeCount } from "@/lib/guides/practice";
import { passedGuidePracticeIndices } from "@/lib/guides/progress";
import { Award, Share2 } from "lucide-react";
import { useState } from "react";

export function ShareCertificate({ topicId, slug }: { topicId: string; slug: string }) {
  const [copied, setCopied] = useState(false);
  const lesson = getGuide(topicId as GuideTopicId, slug);
  const topic = getGuideTopic(topicId as GuideTopicId);
  const total = guidePracticeCount(topicId, slug);
  const passed = passedGuidePracticeIndices(topicId, slug).length;

  if (!lesson || passed === 0) return null;

  const text = `I cleared ${topic.name} — ${lesson.title} on Dev Ladder! (${passed}/${total} practice questions) 🪜`;
  const url = typeof window !== "undefined" ? window.location.href.split("#")[0] : "https://devladder.vercel.app";

  async function share() {
    if (navigator.share) {
      try {
        await navigator.share({ title: "Dev Ladder", text, url });
        return;
      } catch {
        /* fall through */
      }
    }
    await navigator.clipboard.writeText(`${text}\n${url}`);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <article className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-4">
      <div className="flex items-start gap-3">
        <Award className="mt-0.5 size-5 text-amber-600" />
        <div>
          <p className="font-semibold text-ink">Lesson certificate</p>
          <p className="text-sm text-muted">
            {passed} of {total} practice cleared · share your win
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => void share()}
        className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-600"
      >
        <Share2 size={14} />
        {copied ? "Copied!" : "Share"}
      </button>
    </article>
  );
}
