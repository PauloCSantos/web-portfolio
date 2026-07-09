import { useCallback, useContext } from "react";
import type { FocusTarget } from "./FocusTargets";
import { FocusContext } from "./FocusContext";

export function useFocus() {
  const ctx = useContext(FocusContext);
  if (!ctx) {
    throw new Error("useFocus must be used within FocusProvider");
  }
  return ctx;
}

export function useRegisterFocusTarget(target: FocusTarget) {
  const { register } = useFocus();

  return useCallback(
    (node: HTMLElement | null) => {
      register(target, node);
    },
    [register, target],
  );
}
