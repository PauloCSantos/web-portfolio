import type { MouseEventHandler, RefCallback } from "react";
import { cn } from "@shared/lib/tailwind/cn";
import type { SectionId } from "@entities/section";
import type { MenuItem } from "../model/types";

type MenuDesktopNavProps = {
  items: MenuItem[];
  activeId: SectionId | null;
  isDesktop: boolean;
  menuStartRef: RefCallback<HTMLElement | null>;
  createSectionClickHandler: (id: SectionId) => MouseEventHandler<HTMLAnchorElement>;
};

export function MenuDesktopNav({
  items,
  activeId,
  isDesktop,
  menuStartRef,
  createSectionClickHandler,
}: MenuDesktopNavProps) {
  return (
    <div className="hidden items-center gap-3 lg:flex xl:gap-[clamp(1rem,1.35vw,1.75rem)]">
      {items.map(({ id, label }, index) => {
        const isActive = activeId === id;

        return (
          <a
            key={id}
            href={`#${id}`}
            aria-current={isActive ? "location" : undefined}
            ref={isDesktop && index === 0 ? menuStartRef : undefined}
            onClick={createSectionClickHandler(id)}
            className={cn(
              "relative rounded-sm text-[0.66rem] font-semibold uppercase tracking-[0.12em] transition-colors xl:text-(--font-eyebrow) xl:tracking-xwide",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
              isActive
                ? "text-fg after:content-[''] after:absolute after:left-0 after:right-0 after:-bottom-2 after:h-px after:bg-primary"
                : "text-fg/60 hover:text-fg",
            )}
          >
            {label}
          </a>
        );
      })}
    </div>
  );
}
