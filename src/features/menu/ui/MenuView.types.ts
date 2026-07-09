import type { SectionId } from "@entities/section";
import type { MenuItem } from "../model/types";

export type MenuSwitchLabels = {
  left: string;
  right: string;
  aria: string;
};

export type MenuViewLabels = {
  open: string;
  close: string;
  title: string;
};

export type MenuViewProps = {
  items: MenuItem[];
  activeId: SectionId | null;
  scrollOffset: number;
  isDarkTheme: boolean;
  onToggleTheme: () => void;
  themeLabels: MenuSwitchLabels;
  isEnglish: boolean;
  onToggleLanguage: () => void;
  langLabels: MenuSwitchLabels;
};
