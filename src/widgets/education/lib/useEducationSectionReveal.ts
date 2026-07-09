import { useCallback, type RefObject } from "react";
import { gsap } from "gsap";
import { useGsapSectionReveal } from "@shared/lib/motion/useGsapSectionReveal";

type UseEducationSectionRevealParams = {
  sectionRef: RefObject<HTMLElement | null>;
  reduceMotion: boolean;
};

export function useEducationSectionReveal({
  sectionRef,
  reduceMotion,
}: UseEducationSectionRevealParams) {
  const setupReveal = useCallback(
    ({ root }: { root: HTMLElement; reduceMotion: boolean }) => {
      const header = root.querySelector<HTMLElement>("[data-education-header]");
      const thesis = root.querySelector<HTMLElement>("[data-education-thesis]");
      const items = gsap.utils.toArray<HTMLElement>(
        root.querySelectorAll("[data-education-item]"),
      );

      if (!header || !thesis || items.length === 0) {
        return;
      }

      if (reduceMotion) {
        gsap.set([header, thesis, ...items], {
          autoAlpha: 1,
          x: 0,
          y: 0,
          scaleX: 1,
          filter: "blur(0px)",
        });
        return;
      }

      gsap.set([header, thesis, ...items], { autoAlpha: 0 });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top 84%",
          once: true,
          toggleActions: "play none none none",
        },
      });

      timeline.fromTo(
        header,
        { autoAlpha: 0, y: 30, filter: "blur(6px)" },
        {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.72,
          ease: "power2.out",
        },
      );

      timeline.fromTo(
        thesis,
        { autoAlpha: 0, x: 28, filter: "blur(5px)" },
        {
          autoAlpha: 1,
          x: 0,
          filter: "blur(0px)",
          duration: 0.68,
          ease: "power2.out",
        },
        0.12,
      );

      items.forEach((item, index) => {
        timeline.fromTo(
          item,
          {
            autoAlpha: 0,
            y: 30,
            filter: "blur(5px)",
          },
          {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.74,
            ease: "power2.out",
          },
          0.24 + index * 0.16,
        );
      });
    },
    [reduceMotion],
  );

  useGsapSectionReveal({
    rootRef: sectionRef,
    reduceMotion,
    schedule: "idle",
    setup: setupReveal,
  });
}
