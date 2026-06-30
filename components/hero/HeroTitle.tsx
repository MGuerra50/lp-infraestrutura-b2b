"use client";

import gsap from "gsap";
import { useEffect, useRef, useState, type MutableRefObject } from "react";

const TITLE_LINES = [
  { id: "infraestrutura", text: "INFRAESTRUTURA", highlight: true },
  { id: "performance", text: "B2B DE ALTA PERFORMANCE", highlight: false },
] as const;

const ALL_LETTERS = TITLE_LINES.flatMap((line) => line.text.split(""));
const INTRO_STORAGE_KEY = "hero-intro-seen";
const INTRO_DELAY_MS = 800;
const MOUSE_RADIUS = 110;
const MOUSE_STRENGTH = 32;

const TITLE_BASE_CLASS =
  "text-[clamp(1.35rem,2.8vw,3.75rem)] font-bold uppercase leading-none tracking-tight";

const HIGHLIGHT_WORD_CLASS = "text-brand";
const DEFAULT_WORD_CLASS = "text-black";
const HIGHLIGHT_LETTER_COUNT = TITLE_LINES[0].text.length;

type SplitData = {
  matches1: HTMLElement[];
  matches2: HTMLElement[];
  unmatched1: HTMLElement[];
  unmatched2: HTMLElement[];
};

function findFirstMatch(word: string, collection: HTMLElement[]) {
  const normalized = word.replace(/\s/g, "");

  for (let index = 0; index < collection.length; index += 1) {
    if (collection[index].textContent?.replace(/\s/g, "") === normalized) {
      return index;
    }
  }

  return -1;
}

function compareSplits(elements1: HTMLElement[], elements2: HTMLElement[]): SplitData {
  const matches1: HTMLElement[] = [];
  const matches2: HTMLElement[] = [];
  const unmatched1 = [...elements1];
  const unmatched2 = [...elements2];

  let index = 0;

  while (index < unmatched2.length) {
    const matchIndex = findFirstMatch(
      unmatched2[index].textContent ?? "",
      unmatched1,
    );

    if (matchIndex !== -1) {
      matches1.push(unmatched1[matchIndex]);
      matches2.push(unmatched2[index]);
      unmatched1.splice(matchIndex, 1);
      unmatched2.splice(index, 1);
      continue;
    }

    index += 1;
  }

  return { matches1, matches2, unmatched1, unmatched2 };
}

function absolutizeElements(elements: HTMLElement[], container: HTMLElement) {
  const containerRect = container.getBoundingClientRect();

  elements.forEach((element) => {
    const rect = element.getBoundingClientRect();

    gsap.set(element, {
      position: "absolute",
      top: rect.top - containerRect.top,
      left: rect.left - containerRect.left,
      width: rect.width,
      height: rect.height,
      margin: 0,
    });
  });
}

function transition(elements1: HTMLElement[], elements2: HTMLElement[], vars?: gsap.TimelineVars) {
  const data = compareSplits(elements1, elements2);
  const timeline = gsap.timeline(vars);
  const totalMatches = data.matches1.length;

  timeline.set(elements2, { autoAlpha: 1 });
  timeline.set(elements2, { autoAlpha: 0 });

  for (let index = 0; index < totalMatches; index += 1) {
    const bounds1 = data.matches1[index].getBoundingClientRect();
    const bounds2 = data.matches2[index].getBoundingClientRect();

    timeline.to(
      data.matches1[index],
      {
        duration: 1,
        x: bounds2.left - bounds1.left,
        y: bounds2.top - bounds1.top,
        ease: "power1.inOut",
      },
      index * 0.03,
    );
  }

  if (data.unmatched1.length) {
    timeline.to(data.unmatched1, { duration: 0.3, autoAlpha: 0 }, 0);
  }

  if (data.unmatched2.length) {
    timeline.to(data.unmatched2, { duration: 0.5, autoAlpha: 1 }, 0);
  }

  return timeline;
}

function renderAnimatedLetters({
  letterRefs,
  startIndex,
  keyPrefix,
  line,
}: {
  letterRefs: MutableRefObject<(HTMLSpanElement | null)[]>;
  startIndex: number;
  keyPrefix: string;
  line: (typeof TITLE_LINES)[number];
}) {
  let letterIndex = startIndex;

  return line.text.split("").map((char) => {
    const currentIndex = letterIndex;
    letterIndex += 1;

    return (
      <span
        key={`${keyPrefix}-${currentIndex}`}
        ref={(element) => {
          letterRefs.current[currentIndex] = element;
        }}
        className={[
          "inline-block origin-bottom will-change-transform",
          line.highlight ? HIGHLIGHT_WORD_CLASS : DEFAULT_WORD_CLASS,
        ].join(" ")}
      >
        {char === " " ? "\u00A0" : char}
      </span>
    );
  });
}

function FinalTitle({
  containerRef,
  letterRefs,
}: {
  containerRef: React.RefObject<HTMLHeadingElement | null>;
  letterRefs: MutableRefObject<(HTMLSpanElement | null)[]>;
}) {
  let letterIndex = 0;

  return (
    <h1
      ref={containerRef}
      className={`flex cursor-default flex-col items-start gap-1 md:gap-2 ${TITLE_BASE_CLASS}`}
    >
      {TITLE_LINES.map((line) => {
        const lineLetters = renderAnimatedLetters({
          letterRefs,
          startIndex: letterIndex,
          keyPrefix: `final-${line.id}`,
          line,
        });

        letterIndex += line.text.length;

        return (
          <span key={line.id} className="inline-flex whitespace-nowrap">
            {lineLetters}
          </span>
        );
      })}
    </h1>
  );
}

export function HeroTitle() {
  const containerRef = useRef<HTMLHeadingElement>(null);
  const transitionContainerRef = useRef<HTMLDivElement>(null);
  const blurb1Ref = useRef<HTMLDivElement>(null);
  const blurb2Ref = useRef<HTMLDivElement>(null);
  const blurb1LettersRef = useRef<(HTMLSpanElement | null)[]>([]);
  const blurb2LettersRef = useRef<(HTMLSpanElement | null)[]>([]);
  const finalLetterRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const [shouldAnimate, setShouldAnimate] = useState<boolean | null>(null);

  useEffect(() => {
    const hasSeenIntro = localStorage.getItem(INTRO_STORAGE_KEY);
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    setShouldAnimate(!hasSeenIntro && !prefersReducedMotion);
  }, []);

  useEffect(() => {
    if (!shouldAnimate) return;

    const transitionContainer = transitionContainerRef.current;
    const blurb1 = blurb1Ref.current;
    const blurb2 = blurb2Ref.current;
    const letters1 = blurb1LettersRef.current.filter(Boolean) as HTMLSpanElement[];
    const letters2 = blurb2LettersRef.current.filter(Boolean) as HTMLSpanElement[];

    if (
      !transitionContainer ||
      !blurb1 ||
      !blurb2 ||
      !letters1.length ||
      !letters2.length
    ) {
      return;
    }

    gsap.set(blurb2, { autoAlpha: 1 });
    gsap.set(letters2, { autoAlpha: 0 });

    absolutizeElements(letters1, blurb1);
    absolutizeElements(letters2, blurb2);

    const timeline = transition(letters1, letters2, {
      delay: INTRO_DELAY_MS / 1000,
      onComplete: () => setShouldAnimate(false),
    });

    return () => {
      timeline.kill();
    };
  }, [shouldAnimate]);

  useEffect(() => {
    if (shouldAnimate !== false) return;

    const container = containerRef.current;
    const letters = finalLetterRefs.current.filter(Boolean) as HTMLSpanElement[];
    if (!container || !letters.length) return;

    const quickTos = letters.map((letter) => ({
      x: gsap.quickTo(letter, "x", { duration: 0.55, ease: "power3.out" }),
      y: gsap.quickTo(letter, "y", { duration: 0.55, ease: "power3.out" }),
      rotation: gsap.quickTo(letter, "rotation", {
        duration: 0.55,
        ease: "power3.out",
      }),
      scale: gsap.quickTo(letter, "scale", {
        duration: 0.55,
        ease: "power3.out",
      }),
    }));

    const resetLetters = () => {
      quickTos.forEach((quickTo) => {
        quickTo.x(0);
        quickTo.y(0);
        quickTo.rotation(0);
        quickTo.scale(1);
      });
    };

    const onMove = (event: MouseEvent) => {
      letters.forEach((letter, index) => {
        const rect = letter.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = event.clientX - centerX;
        const deltaY = event.clientY - centerY;
        const distance = Math.hypot(deltaX, deltaY);

        if (distance < MOUSE_RADIUS) {
          const force = (1 - distance / MOUSE_RADIUS) * MOUSE_STRENGTH;
          const normalX = deltaX / (distance || 1);
          const normalY = deltaY / (distance || 1);

          quickTos[index].x(normalX * force);
          quickTos[index].y(normalY * force);
          quickTos[index].rotation(deltaX * 0.09);
          quickTos[index].scale(1 + (1 - distance / MOUSE_RADIUS) * 0.12);
          return;
        }

        quickTos[index].x(0);
        quickTos[index].y(0);
        quickTos[index].rotation(0);
        quickTos[index].scale(1);
      });
    };

    container.addEventListener("mousemove", onMove);
    container.addEventListener("mouseleave", resetLetters);

    return () => {
      container.removeEventListener("mousemove", onMove);
      container.removeEventListener("mouseleave", resetLetters);
      resetLetters();
    };
  }, [shouldAnimate]);

  if (shouldAnimate) {
    let blurb2LetterIndex = 0;

    return (
      <div
        ref={transitionContainerRef}
        className="relative w-full"
        style={{ minHeight: `${ALL_LETTERS.length * 0.92}em` }}
      >
        <div ref={blurb1Ref} className="absolute bottom-0 left-0 w-full">
          <div className="flex flex-col items-start">
            {ALL_LETTERS.map((char, index) => (
              <span
                key={`vertical-${index}`}
                ref={(element) => {
                  blurb1LettersRef.current[index] = element;
                }}
                className={[
                  `inline-block ${TITLE_BASE_CLASS}`,
                  index < HIGHLIGHT_LETTER_COUNT ? HIGHLIGHT_WORD_CLASS : DEFAULT_WORD_CLASS,
                ].join(" ")}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </div>
        </div>

        <div
          ref={blurb2Ref}
          className="absolute bottom-0 left-0 flex w-full flex-col items-start gap-1 opacity-0 md:gap-2"
        >
          {TITLE_LINES.map((line) => {
            const lineLetters = renderAnimatedLetters({
              letterRefs: blurb2LettersRef,
              startIndex: blurb2LetterIndex,
              keyPrefix: `horizontal-${line.id}`,
              line,
            });

            blurb2LetterIndex += line.text.length;

            return (
              <span key={line.id} className="inline-flex whitespace-nowrap">
                {lineLetters}
              </span>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className={shouldAnimate === null ? "opacity-0" : "opacity-100"}>
      <FinalTitle containerRef={containerRef} letterRefs={finalLetterRefs} />
    </div>
  );
}
