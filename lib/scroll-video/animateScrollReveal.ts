import gsap from "gsap";

export function animateScrollReveal(
  container: HTMLElement | null,
  timeline: gsap.core.Timeline,
  position: number,
  duration = 0.22,
) {
  if (!container) return;

  const chars = container.querySelectorAll<HTMLElement>("[data-scroll-char]");
  if (!chars.length) return;

  const offsets = Array.from(chars).map(() => 18 + Math.random() * 28);

  timeline.fromTo(
    chars,
    {
      y: (index) => offsets[index] ?? 24,
      opacity: 0,
    },
    {
      y: 0,
      opacity: 1,
      duration,
      stagger: { each: 0.01 },
      ease: "power3.out",
    },
    position,
  );
}
