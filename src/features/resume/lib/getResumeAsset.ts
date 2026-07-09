import type { AppLanguage } from "@shared/lib/i18n/resolveAppLanguage";

type ResumeAsset = {
  url: string;
  filename: string;
};

export function getResumeAsset(language: AppLanguage): ResumeAsset {
  if (language === "en") {
    return {
      url: new URL("../assets/resume-en.pdf", import.meta.url).toString(),
      filename: "resume-en.pdf",
    };
  }

  return {
    url: new URL("../assets/resume-pt.pdf", import.meta.url).toString(),
    filename: "resume-pt.pdf",
  };
}
