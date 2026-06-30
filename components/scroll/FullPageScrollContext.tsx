"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type Section45Handlers = {
  startForward: () => Promise<void>;
  startBackward: () => Promise<void>;
};

type FullPageScrollContextValue = {
  activeSectionId: string | null;
  setActiveSectionId: (id: string) => void;
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
  ecosystemTransitionReady: boolean;
  setEcosystemTransitionReady: (ready: boolean) => void;
  isSection45Transitioning: boolean;
  setIsSection45Transitioning: (transitioning: boolean) => void;
  section45HandlersRef: React.MutableRefObject<Section45Handlers | null>;
};

const FullPageScrollContext = createContext<FullPageScrollContextValue | null>(
  null,
);

export function FullPageScrollProvider({
  children,
  scrollContainerRef,
}: {
  children: ReactNode;
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [activeSectionId, setActiveSectionId] = useState<string | null>("hero");
  const [ecosystemTransitionReady, setEcosystemTransitionReady] = useState(true);
  const [isSection45Transitioning, setIsSection45Transitioning] =
    useState(false);
  const section45HandlersRef = useRef<Section45Handlers | null>(null);

  const value = useMemo(
    () => ({
      activeSectionId,
      setActiveSectionId,
      scrollContainerRef,
      ecosystemTransitionReady,
      setEcosystemTransitionReady,
      isSection45Transitioning,
      setIsSection45Transitioning,
      section45HandlersRef,
    }),
    [
      activeSectionId,
      scrollContainerRef,
      ecosystemTransitionReady,
      isSection45Transitioning,
    ],
  );

  return (
    <FullPageScrollContext.Provider value={value}>
      {children}
    </FullPageScrollContext.Provider>
  );
}

export function useFullPageScroll() {
  const context = useContext(FullPageScrollContext);
  if (!context) {
    throw new Error("useFullPageScroll must be used within FullPageScrollProvider");
  }
  return context;
}

export function useSetActiveSection() {
  const { setActiveSectionId } = useFullPageScroll();
  return useCallback((id: string) => setActiveSectionId(id), [setActiveSectionId]);
}

export const SECTION4_ID = "recursos-tecnicos";
export const SECTION5_ID = "ecossistema";

export function scrollToSectionId(
  container: HTMLDivElement | null,
  id: string,
  behavior: ScrollBehavior = "auto",
) {
  if (!container) return;

  const section = container.querySelector<HTMLElement>(
    `[data-fullpage-section="${id}"]`,
  );

  section?.scrollIntoView({ behavior, block: "start" });
}
