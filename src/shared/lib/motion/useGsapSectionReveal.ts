import { useLayoutEffect, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type GsapSectionRevealSchedule = "sync" | "idle";

type IdleCallbackWindow = Window &
  typeof globalThis & {
    requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
    cancelIdleCallback?: (handle: number) => void;
  };

type UseGsapSectionRevealParams = {
  rootRef: RefObject<HTMLElement | null>;
  reduceMotion: boolean;
  schedule?: GsapSectionRevealSchedule;
  setup: (params: { root: HTMLElement; reduceMotion: boolean }) => void;
};

let isScrollTriggerRegistered = false;

function ensureScrollTriggerRegistered() {
  if (isScrollTriggerRegistered) {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  isScrollTriggerRegistered = true;
}

export function useGsapSectionReveal({
  rootRef,
  reduceMotion,
  schedule = "sync",
  setup,
}: UseGsapSectionRevealParams) {
  useLayoutEffect(() => {
    const root = rootRef.current;

    if (!root) {
      return;
    }

    ensureScrollTriggerRegistered();

    let ctx: gsap.Context | null = null;
    let idleId: number | null = null;
    let timeoutId: ReturnType<typeof globalThis.setTimeout> | null = null;

    const createContext = () => {
      ctx = gsap.context(() => {
        setup({ root, reduceMotion });
      }, root);
    };

    if (schedule === "idle") {
      const idleWindow =
        typeof window !== "undefined" ? (window as IdleCallbackWindow) : null;

      if (idleWindow?.requestIdleCallback) {
        idleId = idleWindow.requestIdleCallback(createContext, { timeout: 900 });
      } else {
        timeoutId = globalThis.setTimeout(createContext, 0);
      }
    } else {
      createContext();
    }

    return () => {
      const idleWindow =
        typeof window !== "undefined" ? (window as IdleCallbackWindow) : null;

      if (idleId !== null && idleWindow?.cancelIdleCallback) {
        idleWindow.cancelIdleCallback(idleId);
      }

      if (timeoutId !== null) {
        globalThis.clearTimeout(timeoutId);
      }

      ctx?.revert();
    };
  }, [reduceMotion, rootRef, schedule, setup]);
}
