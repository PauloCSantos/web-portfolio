import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { useMediaQuery } from "@shared/lib/dom/useMediaQuery";
import { usePrefersReducedMotion } from "@shared/lib/motion/usePrefersReducedMotion";
import { HeroBackgroundArtwork } from "./HeroBackgroundArtwork";

type HeroBackgroundProps = {
  animateEnabled?: boolean;
};

export default function HeroBackground({ animateEnabled = true }: HeroBackgroundProps) {
  const reduce = usePrefersReducedMotion();
  const isMobile = useMediaQuery("(max-width: 767px)") === true;
  const rootRef = useRef<HTMLDivElement | null>(null);
  const planeARef = useRef<HTMLDivElement | null>(null);
  const planeBRef = useRef<HTMLDivElement | null>(null);
  const scanRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (!rootRef.current) return;

    const planeA = planeARef.current;
    const planeB = planeBRef.current;
    const scan = scanRef.current;

    if (!planeA || !planeB || !scan) return;

    gsap.set(planeA, { x: 0, y: 0, rotate: -8 });
    gsap.set(planeB, { x: 0, y: 0, rotate: 10 });
    gsap.set(scan, { opacity: 0.2, xPercent: 0 });

    if (reduce || !animateEnabled || isMobile) {
      return;
    }

    let frameId = 0;
    const animations: gsap.core.Animation[] = [];

    frameId = window.requestAnimationFrame(() => {
      animations.push(
        gsap
          .timeline({ repeat: -1, yoyo: true })
          .to(planeA, { x: 26, y: -18, rotate: -5.5, duration: 9, ease: "power2.inOut" }),
      );

      animations.push(
        gsap
          .timeline({ repeat: -1, yoyo: true })
          .to(planeB, { x: -18, y: 24, rotate: 7.5, duration: 11, ease: "power2.inOut" }),
      );

      animations.push(
        gsap.fromTo(
          scan,
          { opacity: 0, xPercent: -22 },
          {
            xPercent: 122,
            duration: 8,
            repeat: -1,
            delay: 0.8,
            ease: "none",
            keyframes: [
              { opacity: 0.28, duration: 1.4 },
              { opacity: 0.28, duration: 5.2 },
              { opacity: 0, duration: 1.4 },
            ],
          },
        ),
      );
    });

    return () => {
      window.cancelAnimationFrame(frameId);
      animations.forEach((animation) => animation.kill());
    };
  }, [animateEnabled, isMobile, reduce]);

  return (
    <HeroBackgroundArtwork
      rootRef={rootRef}
      planeARef={planeARef}
      planeBRef={planeBRef}
      scanRef={scanRef}
      animated
    />
  );
}
