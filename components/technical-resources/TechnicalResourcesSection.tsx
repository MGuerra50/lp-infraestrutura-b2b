"use client";

import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useFullPageScroll } from "@/components/scroll/FullPageScrollContext";

const EYEBROW_CLASS =
  "text-[10px] font-medium uppercase tracking-[0.22em] text-brand";

const TITLE_CLASS =
  "text-[clamp(1.35rem,2.8vw,3.75rem)] font-bold uppercase leading-none tracking-tight";

const DIVIDER_CLASS =
  "my-6 h-px w-[calc(100%+2rem)] max-w-5xl -ml-8 bg-[linear-gradient(to_right,transparent,rgba(0,0,0,0.16),transparent)] md:-ml-10 md:w-[calc(100%+2.5rem)] lg:my-8 lg:-ml-14 lg:w-[calc(100%+3.5rem)]";

const AUTOPLAY_DURATION = 2;

const CAROUSEL_ITEMS = [
  {
    value: "99.9%",
    label: "Uptime garantido",
    description:
      "SLA contratual com janelas de manutenção planejadas e failover automático em camadas.",
  },
  {
    value: "DDoS",
    label: "Mitigação avançada",
    description:
      "Filtragem em tempo real, rate limiting inteligente e absorção distribuída de tráfego malicioso.",
  },
  {
    value: "<5ms",
    label: "Latência ultrabaixa",
    description:
      "Backbone otimizado e roteamento de borda para workloads críticos e integrações em tempo real.",
  },
  {
    value: "E2E",
    label: "Criptografia ponta a ponta",
    description:
      "TLS 1.3, chaves rotacionadas e protocolos de isolamento para dados em trânsito e em repouso.",
  },
  {
    value: "MULTI-R",
    label: "Replicação síncrona",
    description:
      "Arquitetura multi-região com replicação síncrona para continuidade operacional sem perda de dados.",
  },
  {
    value: "NOC/SRE",
    label: "Observabilidade unificada",
    description:
      "Observabilidade unificada para NOC e SRE com telemetria centralizada e alertas acionáveis.",
  },
  {
    value: "SOC2",
    label: "Conformidade enterprise",
    description:
      "Conformidade com políticas enterprise de segurança, auditoria e governança de acesso.",
  },
] as const;

function ArrowIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className="transition-transform group-hover:translate-x-0.5"
    >
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ResourceCarousel({ isActive }: { isActive: boolean }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const progressTweenRef = useRef<gsap.core.Tween | null>(null);
  const cardTweenRef = useRef<gsap.core.Tween | null>(null);

  const advance = useCallback(() => {
    setActiveIndex((current) => (current + 1) % CAROUSEL_ITEMS.length);
  }, []);

  const animateCardIn = useCallback(() => {
    const content = contentRef.current;
    if (!content) return;

    cardTweenRef.current?.kill();
    cardTweenRef.current = gsap.fromTo(
      content,
      { opacity: 0, y: 28, filter: "blur(6px)" },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.65,
        ease: "power3.out",
      },
    );
  }, []);

  const startProgress = useCallback(() => {
    const progress = progressRef.current;
    if (!progress) return;

    progressTweenRef.current?.kill();
    gsap.set(progress, { scaleX: 0, transformOrigin: "left center" });

    progressTweenRef.current = gsap.to(progress, {
      scaleX: 1,
      duration: AUTOPLAY_DURATION,
      ease: "none",
      onComplete: advance,
    });
  }, [advance]);

  useEffect(() => {
    if (!isActive) {
      setActiveIndex(0);
      setIsPaused(false);
      progressTweenRef.current?.kill();
      cardTweenRef.current?.kill();
      return;
    }

    animateCardIn();
  }, [activeIndex, isActive, animateCardIn]);

  useEffect(() => {
    if (!isActive || isPaused) {
      progressTweenRef.current?.pause();
      return;
    }

    startProgress();

    return () => {
      progressTweenRef.current?.kill();
    };
  }, [activeIndex, isActive, isPaused, startProgress]);

  const handleMouseEnter = () => {
    setIsPaused(true);
    progressTweenRef.current?.pause();
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
    progressTweenRef.current?.resume();
  };

  const item = CAROUSEL_ITEMS[activeIndex];

  return (
    <div className="relative z-20 mt-10 w-full max-w-4xl">
      <article
        ref={cardRef}
        className="relative overflow-hidden rounded-2xl border border-black/[0.06] bg-white p-7 shadow-[0_12px_40px_rgba(0,0,0,0.08)] md:p-9 lg:p-10"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        aria-live="polite"
        aria-atomic="true"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(600px circle at 0% 0%, rgba(47,169,255,0.06), transparent 55%)",
          }}
          aria-hidden
        />

        <div ref={contentRef} className="relative z-10">
          <div className="flex items-start justify-between gap-4">
            <p className="text-[clamp(2.25rem,4vw,3.25rem)] font-bold uppercase leading-none tracking-tight text-brand">
              {item.value}
            </p>
            <span className="shrink-0 text-[11px] font-medium uppercase tracking-[0.16em] text-[#9a9a9a]">
              {String(activeIndex + 1).padStart(2, "0")} /{" "}
              {String(CAROUSEL_ITEMS.length).padStart(2, "0")}
            </span>
          </div>

          <h3 className="mt-3 text-base font-bold uppercase tracking-[0.1em] text-black md:text-lg">
            {item.label}
          </h3>

          <p className="mt-4 text-sm leading-relaxed text-[#5a5a5a] md:text-base">
            {item.description}
          </p>
        </div>

        <div className="relative z-10 mt-8 h-0.5 overflow-hidden rounded-full bg-black/[0.06]">
          <div
            ref={progressRef}
            className="h-full w-full origin-left rounded-full bg-brand"
            style={{ transform: "scaleX(0)" }}
            aria-hidden
          />
        </div>
      </article>

      <div className="mt-4 flex items-center justify-between gap-4">
        <p className="text-xs text-[#8a8a8a]">
          {isPaused ? "Pausado" : "Próximo card em breve"}
        </p>

        <div className="flex gap-1.5" role="tablist" aria-label="Indicadores do carrossel">
          {CAROUSEL_ITEMS.map((carouselItem, index) => (
            <button
              key={carouselItem.label}
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              aria-label={`Ir para ${carouselItem.label}`}
              onClick={() => setActiveIndex(index)}
              className={[
                "h-1.5 rounded-full transition-all duration-300",
                index === activeIndex
                  ? "w-6 bg-brand"
                  : "w-1.5 bg-black/15 hover:bg-black/25",
              ].join(" ")}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function TechnicalResourcesSection() {
  const { activeSectionId, isSection45Transitioning } = useFullPageScroll();
  const isActive = activeSectionId === "recursos-tecnicos";
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isActive) {
      const frame = requestAnimationFrame(() => setIsVisible(true));
      return () => cancelAnimationFrame(frame);
    }

    setIsVisible(false);
  }, [isActive]);

  return (
    <section className="relative h-full overflow-hidden bg-[#f4f4f2]">
      <div
        className={[
          "pointer-events-none absolute inset-y-0 right-0 z-0 hidden w-[36%] overflow-hidden bg-[#060d18] md:block",
          isSection45Transitioning ? "opacity-0" : "opacity-100",
        ].join(" ")}
        style={{
          clipPath: "polygon(24% 0, 100% 0, 100% 100%, 6% 100%)",
        }}
        aria-hidden
      >
        <div className="absolute inset-0 origin-center scale-[1.12]">
          <Image
            src="/Design2.webp"
            alt=""
            fill
            unoptimized
            className="object-cover object-center"
            sizes="50vw"
          />
        </div>
      </div>

      <div
        className={[
          "relative z-20 flex h-full transition-all duration-700 ease-out",
          isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
        ].join(" ")}
      >
        <div className="relative z-20 flex w-full flex-col justify-center px-6 py-20 md:max-w-[68%] md:px-10 lg:px-16 xl:px-20">
          <p className={EYEBROW_CLASS}>Recursos técnicos</p>

          <h2
            className={`mt-4 flex flex-col items-start gap-1 md:mt-5 md:gap-2 ${TITLE_CLASS}`}
          >
            <span className="text-brand">Arquitetura</span>
            <span className="text-black">De alta disponibilidade</span>
          </h2>

          <div aria-hidden className={DIVIDER_CLASS} />

          <p className="max-w-4xl text-sm leading-relaxed text-[#5a5a5a] md:text-base">
            Especificações rigorosas, métricas auditáveis e controles de
            segurança desenhados para validar a compra com times de engenharia
            e diretoria de tecnologia.
          </p>

          <ResourceCarousel isActive={isActive} />

          <div className="relative z-20 mt-10 flex flex-col gap-5 sm:flex-row sm:items-center">
            <Link
              href="/agendar-consulta"
              className="group inline-flex w-fit items-center gap-3 rounded-full bg-[#1a1d21] px-6 py-3.5 text-sm font-medium text-white transition-colors hover:bg-[#2a2f36]"
            >
              Solicitar documentação técnica
              <ArrowIcon />
            </Link>

            <p className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs text-[#5a5a5a] shadow-sm">
              <span className="flex -space-x-2">
                {["NB", "AX", "OR"].map((initials) => (
                  <span
                    key={initials}
                    className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-[#e8e8e6] text-[9px] font-bold text-black"
                  >
                    {initials}
                  </span>
                ))}
              </span>
              Validado por equipes enterprise de infraestrutura
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
