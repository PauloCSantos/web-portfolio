import { useEffect, useRef, useState, type RefObject } from "react";

const RESIZE_COMMIT_DELAY_MS = 80;

export function useStageSize(ref: RefObject<HTMLElement | null>) {
  const [width, setWidth] = useState(0);
  const lastWidthRef = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stageEl = ref.current;
    if (!stageEl) return;

    let frameId: number | null = null;
    let timeoutId: ReturnType<typeof globalThis.setTimeout> | null = null;

    const cancelScheduledUpdate = () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
        frameId = null;
      }

      if (timeoutId !== null) {
        globalThis.clearTimeout(timeoutId);
        timeoutId = null;
      }
    };

    const commitWidth = (nextWidth: number) => {
      const roundedWidth = Math.round(nextWidth);
      const lastWidth = lastWidthRef.current;

      if (roundedWidth === lastWidth) {
        return;
      }

      lastWidthRef.current = roundedWidth;
      setWidth(roundedWidth);
    };

    const scheduleWidthUpdate = (nextWidth: number) => {
      cancelScheduledUpdate();

      timeoutId = globalThis.setTimeout(() => {
        timeoutId = null;
        frameId = window.requestAnimationFrame(() => {
          frameId = null;
          commitWidth(nextWidth);
        });
      }, RESIZE_COMMIT_DELAY_MS);
    };

    commitWidth(stageEl.clientWidth);

    if (typeof ResizeObserver === "undefined") {
      const handleResize = () => scheduleWidthUpdate(stageEl.clientWidth);
      window.addEventListener("resize", handleResize);
      return () => {
        cancelScheduledUpdate();
        window.removeEventListener("resize", handleResize);
      };
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      scheduleWidthUpdate(entry.contentRect.width);
    });
    observer.observe(stageEl);

    return () => {
      cancelScheduledUpdate();
      observer.disconnect();
    };
  }, [ref]);

  return width;
}
