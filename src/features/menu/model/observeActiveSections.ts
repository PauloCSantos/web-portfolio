import type { SectionId } from "@entities/section";
import { getLineRootMargin, getViewportLine } from "./activeSectionMath";

type ObserveActiveSectionsParams = {
  ids: readonly SectionId[];
  offsetTop: number;
  syncFromLayout: () => void;
  syncBottomActiveId: () => boolean;
  onVisibleSectionId: (id: SectionId) => void;
};

function scheduleAnimationFrame(callback: () => void) {
  let ticking = false;

  return () => {
    if (ticking) {
      return;
    }

    ticking = true;

    window.requestAnimationFrame(() => {
      ticking = false;
      callback();
    });
  };
}

function observeActiveSectionsFallback({
  syncFromLayout,
}: Pick<ObserveActiveSectionsParams, "syncFromLayout">) {
  const syncFromViewport = scheduleAnimationFrame(syncFromLayout);

  window.addEventListener("scroll", syncFromViewport, { passive: true });
  window.addEventListener("resize", syncFromViewport);
  window.addEventListener("orientationchange", syncFromViewport);
  window.addEventListener("hashchange", syncFromViewport);

  window.requestAnimationFrame(syncFromViewport);

  return () => {
    window.removeEventListener("scroll", syncFromViewport);
    window.removeEventListener("resize", syncFromViewport);
    window.removeEventListener("orientationchange", syncFromViewport);
    window.removeEventListener("hashchange", syncFromViewport);
  };
}

export function observeActiveSections({
  ids,
  offsetTop,
  syncFromLayout,
  syncBottomActiveId,
  onVisibleSectionId,
}: ObserveActiveSectionsParams) {
  if (typeof IntersectionObserver !== "function") {
    return observeActiveSectionsFallback({ syncFromLayout });
  }

  let observer: IntersectionObserver | null = null;
  const observedElements = new Map<SectionId, Element>();
  const visibleSectionIds = new Set<SectionId>();

  const getIdForElement = (element: Element) => {
    for (const [id, observedElement] of observedElements) {
      if (observedElement === element) {
        return id;
      }
    }

    return null;
  };

  const syncFromVisibleSections = scheduleAnimationFrame(() => {
    if (syncBottomActiveId()) {
      return;
    }

    for (const id of ids) {
      if (visibleSectionIds.has(id)) {
        onVisibleSectionId(id);
        return;
      }
    }

    syncFromLayout();
  });

  const observeCurrentSections = () => {
    if (!observer) {
      return;
    }

    for (const id of ids) {
      const currentElement = document.getElementById(id);
      const observedElement = observedElements.get(id);

      if (observedElement === currentElement) {
        continue;
      }

      if (observedElement) {
        observer.unobserve(observedElement);
        observedElements.delete(id);
        visibleSectionIds.delete(id);
      }

      if (currentElement) {
        observedElements.set(id, currentElement);
        observer.observe(currentElement);
      }
    }
  };

  const createObserver = () => {
    observer?.disconnect();
    visibleSectionIds.clear();

    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = getIdForElement(entry.target);

          if (!id) {
            continue;
          }

          if (entry.isIntersecting) {
            visibleSectionIds.add(id);
          } else {
            visibleSectionIds.delete(id);
          }
        }

        syncFromVisibleSections();
      },
      {
        rootMargin: getLineRootMargin(
          getViewportLine(offsetTop, window.innerHeight),
          window.innerHeight,
        ),
        threshold: 0,
      },
    );

    const existingElements = new Map(observedElements);
    observedElements.clear();

    for (const [id, element] of existingElements) {
      if (document.getElementById(id) === element) {
        observedElements.set(id, element);
        observer.observe(element);
      }
    }
  };

  const refreshObservedSections = scheduleAnimationFrame(() => {
    observeCurrentSections();
    syncFromVisibleSections();
  });

  const recreateObserver = () => {
    createObserver();
    observeCurrentSections();
    syncFromVisibleSections();
  };

  recreateObserver();

  const main = document.getElementById("main");
  const mutationObserver =
    main && typeof MutationObserver === "function"
      ? new MutationObserver(refreshObservedSections)
      : null;

  if (main && mutationObserver) {
    mutationObserver.observe(main, {
      childList: true,
      subtree: true,
    });
  }

  const syncBottomFromScroll = () => {
    if (syncBottomActiveId()) {
      return;
    }

    syncFromVisibleSections();
  };

  window.addEventListener("scroll", syncBottomFromScroll, { passive: true });
  window.addEventListener("resize", recreateObserver);
  window.addEventListener("orientationchange", recreateObserver);
  window.addEventListener("hashchange", syncFromVisibleSections);

  window.requestAnimationFrame(refreshObservedSections);

  return () => {
    observer?.disconnect();
    mutationObserver?.disconnect();
    window.removeEventListener("scroll", syncBottomFromScroll);
    window.removeEventListener("resize", recreateObserver);
    window.removeEventListener("orientationchange", recreateObserver);
    window.removeEventListener("hashchange", syncFromVisibleSections);
  };
}
