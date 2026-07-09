import type { ReactNode } from "react";
import { IntroTransitionContext } from "./introTransitionContext";

type IntroTransitionProviderProps = {
  children: ReactNode;
  heroRevealEnabled: boolean;
  deferredContentReady?: boolean;
};

export function IntroTransitionProvider({
  children,
  heroRevealEnabled,
  deferredContentReady = heroRevealEnabled,
}: IntroTransitionProviderProps) {
  return (
    <IntroTransitionContext.Provider value={{ heroRevealEnabled, deferredContentReady }}>
      {children}
    </IntroTransitionContext.Provider>
  );
}
