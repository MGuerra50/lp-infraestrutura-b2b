"use client";

import Link from "next/link";
import { type MouseEvent } from "react";
import { Logo } from "@/components/hero/Logo";
import {
  scrollToSectionId,
  useFullPageScroll,
} from "@/components/scroll/FullPageScrollContext";

const FOOTER_NAV = [
  {
    title: "Plataforma",
    links: [
      { label: "Recursos Técnicos", sectionId: "recursos-tecnicos" },
      { label: "Ecossistema", sectionId: "ecossistema" },
      { label: "Casos de Estudo", sectionId: "case-studies" },
    ],
  },
  {
    title: "Empresa",
    links: [
      { label: "Jornada de Deploy", sectionId: "jornada-deploy" },
      { label: "Diagnóstico", sectionId: "contato" },
      { label: "Início", sectionId: "hero" },
    ],
  },
] as const;

const LEGAL_LINKS = [
  { label: "Privacidade", href: "#" },
  { label: "Termos de Uso", href: "#" },
  { label: "SLA Enterprise", href: "#" },
] as const;

function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

export function SiteFooter() {
  const { scrollContainerRef, setActiveSectionId } = useFullPageScroll();

  const handleSectionNav = (
    event: MouseEvent<HTMLAnchorElement>,
    sectionId: string,
  ) => {
    event.preventDefault();
    scrollToSectionId(scrollContainerRef.current, sectionId, "smooth");
    setActiveSectionId(sectionId);
  };

  return (
    <footer className="relative h-full border-t border-white/[0.06] bg-[#050508]/90 backdrop-blur-md">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/45 to-transparent"
        aria-hidden
      />

      <div className="mx-auto flex h-full max-w-6xl flex-col justify-center px-6 py-5 md:px-10 lg:px-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3">
              <Logo theme="dark" />
              <span className="text-sm font-semibold tracking-tight text-white">
                Infraestrutura B2B
              </span>
            </div>
            <p className="mt-2 hidden max-w-xs text-xs leading-relaxed text-white/45 sm:block">
              Ambientes isolados, migrações críticas e operação contínua com SLA
              enterprise.
            </p>

            <div className="mt-3 flex items-center gap-2.5">
              <a
                href="#"
                aria-label="LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/50 transition-[border-color,color,box-shadow] hover:border-brand/35 hover:text-brand hover:shadow-[0_0_20px_rgba(47,169,255,0.15)]"
              >
                <LinkedInIcon />
              </a>
              <a
                href="#"
                aria-label="GitHub"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/50 transition-[border-color,color,box-shadow] hover:border-brand/35 hover:text-brand hover:shadow-[0_0_20px_rgba(47,169,255,0.15)]"
              >
                <GithubIcon />
              </a>
            </div>
          </div>

          {FOOTER_NAV.map((group) => (
            <div key={group.title} className="lg:col-span-2">
              <p className="mb-2 font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-brand">
                // {group.title}
              </p>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.sectionId}>
                    <a
                      href={`#${link.sectionId}`}
                      onClick={(event) => handleSectionNav(event, link.sectionId)}
                      className="text-xs text-white/55 transition-colors hover:text-white sm:text-sm"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="lg:col-span-4">
            <p className="mb-2 font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-brand">
              // Contato
            </p>
            <p className="text-xs leading-relaxed text-white/55 sm:text-sm">
              Fale com nossos engenheiros para um diagnóstico técnico.
            </p>
            <a
              href="mailto:contato@infraestrutura.com"
              className="mt-2 inline-block text-xs text-white transition-colors hover:text-brand sm:text-sm"
            >
              contato@infraestrutura.com
            </a>

            <Link
              href="/agendar-consulta"
              className="mt-3 inline-flex items-center justify-center rounded-full border border-brand/30 bg-brand/10 px-5 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-sm transition-[background-color,border-color,box-shadow] hover:border-brand/50 hover:bg-brand/20 hover:shadow-[0_0_28px_rgba(47,169,255,0.2)] sm:text-xs"
            >
              Agendar consultoria
            </Link>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 border-t border-white/[0.06] pt-4 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-white/35">
            © {new Date().getFullYear()} Infraestrutura B2B. Todos os direitos
            reservados.
          </p>

          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {LEGAL_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-xs text-white/35 transition-colors hover:text-white/60"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
