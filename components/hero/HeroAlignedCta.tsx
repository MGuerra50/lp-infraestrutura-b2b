"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useHeroLayout } from "./HeroLayoutContext";

type HeroAlignedCtaProps = {
  children: ReactNode;
  className?: string;
};

export function HeroAlignedCta({ children, className = "" }: HeroAlignedCtaProps) {
  const { tipY } = useHeroLayout();
  const ctaRef = useRef<HTMLDivElement>(null);
  const [alignedTop, setAlignedTop] = useState<number | null>(null);

  useEffect(() => {
    const updatePosition = () => {
      const cta = ctaRef.current;
      if (!cta || tipY === null || window.innerWidth < 1024) {
        setAlignedTop(null);
        return;
      }

      const section = cta.closest("section");
      if (!section) return;

      const sectionTop = section.getBoundingClientRect().top;
      const ctaHeight = cta.offsetHeight;

      setAlignedTop(tipY - sectionTop - ctaHeight / 2);
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);

    return () => window.removeEventListener("resize", updatePosition);
  }, [tipY]);

  return (
    <div
      ref={ctaRef}
      className={[
        "relative z-30 w-full max-w-md",
        alignedTop !== null ? "lg:absolute lg:left-16 lg:max-w-md" : "",
        className,
      ].join(" ")}
      style={alignedTop !== null ? { top: alignedTop } : undefined}
    >
      {children}
    </div>
  );
}
