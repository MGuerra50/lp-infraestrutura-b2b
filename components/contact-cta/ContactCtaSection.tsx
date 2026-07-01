"use client";

import gsap from "gsap";
import Image from "next/image";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useFullPageScroll } from "@/components/scroll/FullPageScrollContext";

const CONTACT_BACKGROUND_SRC = "/form-design.png";

const INPUT_CLASS =
  "w-full rounded-xl border border-black/10 bg-[#f4f4f5] px-4 py-3.5 text-sm text-[#171717] outline-none transition-[border-color,box-shadow,background-color] placeholder:text-[#8a8a8a] focus:border-brand/50 focus:bg-white focus:shadow-[0_0_0_1px_rgba(47,169,255,0.35),0_0_20px_rgba(47,169,255,0.12)]";

type FormFields = {
  fullName: string;
  email: string;
  role: string;
  challenge: string;
};

const INITIAL_FIELDS: FormFields = {
  fullName: "",
  email: "",
  role: "",
  challenge: "",
};

export function ContactCtaSection() {
  const { activeSectionId } = useFullPageScroll();
  const isActive = activeSectionId === "contato";

  const copyRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const [fields, setFields] = useState<FormFields>(INITIAL_FIELDS);

  const updateField = (key: keyof FormFields, value: string) => {
    setFields((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const params = new URLSearchParams();
    if (fields.fullName.trim()) params.set("nome", fields.fullName.trim());
    if (fields.email.trim()) params.set("email", fields.email.trim());
    if (fields.role.trim()) params.set("cargo", fields.role.trim());
    if (fields.challenge.trim()) params.set("desafio", fields.challenge.trim());

    const query = params.toString();
    window.location.href = query ? `/agendar-consulta?${query}` : "/agendar-consulta";
  };

  useEffect(() => {
    const copy = copyRef.current;
    const form = formRef.current;

    timelineRef.current?.kill();
    timelineRef.current = null;

    if (!copy || !form) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (!isActive) {
      gsap.set(copy, { opacity: 0, y: 28 });
      gsap.set(form, { opacity: 0, y: 32 });
      return;
    }

    if (prefersReducedMotion) {
      gsap.set(copy, { opacity: 1, y: 0 });
      gsap.set(form, { opacity: 1, y: 0 });
      return;
    }

    gsap.set(copy, { opacity: 0, y: 28 });
    gsap.set(form, { opacity: 0, y: 32 });

    const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });

    timeline.to(copy, { opacity: 1, y: 0, duration: 0.75 }, 0);
    timeline.to(form, { opacity: 1, y: 0, duration: 0.8 }, 0.18);

    timelineRef.current = timeline;

    return () => {
      timeline.kill();
    };
  }, [isActive]);

  return (
    <div className="relative h-full overflow-hidden bg-[#050508]">
      <Image
        src={CONTACT_BACKGROUND_SRC}
        alt=""
        fill
        unoptimized
        className="object-cover object-center"
        sizes="100vw"
      />

      <div
        className="pointer-events-none absolute inset-0 bg-black/25"
        aria-hidden
      />

      <div className="relative z-10 flex h-full items-center px-6 py-14 md:px-10 md:py-16 lg:px-16 lg:py-20">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-14 xl:gap-20">
          <div ref={copyRef} className="opacity-0">
            <p className="mb-4 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-brand">
              // PRÓXIMO PASSO
            </p>
            <h2 className="text-[clamp(1.85rem,3.8vw,3.25rem)] font-bold leading-[1.05] tracking-tight text-white">
              Pronto para Escalar sem Limites?
            </h2>
            <p className="mt-5 max-w-lg text-sm leading-relaxed text-white/85 md:text-base md:leading-relaxed">
              Solicite um Diagnóstico de Arquitetura. Nossos engenheiros
              avaliarão sua infraestrutura atual e desenharão um plano de
              transição seguro e otimizado para o seu negócio.
            </p>
          </div>

          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="opacity-0 rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.08)] md:p-8"
          >
            <div className="space-y-4">
              <input
                type="text"
                name="fullName"
                value={fields.fullName}
                onChange={(event) => updateField("fullName", event.target.value)}
                placeholder="Nome e Sobrenome"
                className={INPUT_CLASS}
                autoComplete="name"
                required
              />

              <input
                type="email"
                name="email"
                value={fields.email}
                onChange={(event) => updateField("email", event.target.value)}
                placeholder="E-mail Corporativo"
                className={INPUT_CLASS}
                autoComplete="email"
                required
              />

              <input
                type="text"
                name="role"
                value={fields.role}
                onChange={(event) => updateField("role", event.target.value)}
                placeholder="Cargo / Função"
                className={INPUT_CLASS}
                autoComplete="organization-title"
                required
              />

              <textarea
                name="challenge"
                value={fields.challenge}
                onChange={(event) => updateField("challenge", event.target.value)}
                placeholder="Descreva brevemente seu maior desafio de infraestrutura hoje..."
                rows={4}
                className={`${INPUT_CLASS} resize-none`}
                required
              />
            </div>

            <button
              type="submit"
              className="mt-6 w-full rounded-xl bg-brand px-6 py-4 text-sm font-semibold tracking-wide text-white shadow-[0_0_32px_rgba(47,169,255,0.28)] transition-[background-color,box-shadow,transform] hover:bg-brand-hover hover:shadow-[0_0_40px_rgba(47,169,255,0.38)] active:scale-[0.99]"
            >
              Solicitar Avaliação Técnica →
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
