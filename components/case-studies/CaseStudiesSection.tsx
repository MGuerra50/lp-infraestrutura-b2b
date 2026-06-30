"use client";

import gsap from "gsap";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { useFullPageScroll } from "@/components/scroll/FullPageScrollContext";

const CASE_STUDIES = [
  {
    industry: "Serviços Financeiros",
    challenge:
      "Migração de core banking legado para infraestrutura isolada, sem janela de indisponibilidade perceptível.",
    metric: "100%",
    metricLabel: "Uptime na cutover",
  },
  {
    industry: "Logística & E-commerce",
    challenge:
      "Integração de APIs críticas com picos sazonais exigindo latência estável em escala nacional.",
    metric: "< 50ms",
    metricLabel: "Latência média P95",
  },
  {
    industry: "Energia & Indústria",
    challenge:
      "Operação de workloads OT/IT híbridos com exigência de continuidade e conformidade rigorosa.",
    metric: "99.9%",
    metricLabel: "SLA sustentado",
  },
] as const;

function CaseStudyCard({
  study,
  cardRef,
}: {
  study: (typeof CASE_STUDIES)[number];
  cardRef: (element: HTMLElement | null) => void;
}) {
  return (
    <article
      ref={cardRef}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/40 bg-white/85 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_8px_32px_rgba(0,0,0,0.12)] backdrop-blur-sm transition-[border-color,box-shadow] duration-300 hover:border-brand/40 hover:shadow-[0_0_40px_rgba(47,169,255,0.15)] md:p-5 lg:p-6"
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(600px circle at 50% 0%, rgba(47,169,255,0.08), transparent 55%)",
        }}
        aria-hidden
      />

      <div className="relative z-10">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-brand">
          {study.industry}
        </p>
        <p className="max-w-sm text-sm leading-snug text-black/70 md:text-[0.875rem]">
          {study.challenge}
        </p>
      </div>

      <div className="relative z-10 mt-4">
        <p className="text-[clamp(2rem,4vw,3rem)] font-bold leading-none tracking-tight text-brand">
          {study.metric}
        </p>
        <p className="mt-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-black/45">
          {study.metricLabel}
        </p>
      </div>
    </article>
  );
}

export function CaseStudiesSection() {
  const { activeSectionId } = useFullPageScroll();
  const isActive = activeSectionId === "case-studies";

  const headerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const header = headerRef.current;
    const cards = cardRefs.current.filter(Boolean) as HTMLElement[];

    timelineRef.current?.kill();
    timelineRef.current = null;

    if (!header || !cards.length) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (!isActive) {
      gsap.set(header, { opacity: 0, y: 24 });
      gsap.set(cards, { opacity: 0, y: 36 });
      return;
    }

    if (prefersReducedMotion) {
      gsap.set(header, { opacity: 1, y: 0 });
      gsap.set(cards, { opacity: 1, y: 0 });
      return;
    }

    gsap.set(header, { opacity: 0, y: 24 });
    gsap.set(cards, { opacity: 0, y: 36 });

    const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });

    timeline.to(header, { opacity: 1, y: 0, duration: 0.7 }, 0);
    timeline.to(
      cards,
      { opacity: 1, y: 0, duration: 0.85, stagger: 0.12 },
      0.15,
    );

    timelineRef.current = timeline;

    return () => {
      timeline.kill();
    };
  }, [isActive]);

  return (
    <section className="relative h-full overflow-hidden bg-[#050505]">
      <Image
        src="/section6.webp"
        alt=""
        fill
        unoptimized
        className="object-cover object-center opacity-50"
        sizes="100vw"
      />

      <div
        className="pointer-events-none absolute inset-0 bg-[#050505]/75"
        aria-hidden
      />

      <div className="relative z-10 flex h-full flex-col px-6 py-14 md:px-10 md:py-16 lg:px-16 lg:py-20">
        <header ref={headerRef} className="mb-8 shrink-0 opacity-0 md:mb-10">
          <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.22em] text-brand">
            Resultados comprovados
          </p>
          <h2 className="text-[clamp(1.75rem,3.5vw,3rem)] font-bold uppercase leading-none tracking-tight text-white">
            Case Studies
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/55 md:text-base">
            Projetos enterprise onde infraestrutura crítica virou vantagem
            operacional mensurável.
          </p>
        </header>

        <div className="flex min-h-0 flex-1 items-center">
          <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3 md:gap-5 lg:gap-6">
            {CASE_STUDIES.map((study, index) => (
              <CaseStudyCard
                key={study.industry}
                study={study}
                cardRef={(element) => {
                  cardRefs.current[index] = element;
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
