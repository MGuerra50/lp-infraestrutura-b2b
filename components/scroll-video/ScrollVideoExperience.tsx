"use client";

import { useRef } from "react";
import { FullPageSection } from "@/components/scroll/FullPageSection";
import { FixedVideoContentColumn } from "./FixedVideoContentColumn";
import { FixedVideoGradient } from "./FixedVideoGradient";
import { ScrollVideoCanvas } from "./ScrollVideoCanvas";

export function ScrollVideoExperience() {
  const columnRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <ScrollVideoCanvas columnRef={columnRef} />
      <FixedVideoGradient />
      <FixedVideoContentColumn ref={columnRef} />

      <FullPageSection id="social-proof" className="bg-transparent" />
      <FullPageSection id="plataforma" className="bg-transparent" />
    </>
  );
}
