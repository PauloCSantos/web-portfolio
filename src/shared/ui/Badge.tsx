import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cn } from "../lib/tailwind";

type SpanProps = ComponentPropsWithoutRef<"span">;

type BadgeProps = SpanProps & {
  size?: "sm" | "md";
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, size = "md", ...props }, ref) => {
    const base =
      "inline-flex items-center rounded-full border border-border/70 bg-fg/5 text-fg/80";
    const sizeClass =
      size === "sm"
        ? "px-2 py-1 text-xxs"
        : "px-[clamp(0.6rem,0.7vw,0.9rem)] py-[clamp(0.32rem,0.45vw,0.55rem)] text-(length:--font-body-small)";

    return <span ref={ref} {...props} className={cn(base, sizeClass, className)} />;
  },
);

Badge.displayName = "Badge";
