import { Logo } from "./Logo";

const navLinks = [
  { label: "Plataforma", href: "#plataforma" },
  { label: "Recursos", href: "#recursos" },
  { label: "Migrações de rede", href: "#migracoes-de-rede" },
  { label: "Casos de estudo", href: "#casos-de-estudo" },
  { label: "Contato técnico", href: "#contato-tecnico" },
];

function SearchIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  );
}

export function Header() {
  return (
    <header className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-6 py-6 md:px-12 lg:px-16 lg:py-8">
      <Logo />

      <nav className="hidden h-10 items-center gap-4 text-[10px] font-medium uppercase leading-none tracking-[0.14em] text-[#000000] lg:flex xl:gap-6 xl:text-[11px] xl:tracking-[0.18em]">
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="inline-flex items-center transition-opacity hover:opacity-75"
          >
            {link.label}
          </a>
        ))}
        <button
          type="button"
          aria-label="Buscar"
          className="ml-1 inline-flex h-10 items-center justify-center self-center transition-opacity hover:opacity-75"
        >
          <SearchIcon />
        </button>
      </nav>

      <button
        type="button"
        aria-label="Abrir menu"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-black lg:hidden"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <rect x="3" y="6" width="18" height="2" rx="1" />
          <rect x="3" y="11" width="18" height="2" rx="1" />
          <rect x="3" y="16" width="18" height="2" rx="1" />
        </svg>
      </button>
    </header>
  );
}
