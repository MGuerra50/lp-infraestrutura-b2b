import gsap from "gsap";
import { animateScrollReveal } from "@/lib/scroll-video/animateScrollReveal";

function resetPanelChars(panel: HTMLElement) {
  panel.querySelectorAll<HTMLElement>("[data-scroll-char]").forEach((char) => {
    gsap.killTweensOf(char);
    gsap.set(char, { opacity: 0, y: 24 });
  });
}

export function revealPanelContent(
  panel: HTMLElement | null,
  timeline?: gsap.core.Timeline,
  startAt = 0,
) {
  if (!panel) return timeline ?? gsap.timeline();

  const reveals = panel.querySelectorAll<HTMLElement>("[data-scroll-reveal]");
  const activeTimeline = timeline ?? gsap.timeline();

  reveals.forEach((element, index) => {
    animateScrollReveal(
      element,
      activeTimeline,
      startAt + index * 0.03,
      0.22,
    );
  });

  return activeTimeline;
}

export function showPanel(panel: HTMLElement | null) {
  if (!panel) return;
  gsap.set(panel, { opacity: 1 });
}

export function hidePanel(panel: HTMLElement | null) {
  if (!panel) return;
  gsap.killTweensOf(panel);
  gsap.set(panel, { opacity: 0 });
  resetPanelChars(panel);
}

export function swapColumnContent(
  fromPanel: HTMLElement | null,
  toPanel: HTMLElement | null,
) {
  const timeline = gsap.timeline();

  if (fromPanel) {
    timeline.to(fromPanel, { opacity: 0, duration: 0.35, ease: "power2.in" });
    timeline.call(() => resetPanelChars(fromPanel));
  }

  if (toPanel) {
    timeline.set(toPanel, { opacity: 1 }, fromPanel ? "-=0.05" : 0);
    revealPanelContent(toPanel, timeline, 0.1);
  }

  return timeline;
}

export function showPanelWithReveal(panel: HTMLElement | null) {
  const timeline = gsap.timeline();

  if (panel) {
    timeline.set(panel, { opacity: 1 });
    revealPanelContent(panel, timeline, 0.05);
  }

  return timeline;
}

export function resetColumnPanels(column: HTMLElement | null) {
  if (!column) return;

  column.querySelectorAll<HTMLElement>("[data-content-panel]").forEach((panel) => {
    hidePanel(panel);
  });
}
