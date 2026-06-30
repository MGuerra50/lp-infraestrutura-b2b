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
    <span className={className} data-scroll-reveal>
      {text.split("").map((char, index) => (
        <span
          key={`${char}-${index}`}
          data-scroll-char
          className={`inline-block will-change-transform ${charClassName}`}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
}
