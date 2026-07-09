import type {
  KeyboardEvent as ReactKeyboardEvent,
  MouseEventHandler,
  MutableRefObject,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@shared/lib/tailwind/cn";
import type { SectionId } from "@entities/section";
import { MenuSwitchGroup } from "./MenuSwitchGroup";
import type { MenuViewLabels, MenuViewProps } from "./MenuView.types";

type MenuMobileDialogProps = Pick<
  MenuViewProps,
  | "items"
  | "activeId"
  | "isDarkTheme"
  | "onToggleTheme"
  | "themeLabels"
  | "isEnglish"
  | "onToggleLanguage"
  | "langLabels"
> & {
  open: boolean;
  labels: MenuViewLabels;
  panelId: string;
  titleId: string;
  portalRoot: HTMLElement | null;
  dialogRef: MutableRefObject<HTMLDivElement | null>;
  onClose: () => void;
  onDialogKeyDown: (event: ReactKeyboardEvent<HTMLDivElement>) => void;
  createSectionClickHandler: (id: SectionId) => MouseEventHandler<HTMLAnchorElement>;
};

export function MenuMobileDialog({
  open,
  items,
  activeId,
  isDarkTheme,
  onToggleTheme,
  themeLabels,
  isEnglish,
  onToggleLanguage,
  langLabels,
  labels,
  panelId,
  titleId,
  portalRoot,
  dialogRef,
  onClose,
  onDialogKeyDown,
  createSectionClickHandler,
}: MenuMobileDialogProps) {
  if (!open || !portalRoot) {
    return null;
  }

  return createPortal(
    <div className="lg:hidden">
      <button
        type="button"
        aria-label={labels.close}
        tabIndex={-1}
        className="fixed inset-0 z-60 bg-black/50"
        onClick={onClose}
      />

      <div
        id={panelId}
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="fixed left-0 right-0 top-0 z-70 max-h-dvh overflow-y-auto border-b border-border/70 bg-bg/95 shadow-menu-panel"
        onClick={(event) => event.stopPropagation()}
        onKeyDown={onDialogKeyDown}
      >
        <h2 id={titleId} className="sr-only">
          {labels.title}
        </h2>

        <div className="mx-auto max-w-(--layout-container) px-(--layout-gutter) py-[clamp(1rem,2vw,1.5rem)]">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-(length:--font-eyebrow) font-semibold uppercase tracking-xwide text-fg/70">
              {labels.title}
            </p>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-full border border-border/70 bg-bg/80 px-3 py-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              {labels.close}
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {items.map(({ id, label }) => {
              const isActive = activeId === id;

              return (
                <a
                  key={id}
                  href={`#${id}`}
                  aria-current={isActive ? "location" : undefined}
                  onClick={createSectionClickHandler(id)}
                  className={cn(
                    "rounded-lg px-3 py-2.5 text-(length:--font-body-small) font-medium transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
                    isActive ? "bg-card/80" : "hover:bg-card/60 opacity-90",
                  )}
                >
                  {label}
                </a>
              );
            })}
          </div>

          <MenuSwitchGroup
            className="mt-4 flex flex-col items-start gap-4 border-t border-border/70 pt-4"
            switchClassName="w-fit"
            switchContentClassName="min-w-0 grid-cols-[3.5rem_auto_4.75rem] justify-start"
            tone={isDarkTheme ? "dark" : "light"}
            isDarkTheme={isDarkTheme}
            onToggleTheme={onToggleTheme}
            themeLabels={themeLabels}
            isEnglish={isEnglish}
            onToggleLanguage={onToggleLanguage}
            langLabels={langLabels}
          />
        </div>
      </div>
    </div>,
    portalRoot,
  );
}
