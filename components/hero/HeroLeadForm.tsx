"use client";

import { FormEvent, useState } from "react";

function SubmitIcon() {
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand text-white shadow-sm transition-colors group-hover:bg-brand-hover">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M8 5v14l11-7z" />
      </svg>
    </span>
  );
}

export function HeroLeadForm() {
  const [email, setEmail] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const params = new URLSearchParams();
    if (email.trim()) {
      params.set("email", email.trim());
    }

    const query = params.toString();
    window.location.href = query ? `/agendar-consulta?${query}` : "/agendar-consulta";
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="group inline-flex w-full items-center justify-between rounded-full bg-white px-6 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-shadow focus-within:shadow-[0_12px_36px_rgba(0,0,0,0.12)] sm:px-8 sm:py-4"
    >
      <input
        type="email"
        name="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Insira seu e-mail corporativo para um diagnóstico..."
        className="min-w-0 flex-1 bg-transparent text-sm text-[#4a4a4a] outline-none placeholder:text-[#8a8a8a]"
        autoComplete="email"
        required
      />
      <button
        type="submit"
        aria-label="Agendar consultoria técnica"
        className="ml-3 shrink-0"
      >
        <SubmitIcon />
      </button>
    </form>
  );
}
