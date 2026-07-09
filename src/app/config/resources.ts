import type { AppLanguage } from "@shared/lib/i18n/resolveAppLanguage";
import commonEn from "@app/i18n/en.json";
import { heroI18n } from "@widgets/hero";
import { aboutI18n } from "@widgets/about";
import { workI18n } from "@widgets/work";
import { techStackI18n } from "@widgets/tech-stack/i18n";
import { educationI18n } from "@widgets/education";
import { contactI18n } from "@widgets/contact";
import { introI18n } from "@features/intro";
import { resumeI18n } from "@features/resume";
import { defineLazyI18nModule } from "@shared/lib/i18n/defineLazyI18nModule";

type TranslationModule = Record<string, unknown>;
type PublicI18nModule = {
  namespace: string;
  resources: {
    en: TranslationModule;
  };
  loadPtBR: () => Promise<TranslationModule>;
};

const commonI18n = defineLazyI18nModule({
  namespace: "common",
  en: commonEn,
  loadPtBR: async () =>
    (await import("@app/i18n/pt-BR.json")).default as TranslationModule,
});

const i18nModules = [
  commonI18n,
  heroI18n,
  aboutI18n,
  workI18n,
  techStackI18n,
  educationI18n,
  contactI18n,
  introI18n,
  resumeI18n,
] as const satisfies readonly PublicI18nModule[];

export const NAMESPACES = i18nModules.map((module) => module.namespace);

export type AppNamespace = (typeof i18nModules)[number]["namespace"];

type ResourcesByLanguage = Partial<
  Record<AppLanguage, Record<AppNamespace, TranslationModule>>
>;

export const resources: ResourcesByLanguage = {};

const enLoaders = Object.fromEntries(
  i18nModules.map(({ namespace, resources: moduleResources }) => [
    namespace,
    async () => moduleResources.en,
  ]),
) as Record<AppNamespace, () => Promise<TranslationModule>>;

const ptBrLoaders = Object.fromEntries(
  i18nModules.map(({ namespace, loadPtBR }) => [namespace, loadPtBR]),
) as Record<AppNamespace, () => Promise<TranslationModule>>;

export async function loadLanguageResources(lang: AppLanguage) {
  const loadersByLanguage: Record<
    AppLanguage,
    Record<AppNamespace, () => Promise<TranslationModule>>
  > = {
    en: enLoaders,
    "pt-BR": ptBrLoaders,
  };
  const loaders = loadersByLanguage[lang];

  if (!loaders) return null;

  const entries = await Promise.all(
    Object.entries(loaders).map(async ([namespace, loader]) => [
      namespace,
      await loader(),
    ]),
  );

  return Object.fromEntries(entries) as Record<AppNamespace, TranslationModule>;
}
