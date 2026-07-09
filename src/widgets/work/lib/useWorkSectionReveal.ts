import type { RefObject } from "react";
import { useStaggeredSectionReveal } from "@shared/lib/motion/useStaggeredSectionReveal";

type UseWorkSectionRevealParams = {
  sectionRef: RefObject<HTMLElement | null>;
  reduceMotion: boolean;
};

const WORK_INITIAL_VARS = { autoAlpha: 0, y: 14, filter: "blur(6px)" };
const WORK_TO_VARS = {
  autoAlpha: 1,
  x: 0,
  y: 0,
  filter: "blur(0px)",
  duration: 0.72,
  ease: "power2.out",
};
const WORK_REDUCED_MOTION_VARS = {
  autoAlpha: 1,
  x: 0,
  y: 0,
  filter: "blur(0px)",
};
const getWorkFromVars = (_card: HTMLElement, index: number) => ({
  autoAlpha: 0,
  x: (index + 1) % 2 !== 0 ? 42 : -42,
  y: 14,
  filter: "blur(6px)",
});

export function useWorkSectionReveal({
  sectionRef,
  reduceMotion,
}: UseWorkSectionRevealParams) {
  useStaggeredSectionReveal({
    rootRef: sectionRef,
    reduceMotion,
    selector: "[data-work-card]",
    initial: WORK_INITIAL_VARS,
    from: getWorkFromVars,
    to: WORK_TO_VARS,
    reducedMotionVars: WORK_REDUCED_MOTION_VARS,
  });
}
