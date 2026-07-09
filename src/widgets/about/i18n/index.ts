import en from "./en.json";
import { defineLazyI18nModule } from "@shared/lib/i18n/defineLazyI18nModule";

export const aboutI18n = defineLazyI18nModule({
  namespace: "about",
  en,
  loadPtBR: async () => (await import("./pt-BR.json")).default,
});
