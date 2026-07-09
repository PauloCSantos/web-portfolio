import type { i18n as I18nInstance } from "i18next";
import { initI18n as initSharedI18n } from "@shared/lib/i18n/initI18n";
import { resources, NAMESPACES, loadLanguageResources } from "@app/config/resources";

export async function initI18n(): Promise<I18nInstance> {
  return initSharedI18n({
    resources,
    namespaces: NAMESPACES,
    defaultNS: "common",
    fallbackLng: "en",
    loadLanguageResources,
  });
}
