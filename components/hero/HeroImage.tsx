"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useHeroLayout } from "./HeroLayoutContext";

const INTRO_STORAGE_KEY = "hero-intro-seen";
const INTRO_DURATION_MS = 1400;
const HERO_VIDEO_SRC = "/hero_section.mp4";

function HeroMedia({
  alt = "",
  priority = false,
  sizes,
}: {
  alt?: string;
  priority?: boolean;
  sizes: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoReady, setIsVideoReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleReady = () => {
      setIsVideoReady(true);
      void video.play().catch(() => {});
    };

    video.addEventListener("canplaythrough", handleReady);
    video.addEventListener("loadeddata", handleReady);

    if (video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
      handleReady();
    }

    video.load();

    return () => {
      video.removeEventListener("canplaythrough", handleReady);
      video.removeEventListener("loadeddata", handleReady);
    };
  }, []);

  return (
    <>
      <Image
        src="/hero.png"
        alt={alt}
        fill
        priority={priority}
        className={[
          "object-cover object-right transition-opacity duration-700",
          isVideoReady ? "opacity-0" : "opacity-100",
        ].join(" ")}
        sizes={sizes}
      />
      <video
        ref={videoRef}
        src={HERO_VIDEO_SRC}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className={[
          "absolute inset-0 h-full w-full object-cover object-right transition-opacity duration-700",
          isVideoReady ? "opacity-100" : "opacity-0",
        ].join(" ")}
      />
    </>
  );
}

function HeroSquare({
  phase,
  skipTransition,
  onMount,
}: {
  phase: "expanded" | "final";
  skipTransition: boolean;
  onMount?: (element: HTMLDivElement | null) => void;
}) {
  const isExpanded = phase === "expanded";

  return (
    <div
      ref={onMount}
      className={[
        "relative h-full w-full overflow-hidden rounded-[2rem] sm:rounded-[2.5rem]",
        "lg:aspect-square lg:h-[min(135vh,1350px)] lg:w-[min(135vh,1350px)]",
        "lg:max-h-none lg:max-w-none lg:shrink-0 lg:rounded-[3rem]",
        "origin-center lg:origin-[right_center]",
        skipTransition
          ? ""
          : "transition-[transform,border-radius] duration-[1400ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
        isExpanded
          ? "rotate-[35deg] scale-[2.6] lg:translate-x-[2%]"
          : "rotate-[35deg] scale-100 lg:translate-x-[8%]",
      ].join(" ")}
    >
      <span
        data-hero-square-tip
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 h-px w-px opacity-0"
      />
      <div className="absolute inset-0 -rotate-[35deg] scale-[1.4]">
        <HeroMedia
          alt="Cidade à noite com trilhas de luz"
          priority
          sizes="(max-width: 1024px) 100vw, 65vw"
        />
      </div>
      <div className="absolute inset-0 bg-[#0a1628]/20 lg:hidden" />
    </div>
  );
}

const squareWrapperClassName =
  "relative flex h-[638px] w-full items-center px-6 sm:h-[788px] md:px-12 lg:absolute lg:top-[75%] lg:right-0 lg:w-[65%] lg:-translate-y-1/2 lg:justify-end lg:overflow-visible lg:px-0";

export function HeroImage() {
  const { setSquareElement } = useHeroLayout();
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<"expanded" | "final">("final");
  const [skipTransition, setSkipTransition] = useState(true);
  const [showFullscreenBg, setShowFullscreenBg] = useState(false);

  useEffect(() => {
    setMounted(true);

    const hasSeenIntro = localStorage.getItem(INTRO_STORAGE_KEY);
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (hasSeenIntro || prefersReducedMotion) {
      setPhase("final");
      setSkipTransition(true);
      setShowFullscreenBg(false);
      return;
    }

    setSkipTransition(false);
    setPhase("expanded");
    setShowFullscreenBg(true);

    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setPhase("final");
      });
    });

    const hideBgTimer = window.setTimeout(() => {
      setShowFullscreenBg(false);
    }, INTRO_DURATION_MS * 0.65);

    const saveTimer = window.setTimeout(() => {
      localStorage.setItem(INTRO_STORAGE_KEY, "true");
    }, INTRO_DURATION_MS);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(hideBgTimer);
      window.clearTimeout(saveTimer);
    };
  }, []);

  if (!mounted) {
    return (
      <div className={squareWrapperClassName}>
        <HeroSquare
          phase="final"
          skipTransition
          onMount={setSquareElement}
        />
      </div>
    );
  }

  return (
    <>
      <div
        className={[
          "pointer-events-none absolute inset-0 z-[5] transition-opacity duration-700",
          showFullscreenBg ? "opacity-100" : "opacity-0",
        ].join(" ")}
        aria-hidden={!showFullscreenBg}
      >
        <HeroMedia priority sizes="100vw" />
      </div>

      <div className={`relative z-[15] ${squareWrapperClassName}`}>
        <HeroSquare
          phase={phase}
          skipTransition={skipTransition}
          onMount={setSquareElement}
        />
      </div>
    </>
  );
}
