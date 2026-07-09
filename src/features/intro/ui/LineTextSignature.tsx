import { memo, type CSSProperties, useEffect, useId, useMemo, useRef } from "react";
import { gsap } from "gsap";
import { cn } from "@shared/lib/tailwind/cn";
import { usePrefersReducedMotion } from "@shared/lib/motion/usePrefersReducedMotion";
import {
  buildLineTextSignatureSvg,
  getLineTextWrapperStyle,
} from "../lib/lineTextSignatureSvg";

type Props = {
  text: string;
  className?: string;

  width?: number;
  height?: number;

  rows?: number;
  gap?: number;
  radius?: number;

  fontFamily?: string;
  fontWeight?: number;
  fontSize?: number;

  duration?: number;
  stagger?: number;

  onComplete?: () => void;
};

const SVG_WIDTH = 720;
const SVG_HEIGHT = 160;

function LineTextSignatureComponent({
  text,
  className = "",
  width = 720,
  height = 160,

  rows = 34,
  gap = 1.4,
  radius = 1.2,

  fontFamily = "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
  fontWeight = 800,
  fontSize = 72,

  duration = 0.7,
  stagger = 0.035,

  onComplete,
}: Props) {
  const reduceMotion = usePrefersReducedMotion();
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const onCompleteRef = useRef(onComplete);

  const reactId = useId();
  const maskId = useMemo(
    () => `textMask-${reactId.replace(/[^a-zA-Z0-9_-]/g, "_")}`,
    [reactId],
  );

  const rowH = SVG_HEIGHT / rows;
  const usableH = Math.max(0.8, rowH - gap);

  const wrapperStyle: CSSProperties = useMemo(
    () => getLineTextWrapperStyle(width, height),
    [height, width],
  );

  const signatureSvg = useMemo(
    () =>
      buildLineTextSignatureSvg({
        text,
        rows,
        rowHeight: rowH,
        usableHeight: usableH,
        width: SVG_WIDTH,
        height: SVG_HEIGHT,
        radius,
        fontFamily,
        fontWeight,
        fontSize,
        maskId,
        animated: !reduceMotion,
      }),
    [
      fontFamily,
      fontSize,
      fontWeight,
      maskId,
      radius,
      reduceMotion,
      rowH,
      rows,
      text,
      usableH,
    ],
  );

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (reduceMotion) return;
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    let ctx: gsap.Context | null = null;
    const frameId = requestAnimationFrame(() => {
      ctx = gsap.context(() => {
        const elements = Array.from(
          wrapper.querySelectorAll<SVGRectElement>("[data-line-text-signature-line]"),
        );
        if (elements.length === 0) return;

        gsap.to(elements, {
          x: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration,
          ease: "power2.out",
          delay: 0.1,
          stagger,
          onComplete: () => onCompleteRef.current?.(),
        });
      }, wrapper);
    });

    return () => {
      cancelAnimationFrame(frameId);
      ctx?.revert();
    };
  }, [duration, reduceMotion, stagger]);

  if (reduceMotion) {
    return (
      <div className={cn("text-fg", className)} style={wrapperStyle}>
        {signatureSvg}
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className={cn("text-fg", className)} style={wrapperStyle}>
      {signatureSvg}
    </div>
  );
}

export const LineTextSignature = memo(LineTextSignatureComponent);
