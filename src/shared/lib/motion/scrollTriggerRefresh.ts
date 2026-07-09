import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const TABLET_DESKTOP_QUERY = "(min-width: 768px)";

let pendingRefreshId: number | null = null;
let pendingScrollEndRefresh: VoidFunction | null = null;

gsap.registerPlugin(ScrollTrigger);

function shouldRefreshScrollTrigger() {
  return typeof window !== "undefined" && window.matchMedia(TABLET_DESKTOP_QUERY).matches;
}

export function scheduleScrollTriggerRefresh(): VoidFunction {
  if (
    !shouldRefreshScrollTrigger() ||
    pendingRefreshId !== null ||
    pendingScrollEndRefresh !== null
  ) {
    return () => {};
  }

  const refresh = () => {
    pendingRefreshId = null;

    if (ScrollTrigger.isScrolling()) {
      const runAfterScroll = () => {
        ScrollTrigger.removeEventListener("scrollEnd", runAfterScroll);
        pendingScrollEndRefresh = null;
        scheduleScrollTriggerRefresh();
      };

      pendingScrollEndRefresh = () => {
        ScrollTrigger.removeEventListener("scrollEnd", runAfterScroll);
        pendingScrollEndRefresh = null;
      };
      ScrollTrigger.addEventListener("scrollEnd", runAfterScroll);
      return;
    }

    ScrollTrigger.refresh();
  };

  pendingRefreshId = window.requestAnimationFrame(() => {
    refresh();
  });

  return () => {
    if (pendingRefreshId !== null) {
      window.cancelAnimationFrame(pendingRefreshId);
      pendingRefreshId = null;
    }

    pendingScrollEndRefresh?.();
  };
}
