import { useEffect, type MutableRefObject } from "react";
import type { TechChip } from "../model/layout";
import type { TechStackDesktopChipGroups } from "../model/types";
import type { TechStackSceneController } from "./createTechStackSceneController";
import { scheduleScrollTriggerRefresh } from "@shared/lib/motion/scrollTriggerRefresh";

const LAYOUT_SYNC_DEBOUNCE_MS = 90;

type UseTechStackLayoutSyncParams = {
  chips: readonly TechChip[];
  chipGroups: TechStackDesktopChipGroups;
  sceneControllerRef: MutableRefObject<TechStackSceneController | null>;
  currentStepIndexRef: MutableRefObject<number>;
  hasSyncedLayoutRef: MutableRefObject<boolean>;
};

export function useTechStackLayoutSync({
  chips,
  chipGroups,
  sceneControllerRef,
  currentStepIndexRef,
  hasSyncedLayoutRef,
}: UseTechStackLayoutSyncParams) {
  useEffect(() => {
    let frameId: number | null = null;
    let timeoutId: ReturnType<typeof globalThis.setTimeout> | null = null;
    let refreshCleanup: VoidFunction | null = null;
    let canceled = false;

    const cancelScheduledWork = () => {
      canceled = true;

      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
        frameId = null;
      }

      if (timeoutId !== null) {
        globalThis.clearTimeout(timeoutId);
        timeoutId = null;
      }

      refreshCleanup?.();
      refreshCleanup = null;
    };

    timeoutId = globalThis.setTimeout(() => {
      timeoutId = null;

      frameId = window.requestAnimationFrame(() => {
        frameId = null;

        if (canceled) {
          return;
        }

        const sceneController = sceneControllerRef.current;

        if (!sceneController) {
          return;
        }

        sceneController.syncLayout({
          chips,
          chipGroups,
          currentStepIndex: currentStepIndexRef.current,
          immediate: true,
        });

        if (!hasSyncedLayoutRef.current) {
          hasSyncedLayoutRef.current = true;
          return;
        }

        refreshCleanup = scheduleScrollTriggerRefresh();
      });
    }, LAYOUT_SYNC_DEBOUNCE_MS);

    return cancelScheduledWork;
  }, [chips, chipGroups, currentStepIndexRef, hasSyncedLayoutRef, sceneControllerRef]);
}
