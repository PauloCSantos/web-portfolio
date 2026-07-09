import en from "./en.json";
import { defineLazyI18nModule } from "@shared/lib/i18n/defineLazyI18nModule";

export const resumeI18n = defineLazyI18nModule({
  namespace: "resume",
  en,
  loadPtBR: async () => (await import("./pt-BR.json")).default,
});
