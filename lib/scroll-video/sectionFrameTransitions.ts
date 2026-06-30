import { FRAME_RANGES } from "@/lib/scroll-video/frames";

export type VideoSectionId = "hero" | "social-proof" | "plataforma";

const SECTION_ORDER: VideoSectionId[] = [
  "hero",
  "social-proof",
  "plataforma",
];

const { firstHalf, secondHalf } = FRAME_RANGES;

function getSectionIndex(section: VideoSectionId) {
  return SECTION_ORDER.indexOf(section);
}

function isBackwardTransition(
  previousSection: VideoSectionId | null,
  nextSection: VideoSectionId,
) {
  if (!previousSection) return false;

  return getSectionIndex(nextSection) < getSectionIndex(previousSection);
}

export function getSectionFrameTransition(
  previousSection: VideoSectionId | null,
  nextSection: VideoSectionId,
  currentFrame: number,
): { from: number; to: number } | null {
  const backward = isBackwardTransition(previousSection, nextSection);

  if (nextSection === "social-proof") {
    if (backward) {
      return {
        from: Math.max(currentFrame, secondHalf.start),
        to: firstHalf.start,
      };
    }

    return { from: firstHalf.start, to: firstHalf.end };
  }

  if (nextSection === "plataforma") {
    if (backward) {
      return null;
    }

    const from = Math.min(currentFrame, secondHalf.end);

    return { from, to: secondHalf.end };
  }

  if (nextSection === "hero" && currentFrame > firstHalf.start) {
    return { from: currentFrame, to: firstHalf.start };
  }

  return null;
}
