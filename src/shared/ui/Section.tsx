import { forwardRef, type ComponentPropsWithoutRef, type CSSProperties } from "react";
import { cn } from "../lib/tailwind";

type SectionProps = ComponentPropsWithoutRef<"section"> & {
  deferIntrinsicSize?: string;
  deferRender?: boolean;
  tone?: "default" | "muted";
};

export const Section = forwardRef<HTMLElement, SectionProps>(
  (
    {
      className,
      deferIntrinsicSize = "640px",
      deferRender = false,
      style,
      tone = "default",
      ...props
    },
    ref,
  ) => {
    const base =
      "scroll-mt-[calc(var(--header-block-size)+1.25rem)] border-t border-border/60 py-(--section-padding-block) text-fg";
    const toneClass = tone === "muted" ? "bg-card/40" : "bg-bg";
    const deferStyle: CSSProperties | null = deferRender
      ? {
          contentVisibility: "auto",
          containIntrinsicSize: deferIntrinsicSize,
        }
      : null;

    return (
      <section
        ref={ref}
        {...props}
        style={{ ...deferStyle, ...style }}
        className={cn(base, toneClass, className)}
      />
    );
  },
);

Section.displayName = "Section";
