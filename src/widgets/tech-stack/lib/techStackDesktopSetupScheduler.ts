const DESKTOP_STORY_SETUP_IDLE_TIMEOUT = 1700;
const DESKTOP_STORY_SETUP_ROOT_MARGIN = "1800px 0px";

type IdleCallbackWindow = Window &
  typeof globalThis & {
    requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
    cancelIdleCallback?: (handle: number) => void;
  };

type ScheduleDesktopStorySetupParams = {
  target: Element;
  setup: () => void;
};

export function scheduleDesktopStorySetup({
  target,
  setup,
}: ScheduleDesktopStorySetupParams): VoidFunction {
  if (typeof window === "undefined") {
    return () => {};
  }

  const idleWindow = window as IdleCallbackWindow;
  let hasRun = false;
  let idleId: number | null = null;
  let timeoutId: ReturnType<typeof globalThis.setTimeout> | null = null;
  let observer: IntersectionObserver | null = null;

  const cleanup = () => {
    if (idleId !== null && idleWindow.cancelIdleCallback) {
      idleWindow.cancelIdleCallback(idleId);
      idleId = null;
    }

    if (timeoutId !== null) {
      globalThis.clearTimeout(timeoutId);
      timeoutId = null;
    }

    observer?.disconnect();
    observer = null;
  };

  const runSetup = () => {
    if (hasRun) {
      return;
    }

    hasRun = true;
    cleanup();
    setup();
  };

  if (idleWindow.requestIdleCallback) {
    idleId = idleWindow.requestIdleCallback(runSetup, {
      timeout: DESKTOP_STORY_SETUP_IDLE_TIMEOUT,
    });
  } else {
    timeoutId = globalThis.setTimeout(runSetup, 0);
  }

  if ("IntersectionObserver" in window) {
    observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          runSetup();
        }
      },
      { root: null, rootMargin: DESKTOP_STORY_SETUP_ROOT_MARGIN, threshold: 0 },
    );
    observer.observe(target);
  }

  return () => {
    hasRun = true;
    cleanup();
  };
}
