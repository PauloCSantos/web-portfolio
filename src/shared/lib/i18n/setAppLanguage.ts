import i18n from "i18next";
import { resolveAppLanguage, type AppLanguage } from "./resolveAppLanguage";
import { ensureLanguageResources } from "./initI18n";
import { canUseDOM } from "@shared/lib/dom/canUseDOM";
import { safeRemoveItem, safeSetItem } from "@shared/lib/storage/safeStorage";
import { APP_LANGUAGE_STORAGE_KEY, LEGACY_APP_LANGUAGE_STORAGE_KEY } from "./storage";

export async function setAppLanguage(lang: AppLanguage | string): Promise<void> {
  const next = resolveAppLanguage(lang);

  try {
    await ensureLanguageResources(next);
    await i18n.changeLanguage(next);
  } catch (e) {
    console.error("[i18n] Failed to change language", e);
    return;
  }

  if (canUseDOM) {
    document.documentElement.lang = next;
  }

  safeSetItem(APP_LANGUAGE_STORAGE_KEY, next);
  safeRemoveItem(LEGACY_APP_LANGUAGE_STORAGE_KEY);
}
