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
  SECTION56_CONTENT_FADE_DURATION,
  SECTION56_IMAGE_FADE_DURATION,
  SECTION56_SHADOW_FADE_DURATION,
  SECTION56_CARD_STAGGER,
  SECTION6_IMAGE_OPACITY,
  SECTION6_IMAGE_SRC,
  SECTION6_SHADOW_OPACITY,
} from "@/lib/section-transition/section56Constants";

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
    setIsSection56Transitioning,
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
  const setIsSection56TransitioningRef = useRef(setIsSection56Transitioning);
  const scrollContainerRefRef = useRef(scrollContainerRef);

  setActiveSectionIdRef.current = setActiveSectionId;
  setCaseStudiesTransitionReadyRef.current = setCaseStudiesTransitionReady;
  setIsSection56TransitioningRef.current = setIsSection56Transitioning;
  scrollContainerRefRef.current = scrollContainerRef;

  const hideOverlay = useCallback(() => {
    const overlay = overlayRef.current;
    const image5 = image5Ref.current;
    const image6 = image6Ref.current;
    const shadow = shadowRef.current;
    if (!overlay || !image5 || !image6 || !shadow) return;

    gsap.set(overlay, { autoAlpha: 0 });
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

    gsap.set(overlay, { autoAlpha: 1 });
    gsap.set(image5, { autoAlpha: 0 });
    gsap.set(image6, { autoAlpha: SECTION6_IMAGE_OPACITY });
    gsap.set(shadow, { autoAlpha: SECTION6_SHADOW_OPACITY });
  }, []);

  const syncIdleOverlay = useCallback(() => {
    if (runningRef.current) return;

    if (activeSectionId === SECTION6_ID && isDesktopViewport()) {
      showSection6Idle();
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

        gsap.set(overlay, { autoAlpha: 1 });
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
              duration: SECTION56_IMAGE_FADE_DURATION,
              ease: "power2.inOut",
            },
            0,
          );
          timeline.to(
            image6,
            {
              autoAlpha: SECTION6_IMAGE_OPACITY,
              duration: SECTION56_IMAGE_FADE_DURATION,
              ease: "power2.inOut",
            },
            0,
          );

          if (ecosystemContent) {
            timeline.to(
              ecosystemContent,
              {
                opacity: 0,
                duration: SECTION56_CONTENT_FADE_DURATION,
                ease: "power2.inOut",
              },
              SECTION56_IMAGE_FADE_DURATION,
            );
          }

          timeline.to(
            shadow,
            {
              autoAlpha: SECTION6_SHADOW_OPACITY,
              duration: SECTION56_SHADOW_FADE_DURATION,
              ease: "power2.inOut",
            },
            SECTION56_IMAGE_FADE_DURATION + SECTION56_CONTENT_FADE_DURATION,
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

      const ecosystemContent = getEcosystemContent();
      const header = getCaseStudiesHeader();
      const cards = getCaseStudiesCards();

      try {
        if (prefersReducedMotion) {
          scrollToSectionId(scrollContainerRefRef.current.current, SECTION5_ID);
          setActiveSectionIdRef.current(SECTION5_ID);
          return true;
        }

        gsap.set(overlay, { autoAlpha: 1 });
        gsap.set(image5, { autoAlpha: 0 });
        gsap.set(image6, { autoAlpha: SECTION6_IMAGE_OPACITY });
        gsap.set(shadow, { autoAlpha: SECTION6_SHADOW_OPACITY });

        if (ecosystemContent) {
          gsap.set(ecosystemContent, { opacity: 0 });
        }

        await new Promise<void>((resolve, reject) => {
          const timeline = gsap.timeline({
            onComplete: resolve,
            onInterrupt: () => reject(new Error("interrupted")),
          });

          if (cards.length) {
            timeline.to(cards, {
              opacity: 0,
              y: 24,
              duration: SECTION56_CONTENT_FADE_DURATION,
              stagger: { each: SECTION56_CARD_STAGGER, from: "end" },
              ease: "power2.inOut",
            });
          }

          const cardsDuration =
            cards.length > 0
              ? (cards.length - 1) * SECTION56_CARD_STAGGER +
                SECTION56_CONTENT_FADE_DURATION
              : 0;

          if (header) {
            timeline.to(
              header,
              {
                opacity: 0,
                y: 24,
                duration: SECTION56_CONTENT_FADE_DURATION,
                ease: "power2.inOut",
              },
              cardsDuration,
            );
          }

          const contentEnd =
            cardsDuration +
            (header ? SECTION56_CONTENT_FADE_DURATION : 0);

          timeline.to(
            shadow,
            {
              autoAlpha: 0,
              duration: SECTION56_SHADOW_FADE_DURATION,
              ease: "power2.inOut",
            },
            contentEnd,
          );

          timeline.to(
            image6,
            {
              autoAlpha: 0,
              duration: SECTION56_IMAGE_FADE_DURATION,
              ease: "power2.inOut",
            },
            contentEnd + SECTION56_SHADOW_FADE_DURATION,
          );
          timeline.to(
            image5,
            {
              autoAlpha: 1,
              duration: SECTION56_IMAGE_FADE_DURATION,
              ease: "power2.inOut",
            },
            contentEnd + SECTION56_SHADOW_FADE_DURATION,
          );
        });

        scrollToSectionId(scrollContainerRefRef.current.current, SECTION5_ID);
        setActiveSectionIdRef.current(SECTION5_ID);

        if (ecosystemContent) {
          await gsap.to(ecosystemContent, {
            opacity: 1,
            duration: SECTION56_CONTENT_FADE_DURATION,
            ease: "power2.inOut",
          });
        }

        hideOverlay();

        return true;
      } catch {
        return false;
      } finally {
        runningRef.current = false;
        setIsSection56TransitioningRef.current(false);
      }
    };

    section56HandlersRef.current = {
      startForward: runForward,
      startBackward: runBackward,
    };

    return () => {
      section56HandlersRef.current = null;
    };
  }, [section56HandlersRef, hideOverlay, showSection6Idle]);

  return (
    <div
      ref={overlayRef}
      className="pointer-events-none fixed inset-0 z-[100] overflow-hidden opacity-0"
      aria-hidden
    >
      <div ref={image5Ref} className="absolute inset-0">
        <Image
          src={SECTION5_IMAGE_SRC}
          alt=""
          fill
          unoptimized
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>

      <div ref={image6Ref} className="absolute inset-0 opacity-0">
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
        className="absolute inset-0 bg-black"
        style={{ opacity: 0 }}
        aria-hidden
      />
    </div>
  );
}
