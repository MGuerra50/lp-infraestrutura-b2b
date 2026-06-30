"use client";

import { useEffect, useState } from "react";
import { Header } from "./Header";

const INTRO_STORAGE_KEY = "hero-intro-seen";
const INTRO_DURATION_MS = 1400;

export function HeroHeader() {
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
    <div
      className={[
        "transition-opacity duration-700 ease-out",
        visible ? "opacity-100" : "opacity-0",
      ].join(" ")}
    >
      <Header />
    </div>
  );
}
