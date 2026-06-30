"use client";

import gsap from "gsap";
import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";
import {
  scrollToSectionId,
  SECTION5_ID,
  SECTION6_ID,
  useFullPageScroll,
} from "@/components/scroll/FullPageScrollContext";
import {
  SECTION5_IMAGE_SRC,
  SECTION56_BACKWARD_CARD_STAGGER,
  SECTION56_BACKWARD_CONTENT_FADE,
  SECTION56_BACKWARD_CROSSFADE_OVERLAP,
  SECTION56_BACKWARD_IMAGE_FADE,
  SECTION56_FORWARD_CONTENT_FADE,
  SECTION56_FORWARD_CONTENT_OVERLAP,
  SECTION56_FORWARD_IMAGE_FADE,
  SECTION56_FORWARD_SHADOW_FADE,
  SECTION56_FORWARD_SHADOW_OVERLAP,
  SECTION6_IMAGE_OPACITY,
  SECTION6_IMAGE_SRC,
  SECTION6_SHADOW_OPACITY,
} from "@/lib/section-transition/section56Constants";

const TRANSITION_OVERLAY_Z = 120;

function isDesktopViewport() {
  return window.matchMedia("(min-width: 768px)").matches;
}

function getEcosystemContent() {
  return document.querySelector<HTMLElement>("[data-ecosystem-content]");
}

function getCaseStudiesHeader() {
  return document.querySelector<HTMLElement>("[data-case-studies-header]");
}

function getCaseStudiesCards() {
  return Array.from(
    document.querySelectorAll<HTMLElement>("[data-case-studies-card]"),
  );
}

export function Section5To6Transition() {
  const {
    activeSectionId,
    setActiveSectionId,
    setCaseStudiesTransitionReady,
    setEcosystemTransitionReady,
    setIsSection56Transitioning,
    section45HandlersRef,
    section56HandlersRef,
    scrollContainerRef,
  } = useFullPageScroll();

  const overlayRef = useRef<HTMLDivElement>(null);
  const image5Ref = useRef<HTMLDivElement>(null);
  const image6Ref = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const runningRef = useRef(false);

  const setActiveSectionIdRef = useRef(setActiveSectionId);
  const setCaseStudiesTransitionReadyRef = useRef(setCaseStudiesTransitionReady);
  const setEcosystemTransitionReadyRef = useRef(setEcosystemTransitionReady);
  const setIsSection56TransitioningRef = useRef(setIsSection56Transitioning);
  const scrollContainerRefRef = useRef(scrollContainerRef);
  const section45HandlersRefRef = useRef(section45HandlersRef);

  setActiveSectionIdRef.current = setActiveSectionId;
  setCaseStudiesTransitionReadyRef.current = setCaseStudiesTransitionReady;
  setEcosystemTransitionReadyRef.current = setEcosystemTransitionReady;
  setIsSection56TransitioningRef.current = setIsSection56Transitioning;
  scrollContainerRefRef.current = scrollContainerRef;
  section45HandlersRefRef.current = section45HandlersRef;

  const setOverlayElevated = useCallback((elevated: boolean) => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    gsap.set(overlay, { zIndex: elevated ? TRANSITION_OVERLAY_Z : 100 });
  }, []);

  const hideOverlay = useCallback(() => {
    const overlay = overlayRef.current;
    const image5 = image5Ref.current;
    const image6 = image6Ref.current;
    const shadow = shadowRef.current;
    if (!overlay || !image5 || !image6 || !shadow) return;

    gsap.set(overlay, { autoAlpha: 0, zIndex: 100 });
    gsap.set(image5, { autoAlpha: 0 });
    gsap.set(image6, { autoAlpha: 0 });
    gsap.set(shadow, { autoAlpha: 0 });
  }, []);

  const showSection6Idle = useCallback(() => {
    const overlay = overlayRef.current;
    const image5 = image5Ref.current;
    const image6 = image6Ref.current;
    const shadow = shadowRef.current;
    if (!overlay || !image5 || !image6 || !shadow) return;

    gsap.set(overlay, { autoAlpha: 1, zIndex: 100 });
    gsap.set(image5, { autoAlpha: 0 });
    gsap.set(image6, { autoAlpha: SECTION6_IMAGE_OPACITY });
    gsap.set(shadow, { autoAlpha: SECTION6_SHADOW_OPACITY });
  }, []);

  const showTransitionCoverWithImage5 = useCallback(() => {
    const overlay = overlayRef.current;
    const image5 = image5Ref.current;
    const image6 = image6Ref.current;
    const shadow = shadowRef.current;
    if (!overlay || !image5 || !image6 || !shadow) return;

    gsap.set(overlay, { autoAlpha: 1, zIndex: TRANSITION_OVERLAY_Z });
    gsap.set(image5, { autoAlpha: 1 });
    gsap.set(image6, { autoAlpha: 0 });
    gsap.set(shadow, { autoAlpha: 0 });
  }, []);

  const finalizeSection5Background = useCallback(() => {
    section45HandlersRefRef.current.current?.showSection5Idle();
    hideOverlay();
  }, [hideOverlay]);

  const syncIdleOverlay = useCallback(() => {
    if (runningRef.current) return;

    if (!isDesktopViewport()) {
      hideOverlay();
      return;
    }

    if (activeSectionId === SECTION6_ID) {
      showSection6Idle();
      return;
    }

    if (activeSectionId === SECTION5_ID) {
      return;
    }

    hideOverlay();
  }, [activeSectionId, hideOverlay, showSection6Idle]);

  useEffect(() => {
    syncIdleOverlay();
  }, [syncIdleOverlay]);

  useEffect(() => {
    const overlay = overlayRef.current;
    const image5 = image5Ref.current;
    const image6 = image6Ref.current;
    const shadow = shadowRef.current;

    if (!overlay || !image5 || !image6 || !shadow) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const runForward = async (): Promise<boolean> => {
      if (runningRef.current) return false;
      runningRef.current = true;
      setIsSection56TransitioningRef.current(true);
      setCaseStudiesTransitionReadyRef.current(false);
      setOverlayElevated(true);

      const ecosystemContent = getEcosystemContent();
      const header = getCaseStudiesHeader();
      const cards = getCaseStudiesCards();

      if (header) gsap.set(header, { opacity: 0, y: 24 });
      if (cards.length) gsap.set(cards, { opacity: 0, y: 36 });

      try {
        if (prefersReducedMotion) {
          scrollToSectionId(scrollContainerRefRef.current.current, SECTION6_ID);
          setActiveSectionIdRef.current(SECTION6_ID);
          setCaseStudiesTransitionReadyRef.current(true);
          return true;
        }

        gsap.set(overlay, { autoAlpha: 1, zIndex: TRANSITION_OVERLAY_Z });
        gsap.set(image5, { autoAlpha: 1 });
        gsap.set(image6, { autoAlpha: 0 });
        gsap.set(shadow, { autoAlpha: 0 });

        if (ecosystemContent) {
          gsap.set(ecosystemContent, { opacity: 1 });
        }

        await new Promise<void>((resolve, reject) => {
          const timeline = gsap.timeline({
            onComplete: resolve,
            onInterrupt: () => reject(new Error("interrupted")),
          });

          timeline.to(
            image5,
            {
              autoAlpha: 0,
              duration: SECTION56_FORWARD_IMAGE_FADE,
              ease: "power2.inOut",
            },
            0,
          );
          timeline.to(
            image6,
            {
              autoAlpha: SECTION6_IMAGE_OPACITY,
              duration: SECTION56_FORWARD_IMAGE_FADE,
              ease: "power2.inOut",
            },
            0,
          );

          if (ecosystemContent) {
            timeline.to(
              ecosystemContent,
              {
                opacity: 0,
                duration: SECTION56_FORWARD_CONTENT_FADE,
                ease: "power2.in",
              },
              SECTION56_FORWARD_CONTENT_OVERLAP,
            );
          }

          timeline.to(
            shadow,
            {
              autoAlpha: SECTION6_SHADOW_OPACITY,
              duration: SECTION56_FORWARD_SHADOW_FADE,
              ease: "power2.inOut",
            },
            SECTION56_FORWARD_SHADOW_OVERLAP,
          );
        });

        scrollToSectionId(scrollContainerRefRef.current.current, SECTION6_ID);
        setActiveSectionIdRef.current(SECTION6_ID);
        setCaseStudiesTransitionReadyRef.current(true);

        if (isDesktopViewport()) {
          showSection6Idle();
        } else {
          hideOverlay();
        }

        return true;
      } catch {
        return false;
      } finally {
        runningRef.current = false;
        setIsSection56TransitioningRef.current(false);
      }
    };

    const runBackward = async (): Promise<boolean> => {
      if (runningRef.current) return false;
      runningRef.current = true;
      setIsSection56TransitioningRef.current(true);
      setCaseStudiesTransitionReadyRef.current(false);
      setEcosystemTransitionReadyRef.current(false);
      setOverlayElevated(true);

      const ecosystemContent = getEcosystemContent();
      const header = getCaseStudiesHeader();
      const cards = getCaseStudiesCards();

      if (ecosystemContent) {
        gsap.set(ecosystemContent, { opacity: 0 });
      }

      try {
        if (prefersReducedMotion) {
          scrollToSectionId(scrollContainerRefRef.current.current, SECTION5_ID);
          setActiveSectionIdRef.current(SECTION5_ID);
          return true;
        }

        gsap.set(overlay, { autoAlpha: 1, zIndex: TRANSITION_OVERLAY_Z });
        gsap.set(image6, { autoAlpha: SECTION6_IMAGE_OPACITY });
        gsap.set(image5, { autoAlpha: 0 });
        gsap.set(shadow, { autoAlpha: SECTION6_SHADOW_OPACITY });

        await new Promise<void>((resolve, reject) => {
          const timeline = gsap.timeline({
            onComplete: resolve,
            onInterrupt: () => reject(new Error("interrupted")),
          });

          if (cards.length) {
            timeline.to(
              cards,
              {
                opacity: 0,
                y: 16,
                duration: SECTION56_BACKWARD_CONTENT_FADE,
                stagger: { each: SECTION56_BACKWARD_CARD_STAGGER, from: "end" },
                ease: "power2.in",
              },
              0,
            );
          }

          if (header) {
            timeline.to(
              header,
              {
                opacity: 0,
                y: 16,
                duration: SECTION56_BACKWARD_CONTENT_FADE,
                ease: "power2.in",
              },
              0,
            );
          }

          const crossfadeStart = SECTION56_BACKWARD_CROSSFADE_OVERLAP;

          timeline.to(
            image5,
            {
              autoAlpha: 1,
              duration: SECTION56_BACKWARD_IMAGE_FADE,
              ease: "power2.inOut",
            },
            crossfadeStart,
          );

          timeline.to(
            shadow,
            {
              autoAlpha: 0,
              duration: SECTION56_BACKWARD_IMAGE_FADE * 0.85,
              ease: "power2.inOut",
            },
            crossfadeStart,
          );

          timeline.to(
            image6,
            {
              autoAlpha: 0,
              duration: SECTION56_BACKWARD_IMAGE_FADE * 0.85,
              ease: "power2.inOut",
            },
            crossfadeStart,
          );
        });

        showTransitionCoverWithImage5();

        if (isDesktopViewport()) {
          finalizeSection5Background();
        }

        scrollToSectionId(scrollContainerRefRef.current.current, SECTION5_ID);
        setActiveSectionIdRef.current(SECTION5_ID);

        if (ecosystemContent) {
          gsap.set(ecosystemContent, { opacity: 1 });
        }

        if (!isDesktopViewport()) {
          hideOverlay();
        }

        return true;
      } catch {
        return false;
      } finally {
        runningRef.current = false;
        setIsSection56TransitioningRef.current(false);
        setEcosystemTransitionReadyRef.current(true);
      }
    };

    section56HandlersRef.current = {
      startForward: runForward,
      startBackward: runBackward,
    };

    return () => {
      section56HandlersRef.current = null;
    };
  }, [
    section56HandlersRef,
    hideOverlay,
    showSection6Idle,
    setOverlayElevated,
    showTransitionCoverWithImage5,
    finalizeSection5Background,
  ]);

  return (
    <div
      ref={overlayRef}
      className="pointer-events-none fixed inset-0 z-[100] overflow-hidden bg-black opacity-0"
      aria-hidden
    >
      <div ref={image6Ref} className="absolute inset-0 z-0">
        <Image
          src={SECTION6_IMAGE_SRC}
          alt=""
          fill
          unoptimized
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>

      <div
        ref={shadowRef}
        className="absolute inset-0 z-10 bg-black"
        style={{ opacity: 0 }}
        aria-hidden
      />

      <div ref={image5Ref} className="absolute inset-0 z-20">
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
