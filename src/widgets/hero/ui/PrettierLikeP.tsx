import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { cn } from "@shared/lib/tailwind";
import { usePrefersReducedMotion } from "@shared/lib/motion/usePrefersReducedMotion";

type Bar = {
  w: number; // 0..1
  a?: number;
};

const bars: Bar[] = [
  { w: 0.78, a: 0.42 },
  { w: 0.82, a: 0.36 },
  { w: 0.86, a: 0.3 },
  { w: 0.88, a: 0.24 },

  { w: 0.7, a: 0.42 },
  { w: 0.76, a: 0.34 },
  { w: 0.64, a: 0.38 },

  { w: 0.46, a: 0.28 },
  { w: 0.4, a: 0.22 },

  { w: 0.52, a: 0.34 },
  { w: 0.5, a: 0.28 },
  { w: 0.48, a: 0.22 },
];

type Props = {
  /**
   * Se você passar size, mantém o comportamento antigo (fixo).
   * Se não passar, usa mobile-first responsivo (recomendado).
   */
  size?: number;
  className?: string;
  revealEnabled?: boolean;
};

export function PrettierLikeP({ size, className, revealEnabled = true }: Props) {
  const reduceMotion = usePrefersReducedMotion();
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const barRefs = useRef<Array<HTMLDivElement | null>>([]);

  useLayoutEffect(() => {
    if (!wrapperRef.current) return;

    const ctx = gsap.context(() => {
      const elements = barRefs.current.filter(
        (bar): bar is HTMLDivElement => bar !== null,
      );
      if (elements.length === 0) return;

      if (!revealEnabled) {
        gsap.set(elements, { xPercent: -140, opacity: 0, filter: "blur(6px)" });
        return;
      }

      if (reduceMotion) {
        gsap.set(elements, { xPercent: 0, opacity: 1, filter: "blur(0px)" });
        return;
      }

      gsap.set(elements, { xPercent: -140, opacity: 0, filter: "blur(6px)" });
      gsap.to(elements, {
        xPercent: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.6,
        ease: "power2.out",
        delay: 0.08,
        stagger: 0.055,
        willChange: "opacity, transform, filter",
        clearProps: "willChange",
      });
    }, wrapperRef);

    return () => ctx.revert();
  }, [reduceMotion, revealEnabled]);

  const responsiveSizeClasses =
    "h-[clamp(8.5rem,15vw,18rem)] w-[clamp(8.5rem,15vw,18rem)]";

  const wrapperProps =
    typeof size === "number"
      ? { style: { width: size, height: size } }
      : { className: responsiveSizeClasses };

  // Reduced motion: render estático (sem stagger/blur/slide)
  if (reduceMotion) {
    return (
      <div
        aria-hidden
        {...wrapperProps}
        className={cn(
          "shrink-0",
          typeof size === "number" ? undefined : responsiveSizeClasses,
          className,
        )}
      >
        <div className="relative h-full w-full overflow-hidden rounded-md border border-primary/45 bg-bg/55 p-[clamp(0.85rem,1.2vw,1.25rem)]">
          <div className="absolute inset-x-0 top-0 h-1 bg-primary" />
          <div className="absolute bottom-0 right-0 h-1/2 w-1/2 border-l border-t border-border/70" />
          <div className="flex h-full flex-col justify-center gap-[clamp(0.25rem,0.4vw,0.5rem)]">
            {bars.map((b, i) => (
              <div
                key={i}
                className="h-[clamp(0.45rem,0.65vw,0.75rem)] rounded-full bg-primary"
                style={{
                  width: `${Math.round(b.w * 100)}%`,
                  opacity: b.a ?? 0.18,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={wrapperRef}
      aria-hidden
      {...(typeof size === "number" ? { style: { width: size, height: size } } : {})}
      className={cn(
        "shrink-0",
        typeof size === "number" ? undefined : responsiveSizeClasses,
        className,
      )}
    >
      <div className="relative h-full w-full overflow-hidden rounded-md border border-primary/45 bg-bg/55 p-[clamp(0.85rem,1.2vw,1.25rem)]">
        <div className="absolute inset-x-0 top-0 h-1 bg-primary" />
        <div className="absolute bottom-0 right-0 h-1/2 w-1/2 border-l border-t border-border/70" />
        <div className="flex h-full flex-col justify-center gap-[clamp(0.25rem,0.4vw,0.5rem)]">
          {bars.map((b, i) => (
            <div
              key={i}
              ref={(element) => {
                barRefs.current[i] = element;
              }}
              className="h-[clamp(0.45rem,0.65vw,0.75rem)] rounded-full bg-primary"
              style={{
                width: `${Math.round(b.w * 100)}%`,
                opacity: b.a ?? 0.18,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
