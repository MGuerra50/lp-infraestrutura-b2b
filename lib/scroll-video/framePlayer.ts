import gsap from "gsap";

function clampFrameIndex(value: number, from: number, to: number) {
  const lo = Math.min(from, to);
  const hi = Math.max(from, to);
  return Math.max(lo, Math.min(hi, Math.round(value)));
}

export function createFramePlayer(renderFrame: (index: number) => void) {
  let activeTween: gsap.core.Tween | null = null;
  let lastRenderedIndex = -1;

  const renderOnce = (index: number, force = false) => {
    if (!force && index === lastRenderedIndex) return;
    lastRenderedIndex = index;
    renderFrame(index);
  };

  const playRange = (from: number, to: number, duration = 1.4) => {
    activeTween?.kill();
    lastRenderedIndex = -1;

    if (from === to) {
      renderOnce(to, true);
      return null;
    }

    const state = { value: from };
    renderOnce(from, true);

    activeTween = gsap.to(state, {
      value: to,
      duration,
      ease: "none",
      onUpdate: () => {
        renderOnce(clampFrameIndex(state.value, from, to));
      },
      onComplete: () => {
        renderOnce(to, true);
        activeTween = null;
      },
    });

    return activeTween;
  };

  const stop = () => {
    activeTween?.kill();
    activeTween = null;
  };

  return { playRange, stop, renderOnce };
};
