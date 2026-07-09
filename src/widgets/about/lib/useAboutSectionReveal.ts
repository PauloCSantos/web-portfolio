import type { RefObject } from "react";
import { useStaggeredSectionReveal } from "@shared/lib/motion/useStaggeredSectionReveal";

function getOffsetByDirection(direction: string) {
  if (direction === "left") {
    return { x: -42, y: 8, rotate: -0.6 };
  }

  if (direction === "right") {
    return { x: 42, y: 8, rotate: 0.6 };
  }

  if (direction === "up") {
    return { x: 0, y: 34, rotate: 0 };
  }

  return { x: 0, y: 20, rotate: 0 };
}

type UseAboutSectionRevealParams = {
  sectionRef: RefObject<HTMLElement | null>;
  reduceMotion: boolean;
};

const ABOUT_INITIAL_VARS = { autoAlpha: 0 };
const ABOUT_TO_VARS = {
  autoAlpha: 1,
  x: 0,
  y: 0,
  rotate: 0,
  filter: "blur(0px)",
  duration: 0.72,
  ease: "power2.out",
};
const ABOUT_REDUCED_MOTION_VARS = {
  autoAlpha: 1,
  x: 0,
  y: 0,
  rotate: 0,
  filter: "blur(0px)",
};
const getAboutFromVars = (item: HTMLElement) => ({
  autoAlpha: 0,
  filter: "blur(6px)",
  ...getOffsetByDirection(item.dataset.aboutDirection ?? "up"),
});

export function useAboutSectionReveal({
  sectionRef,
  reduceMotion,
}: UseAboutSectionRevealParams) {
  useStaggeredSectionReveal({
    rootRef: sectionRef,
    reduceMotion,
    selector: "[data-about-item]",
    initial: ABOUT_INITIAL_VARS,
    from: getAboutFromVars,
    to: ABOUT_TO_VARS,
    reducedMotionVars: ABOUT_REDUCED_MOTION_VARS,
  });
}
