import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@shared/lib/theme/ThemeContext";
import { MenuView } from "./MenuView";
import type { MenuItem } from "../model/types";
import { resolveAppLanguage } from "@shared/lib/i18n/resolveAppLanguage";
import { setAppLanguage } from "@shared/lib/i18n/setAppLanguage";
import { SECTION_ORDER } from "@entities/section";
import { useActiveSection } from "../model/useActiveSection";

export function Menu({ offsetTop = 80 }: { offsetTop?: number }) {
  const { t, i18n } = useTranslation("common");
  const { theme, toggleTheme } = useTheme();

  const ids = SECTION_ORDER;
  const activeId = useActiveSection({ ids, offsetTop });

  const items: MenuItem[] = useMemo(
    () => ids.map((id) => ({ id, label: t(`nav.${id}`) })),
    [ids, t],
  );

  const isDarkTheme = theme === "dark";
  const lang = resolveAppLanguage(i18n.language);
  const isEnglish = lang === "en";

  return (
    <MenuView
      items={items}
      activeId={activeId}
      scrollOffset={offsetTop}
      isDarkTheme={isDarkTheme}
      onToggleTheme={toggleTheme}
      themeLabels={{
        left: t("menu.light"),
        right: t("menu.dark"),
        aria: t("menu.toggleTheme"),
      }}
      isEnglish={isEnglish}
      onToggleLanguage={() => void setAppLanguage(isEnglish ? "pt-BR" : "en")}
      langLabels={{
        left: t("menu.langPT"),
        right: t("menu.langEN"),
        aria: t("menu.toggleLang"),
      }}
    />
  );
}
