type ScrollRevealTextProps = {
  text: string;
  className?: string;
  charClassName?: string;
};

export function ScrollRevealText({
  text,
  className = "",
  charClassName = "",
}: ScrollRevealTextProps) {
  return (
    <span
      className={`max-w-full whitespace-normal [overflow-wrap:anywhere] ${className}`}
      data-scroll-reveal
    >
      {text.split("").map((char, index) => (
        <span
          key={`${char}-${index}`}
          data-scroll-char
          className={`inline will-change-transform ${charClassName}`}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
}
