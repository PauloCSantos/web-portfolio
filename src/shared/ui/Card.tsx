import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cn } from "../lib/tailwind";

type DivProps = ComponentPropsWithoutRef<"div">;
type H3Props = ComponentPropsWithoutRef<"h3">;
type PProps = ComponentPropsWithoutRef<"p">;
type SpanProps = ComponentPropsWithoutRef<"span">;

const CardRoot = forwardRef<HTMLDivElement, DivProps>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    {...props}
    className={cn(
      "bg-card/80 border border-border/70 rounded-(--card-radius) p-(--card-padding) [container-type:inline-size]",
      "shadow-card",
      "transition-shadow hover:shadow-card-hover",
      className,
    )}
  />
));
CardRoot.displayName = "Card";

const CardHeader = forwardRef<HTMLDivElement, DivProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} {...props} className={cn("space-y-2", className)} />
  ),
);
CardHeader.displayName = "CardHeader";

const CardTitle = forwardRef<HTMLHeadingElement, H3Props>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      {...props}
      className={cn(
        "text-(length:--font-card-title) font-semibold leading-tight",
        className,
      )}
    />
  ),
);
CardTitle.displayName = "CardTitle";

const CardEyebrow = forwardRef<HTMLSpanElement, SpanProps>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      {...props}
      className={cn("text-(length:--font-body-small) text-muted", className)}
    />
  ),
);
CardEyebrow.displayName = "CardEyebrow";

const CardDescription = forwardRef<HTMLParagraphElement, PProps>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      {...props}
      className={cn(
        "text-(length:--font-body-small) leading-relaxed text-muted",
        className,
      )}
    />
  ),
);
CardDescription.displayName = "CardDescription";

const CardContent = forwardRef<HTMLDivElement, DivProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} {...props} className={cn("", className)} />
  ),
);
CardContent.displayName = "CardContent";

const CardFooter = forwardRef<HTMLDivElement, DivProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} {...props} className={cn("flex items-center", className)} />
  ),
);
CardFooter.displayName = "CardFooter";

export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Title: CardTitle,
  Eyebrow: CardEyebrow,
  Description: CardDescription,
  Content: CardContent,
  Footer: CardFooter,
});
