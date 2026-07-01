"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useFullPageScroll } from "./FullPageScrollContext";

type FullPageSectionProps = {
  id: string;
  children?: ReactNode;
  className?: string;
  footerExtension?: boolean;
  onEnter?: () => void;
};

export function FullPageSection({
  id,
  children,
  className = "",
  footerExtension = false,
  onEnter,
}: FullPageSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const {
    activeSectionId,
    setActiveSectionId,
    isSection45Transitioning,
    isSection56Transitioning,
  } = useFullPageScroll();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || entry.intersectionRatio < 0.6) return;
        if (activeSectionId === id) return;
        if (isSection45Transitioning || isSection56Transitioning) return;
        if (
          (id === "ecossistema" && activeSectionId === "recursos-tecnicos") ||
          (id === "recursos-tecnicos" && activeSectionId === "ecossistema")
        ) {
          return;
        }
        if (
          (id === "case-studies" && activeSectionId === "ecossistema") ||
          (id === "ecossistema" && activeSectionId === "case-studies")
        ) {
          return;
        }

        setActiveSectionId(id);
        onEnter?.();
      },
      { threshold: [0.6, 0.85] },
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, [
    activeSectionId,
    id,
    onEnter,
    setActiveSectionId,
    isSection45Transitioning,
    isSection56Transitioning,
  ]);

  return (
    <section
      ref={sectionRef}
      id={id}
      data-fullpage-section={id}
      {...(footerExtension ? { "data-footer-extension": "" } : {})}
      className={[
        "relative w-full shrink-0 snap-start snap-always",
        footerExtension ? "h-[150dvh]" : "h-dvh",
        className,
      ].join(" ")}
    >
      {children}
    </section>
  );
}
