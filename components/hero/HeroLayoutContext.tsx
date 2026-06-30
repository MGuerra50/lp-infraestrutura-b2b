"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type HeroLayoutContextValue = {
  setSquareElement: (element: HTMLElement | null) => void;
  tipY: number | null;
};

const HeroLayoutContext = createContext<HeroLayoutContextValue | null>(null);

export function HeroLayoutProvider({ children }: { children: ReactNode }) {
  const [squareElement, setSquareElement] = useState<HTMLElement | null>(null);
  const [tipY, setTipY] = useState<number | null>(null);

  useEffect(() => {
    if (!squareElement) {
      setTipY(null);
      return;
    }

    const updateTipPosition = () => {
      const tip = squareElement.querySelector<HTMLElement>("[data-hero-square-tip]");
      if (!tip) return;

      const rect = tip.getBoundingClientRect();
      setTipY(rect.top + rect.height / 2);
    };

    updateTipPosition();

    let frameCount = 0;
    let rafId = 0;

    const trackDuringIntro = () => {
      updateTipPosition();
      frameCount += 1;

      if (frameCount < 120) {
        rafId = window.requestAnimationFrame(trackDuringIntro);
      }
    };

    rafId = window.requestAnimationFrame(trackDuringIntro);

    const resizeObserver = new ResizeObserver(updateTipPosition);
    resizeObserver.observe(squareElement);

    window.addEventListener("resize", updateTipPosition);
    window.addEventListener("scroll", updateTipPosition, { passive: true });

    return () => {
      window.cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateTipPosition);
      window.removeEventListener("scroll", updateTipPosition);
    };
  }, [squareElement]);

  const value = useMemo(
    () => ({
      setSquareElement,
      tipY,
    }),
    [tipY],
  );

  return (
    <HeroLayoutContext.Provider value={value}>
      {children}
    </HeroLayoutContext.Provider>
  );
}

export function useHeroLayout() {
  const context = useContext(HeroLayoutContext);

  if (!context) {
    throw new Error("useHeroLayout must be used within HeroLayoutProvider");
  }

  return context;
}
