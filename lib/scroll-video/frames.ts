export const SCROLL_VIDEO = {
  frameCount: 300,
  basePath: "/frames",
} as const;

const HALF_FRAME_COUNT = Math.floor(SCROLL_VIDEO.frameCount / 2);

export const FRAME_RANGES = {
  firstHalf: {
    start: 0,
    end: HALF_FRAME_COUNT - 1,
  },
  secondHalf: {
    start: HALF_FRAME_COUNT,
    end: SCROLL_VIDEO.frameCount - 1,
  },
} as const;

export function getFramePath(frameIndex: number) {
  const clampedIndex = Math.max(
    0,
    Math.min(frameIndex, SCROLL_VIDEO.frameCount - 1),
  );

  return `${SCROLL_VIDEO.basePath}/frame_${String(clampedIndex + 1).padStart(4, "0")}.png`;
}

export function getFramePaths() {
  return Array.from({ length: SCROLL_VIDEO.frameCount }, (_, index) =>
    getFramePath(index),
  );
}
