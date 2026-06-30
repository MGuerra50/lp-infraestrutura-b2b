"use client";

import { useFullPageScroll } from "@/components/scroll/FullPageScrollContext";

export function FixedVideoGradient() {
  const { activeSectionId } = useFullPageScroll();
  const isVideoSection =
    activeSectionId === "social-proof" || activeSectionId === "plataforma";

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-10 transition-opacity duration-700 ease-in-out ${
        isVideoSection ? "opacity-100" : "opacity-0"
      }`}
      style={{
        background: [
          "radial-gradient(ellipse 55% 50% at 0% 100%, rgba(5,5,5,0.94) 0%, rgba(5,5,5,0.5) 42%, transparent 72%)",
          "linear-gradient(135deg, rgba(5,5,5,0.82) 0%, rgba(5,5,5,0.38) 45%, rgba(5,5,5,0.08) 100%)",
        ].join(", "),
      }}
      aria-hidden={!isVideoSection}
    />
  );
}
