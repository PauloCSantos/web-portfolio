import { createContext, useContext } from "react";

export type IntroTransitionContextValue = {
  heroRevealEnabled: boolean;
  deferredContentReady: boolean;
};

export const IntroTransitionContext = createContext<IntroTransitionContextValue>({
  heroRevealEnabled: true,
  deferredContentReady: true,
});

export function useIntroTransition() {
  return useContext(IntroTransitionContext);
}
