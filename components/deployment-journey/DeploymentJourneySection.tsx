"use client";

import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { useFullPageScroll } from "@/components/scroll/FullPageScrollContext";

const JOURNEY_STEPS = [
  {
    step: "01",
    title: "Consultoria & Diagnóstico",
    description:
      "Mapeamento de ambientes legados, riscos operacionais e desenho de arquitetura alinhada ao SLA do negócio.",
    Icon: DiagnosisIcon,
  },
  {
    step: "02",
    title: "Deploy & Migração",
    description:
      "Provisionamento de infraestrutura, integrações críticas e cutover controlado com rollback documentado.",
    Icon: DeployIcon,
  },
  {
    step: "03",
    title: "Go-live & Evolução",
    description:
      "Monitoramento contínuo, governança enterprise e otimização de performance pós-produção.",
    Icon: EvolutionIcon,
  },
] as const;

function DiagnosisIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden>
      <rect
        x="5"
        y="7"
        width="22"
        height="18"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <path
        d="M10 14h12M10 18h8M10 22h10"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <circle cx="23" cy="11" r="2.5" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  );
}

function DeployIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden>
      <path
        d="M8 24V12l8-5 8 5v12"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path
        d="M13 24v-6h6v6"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path
        d="M16 7v4M12 11h8"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  );
}

function EvolutionIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden>
      <path
        d="M6 22l6-8 5 5 9-12"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="6" cy="22" r="2" stroke="currentColor" strokeWidth="1.25" />
      <circle cx="12" cy="14" r="2" stroke="currentColor" strokeWidth="1.25" />
      <circle cx="17" cy="19" r="2" stroke="currentColor" strokeWidth="1.25" />
      <circle cx="26" cy="7" r="2" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  );
}

function JourneyStep({
  step,
  stepRef,
  isLast,
}: {
  step: (typeof JOURNEY_STEPS)[number];
  stepRef: (element: HTMLElement | null) => void;
  isLast: boolean;
}) {
  const { Icon } = step;

  return (
    <li ref={stepRef} className="relative flex flex-1 flex-col items-center opacity-0">
      <div className="relative z-10 flex flex-col items-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-brand/35 bg-white/[0.03] text-brand shadow-[0_0_24px_rgba(47,169,255,0.15)] backdrop-blur-sm">
          <Icon />
        </div>
        <span className="mt-4 text-[10px] font-semibold uppercase tracking-[0.24em] text-brand">
          {step.step}
        </span>
      </div>

      {!isLast ? (
        <div
          className="pointer-events-none absolute left-[calc(50%+2rem)] top-8 hidden h-px w-[calc(100%-4rem)] bg-gradient-to-r from-brand/70 via-brand/30 to-white/10 md:block"
          aria-hidden
        />
      ) : null}

      <div className="mt-5 max-w-xs text-center md:mt-6">
        <h3 className="text-sm font-semibold uppercase tracking-[0.1em] text-white md:text-base">
          {step.title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-white/55">
          {step.description}
        </p>
      </div>
    </li>
  );
}

export function DeploymentJourneySection() {
  const { activeSectionId } = useFullPageScroll();
  const isActive = activeSectionId === "jornada-deploy";

  const headerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLElement | null)[]>([]);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const header = headerRef.current;
    const line = lineRef.current;
    const steps = stepRefs.current.filter(Boolean) as HTMLElement[];
    const cta = ctaRef.current;

    timelineRef.current?.kill();
    timelineRef.current = null;

    if (!header || !steps.length) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (!isActive) {
      gsap.set(header, { opacity: 0, y: 24 });
      gsap.set(line, { scaleX: 0, opacity: 0 });
      gsap.set(steps, { opacity: 0, y: 28 });
      gsap.set(cta, { opacity: 0, y: 20 });
      return;
    }

    if (prefersReducedMotion) {
      gsap.set(header, { opacity: 1, y: 0 });
      gsap.set(line, { scaleX: 1, opacity: 1 });
      gsap.set(steps, { opacity: 1, y: 0 });
      gsap.set(cta, { opacity: 1, y: 0 });
      return;
    }

    gsap.set(header, { opacity: 0, y: 24 });
    gsap.set(line, { scaleX: 0, opacity: 0, transformOrigin: "left center" });
    gsap.set(steps, { opacity: 0, y: 28 });
    gsap.set(cta, { opacity: 0, y: 20 });

    const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });

    timeline.to(header, { opacity: 1, y: 0, duration: 0.7 }, 0);

    if (line) {
      timeline.to(
        line,
        { scaleX: 1, opacity: 1, duration: 1.1, ease: "power2.inOut" },
        0.2,
      );
    }

    timeline.to(
      steps,
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.18 },
      0.35,
    );

    if (cta) {
      timeline.to(cta, { opacity: 1, y: 0, duration: 0.65 }, 0.75);
    }

    timelineRef.current = timeline;

    return () => {
      timeline.kill();
    };
  }, [isActive]);

  return (
    <section className="relative h-full overflow-hidden bg-[#050505]">
      <Image
        src="/section7.webp"
        alt=""
        fill
        unoptimized
        className="object-cover object-center opacity-40"
        sizes="100vw"
      />

      <div
        className="pointer-events-none absolute inset-0 bg-[#050505]/70"
        aria-hidden
      />

      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage: [
            "linear-gradient(90deg, transparent 0%, rgba(47,169,255,0.08) 50%, transparent 100%)",
            "repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 80px)",
          ].join(", "),
        }}
        aria-hidden
      />

      <div className="relative z-10 flex h-full flex-col justify-center px-6 py-14 md:px-10 md:py-16 lg:px-16 lg:py-20">
        <header ref={headerRef} className="mb-10 shrink-0 text-center opacity-0 md:mb-14">
          <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.22em] text-brand">
            Jornada enterprise
          </p>
          <h2 className="text-[clamp(1.75rem,3.5vw,3rem)] font-bold uppercase leading-none tracking-tight text-white">
            Consultoria & Deploy
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/55 md:text-base">
            Da estratégia à operação contínua — um processo claro, previsível e
            desenhado para conversão em resultados mensuráveis.
          </p>
        </header>

        <div
          ref={lineRef}
          className="mx-auto mb-8 hidden h-px w-full max-w-4xl origin-left bg-gradient-to-r from-brand via-brand/50 to-white/10 opacity-0 md:block lg:max-w-5xl"
          aria-hidden
        />

        <ol className="flex flex-col gap-10 md:flex-row md:gap-6 lg:gap-8">
          {JOURNEY_STEPS.map((step, index) => (
            <JourneyStep
              key={step.step}
              step={step}
              isLast={index === JOURNEY_STEPS.length - 1}
              stepRef={(element) => {
                stepRefs.current[index] = element;
              }}
            />
          ))}
        </ol>

        <div className="mt-10 flex justify-center md:mt-12">
          <Link
            ref={ctaRef}
            href="/agendar-consulta"
            className="inline-flex items-center justify-center rounded-full border border-brand/40 bg-brand/10 px-8 py-3.5 text-sm font-medium text-white opacity-0 backdrop-blur-sm transition-colors hover:bg-brand hover:text-white"
          >
            Iniciar jornada de consultoria
          </Link>
        </div>
      </div>
    </section>
  );
}
