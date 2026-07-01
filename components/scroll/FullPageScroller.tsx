"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { Section4To5ImageTransition } from "@/components/section-transition/Section4To5ImageTransition";
import { Section5To6Transition } from "@/components/section-transition/Section5To6Transition";
import {
  getClosestSnapIndex,
  getSectionIdAtScroll,
  getSnapTargets,
} from "@/lib/scroll/fullPageSnap";
import {
  FullPageScrollProvider,
  SECTION4_ID,
  SECTION5_ID,
  SECTION6_ID,
  useFullPageScroll,
} from "./FullPageScrollContext";

const SCROLL_LOCK_MS = 900;
const WHEEL_THRESHOLD = 28;

function FullPageScrollerInner({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    scrollContainerRef,
    isSection45Transitioning,
    isSection56Transitioning,
    section45HandlersRef,
    section56HandlersRef,
    activeSectionId,
  } = useFullPageScroll();
  const lockRef = useRef(false);
  const touchStartYRef = useRef<number | null>(null);
  const isSection45TransitioningRef = useRef(isSection45Transitioning);
  const isSection56TransitioningRef = useRef(isSection56Transitioning);
  isSection45TransitioningRef.current = isSection45Transitioning;
  isSection56TransitioningRef.current = isSection56Transitioning;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    scrollContainerRef.current = container;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) return;

    const isTransitioning = () =>
      isSection45TransitioningRef.current || isSection56TransitioningRef.current;

    const getCurrentSectionId = () =>
      getSectionIdAtScroll(container, container.scrollTop) ?? activeSectionId;

    const scrollToTop = (top: number) => {
      if (lockRef.current || isTransitioning()) return;

      lockRef.current = true;
      container.scrollTo({ top, behavior: "smooth" });

      window.setTimeout(() => {
        lockRef.current = false;
      }, SCROLL_LOCK_MS);
    };

    const trySection45Transition = async (direction: 1 | -1) => {
      const currentSectionId = getCurrentSectionId();
      const handlers = section45HandlersRef.current;

      if (direction === 1 && currentSectionId === SECTION4_ID && handlers) {
        try {
          lockRef.current = true;
          return await handlers.startForward();
        } finally {
          lockRef.current = false;
        }
      }

      if (direction === -1 && currentSectionId === SECTION5_ID && handlers) {
        try {
          lockRef.current = true;
          return await handlers.startBackward();
        } finally {
          lockRef.current = false;
        }
      }

      return false;
    };

    const trySection56Transition = async (direction: 1 | -1) => {
      const currentSectionId = getCurrentSectionId();
      const handlers = section56HandlersRef.current;

      if (direction === 1 && currentSectionId === SECTION5_ID && handlers) {
        try {
          lockRef.current = true;
          return await handlers.startForward();
        } finally {
          lockRef.current = false;
        }
      }

      if (direction === -1 && currentSectionId === SECTION6_ID && handlers) {
        try {
          lockRef.current = true;
          return await handlers.startBackward();
        } finally {
          lockRef.current = false;
        }
      }

      return false;
    };

    const tryCustomTransition = async (direction: 1 | -1) => {
      const handled45 = await trySection45Transition(direction);
      if (handled45) return true;

      const handled56 = await trySection56Transition(direction);
      if (handled56) return true;

      return false;
    };

    const navigateByDirection = async (direction: 1 | -1) => {
      if (lockRef.current || isTransitioning()) return;

      const targets = getSnapTargets(container);
      if (!targets.length) return;

      const currentSnap = getClosestSnapIndex(container.scrollTop, targets);
      const nextSnap = currentSnap + direction;

      if (nextSnap < 0 || nextSnap >= targets.length) return;

      const currentTarget = targets[currentSnap];
      const nextTarget = targets[nextSnap];

      if (!currentTarget || !nextTarget) return;

      if (currentTarget.sectionId !== nextTarget.sectionId) {
        const handled = await tryCustomTransition(direction);
        if (handled) return;
      }

      scrollToTop(nextTarget.top);
    };

    const handleWheel = async (event: WheelEvent) => {
      if (Math.abs(event.deltaY) < WHEEL_THRESHOLD) return;

      event.preventDefault();
      await navigateByDirection(event.deltaY > 0 ? 1 : -1);
    };

    const handleTouchStart = (event: TouchEvent) => {
      touchStartYRef.current = event.touches[0]?.clientY ?? null;
    };

    const handleTouchEnd = async (event: TouchEvent) => {
      const startY = touchStartYRef.current;
      const endY = event.changedTouches[0]?.clientY;

      touchStartYRef.current = null;
      if (startY == null || endY == null) return;

      const deltaY = startY - endY;
      if (Math.abs(deltaY) < 48) return;

      await navigateByDirection(deltaY > 0 ? 1 : -1);
    };

    const handleKeyDown = async (event: KeyboardEvent) => {
      if (lockRef.current || isTransitioning()) return;

      if (event.key === "ArrowDown" || event.key === "PageDown") {
        event.preventDefault();
        await navigateByDirection(1);
      }

      if (event.key === "ArrowUp" || event.key === "PageUp") {
        event.preventDefault();
        await navigateByDirection(-1);
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    container.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    scrollContainerRef,
    section45HandlersRef,
    section56HandlersRef,
    activeSectionId,
  ]);

  return (
    <div
      ref={containerRef}
      className="h-dvh snap-y snap-mandatory overflow-y-auto overscroll-none"
    >
      {children}
    </div>
  );
}

export function FullPageScroller({ children }: { children: ReactNode }) {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  return (
    <FullPageScrollProvider scrollContainerRef={scrollContainerRef}>
      <Section4To5ImageTransition />
      <Section5To6Transition />
      <FullPageScrollerInner>{children}</FullPageScrollerInner>
    </FullPageScrollProvider>
  );
}
