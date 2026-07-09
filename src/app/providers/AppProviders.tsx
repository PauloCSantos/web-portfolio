import { I18nProvider } from "./i18n/I18nProvider";
import { ThemeProvider } from "@shared/lib/theme/ThemeProvider";
import { FocusProvider } from "@shared/lib/focus/FocusProvider";
import type { ReactNode } from "react";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      <ThemeProvider>
        <FocusProvider>{children}</FocusProvider>
      </ThemeProvider>
    </I18nProvider>
  );
}
