"use client";

import { forwardRef, type ReactNode } from "react";
import { ScrollRevealText } from "@/components/ui/ScrollRevealText";
import { useFullPageScroll } from "@/components/scroll/FullPageScrollContext";

const TITLE_CLASS =
  "text-[clamp(0.82rem,2.2vw,2.75rem)] font-bold uppercase leading-[1.08] tracking-tight xl:text-[clamp(1.1rem,1.8vw,2.75rem)] xl:leading-none";

const EYEBROW_CLASS =
  "text-[clamp(0.62rem,0.95vw,1.35rem)] font-bold uppercase leading-none tracking-tight text-brand xl:text-[clamp(0.7rem,1.1vw,1.35rem)]";

const TRUST_LOGOS = [
  "NEXUS BANK",
  "AXIS SEGUROS",
  "ORION INDÚSTRIA",
  "VALOR CAPITAL",
  "PRIME LOGÍSTICA",
  "CORE ENERGIA",
];

const PLATFORM_BLOCKS = [
  {
    title: "Topologia de Rede",
    description:
      "Arquitetura segmentada com isolamento por camadas, roteamento otimizado e balanceamento inteligente para operações críticas.",
  },
  {
    title: "Redundância de Servidores",
    description:
      "Clusters em alta disponibilidade com failover automático e monitoramento contínuo para manter o negócio em operação.",
  },
  {
    title: "Infraestrutura Híbrida",
    description:
      "Bare-metal dedicado e nuvem privada sob medida, com SLA rigoroso e governança enterprise de ponta a ponta.",
  },
];

function ColumnContent({
  eyebrow,
  titleLines,
  children,
}: {
  eyebrow: string;
  titleLines: string[];
  children: ReactNode;
}) {
  return (
    <div className="w-full min-w-0 max-w-full">
      <p className={`${EYEBROW_CLASS} max-w-full`}>
        <ScrollRevealText text={eyebrow} />
      </p>

      <h2
        className={`mt-2 flex w-full min-w-0 max-w-full flex-col items-start gap-0.5 xl:mt-4 xl:gap-2 ${TITLE_CLASS} text-black`}
      >
        {titleLines.map((line) => (
          <span key={line} className="block w-full min-w-0 max-w-full">
            <ScrollRevealText text={line} />
          </span>
        ))}
      </h2>

      <div
        aria-hidden
        className="my-4 h-px w-full bg-[linear-gradient(to_right,transparent,rgba(0,0,0,0.16),transparent)] xl:my-8"
      />

      <div className="w-full min-w-0 max-w-full text-xs leading-relaxed text-[#5a5a5a] xl:text-base">
        {children}
      </div>
    </div>
  );
}

export const FixedVideoContentColumn = forwardRef<HTMLDivElement>(
  function FixedVideoContentColumn(_props, ref) {
    const { activeSectionId } = useFullPageScroll();
    const isVideoSection =
      activeSectionId === "social-proof" || activeSectionId === "plataforma";

    return (
      <div
        ref={ref}
        className={`pointer-events-none fixed inset-y-0 right-0 z-20 flex w-full justify-end overflow-hidden transition-opacity duration-700 ease-in-out ${
          isVideoSection ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden={!isVideoSection}
      >
        <aside
          data-section-content-column-inner
          className={`relative box-border flex h-full w-[30%] max-w-[30%] min-w-0 shrink-0 flex-col overflow-x-hidden bg-white xl:w-[25vw] xl:max-w-[25vw] xl:min-w-[17rem] ${
            isVideoSection ? "pointer-events-auto" : ""
          }`}
        >
          <div
            data-content-panel="social-proof"
            className="absolute inset-0 flex w-full min-w-0 max-w-full flex-col justify-end overflow-x-hidden overflow-y-auto overscroll-contain px-4 pb-10 pt-20 opacity-0 sm:px-5 md:px-6 xl:px-10 xl:pb-20 xl:pt-28"
          >
            <ColumnContent eyebrow="Confiança" titleLines={["corporativa"]}>
              <ul className="flex flex-col gap-3 xl:gap-4">
                {TRUST_LOGOS.map((logo) => (
                  <li
                    key={logo}
                    className="max-w-full text-[11px] font-semibold uppercase tracking-[0.12em] text-[#5a5a5a] xl:text-sm xl:tracking-[0.16em]"
                  >
                    <ScrollRevealText text={logo} />
                  </li>
                ))}
              </ul>
            </ColumnContent>
          </div>

          <div
            data-content-panel="plataforma"
            className="absolute inset-0 flex w-full min-w-0 max-w-full flex-col overflow-x-hidden overflow-y-auto overscroll-contain px-4 pb-8 pt-16 opacity-0 sm:px-5 md:px-6 xl:justify-end xl:overflow-y-hidden xl:px-10 xl:pb-20 xl:pt-28"
          >
            <ColumnContent
              eyebrow="A plataforma"
              titleLines={[
                "Infraestrutura",
                "desenhada para",
                "escala e continuidade",
              ]}
            >
              <div className="flex flex-col gap-4 xl:gap-8">
                {PLATFORM_BLOCKS.map((block) => (
                  <article
                    key={block.title}
                    className="w-full min-w-0 max-w-full border-t border-black/10 pt-3 xl:pt-4"
                  >
                    <h3 className="mb-1.5 max-w-full text-[10px] font-bold uppercase tracking-[0.08em] text-black xl:mb-2 xl:text-sm xl:tracking-[0.12em]">
                      <ScrollRevealText text={block.title} />
                    </h3>
                    <p className="max-w-full text-[11px] leading-relaxed text-[#5a5a5a] xl:text-sm">
                      <ScrollRevealText text={block.description} />
                    </p>
                  </article>
                ))}
              </div>
            </ColumnContent>
          </div>
        </aside>
      </div>
    );
  },
);
