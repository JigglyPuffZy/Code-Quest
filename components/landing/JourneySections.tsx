"use client";

import { useEffect, useMemo, useRef, useSyncExternalStore, type CSSProperties } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, GraduationCap } from "lucide-react";
import { TechLogo } from "@/components/icons/TechLogo";
import { storageKey } from "@/lib/storage-keys";
import type { GuideTopicId } from "@/lib/guides/types";
import "./journey.css";
import "./courses.css";

export type LandingCourse = {
  id: GuideTopicId;
  name: string;
  description: string;
  lessonSlugs: string[];
};

const progressKey = storageKey("guide-progress");
function subscribeProgress(update: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === progressKey || event.key === null) update();
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener("devladder:guide-progress-updated", update);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener("devladder:guide-progress-updated", update);
  };
}
function progressSnapshot() {
  try { return window.localStorage.getItem(progressKey) ?? "{}"; }
  catch { return null; }
}
const serverSnapshot = () => null;

export function JourneySections({ courses }: { courses: LandingCourse[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const snapshot = useSyncExternalStore(subscribeProgress, progressSnapshot, serverSnapshot);
  const readByTopic = useMemo<Record<string, unknown>>(() => {
    try {
      const parsed = snapshot ? JSON.parse(snapshot) : null;
      return parsed?.read && typeof parsed.read === "object" && !Array.isArray(parsed.read) ? parsed.read : {};
    } catch { return {}; }
  }, [snapshot]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("jr-revealed");
          observer.unobserve(entry.target);
        }
      }
    }, { threshold: 0.12 });
    container.querySelectorAll("[data-jr-reveal]").forEach((node) => observer.observe(node));
    container.classList.add("jr-enhanced");
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !window.matchMedia("(hover: hover) and (prefers-reduced-motion: no-preference)").matches) return;
    const cards = Array.from(container.querySelectorAll<HTMLElement>(".cs-card"));
    let frame = 0;
    const move = (event: PointerEvent) => {
      const card = event.currentTarget as HTMLElement;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        card.style.setProperty("--cx", `${x}px`);
        card.style.setProperty("--cy", `${y}px`);
        card.style.setProperty("--ry", `${(x / rect.width - 0.5) * 6}deg`);
        card.style.setProperty("--rx", `${(y / rect.height - 0.5) * -5}deg`);
      });
    };
    const leave = (event: PointerEvent) => {
      const card = event.currentTarget as HTMLElement;
      card.style.setProperty("--rx", "0deg");
      card.style.setProperty("--ry", "0deg");
    };
    cards.forEach((card) => { card.addEventListener("pointermove", move); card.addEventListener("pointerleave", leave); });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      cards.forEach((card) => { card.removeEventListener("pointermove", move); card.removeEventListener("pointerleave", leave); });
    };
  }, []);

  return <div className="jr-sections" ref={containerRef}>
    <div className="jr-wrap">
      <section id="tracks" className="jr-courses" aria-labelledby="tracks-title">
        <div className="jr-heading" data-jr-reveal><p className="jr-eyebrow">COURSES</p><h2 id="tracks-title">Pick a path and start climbing.</h2><p>Beginner-friendly tracks for the languages and tools teams use every day.</p></div>
        <ul className="cs-grid">{courses.map((course, index) => {
          const storedRead = readByTopic[course.id];
          const read = new Set(Array.isArray(storedRead) ? storedRead.filter((slug): slug is string => typeof slug === "string") : []);
          const total = course.lessonSlugs.length;
          const done = course.lessonSlugs.filter((slug) => read.has(slug)).length;
          const available = snapshot !== null && total > 0;
          const percent = total ? Math.round(done / total * 100) : 0;
          return <li className="cs-card" key={course.id} data-jr-reveal style={{ "--jr-delay": `${index * 80}ms` } as CSSProperties}>
            <div className="cs-top">
              <span className="cs-logo"><TechLogo topicId={course.id} name={course.name} size={36} /></span>
              <span className={index === 0 ? "cs-tag is-start" : "cs-tag"}>{index === 0 ? "Start here" : `Path 0${index + 1}`}</span>
            </div>
            <h3>{course.name}</h3>
            <p className="cs-desc">{course.description}</p>
            <ul className="cs-meta">
              <li><BookOpen aria-hidden="true" />{total ? `${total} lessons` : "Coming soon"}</li>
              <li><GraduationCap aria-hidden="true" />Beginner friendly</li>
            </ul>
            <div className="cs-progress">
              <div className="cs-progress-label"><span>{available ? done ? `${done} of ${total} lessons read` : "Not started yet" : "Progress unavailable"}</span><b>{available ? `${percent}%` : "—"}</b></div>
              <div className="cs-bar" role={available ? "progressbar" : undefined} aria-label={`${course.name} reading progress`} aria-valuenow={available ? percent : undefined} aria-valuemin={available ? 0 : undefined} aria-valuemax={available ? 100 : undefined}><i style={{ width: `${available ? percent : 0}%` }} /></div>
            </div>
            <Link href={`/guides/${course.id}`} prefetch={false} className="cs-cta" aria-label={`${done ? "Continue" : "Start"} the ${course.name} course`}>{done ? "Continue learning" : "Start learning"}<ArrowRight aria-hidden="true" /></Link>
          </li>;
        })}</ul>
        <p className="jr-courses-note"><span />Start with curiosity. Build at your pace.</p>
      </section>
    </div>
  </div>;
}
