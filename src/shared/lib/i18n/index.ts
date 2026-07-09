export type { AppLanguage } from "./resolveAppLanguage";
export { isAppLanguage, resolveAppLanguage } from "./resolveAppLanguage";

export { APP_LANGUAGE_STORAGE_KEY } from "./storage";
export { setAppLanguage } from "./setAppLanguage";

export { initI18n } from "./initI18n";
export type { InitI18nOptions } from "./initI18n";

export { tStringArray } from "./tStringArray";
export {
  hasStringArrayField,
  hasStringFields,
  isRecord,
  resolveTranslatedArray,
} from "./translatedContent";
