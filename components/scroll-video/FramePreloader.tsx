"use client";

import { useEffect } from "react";
import { startFramePreload } from "@/lib/scroll-video/preloadFrames";

export function FramePreloader() {
  useEffect(() => {
    startFramePreload();
  }, []);

  return null;
}
