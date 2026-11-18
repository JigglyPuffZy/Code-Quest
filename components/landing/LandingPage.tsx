"use client";

import "./landing.css";
import { FeaturesSection } from "./FeaturesSection";
import { Hero } from "./Hero";
import { HowItWorks } from "./HowItWorks";
import { JourneySections, type LandingCourse } from "./JourneySections";
import "./unify.css"; // shared colour + type scale, must load after the section stylesheets
import "./theme-light.css"; // light-mode versions of the hero and features sections
import { DevyyyyyChat } from "@/components/support/DevyyyyyChat";
import { Logo } from "@/components/shell/Logo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { usePlayer } from "@/components/player/PlayerProvider";
import { cn } from "@/lib/cn";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    let done = false;
    const reveal = () => {
      if (done) return;
      done = true;
      setVisible(true);
      observer?.disconnect();
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
    // Plain geometry check: also covers cases where IntersectionObserver never fires.
    const check = () => {
      if (node.getBoundingClientRect().top < window.innerHeight * 0.95) reveal();
    };
    const observer = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting || entry.boundingClientRect.top < 0) reveal();
    }, { threshold: 0.12 });
    observer?.observe(node);
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    check();
    return () => {
      done = true;
      observer?.disconnect();
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, []);
  return <div ref={ref} className={cn("lp-reveal", visible && "is-visible", className)}>{children}</div>;
}

export function LandingPage({ courses }: { courses: LandingCourse[] }) {
  const { ready, email, supabaseEnabled } = usePlayer();
  const enter = email ? "/dashboard" : "/signup";
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="lp min-h-screen">
      <header className="lp-nav-wrap">
        <div className={cn("lp-nav", scrolled && "is-scrolled")}>
          <Logo subtitle="Academy" className="min-w-0 shrink" />
          <nav className="lp-nav-links" aria-label="Page sections">
            <a href="#features">Features</a>
            <a href="#how">How it works</a>
            <a href="#tracks">Courses</a>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle compact />
            {supabaseEnabled && !email ? (
              <>
                <Link href="/login" className="lp-btn lp-btn-ghost lp-btn-sm lp-hide-xs">Log in</Link>
                <Link href="/signup" className="lp-btn lp-btn-primary lp-btn-sm">Sign up</Link>
              </>
            ) : (
              <Link href={email ? "/dashboard" : "/login"} className="lp-btn lp-btn-primary lp-btn-sm">
                Log in
                <ArrowRight size={15} />
              </Link>
            )}
          </div>
        </div>
      </header>

      <main>
        <Hero enter={enter} ready={ready} email={email} supabaseEnabled={supabaseEnabled} />

        <FeaturesSection />

        <HowItWorks />

        <JourneySections courses={courses} />

        <div className="lp-wrap">
          <Reveal className="lp-final">
            <h2>Ready to start your climb?</h2>
            <p>Create your free account, pick a course and earn your first XP in minutes.</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href={enter} className="lp-btn lp-btn-light">{email ? "Log in" : "Create free account"}<ArrowRight size={16} /></Link>
              {!email ? <Link href="/login" className="lp-btn lp-btn-line">I have an account</Link> : null}
            </div>
          </Reveal>

          <footer className="lp-footer">
            <span>© {new Date().getFullYear()} Dev Ladder. Build understanding, one step at a time.</span>
            <nav aria-label="Footer">
              <a href="#features">Features</a>
              <a href="#how">How it works</a>
              <Link href="/login">Log in</Link>
            </nav>
          </footer>
        </div>
      </main>

      <DevyyyyyChat variant="landing" />
    </div>
  );
}
