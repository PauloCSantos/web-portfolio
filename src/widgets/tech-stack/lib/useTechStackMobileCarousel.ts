import { useEffect, useRef } from "react";

type UseTechStackMobileCarouselParams = {
  activeSlideIndex: number;
  slideCount: number;
  reduceMotion: boolean;
  onActiveSlideChange: (index: number) => void;
  onSelectSlide: (index: number) => void;
};

export function useTechStackMobileCarousel({
  activeSlideIndex,
  slideCount,
  reduceMotion,
  onActiveSlideChange,
  onSelectSlide,
}: UseTechStackMobileCarouselParams) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const slideRefs = useRef<Array<HTMLElement | null>>([]);
  const programmaticTargetIndexRef = useRef<number | null>(null);
  const programmaticReleaseRef = useRef<number | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    const slide = slideRefs.current[activeSlideIndex];

    if (!track || !slide) {
      return;
    }

    const targetLeft = slide.offsetLeft;
    const nearActive = Math.abs(track.scrollLeft - targetLeft) < 2;

    if (nearActive) {
      if (programmaticTargetIndexRef.current === activeSlideIndex) {
        programmaticTargetIndexRef.current = null;
      }

      return;
    }

    track.scrollTo({
      left: targetLeft,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, [activeSlideIndex, reduceMotion]);

  useEffect(() => {
    return () => {
      if (programmaticReleaseRef.current !== null) {
        window.clearTimeout(programmaticReleaseRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    const slides = slideRefs.current.filter((slide): slide is HTMLElement =>
      Boolean(slide),
    );

    if (!track || slides.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        let nextIndex: number | null = null;
        let highestRatio = 0;

        for (const entry of entries) {
          if (!entry.isIntersecting || entry.intersectionRatio < highestRatio) {
            continue;
          }

          const index = slideRefs.current.indexOf(entry.target as HTMLElement);

          if (index === -1) {
            continue;
          }

          if (
            programmaticTargetIndexRef.current !== null &&
            programmaticTargetIndexRef.current !== index
          ) {
            continue;
          }

          nextIndex = index;
          highestRatio = entry.intersectionRatio;
        }

        if (nextIndex === null) {
          return;
        }

        if (programmaticTargetIndexRef.current === nextIndex) {
          const targetSlide = slideRefs.current[nextIndex];

          if (targetSlide) {
            const targetLeft = targetSlide.offsetLeft;
            const reachedTarget = Math.abs(track.scrollLeft - targetLeft) < 4;

            if (reachedTarget) {
              programmaticTargetIndexRef.current = null;
            }
          }
        }

        onActiveSlideChange(nextIndex);
      },
      {
        root: track,
        threshold: [0.6, 0.75, 0.9],
      },
    );

    for (const slide of slides) {
      observer.observe(slide);
    }

    return () => {
      observer.disconnect();
    };
  }, [onActiveSlideChange, slideCount]);

  const registerSlideRef = (index: number, node: HTMLElement | null) => {
    slideRefs.current[index] = node;
  };

  const handleSelectSlide = (index: number) => {
    if (programmaticReleaseRef.current !== null) {
      window.clearTimeout(programmaticReleaseRef.current);
    }

    programmaticTargetIndexRef.current = index;
    programmaticReleaseRef.current = window.setTimeout(
      () => {
        programmaticTargetIndexRef.current = null;
        programmaticReleaseRef.current = null;
      },
      reduceMotion ? 120 : 700,
    );

    onSelectSlide(index);
  };

  return {
    trackRef,
    registerSlideRef,
    handleSelectSlide,
  };
}
