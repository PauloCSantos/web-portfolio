import type { RefObject } from "react";
import { useStaggeredSectionReveal } from "@shared/lib/motion/useStaggeredSectionReveal";

type UseContactSectionRevealParams = {
  sectionRef: RefObject<HTMLElement | null>;
  reduceMotion: boolean;
};

const CONTACT_INITIAL_VARS = { autoAlpha: 0, y: 40, filter: "blur(6px)" };
const CONTACT_TO_VARS = {
  autoAlpha: 1,
  y: 0,
  filter: "blur(0px)",
  duration: 0.72,
  ease: "power2.out",
};
const CONTACT_REDUCED_MOTION_VARS = {
  autoAlpha: 1,
  y: 0,
  filter: "blur(0px)",
};

export function useContactSectionReveal({
  sectionRef,
  reduceMotion,
}: UseContactSectionRevealParams) {
  useStaggeredSectionReveal({
    rootRef: sectionRef,
    reduceMotion,
    selector: "[data-contact-item]",
    initial: CONTACT_INITIAL_VARS,
    from: CONTACT_INITIAL_VARS,
    to: CONTACT_TO_VARS,
    reducedMotionVars: CONTACT_REDUCED_MOTION_VARS,
    start: "top 85%",
    stagger: 0.2,
    timeline: false,
  });
}
