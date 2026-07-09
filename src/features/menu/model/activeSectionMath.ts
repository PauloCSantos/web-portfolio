import type { SectionId } from "@entities/section";

type SectionElementResolver = (id: SectionId) => Element | null;

export function getNearestSectionId(
  ids: readonly SectionId[],
  viewportLine: number,
  getElement: SectionElementResolver,
) {
  let bestId: SectionId | null = null;
  let bestDistance = Number.POSITIVE_INFINITY;

  for (const id of ids) {
    const el = getElement(id);

    if (!el) {
      continue;
    }

    const top = el.getBoundingClientRect().top;
    const distance = Math.abs(top - viewportLine);

    if (distance < bestDistance) {
      bestDistance = distance;
      bestId = id;
    }
  }

  return bestId;
}

export function getSectionContainingViewportLine(
  ids: readonly SectionId[],
  viewportLine: number,
  getElement: SectionElementResolver,
) {
  for (const id of ids) {
    const el = getElement(id);

    if (!el) {
      continue;
    }

    const rect = el.getBoundingClientRect();

    if (rect.top <= viewportLine && rect.bottom >= viewportLine) {
      return id;
    }
  }

  return null;
}

export function getViewportLine(offsetTop: number, viewportHeight: number) {
  const preferredLine = Math.max(offsetTop + 1, viewportHeight * 0.35);
  return Math.min(preferredLine, Math.max(viewportHeight - 1, 0));
}

export function getLineRootMargin(viewportLine: number, viewportHeight: number) {
  const bottomMargin = Math.max(viewportHeight - viewportLine - 1, 0);
  return `-${viewportLine}px 0px -${bottomMargin}px 0px`;
}

export function isScrolledToBottom({
  viewportHeight,
  scrollY,
  scrollHeight,
  bottomOffsetPx,
}: {
  viewportHeight: number;
  scrollY: number;
  scrollHeight: number;
  bottomOffsetPx: number;
}) {
  return viewportHeight + scrollY >= scrollHeight - bottomOffsetPx;
}
