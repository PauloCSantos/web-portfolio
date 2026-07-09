import { useCallback, type RefObject } from "react";
import { gsap } from "gsap";
import { useGsapSectionReveal } from "@shared/lib/motion/useGsapSectionReveal";

const HERO_ITEM_OFFSETS = [
  { x: -44, y: -8, rotate: -1.2 },
  { x: 0, y: 30, rotate: 0 },
  { x: 40, y: 0, rotate: 0.8 },
  { x: -32, y: 10, rotate: -0.4 },
  { x: 0, y: 20, rotate: 0 },
  { x: 28, y: 12, rotate: 0.5 },
] as const;

type UseHeroRevealParams = {
  containerRef: RefObject<HTMLDivElement | null>;
  reduceMotion: boolean;
  enabled?: boolean;
};

export function useHeroReveal({
  containerRef,
  reduceMotion,
  enabled = true,
}: UseHeroRevealParams) {
  const setupReveal = useCallback(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const textItems = gsap.utils.toArray<HTMLElement>(
      container.querySelectorAll("[data-hero-item]"),
    );

    if (!enabled) {
      gsap.set(container, { autoAlpha: 0, y: 18 });
      gsap.set(textItems, {
        autoAlpha: 0,
        x: 0,
        y: 18,
        rotate: 0,
        filter: "blur(6px)",
      });
      return;
    }

    if (reduceMotion) {
      gsap.set(container, { autoAlpha: 1, y: 0 });
      gsap.set(textItems, {
        autoAlpha: 1,
        x: 0,
        y: 0,
        rotate: 0,
        filter: "blur(0px)",
      });
      return;
    }

    const introTimeline = gsap.timeline();

    introTimeline.fromTo(
      container,
      { autoAlpha: 0, y: 18 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 1.1,
        ease: "power2.out",
        willChange: "opacity, transform",
        clearProps: "willChange",
      },
    );

    textItems.forEach((item, index) => {
      const offset = HERO_ITEM_OFFSETS[index] ?? { x: 0, y: 18, rotate: 0 };

      introTimeline.fromTo(
        item,
        {
          autoAlpha: 0,
          filter: "blur(6px)",
          ...offset,
        },
        {
          autoAlpha: 1,
          x: 0,
          y: 0,
          rotate: 0,
          filter: "blur(0px)",
          duration: 0.8,
          ease: "power3.out",
          willChange: "opacity, transform, filter",
          clearProps: "willChange",
        },
        index === 0 ? "-=0.45" : "-=0.54",
      );
    });
  }, [containerRef, enabled, reduceMotion]);

  useGsapSectionReveal({
    rootRef: containerRef,
    reduceMotion,
    setup: setupReveal,
  });
}
