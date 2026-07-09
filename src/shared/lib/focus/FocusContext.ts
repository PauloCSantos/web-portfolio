import { createContext } from "react";
import type { FocusTarget } from "./FocusTargets";

export type FocusRegistry = Map<FocusTarget, HTMLElement>;

export type FocusContextValue = {
  register: (target: FocusTarget, el: HTMLElement | null) => void;
  focus: (target: FocusTarget) => void;
};

export const FocusContext = createContext<FocusContextValue | null>(null);
