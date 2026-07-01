type LogoProps = {
  theme?: "light" | "dark";
  className?: string;
};

export function Logo({ theme = "light", className = "" }: LogoProps) {
  const ringClass = theme === "dark" ? "ring-[#050508]" : "ring-white";

  return (
    <a
      href="#hero"
      className={`flex items-center ${className}`}
      aria-label="Infraestrutura B2B"
    >
      <span className="flex items-center">
        <span
          className={`relative z-10 h-7 w-7 shrink-0 rounded-full bg-brand-light ring-2 ${ringClass}`}
        />
        <span
          className={`relative z-20 -ml-3 h-7 w-7 shrink-0 rounded-full bg-brand ring-2 ${ringClass}`}
        />
        <span
          className={`relative z-30 -ml-3 h-7 w-7 shrink-0 rounded-full bg-brand-hover ring-2 ${ringClass}`}
        />
      </span>
    </a>
  );
}
