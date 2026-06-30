"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { Section4To5ImageTransition } from "@/components/section-transition/Section4To5ImageTransition";
import {
  FullPageScrollProvider,
  SECTION4_ID,
  SECTION5_ID,
  useFullPageScroll,
} from "./FullPageScrollContext";

const SCROLL_LOCK_MS = 900;
const WHEEL_THRESHOLD = 28;

function FullPageScrollerInner({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    scrollContainerRef,
    isSection45Transitioning,
    section45HandlersRef,
    activeSectionId,
  } = useFullPageScroll();
  const lockRef = useRef(false);
  const touchStartYRef = useRef<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    scrollContainerRef.current = container;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) return;

    const getSections = () =>
      Array.from(
        container.querySelectorAll<HTMLElement>("[data-fullpage-section]"),
      );

    const getCurrentIndex = () => {
      const viewportHeight = container.clientHeight;
      if (!viewportHeight) return 0;

      return Math.round(container.scrollTop / viewportHeight);
    };

    const getCurrentSectionId = () => {
      const sections = getSections();
      const currentIndex = getCurrentIndex();
      return sections[currentIndex]?.getAttribute("data-fullpage-section");
    };

    const scrollToIndex = (index: number) => {
      const sections = getSections();
      const target = sections[index];
      if (!target || lockRef.current || isSection45Transitioning) return;

      lockRef.current = true;
      target.scrollIntoView({ behavior: "smooth", block: "start" });

      window.setTimeout(() => {
        lockRef.current = false;
      }, SCROLL_LOCK_MS);
    };

    const trySection45Transition = async (direction: 1 | -1) => {
      const currentSectionId = getCurrentSectionId() ?? activeSectionId;

      if (
        direction === 1 &&
        currentSectionId === SECTION4_ID &&
        section45HandlersRef.current
      ) {
        lockRef.current = true;
        await section45HandlersRef.current.startForward();
        lockRef.current = false;
        return true;
      }

      if (
        direction === -1 &&
        currentSectionId === SECTION5_ID &&
        section45HandlersRef.current
      ) {
        lockRef.current = true;
        await section45HandlersRef.current.startBackward();
        lockRef.current = false;
        return true;
      }

      return false;
    };

    const handleWheel = async (event: WheelEvent) => {
      if (Math.abs(event.deltaY) < WHEEL_THRESHOLD) return;

      event.preventDefault();

      if (lockRef.current || isSection45Transitioning) return;

      const sections = getSections();
      const currentIndex = getCurrentIndex();
      const direction = event.deltaY > 0 ? 1 : -1;
      const nextIndex = currentIndex + direction;

      if (nextIndex < 0 || nextIndex >= sections.length) return;

      const handled = await trySection45Transition(direction);
      if (handled) return;

      scrollToIndex(nextIndex);
    };

    const handleTouchStart = (event: TouchEvent) => {
      touchStartYRef.current = event.touches[0]?.clientY ?? null;
    };

    const handleTouchEnd = async (event: TouchEvent) => {
      const startY = touchStartYRef.current;
      const endY = event.changedTouches[0]?.clientY;

      touchStartYRef.current = null;
      if (startY == null || endY == null || lockRef.current) return;

      const deltaY = startY - endY;
      if (Math.abs(deltaY) < 48) return;

      if (lockRef.current || isSection45Transitioning) return;

      const sections = getSections();
      const currentIndex = getCurrentIndex();
      const direction = deltaY > 0 ? 1 : -1;
      const nextIndex = currentIndex + direction;

      if (nextIndex < 0 || nextIndex >= sections.length) return;

      const handled = await trySection45Transition(direction);
      if (handled) return;

      scrollToIndex(nextIndex);
    };

    const handleKeyDown = async (event: KeyboardEvent) => {
      if (lockRef.current || isSection45Transitioning) return;

      const sections = getSections();
      const currentIndex = getCurrentIndex();

      if (event.key === "ArrowDown" || event.key === "PageDown") {
        event.preventDefault();

        const handled = await trySection45Transition(1);
        if (handled) return;

        scrollToIndex(currentIndex + 1);
      }

      if (event.key === "ArrowUp" || event.key === "PageUp") {
        event.preventDefault();

        const handled = await trySection45Transition(-1);
        if (handled) return;

        scrollToIndex(currentIndex - 1);
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
    isSection45Transitioning,
    section45HandlersRef,
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
      <FullPageScrollerInner>{children}</FullPageScrollerInner>
    </FullPageScrollProvider>
  );
}
