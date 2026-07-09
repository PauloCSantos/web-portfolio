import en from "./en.json";
import { defineLazyI18nModule } from "@shared/lib/i18n/defineLazyI18nModule";

export const introI18n = defineLazyI18nModule({
  namespace: "intro",
  en,
  loadPtBR: async () => (await import("./pt-BR.json")).default,
});
