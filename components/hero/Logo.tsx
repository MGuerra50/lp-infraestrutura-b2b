export function Logo() {
  return (
    <a href="#" className="flex items-center" aria-label="Infraestrutura B2B">
      <span className="flex items-center">
        <span className="relative z-10 h-7 w-7 shrink-0 rounded-full bg-brand-light ring-2 ring-white" />
        <span className="relative z-20 -ml-3 h-7 w-7 shrink-0 rounded-full bg-brand ring-2 ring-white" />
        <span className="relative z-30 -ml-3 h-7 w-7 shrink-0 rounded-full bg-brand-hover ring-2 ring-white" />
      </span>
    </a>
  );
}
