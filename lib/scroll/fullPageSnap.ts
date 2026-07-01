export const FOOTER_EXTENSION_RATIO = 0.5;
export const SECTION_CONTACT_ID = "contato";

export type SnapTarget = {
  top: number;
  sectionId: string;
  isFooterSlot: boolean;
};

export function getFullPageSections(container: HTMLDivElement) {
  return Array.from(
    container.querySelectorAll<HTMLElement>("[data-fullpage-section]"),
  );
}

function getElementScrollTop(
  element: HTMLElement,
  container: HTMLDivElement,
): number {
  const containerRect = container.getBoundingClientRect();
  const elementRect = element.getBoundingClientRect();

  return elementRect.top - containerRect.top + container.scrollTop;
}

export function getSnapTargets(container: HTMLDivElement): SnapTarget[] {
  const sections = getFullPageSections(container);
  const viewportHeight = container.clientHeight;
  const targets: SnapTarget[] = [];

  sections.forEach((section, index) => {
    const sectionId = section.getAttribute("data-fullpage-section") ?? "";
    const hasFooterExtension = section.hasAttribute("data-footer-extension");

    targets.push({
      top: getElementScrollTop(section, container),
      sectionId,
      isFooterSlot: false,
    });

    if (hasFooterExtension && index === sections.length - 1) {
      const footerPanel = section.querySelector<HTMLElement>(
        "[data-footer-snap]",
      );

      targets.push({
        top: footerPanel
          ? getElementScrollTop(footerPanel, container)
          : getElementScrollTop(section, container) +
            section.offsetHeight -
            viewportHeight,
        sectionId,
        isFooterSlot: true,
      });
    }
  });

  return targets;
}

export function getClosestSnapIndex(
  scrollTop: number,
  targets: SnapTarget[],
): number {
  let closest = 0;
  let minDistance = Infinity;

  targets.forEach((target, index) => {
    const distance = Math.abs(scrollTop - target.top);
    if (distance < minDistance) {
      minDistance = distance;
      closest = index;
    }
  });

  return closest;
}

export function getSectionIdAtScroll(
  container: HTMLDivElement,
  scrollTop: number,
): string | null {
  const sections = getFullPageSections(container);
  const viewportHeight = container.clientHeight;

  for (let index = sections.length - 1; index >= 0; index -= 1) {
    const section = sections[index];
    if (!section) continue;

    if (scrollTop >= getElementScrollTop(section, container) - viewportHeight * 0.25) {
      return section.getAttribute("data-fullpage-section");
    }
  }

  return sections[0]?.getAttribute("data-fullpage-section") ?? null;
}
