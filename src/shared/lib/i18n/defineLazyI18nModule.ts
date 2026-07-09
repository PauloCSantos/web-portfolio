type TranslationModule = Record<string, unknown>;

type LazyI18nModuleOptions<TNamespace extends string> = {
  namespace: TNamespace;
  en: TranslationModule;
  loadPtBR: () => Promise<TranslationModule>;
};

export function defineLazyI18nModule<TNamespace extends string>(
  options: LazyI18nModuleOptions<TNamespace>,
) {
  return {
    namespace: options.namespace,
    resources: {
      en: options.en,
    },
    loadPtBR: options.loadPtBR,
  } as const;
}
