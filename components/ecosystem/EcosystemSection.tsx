"use client";

import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { useFullPageScroll } from "@/components/scroll/FullPageScrollContext";

const TITLE_LINES = ["Ecossistema", "Nativo para", "Escala"] as const;

const TITLE_CLASS =
  "block whitespace-nowrap text-[clamp(2rem,min(9vw,12vh),5.75rem)] font-bold leading-[0.9] tracking-tight";

export function EcosystemSection() {
  const {
    activeSectionId,
    ecosystemTransitionReady,
    isSection45Transitioning,
    isSection56Transitioning,
  } = useFullPageScroll();
  const isActive = activeSectionId === "ecossistema";
  const shouldAnimateContent =
    isActive &&
    ecosystemTransitionReady &&
    !isSection45Transitioning &&
    !isSection56Transitioning;
  const showNativeBackground = isActive && ecosystemTransitionReady;

  const sectionRef = useRef<HTMLElement>(null);
  const titleLineRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const subtitle = subtitleRef.current;
    const cta = ctaRef.current;
    const titleLines = titleLineRefs.current.filter(Boolean) as HTMLSpanElement[];

    timelineRef.current?.kill();
    timelineRef.current = null;

    if (!section || !titleLines.length) return;

    if (isSection56Transitioning) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (!shouldAnimateContent) {
      gsap.set(titleLines, { yPercent: 110 });
      gsap.set([subtitle, cta], { opacity: 0, y: 24 });
      return;
    }

    if (prefersReducedMotion) {
      gsap.set(titleLines, { yPercent: 0 });
      gsap.set([subtitle, cta], { opacity: 1, y: 0 });
      return;
    }

    gsap.set(titleLines, { yPercent: 110 });
    gsap.set([subtitle, cta], { opacity: 0, y: 28 });

    const timeline = gsap.timeline({ defaults: { ease: "power4.out" } });

    timeline.to(
      titleLines,
      {
        yPercent: 0,
        duration: 1.05,
        stagger: 0.13,
      },
      0,
    );

    if (subtitle) {
      timeline.fromTo(
        subtitle,
        { opacity: 0, y: 36, filter: "blur(10px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.85,
          ease: "power3.out",
        },
        0.42,
      );
    }

    if (cta) {
      timeline.fromTo(
        cta,
        { opacity: 0, y: 22, scale: 0.94 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.65,
          ease: "back.out(1.5)",
        },
        0.58,
      );
    }

    timelineRef.current = timeline;

    return () => {
      timeline.kill();
    };
  }, [shouldAnimateContent, isSection56Transitioning]);

  return (
    <section ref={sectionRef} className="relative h-full overflow-hidden bg-[#050505] md:bg-transparent">
      <Image
        src="/design-section5.webp"
        alt=""
        fill
        unoptimized
        priority={false}
        className={[
          "object-cover object-center md:hidden",
          showNativeBackground ? "opacity-100" : "opacity-0",
        ].join(" ")}
        sizes="100vw"
      />

      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050505]/55 via-transparent to-transparent"
        aria-hidden
      />

      <div
        data-ecosystem-content
        className="relative z-10 flex h-full w-full min-w-0 flex-col justify-center px-6 py-14 md:px-12 md:py-16 lg:px-16 lg:py-20 xl:px-20"
      >
        <div className="flex min-w-0 flex-col pb-8">
          <h2 className="flex w-full min-w-0 max-w-full flex-col items-start">
            {TITLE_LINES.map((line, index) => (
              <span
                key={line}
                className="w-fit max-w-full overflow-hidden py-[0.06em]"
              >
                <span
                  ref={(element) => {
                    titleLineRefs.current[index] = element;
                  }}
                  className={[
                    TITLE_CLASS,
                    index === 0 ? "text-brand" : "text-white",
                  ].join(" ")}
                >
                  {line}
                </span>
              </span>
            ))}
          </h2>

          <p
            ref={subtitleRef}
            className="mt-8 max-w-xl text-sm leading-relaxed text-white/75 opacity-0 md:max-w-2xl md:text-base"
          >
            Arquitetura multi-tenant com isolamento rigoroso de dados e
            otimização para microsserviços. Escale com segurança conectando seus
            sistemas legados às nossas APIs de alta performance.
          </p>

          <Link
            ref={ctaRef}
            href="/agendar-consulta"
            className="mt-10 inline-flex w-fit items-center justify-center rounded-full bg-brand px-8 py-3.5 text-sm font-medium text-white opacity-0 transition-colors hover:bg-brand-hover"
          >
            Explorar Documentação da API
          </Link>
        </div>
      </div>
    </section>
  );
}
