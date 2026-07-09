import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cn } from "../lib/tailwind";

type DivProps = ComponentPropsWithoutRef<"div">;

export const Container = forwardRef<HTMLDivElement, DivProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      {...props}
      className={cn(
        "mx-auto w-full max-w-(--layout-container) px-(--layout-gutter)",
        className,
      )}
    />
  ),
);

Container.displayName = "Container";
