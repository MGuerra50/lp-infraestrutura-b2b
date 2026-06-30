"use client";

import { useEffect, useState } from "react";
import { HeroTitle } from "./HeroTitle";

const INTRO_STORAGE_KEY = "hero-intro-seen";
const INTRO_DURATION_MS = 1400;

const HERO_SUBTITLE =
  "Projetamos e mantemos ambientes isolados e altamente seguros. Desde a gestão completa de servidores dedicados até integrações robustas e migrações críticas de sistemas legados. Uptime garantido para o seu negócio não parar.";

export function HeroContent({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const hasSeenIntro = localStorage.getItem(INTRO_STORAGE_KEY);
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (hasSeenIntro || prefersReducedMotion) {
      setVisible(true);
      return;
    }

    setVisible(false);

    const timer = window.setTimeout(() => {
      setVisible(true);
    }, INTRO_DURATION_MS * 0.55);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <>
      <div
        className={[
          "relative z-30 flex flex-1 flex-col justify-center px-6 pb-16 pt-32 md:px-12 lg:w-[48%] lg:px-16 lg:pb-24 lg:pt-40",
          "transition-opacity duration-700 ease-out",
          visible ? "opacity-100" : "opacity-0",
        ].join(" ")}
      >
        {children}
      </div>

      <div
        className={[
          "absolute inset-x-0 bottom-0 z-20 px-6 pb-8 md:px-12 lg:px-16 lg:pb-12",
          "transition-opacity duration-700 ease-out",
          visible ? "opacity-100" : "opacity-0",
        ].join(" ")}
      >
        <HeroTitle />
        <div
          aria-hidden
          className="my-6 h-px w-[calc(100%+2rem)] max-w-5xl -ml-8 bg-[linear-gradient(to_right,transparent,rgba(0,0,0,0.16),transparent)] md:-ml-10 md:w-[calc(100%+2.5rem)] lg:my-8 lg:-ml-14 lg:w-[calc(100%+3.5rem)]"
        />
        <p className="max-w-4xl text-sm leading-relaxed text-[#5a5a5a] md:text-base">
          {HERO_SUBTITLE}
        </p>
      </div>
    </>
  );
}
