import type { MutableRefObject, RefCallback } from "react";
import type { SectionId } from "@entities/section";
import type { MenuItem } from "../model/types";
import type { MenuViewLabels } from "./MenuView.types";

type MenuMobileHeaderProps = {
  items: MenuItem[];
  activeId: SectionId | null;
  open: boolean;
  labels: MenuViewLabels;
  panelId: string;
  isDesktop: boolean;
  openerRef: MutableRefObject<HTMLButtonElement | null>;
  menuStartRef: RefCallback<HTMLElement | null>;
  onToggleOpen: () => void;
};

export function MenuMobileHeader({
  items,
  activeId,
  open,
  labels,
  panelId,
  isDesktop,
  openerRef,
  menuStartRef,
  onToggleOpen,
}: MenuMobileHeaderProps) {
  return (
    <div className="flex w-full items-center justify-between gap-3 lg:hidden">
      <div className="max-w-[min(72%,24rem)] truncate text-(length:--font-eyebrow) font-semibold uppercase tracking-xwide opacity-70">
        {items.find((item) => item.id === activeId)?.label ?? ""}
      </div>

      <button
        ref={(node) => {
          openerRef.current = node;
          if (!isDesktop) {
            menuStartRef(node);
          }
        }}
        type="button"
        className="inline-flex min-h-11 items-center justify-center rounded-full border border-border/70 bg-bg/70 px-3 py-2 text-(length:--font-body-small)"
        aria-label={open ? labels.close : labels.open}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggleOpen}
      >
        <span className="sr-only">{labels.title}</span>
        <span aria-hidden className="flex flex-col gap-1">
          <span className="block h-px w-5 bg-fg" />
          <span className="block h-px w-5 bg-fg" />
          <span className="block h-px w-5 bg-fg" />
        </span>
      </button>
    </div>
  );
}
