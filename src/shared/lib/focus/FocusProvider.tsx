import { useCallback, useMemo, useRef, type ReactNode } from "react";
import type { FocusTarget } from "./FocusTargets";
import { FocusContext, type FocusRegistry } from "./FocusContext";

function focusElement(el: HTMLElement) {
  try {
    el.focus({ preventScroll: true });
  } catch {
    el.focus();
  }
}

export function FocusProvider({ children }: { children: ReactNode }) {
  const registryRef = useRef<FocusRegistry>(new Map());
  const pendingFocusRef = useRef<FocusTarget | null>(null);

  const focus = useCallback((target: FocusTarget) => {
    const el = registryRef.current.get(target);
    if (el) {
      focusElement(el);
      return;
    }
    pendingFocusRef.current = target;
  }, []);

  const register = useCallback((target: FocusTarget, el: HTMLElement | null) => {
    if (el) {
      registryRef.current.set(target, el);

      if (pendingFocusRef.current === target) {
        pendingFocusRef.current = null;
        focusElement(el);
      }
      return;
    }

    registryRef.current.delete(target);
  }, []);

  const value = useMemo(() => ({ register, focus }), [register, focus]);

  return <FocusContext.Provider value={value}>{children}</FocusContext.Provider>;
}
