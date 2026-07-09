import i18n, { type Resource, type i18n as I18nInstance } from "i18next";
import { initReactI18next } from "react-i18next";
import { canUseDOM } from "@shared/lib/dom/canUseDOM";
import { safeGetItem, safeSetItem } from "@shared/lib/storage/safeStorage";
import { APP_LANGUAGE_STORAGE_KEY, LEGACY_APP_LANGUAGE_STORAGE_KEY } from "./storage";
import {
  isAppLanguage,
  resolveAppLanguage,
  type AppLanguage,
} from "./resolveAppLanguage";

type LanguageNamespaceResources = Record<string, unknown>;
type LoadLanguageResources = (
  lang: AppLanguage,
) => Promise<LanguageNamespaceResources | null>;

export type InitI18nOptions = {
  resources: Resource;
  namespaces: readonly string[];
  defaultNS?: string;
  fallbackLng?: AppLanguage;
  loadLanguageResources?: LoadLanguageResources;
};

let initPromise: Promise<void> | null = null;
let loadLanguageResources: LoadLanguageResources | null = null;
const loadedLanguages = new Set<AppLanguage>();

function getInitialLanguage(): AppLanguage {
  if (!canUseDOM) return "en";

  const stored =
    safeGetItem(APP_LANGUAGE_STORAGE_KEY) ?? safeGetItem(LEGACY_APP_LANGUAGE_STORAGE_KEY);
  const resolved = resolveAppLanguage(stored);

  if (stored && safeGetItem(APP_LANGUAGE_STORAGE_KEY) == null) {
    safeSetItem(APP_LANGUAGE_STORAGE_KEY, resolved);
  }
  return resolved;
}

function addLanguageBundles(lang: AppLanguage, bundles: LanguageNamespaceResources) {
  for (const [namespace, data] of Object.entries(bundles)) {
    i18n.addResourceBundle(lang, namespace, data, true, true);
  }
}

export async function ensureLanguageResources(lang: AppLanguage): Promise<void> {
  if (loadedLanguages.has(lang)) return;
  if (!loadLanguageResources) return;

  const bundles = await loadLanguageResources(lang);
  if (bundles) {
    addLanguageBundles(lang, bundles);
  }

  loadedLanguages.add(lang);
}

export async function initI18n(options: InitI18nOptions): Promise<I18nInstance> {
  if (i18n.isInitialized) return i18n;

  const {
    resources,
    namespaces,
    defaultNS = "common",
    fallbackLng = "en",
    loadLanguageResources: languageLoader,
  } = options;

  loadLanguageResources = languageLoader ?? null;

  if (!initPromise) {
    const initialLanguage = getInitialLanguage();
    let initResources: Resource = resources;

    loadedLanguages.clear();
    for (const key of Object.keys(resources)) {
      if (isAppLanguage(key)) loadedLanguages.add(key);
    }

    if (!loadedLanguages.has(initialLanguage) && loadLanguageResources) {
      const bundles = await loadLanguageResources(initialLanguage);
      if (bundles) {
        initResources = {
          ...resources,
          [initialLanguage]: bundles,
        } as Resource;
        loadedLanguages.add(initialLanguage);
      }
    }

    initPromise = i18n
      .use(initReactI18next)
      .init({
        resources: initResources,
        lng: initialLanguage,
        fallbackLng,
        ns: [...namespaces],
        defaultNS,
        interpolation: { escapeValue: false },
      })
      .then(() => undefined);
  }

  await initPromise;

  if (canUseDOM) {
    document.documentElement.lang = resolveAppLanguage(i18n.language);
  }

  return i18n;
}
