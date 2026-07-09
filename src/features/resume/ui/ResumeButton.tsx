import { useTranslation } from "react-i18next";
import { getResumeAsset } from "../lib/getResumeAsset";
import { cn } from "@shared/lib/tailwind/cn";
import { resolveAppLanguage } from "@shared/lib/i18n/resolveAppLanguage";

type Props = {
  className?: string;
  variant?: "primary" | "compact";
};

export function ResumeButton({ className, variant = "primary" }: Props) {
  const { t, i18n } = useTranslation("resume");

  const appLanguage = resolveAppLanguage(i18n.language);
  const { url, filename } = getResumeAsset(appLanguage);
  const languageLabel =
    appLanguage === "en" ? t("languageEnglish") : t("languagePortuguese");
  const ariaLabel = t("downloadAria", { language: languageLabel });

  const base =
    "inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full text-(length:--font-body-small) font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg sm:w-auto";

  const stylesByVariant =
    variant === "compact"
      ? "border border-border/70 bg-card/70 px-[clamp(1.1rem,1.6vw,1.75rem)] py-[clamp(0.7rem,0.9vw,0.95rem)] shadow-sm hover:border-primary/60 hover:text-fg"
      : "bg-primary px-[clamp(1.25rem,2vw,2.25rem)] py-[clamp(0.8rem,1vw,1.15rem)] text-white shadow-resume hover:shadow-resume-hover";

  return (
    <a
      href={url}
      download={filename}
      aria-label={ariaLabel}
      title={ariaLabel}
      className={cn(base, stylesByVariant, className)}
    >
      {t("download")}
    </a>
  );
}
