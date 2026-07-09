import { useCallback, type RefObject } from "react";
import { gsap } from "gsap";
import { useGsapSectionReveal } from "./useGsapSectionReveal";

type RevealVars = gsap.TweenVars;

type UseStaggeredSectionRevealParams = {
  rootRef: RefObject<HTMLElement | null>;
  reduceMotion: boolean;
  selector: string;
  from: RevealVars | ((element: HTMLElement, index: number) => RevealVars);
  to: RevealVars;
  initial?: RevealVars;
  reducedMotionVars?: RevealVars;
  start?: string;
  stagger?: number;
  schedule?: "sync" | "idle";
  timeline?: boolean;
};

function resolveVars(
  vars: RevealVars | ((element: HTMLElement, index: number) => RevealVars),
  element: HTMLElement,
  index: number,
) {
  return typeof vars === "function" ? vars(element, index) : vars;
}

export function useStaggeredSectionReveal({
  rootRef,
  reduceMotion,
  selector,
  from,
  to,
  initial,
  reducedMotionVars,
  start = "top 84%",
  stagger = 0.18,
  schedule = "idle",
  timeline = true,
}: UseStaggeredSectionRevealParams) {
  const setupReveal = useCallback(
    ({ root }: { root: HTMLElement; reduceMotion: boolean }) => {
      const items = gsap.utils.toArray<HTMLElement>(root.querySelectorAll(selector));

      if (items.length === 0) {
        return;
      }

      if (reduceMotion) {
        gsap.set(items, reducedMotionVars ?? to);
        return;
      }

      if (initial) {
        gsap.set(items, initial);
      }

      const scrollTrigger = {
        trigger: root,
        start,
        once: true,
        toggleActions: "play none none none",
      };

      if (!timeline) {
        gsap.to(items, {
          ...to,
          stagger,
          scrollTrigger,
        });
        return;
      }

      const sectionTimeline = gsap.timeline({ scrollTrigger });

      items.forEach((item, index) => {
        sectionTimeline.fromTo(
          item,
          resolveVars(from, item, index),
          to,
          index * stagger,
        );
      });
    },
    [from, initial, reduceMotion, reducedMotionVars, selector, stagger, start, to, timeline],
  );

  useGsapSectionReveal({
    rootRef,
    reduceMotion,
    schedule,
    setup: setupReveal,
  });
}
