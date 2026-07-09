import { useEffect, useRef, useState } from "react";
import { SECTION_ORDER, type SectionId } from "@entities/section";
import {
  getNearestSectionId,
  getSectionContainingViewportLine,
  getViewportLine,
  isScrolledToBottom,
} from "./activeSectionMath";
import { observeActiveSections } from "./observeActiveSections";

type Options = {
  ids?: readonly SectionId[];
  offsetTop?: number;
  bottomOffsetPx?: number;
};

export function useActiveSection(options: Options = {}) {
  const { ids = SECTION_ORDER, offsetTop = 80, bottomOffsetPx = 100 } = options;

  const [activeId, setActiveId] = useState<SectionId | null>(null);
  const activeIdRef = useRef<SectionId | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return;
    if (ids.length === 0) return;

    const syncActiveId = (nextActiveId: SectionId) => {
      if (activeIdRef.current === nextActiveId) {
        return;
      }

      activeIdRef.current = nextActiveId;
      setActiveId(nextActiveId);
    };

    const syncBottomActiveId = () => {
      const doc = document.documentElement;

      if (
        isScrolledToBottom({
          viewportHeight: window.innerHeight,
          scrollY: window.scrollY,
          scrollHeight: doc.scrollHeight,
          bottomOffsetPx,
        })
      ) {
        syncActiveId(ids[ids.length - 1]);
        return true;
      }

      return false;
    };

    const syncFromLayout = () => {
      if (syncBottomActiveId()) return;

      const getElement = (id: SectionId) => document.getElementById(id);
      const viewportLine = getViewportLine(offsetTop, window.innerHeight);
      const containing = getSectionContainingViewportLine(
        ids,
        viewportLine,
        getElement,
      );

      if (containing) {
        syncActiveId(containing);
        return;
      }

      const nearest = getNearestSectionId(ids, viewportLine, getElement);
      if (nearest) syncActiveId(nearest);
    };

    return observeActiveSections({
      ids,
      offsetTop,
      syncFromLayout,
      syncBottomActiveId,
      onVisibleSectionId: syncActiveId,
    });
  }, [ids, offsetTop, bottomOffsetPx]);

  return activeId;
}
