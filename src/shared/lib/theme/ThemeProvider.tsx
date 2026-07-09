import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { ThemeContext, type Theme } from "./ThemeContext";
import { canUseDOM } from "@shared/lib/dom/canUseDOM";
import {
  safeGetItem,
  safeRemoveItem,
  safeSetItem,
} from "@shared/lib/storage/safeStorage";

const THEME_KEY = "portfolio:theme:v1" as const;
const LEGACY_THEME_KEY = "theme" as const;
const DEFAULT_THEME: Theme = "light";

function isTheme(value: unknown): value is Theme {
  return value === "light" || value === "dark";
}

function safeGetStoredTheme(): Theme | null {
  const storedTheme = safeGetItem(THEME_KEY);
  const legacyTheme = safeGetItem(LEGACY_THEME_KEY);
  const raw = storedTheme ?? legacyTheme;
  if (!raw) return null;

  if (isTheme(raw)) {
    if (storedTheme == null && legacyTheme != null) {
      safeSetItem(THEME_KEY, raw);
    }
    return raw;
  }

  safeRemoveItem(THEME_KEY);
  safeRemoveItem(LEGACY_THEME_KEY);
  return null;
}

function safeSetStoredTheme(theme: Theme) {
  safeSetItem(THEME_KEY, theme);
}

function applyThemeToHtml(theme: Theme) {
  if (!canUseDOM) return;
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = safeGetStoredTheme();
    if (saved) return saved;

    const prefersDark =
      canUseDOM && window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;

    return prefersDark ? "dark" : DEFAULT_THEME;
  });

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  useEffect(() => {
    applyThemeToHtml(theme);
    safeSetStoredTheme(theme);
  }, [theme]);

  const value = useMemo(
    () => ({ theme, toggleTheme, setTheme }),
    [theme, toggleTheme, setTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
