"use client";

import { forwardRef, type ReactNode } from "react";
import { ScrollRevealText } from "@/components/ui/ScrollRevealText";
import { useFullPageScroll } from "@/components/scroll/FullPageScrollContext";

const TITLE_CLASS =
  "text-[clamp(1.1rem,1.8vw,2.75rem)] font-bold uppercase leading-none tracking-tight";

const EYEBROW_CLASS =
  "text-[clamp(0.7rem,1.1vw,1.35rem)] font-bold uppercase leading-none tracking-tight text-brand";

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
    <>
      <p className={EYEBROW_CLASS}>
        <ScrollRevealText text={eyebrow} />
      </p>

      <h2
        className={`mt-3 flex flex-col items-start gap-1 md:mt-4 md:gap-2 ${TITLE_CLASS} text-black`}
      >
        {titleLines.map((line) => (
          <span key={line} className="block max-w-full">
            <ScrollRevealText
              text={line}
              className="inline-flex max-w-full flex-wrap"
            />
          </span>
        ))}
      </h2>

      <div
        aria-hidden
        className="my-6 h-px w-full bg-[linear-gradient(to_right,transparent,rgba(0,0,0,0.16),transparent)] lg:my-8"
      />

      <div className="text-sm leading-relaxed text-[#5a5a5a] md:text-base">
        {children}
      </div>
    </>
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
        className={`pointer-events-none fixed inset-y-0 right-0 z-20 flex justify-end transition-opacity duration-700 ease-in-out ${
          isVideoSection ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden={!isVideoSection}
      >
        <aside
          data-section-content-column-inner
          className="relative flex h-full w-[25vw] min-w-[17rem] max-w-[25vw] flex-col justify-end bg-white"
        >
            <div
              data-content-panel="social-proof"
              className="absolute inset-0 flex flex-col justify-end px-6 pb-14 pt-28 opacity-0 md:px-8 md:pb-16 lg:px-10 lg:pb-20"
            >
              <ColumnContent eyebrow="Confiança" titleLines={["corporativa"]}>
                <ul className="flex flex-col gap-4">
                  {TRUST_LOGOS.map((logo) => (
                    <li
                      key={logo}
                      className="text-xs font-semibold uppercase tracking-[0.16em] text-[#5a5a5a] md:text-sm"
                    >
                      <ScrollRevealText text={logo} />
                    </li>
                  ))}
                </ul>
              </ColumnContent>
            </div>

            <div
              data-content-panel="plataforma"
              className="absolute inset-0 flex flex-col justify-end px-6 pb-14 pt-28 opacity-0 md:px-8 md:pb-16 lg:px-10 lg:pb-20"
            >
              <ColumnContent
                eyebrow="A plataforma"
                titleLines={[
                  "Infraestrutura",
                  "desenhada para",
                  "escala e continuidade",
                ]}
              >
                <div className="flex flex-col gap-8">
                  {PLATFORM_BLOCKS.map((block) => (
                    <article
                      key={block.title}
                      className="border-t border-black/10 pt-4"
                    >
                      <h3 className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-black md:text-sm">
                        <ScrollRevealText text={block.title} />
                      </h3>
                      <p className="text-sm leading-relaxed text-[#5a5a5a]">
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
