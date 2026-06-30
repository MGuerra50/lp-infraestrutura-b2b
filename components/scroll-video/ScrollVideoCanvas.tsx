"use client";

import gsap from "gsap";
import { useCallback, useEffect, useRef, useState } from "react";
import { useFullPageScroll } from "@/components/scroll/FullPageScrollContext";
import {
  hidePanel,
  resetColumnPanels,
  showPanel,
  showPanelWithReveal,
  swapColumnContent,
} from "@/lib/scroll-video/columnAnimations";
import { createFramePlayer } from "@/lib/scroll-video/framePlayer";
import { FRAME_RANGES } from "@/lib/scroll-video/frames";
import {
  getFramesSnapshot,
  isAllFramesReady,
  startFramePreload,
  subscribeFramePreloadProgress,
} from "@/lib/scroll-video/preloadFrames";
import {
  getSectionFrameTransition,
  type VideoSectionId,
} from "@/lib/scroll-video/sectionFrameTransitions";

const { firstHalf, secondHalf } = FRAME_RANGES;

function drawFrameToCanvas(
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
) {
  const context = canvas.getContext("2d");
  if (!context || !image.complete || !image.naturalWidth) return;

  const dpr = window.devicePixelRatio || 1;
  const { clientWidth, clientHeight } = canvas;

  canvas.width = clientWidth * dpr;
  canvas.height = clientHeight * dpr;
  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  context.clearRect(0, 0, clientWidth, clientHeight);

  const scale = Math.max(
    clientWidth / image.naturalWidth,
    clientHeight / image.naturalHeight,
  );
  const width = image.naturalWidth * scale;
  const height = image.naturalHeight * scale;
  const x = (clientWidth - width) / 2;
  const y = (clientHeight - height) / 2;

  context.drawImage(image, x, y, width, height);
}

function getContentPanel(
  column: HTMLElement | null,
  sectionId: "social-proof" | "plataforma",
) {
  return column?.querySelector<HTMLElement>(
    `[data-content-panel="${sectionId}"]`,
  ) ?? null;
}

type ScrollVideoCanvasProps = {
  columnRef: React.RefObject<HTMLDivElement | null>;
};

export function ScrollVideoCanvas({ columnRef }: ScrollVideoCanvasProps) {
  const { activeSectionId } = useFullPageScroll();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const frameIndexRef = useRef(0);
  const previousSectionRef = useRef<string | null>(null);
  const contentTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const framePlayerRef = useRef<ReturnType<typeof createFramePlayer> | null>(
    null,
  );
  const [hasFirstFrame, setHasFirstFrame] = useState(() => {
    const snapshot = getFramesSnapshot();
    return Boolean(snapshot?.[0]?.complete && snapshot[0].naturalWidth);
  });
  const [isFullyReady, setIsFullyReady] = useState(isAllFramesReady());

  const isVideoSection =
    activeSectionId === "social-proof" || activeSectionId === "plataforma";

  const drawFirstFrame = useCallback(() => {
    const canvas = canvasRef.current;
    const snapshot = getFramesSnapshot();
    const firstFrame = snapshot?.[0];

    if (!canvas || !firstFrame?.complete || !firstFrame.naturalWidth) return;

    if (snapshot) {
      imagesRef.current = snapshot;
    }

    drawFrameToCanvas(canvas, firstFrame);
    frameIndexRef.current = 0;
  }, []);

  useEffect(() => {
    let isMounted = true;

    startFramePreload();

    const unsubscribe = subscribeFramePreloadProgress((loaded) => {
      if (!isMounted || loaded < 1) return;

      const snapshot = getFramesSnapshot();
      if (!snapshot?.[0]) return;

      imagesRef.current = snapshot;
      setHasFirstFrame(true);
      drawFirstFrame();
    });

    startFramePreload().then((images) => {
      if (!isMounted) return;

      imagesRef.current = images;
      setHasFirstFrame(true);
      setIsFullyReady(true);
      drawFirstFrame();
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [drawFirstFrame]);

  useEffect(() => {
    if (!hasFirstFrame) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const renderFrame = (index: number) => {
      const image = imagesRef.current[index];
      if (!image?.complete || !image.naturalWidth) {
        drawFirstFrame();
        return;
      }

      frameIndexRef.current = index;
      drawFrameToCanvas(canvas, image);
    };

    framePlayerRef.current = createFramePlayer(renderFrame);

    const handleResize = () => {
      const image = imagesRef.current[frameIndexRef.current];
      if (image?.complete && image.naturalWidth) {
        drawFrameToCanvas(canvas, image);
      } else {
        drawFirstFrame();
      }
    };

    window.addEventListener("resize", handleResize);
    drawFirstFrame();

    if (prefersReducedMotion) {
      renderFrame(0);
      return () => window.removeEventListener("resize", handleResize);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      framePlayerRef.current?.stop();
      contentTimelineRef.current?.kill();
    };
  }, [drawFirstFrame, hasFirstFrame]);

  useEffect(() => {
    if (!hasFirstFrame) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const column = columnRef.current;
    const socialPanel = getContentPanel(column, "social-proof");
    const platformPanel = getContentPanel(column, "plataforma");
    const framePlayer = framePlayerRef.current;

    contentTimelineRef.current?.kill();
    contentTimelineRef.current = null;

    const previousSection = previousSectionRef.current as VideoSectionId | null;
    previousSectionRef.current = activeSectionId;

    const isVideoTarget =
      activeSectionId === "social-proof" || activeSectionId === "plataforma";

    if (isVideoTarget && !isFullyReady) {
      drawFirstFrame();
    }

    if (!framePlayer) return;

    const transition =
      isFullyReady && isVideoTarget
        ? getSectionFrameTransition(
            previousSection,
            activeSectionId as VideoSectionId,
            frameIndexRef.current,
          )
        : null;

    if (activeSectionId === "social-proof") {
      if (prefersReducedMotion) {
        framePlayer.renderOnce(
          previousSection === "plataforma" ? firstHalf.start : firstHalf.end,
        );
        hidePanel(platformPanel);
        showPanel(socialPanel);
        socialPanel
          ?.querySelectorAll<HTMLElement>("[data-scroll-char]")
          .forEach((char) => gsap.set(char, { opacity: 1, y: 0 }));
        return;
      }

      if (transition) {
        framePlayer.playRange(transition.from, transition.to, 1.35);
      } else if (!isFullyReady) {
        framePlayer.renderOnce(firstHalf.start);
      }

      if (previousSection === "plataforma") {
        contentTimelineRef.current = swapColumnContent(platformPanel, socialPanel);
        return;
      }

      hidePanel(platformPanel);
      contentTimelineRef.current = showPanelWithReveal(socialPanel);
      return;
    }

    if (activeSectionId === "plataforma") {
      if (prefersReducedMotion) {
        framePlayer.renderOnce(secondHalf.end);
        hidePanel(socialPanel);
        showPanel(platformPanel);
        platformPanel
          ?.querySelectorAll<HTMLElement>("[data-scroll-char]")
          .forEach((char) => gsap.set(char, { opacity: 1, y: 0 }));
        return;
      }

      if (transition) {
        framePlayer.playRange(transition.from, transition.to, 1.35);
      } else if (!isFullyReady) {
        framePlayer.renderOnce(firstHalf.start);
      }

      if (previousSection === "social-proof") {
        contentTimelineRef.current = swapColumnContent(socialPanel, platformPanel);
        return;
      }

      hidePanel(socialPanel);
      contentTimelineRef.current = showPanelWithReveal(platformPanel);
      return;
    }

    if (activeSectionId === "recursos-tecnicos" || activeSectionId === "hero") {
      framePlayer.stop();

      const leavingPanel =
        previousSection === "social-proof"
          ? socialPanel
          : previousSection === "plataforma"
            ? platformPanel
            : null;

      if (leavingPanel && !prefersReducedMotion) {
        contentTimelineRef.current = gsap.timeline();
        contentTimelineRef.current.to(leavingPanel, {
          opacity: 0,
          duration: 0.45,
          ease: "power2.in",
        });
        contentTimelineRef.current.call(() => resetColumnPanels(column), [], 0.5);
      } else {
        resetColumnPanels(column);
      }

      return;
    }

    if (transition) {
      framePlayer.playRange(transition.from, transition.to, 1.1);
    } else {
      framePlayer.stop();
    }

    resetColumnPanels(column);
  }, [activeSectionId, columnRef, drawFirstFrame, hasFirstFrame, isFullyReady]);

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-0 bg-[#050505] transition-opacity duration-700 ease-in-out ${
        isVideoSection && hasFirstFrame ? "opacity-100" : "opacity-0"
      }`}
      aria-hidden={!isVideoSection}
    >
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
