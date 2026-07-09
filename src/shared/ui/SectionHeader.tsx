import type { ComponentPropsWithoutRef } from "react";
import { cn } from "../lib/tailwind";

type DivProps = ComponentPropsWithoutRef<"div">;

type SectionHeaderProps = DivProps & {
  title: string;
  description?: string;
  titleId?: string;
  align?: "left" | "center";
  maxWidthClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
};

export function SectionHeader({
  title,
  description,
  titleId,
  align = "left",
  maxWidthClassName = "max-w-(--layout-readable)",
  titleClassName,
  descriptionClassName,
  className,
  ...props
}: SectionHeaderProps) {
  const alignClass = align === "center" ? "text-center mx-auto" : "text-left";

  return (
    <div {...props} className={cn("space-y-4", alignClass, maxWidthClassName, className)}>
      <h2
        id={titleId}
        className={cn(
          "text-(length:--font-section-title) font-semibold leading-[1.05] text-balance",
          titleClassName,
        )}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "max-w-(--layout-readable) text-(length:--font-body-fluid) leading-relaxed text-muted text-pretty",
            descriptionClassName,
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
