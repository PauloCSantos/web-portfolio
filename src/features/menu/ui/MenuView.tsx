import type { MouseEventHandler } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import type { SectionId } from "@entities/section";
import { cn } from "@shared/lib/tailwind/cn";
import { isModifiedNavigationEvent, navigateToSection } from "../lib/menuDom";
import { useMenuViewState } from "../lib/useMenuViewState";
import { MenuDesktopNav } from "./MenuDesktopNav";
import { MenuMobileDialog } from "./MenuMobileDialog";
import { MenuMobileHeader } from "./MenuMobileHeader";
import { MenuSwitchGroup } from "./MenuSwitchGroup";
import type { MenuViewProps } from "./MenuView.types";

export function MenuView(props: MenuViewProps) {
  const { t } = useTranslation("common");
  const labels = {
    open: t("menu.openMenu"),
    close: t("menu.closeMenu"),
    title: t("menu.menuTitle"),
  };
  const tone = props.isDarkTheme ? "dark" : "light";
  const {
    open,
    setOpen,
    isScrolled,
    isDesktop,
    panelId,
    titleId,
    openerRef,
    dialogRef,
    menuStartRef,
    portalRoot,
    onDialogKeyDown,
    headerAriaLabel,
  } = useMenuViewState(labels);

  const handleNavigateToSection = (id: SectionId) => {
    setOpen(false);
    navigateToSection(id, props.scrollOffset);
  };

  const createSectionClickHandler = (
    id: SectionId,
  ): MouseEventHandler<HTMLAnchorElement> => {
    return (event) => {
      if (isModifiedNavigationEvent(event)) {
        return;
      }

      event.preventDefault();
      handleNavigateToSection(id);
    };
  };

  const header = (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50",
        "bg-bg/80 backdrop-blur border-b border-border/70",
        "transition-shadow duration-300",
        isScrolled ? "shadow-menu" : "shadow-none",
      )}
    >
      <nav
        aria-label={headerAriaLabel}
        className="mx-auto flex h-(--header-block-size) max-w-(--layout-container) items-center justify-between px-(--layout-gutter)"
      >
        <MenuDesktopNav
          items={props.items}
          activeId={props.activeId}
          isDesktop={isDesktop}
          menuStartRef={menuStartRef}
          createSectionClickHandler={createSectionClickHandler}
        />

        <MenuSwitchGroup
          className="hidden items-center gap-3 lg:flex xl:gap-[clamp(1rem,1.4vw,1.75rem)]"
          tone={tone}
          isDarkTheme={props.isDarkTheme}
          onToggleTheme={props.onToggleTheme}
          themeLabels={props.themeLabels}
          isEnglish={props.isEnglish}
          onToggleLanguage={props.onToggleLanguage}
          langLabels={props.langLabels}
        />

        <MenuMobileHeader
          items={props.items}
          activeId={props.activeId}
          open={open}
          labels={labels}
          panelId={panelId}
          isDesktop={isDesktop}
          openerRef={openerRef}
          menuStartRef={menuStartRef}
          onToggleOpen={() => setOpen((value) => !value)}
        />
      </nav>

      <MenuMobileDialog
        open={open}
        items={props.items}
        activeId={props.activeId}
        isDarkTheme={props.isDarkTheme}
        onToggleTheme={props.onToggleTheme}
        themeLabels={props.themeLabels}
        isEnglish={props.isEnglish}
        onToggleLanguage={props.onToggleLanguage}
        langLabels={props.langLabels}
        labels={labels}
        panelId={panelId}
        titleId={titleId}
        portalRoot={portalRoot}
        dialogRef={dialogRef}
        onClose={() => setOpen(false)}
        onDialogKeyDown={onDialogKeyDown}
        createSectionClickHandler={createSectionClickHandler}
      />
    </header>
  );

  return portalRoot ? createPortal(header, portalRoot) : header;
}
