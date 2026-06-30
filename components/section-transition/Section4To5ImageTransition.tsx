"use client";

import gsap from "gsap";
import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";
import {
  scrollToSectionId,
  SECTION4_ID,
  SECTION5_ID,
  useFullPageScroll,
} from "@/components/scroll/FullPageScrollContext";
import {
  SECTION4_IMAGE_PANEL,
  SECTION4_IMAGE_SRC,
  SECTION45_EXPAND_DURATION,
  SECTION45_FADE_DURATION,
  SECTION5_IMAGE_PANEL,
  SECTION5_IMAGE_SRC,
} from "@/lib/section-transition/section45Constants";

function isDesktopViewport() {
  return window.matchMedia("(min-width: 768px)").matches;
}

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export function Section4To5ImageTransition() {
  const {
    activeSectionId,
    scrollContainerRef,
    ecosystemTransitionReady,
    setActiveSectionId,
    setEcosystemTransitionReady,
    setIsSection45Transitioning,
    section45HandlersRef,
  } = useFullPageScroll();

  const overlayRef = useRef<HTMLDivElement>(null);
  const image4Ref = useRef<HTMLDivElement>(null);
  const image5Ref = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const runningRef = useRef(false);

  const setActiveSectionIdRef = useRef(setActiveSectionId);
  const setEcosystemTransitionReadyRef = useRef(setEcosystemTransitionReady);
  const setIsSection45TransitioningRef = useRef(setIsSection45Transitioning);
  const scrollContainerRefRef = useRef(scrollContainerRef);

  setActiveSectionIdRef.current = setActiveSectionId;
  setEcosystemTransitionReadyRef.current = setEcosystemTransitionReady;
  setIsSection45TransitioningRef.current = setIsSection45Transitioning;
  scrollContainerRefRef.current = scrollContainerRef;

  const hideOverlay = useCallback(() => {
    const overlay = overlayRef.current;
    const image4 = image4Ref.current;
    const image5 = image5Ref.current;
    if (!overlay || !image4 || !image5) return;

    gsap.set(overlay, { autoAlpha: 0 });
    gsap.set(image4, { autoAlpha: 0 });
    gsap.set(image5, { autoAlpha: 0 });
  }, []);

  const showSection4Panel = useCallback(() => {
    const overlay = overlayRef.current;
    const image4 = image4Ref.current;
    const image5 = image5Ref.current;
    if (!overlay || !image4 || !image5) return;

    gsap.set(overlay, {
      autoAlpha: 1,
      width: SECTION4_IMAGE_PANEL.width,
      right: 0,
      left: "auto",
      clipPath: SECTION4_IMAGE_PANEL.clipPath,
    });
    gsap.set(image4, { autoAlpha: 1 });
    gsap.set(image5, { autoAlpha: 0 });
  }, []);

  const showSection5Fullscreen = useCallback(() => {
    const overlay = overlayRef.current;
    const image4 = image4Ref.current;
    const image5 = image5Ref.current;
    if (!overlay || !image4 || !image5) return;

    gsap.set(overlay, {
      autoAlpha: 1,
      width: SECTION5_IMAGE_PANEL.width,
      right: 0,
      left: "auto",
      clipPath: SECTION5_IMAGE_PANEL.clipPath,
    });
    gsap.set(image4, { autoAlpha: 0 });
    gsap.set(image5, { autoAlpha: 1 });
  }, []);

  const syncIdleOverlay = useCallback(() => {
    if (runningRef.current) return;

    const desktop = isDesktopViewport();

    if (activeSectionId === SECTION4_ID && desktop) {
      showSection4Panel();
      return;
    }

    if (
      activeSectionId === SECTION5_ID &&
      ecosystemTransitionReady &&
      desktop
    ) {
      showSection5Fullscreen();
      return;
    }

    hideOverlay();
  }, [
    activeSectionId,
    ecosystemTransitionReady,
    hideOverlay,
    showSection4Panel,
    showSection5Fullscreen,
  ]);

  useEffect(() => {
    syncIdleOverlay();
  }, [syncIdleOverlay]);

  useEffect(() => {
    const overlay = overlayRef.current;
    const image4 = image4Ref.current;
    const image5 = image5Ref.current;

    if (!overlay || !image4 || !image5) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const runForward = async (): Promise<boolean> => {
      if (runningRef.current) return false;
      runningRef.current = true;
      setIsSection45TransitioningRef.current(true);
      setEcosystemTransitionReadyRef.current(false);

      try {
        if (prefersReducedMotion) {
          scrollToSectionId(scrollContainerRefRef.current.current, SECTION5_ID);
          setActiveSectionIdRef.current(SECTION5_ID);
          setEcosystemTransitionReadyRef.current(true);
          return true;
        }

        const desktop = isDesktopViewport();
        const panelState = desktop ? SECTION4_IMAGE_PANEL : SECTION5_IMAGE_PANEL;

        timelineRef.current?.kill();

        gsap.set(overlay, {
          autoAlpha: 1,
          width: panelState.width,
          right: 0,
          left: "auto",
          clipPath: panelState.clipPath,
        });
        gsap.set(image4, { autoAlpha: 1 });
        gsap.set(image5, { autoAlpha: 0 });

        await new Promise<void>((resolve, reject) => {
          const timeline = gsap.timeline({
            onComplete: resolve,
            onInterrupt: () => reject(new Error("interrupted")),
          });

          timeline.to(
            image4,
            {
              autoAlpha: 0,
              duration: SECTION45_FADE_DURATION,
              ease: "power2.inOut",
            },
            0,
          );
          timeline.to(
            image5,
            {
              autoAlpha: 1,
              duration: SECTION45_FADE_DURATION,
              ease: "power2.inOut",
            },
            0,
          );

          if (desktop) {
            timeline.to(
              overlay,
              {
                width: SECTION5_IMAGE_PANEL.width,
                clipPath: SECTION5_IMAGE_PANEL.clipPath,
                duration: SECTION45_EXPAND_DURATION,
                ease: "power3.inOut",
              },
              SECTION45_FADE_DURATION,
            );
          }

          timelineRef.current = timeline;
        });

        scrollToSectionId(scrollContainerRefRef.current.current, SECTION5_ID);
        setActiveSectionIdRef.current(SECTION5_ID);
        setEcosystemTransitionReadyRef.current(true);

        if (desktop) {
          showSection5Fullscreen();
        } else {
          hideOverlay();
        }

        return true;
      } catch {
        return false;
      } finally {
        timelineRef.current = null;
        runningRef.current = false;
        setIsSection45TransitioningRef.current(false);
      }
    };

    const runBackward = async (): Promise<boolean> => {
      if (runningRef.current) return false;
      runningRef.current = true;
      setIsSection45TransitioningRef.current(true);
      setEcosystemTransitionReadyRef.current(false);

      try {
        if (prefersReducedMotion) {
          scrollToSectionId(scrollContainerRefRef.current.current, SECTION4_ID);
          setActiveSectionIdRef.current(SECTION4_ID);
          return true;
        }

        const desktop = isDesktopViewport();
        const panelState = desktop ? SECTION4_IMAGE_PANEL : SECTION5_IMAGE_PANEL;

        timelineRef.current?.kill();

        gsap.set(overlay, {
          autoAlpha: 1,
          width: SECTION5_IMAGE_PANEL.width,
          right: 0,
          left: "auto",
          clipPath: SECTION5_IMAGE_PANEL.clipPath,
        });
        gsap.set(image4, { autoAlpha: 0 });
        gsap.set(image5, { autoAlpha: 1 });

        scrollToSectionId(scrollContainerRefRef.current.current, SECTION4_ID);
        setActiveSectionIdRef.current(SECTION4_ID);

        await wait(0);

        await new Promise<void>((resolve, reject) => {
          const timeline = gsap.timeline({
            onComplete: resolve,
            onInterrupt: () => reject(new Error("interrupted")),
          });

          if (desktop) {
            timeline.to(
              overlay,
              {
                width: panelState.width,
                clipPath: panelState.clipPath,
                duration: SECTION45_EXPAND_DURATION,
                ease: "power3.inOut",
              },
              0,
            );

            timeline.to(
              image5,
              {
                autoAlpha: 0,
                duration: SECTION45_FADE_DURATION,
                ease: "power2.inOut",
              },
              SECTION45_EXPAND_DURATION,
            );
            timeline.to(
              image4,
              {
                autoAlpha: 1,
                duration: SECTION45_FADE_DURATION,
                ease: "power2.inOut",
              },
              SECTION45_EXPAND_DURATION,
            );
          } else {
            timeline.to(
              image5,
              {
                autoAlpha: 0,
                duration: SECTION45_FADE_DURATION,
                ease: "power2.inOut",
              },
              0,
            );
            timeline.to(
              image4,
              {
                autoAlpha: 1,
                duration: SECTION45_FADE_DURATION,
                ease: "power2.inOut",
              },
              0,
            );
          }

          timelineRef.current = timeline;
        });

        if (desktop) {
          showSection4Panel();
        } else {
          hideOverlay();
        }

        return true;
      } catch {
        return false;
      } finally {
        timelineRef.current = null;
        runningRef.current = false;
        setIsSection45TransitioningRef.current(false);
      }
    };

    section45HandlersRef.current = {
      startForward: runForward,
      startBackward: runBackward,
      showSection5Idle: showSection5Fullscreen,
    };

    return () => {
      section45HandlersRef.current = null;
    };
  }, [
    section45HandlersRef,
    hideOverlay,
    showSection4Panel,
    showSection5Fullscreen,
  ]);

  return (
    <div
      ref={overlayRef}
      className="pointer-events-none fixed inset-y-0 right-0 z-[100] overflow-hidden opacity-0"
      style={{
        clipPath: SECTION4_IMAGE_PANEL.clipPath,
        width: SECTION4_IMAGE_PANEL.width,
      }}
      aria-hidden
    >
      <div
        ref={image4Ref}
        className="absolute inset-0 origin-center scale-[1.12]"
      >
        <Image
          src={SECTION4_IMAGE_SRC}
          alt=""
          fill
          unoptimized
          className="object-cover object-center"
          sizes="50vw"
        />
      </div>

      <div ref={image5Ref} className="absolute inset-0 opacity-0">
        <Image
          src={SECTION5_IMAGE_SRC}
          alt=""
          fill
          unoptimized
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>
    </div>
  );
}
