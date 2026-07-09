import { useRef } from "react";
import type { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import { Badge } from "@shared/ui/Badge";
import { Container } from "@shared/ui/Container";
import { ErrorBoundary } from "@shared/ui/ErrorBoundary";
import { Section } from "@shared/ui/Section";
import { SectionHeader } from "@shared/ui/SectionHeader";
import { SECTION_IDS } from "@entities/section";
import { tStringArray } from "@shared/lib/i18n/tStringArray";
import { usePrefersReducedMotion } from "@shared/lib/motion/usePrefersReducedMotion";
import { useAboutSectionReveal } from "../lib/useAboutSectionReveal";

const HIGHLIGHTS = ["integration", "performance", "impact"] as const;
const STACK_KEYS = ["frontend", "backend", "devops"] as const;

type HighlightKey = (typeof HIGHLIGHTS)[number];
type StackKey = (typeof STACK_KEYS)[number];

interface HighlightCardProps {
  highlightKey: HighlightKey;
  index: number;
  t: TFunction;
}

function HighlightSignal({ highlightKey, index, t }: HighlightCardProps) {
  return (
    <article className="group grid gap-4 border-t border-border/80 py-5 first:border-t-0 sm:grid-cols-[minmax(4.5rem,0.34fr)_1fr] sm:gap-6">
      <span className="font-mono text-xxs text-primary/85" aria-hidden="true">
        {t("highlights.signalLabel")} {String(index + 1).padStart(2, "0")}
      </span>

      <div className="space-y-2">
        <h3 className="text-(length:--font-card-title) font-semibold leading-tight text-balance">
          {t(`highlights.${highlightKey}.title`)}
        </h3>
        <p className="max-w-[58ch] text-(length:--font-body-small) leading-relaxed text-muted text-pretty">
          {t(`highlights.${highlightKey}.description`)}
        </p>
      </div>
    </article>
  );
}

interface StackSectionProps {
  stackKey: StackKey;
  t: TFunction;
}

function StackSection({ stackKey, t }: StackSectionProps) {
  const skills: string[] = tStringArray(t, `stack.${stackKey}.skills`);

  return (
    <article
      className="grid gap-4 border-t border-border/70 py-5 first:border-t-0 md:grid-cols-[minmax(10rem,0.72fr)_1fr]"
      aria-labelledby={`stack-${stackKey}-title`}
    >
      <h3
        id={`stack-${stackKey}-title`}
        className="text-(length:--font-card-title) font-semibold leading-tight text-balance"
      >
        {t(`stack.${stackKey}.title`)}
      </h3>

      <div className="space-y-3">
        <p className="max-w-[54ch] text-(length:--font-body-small) leading-relaxed text-muted text-pretty">
          {t(`stack.${stackKey}.description`)}
        </p>

        <ul className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <li key={skill}>
              <Badge className="border-border/80 bg-bg/60 transition-colors hover:bg-primary/10">
                {skill}
              </Badge>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

type AboutErrorFallbackProps = {
  message: string;
};

function AboutErrorFallback({ message }: AboutErrorFallbackProps) {
  const sectionTitleId = "about-title-fallback";
  const errorMessageId = "about-error-message";

  return (
    <Section id={SECTION_IDS.about} aria-labelledby={sectionTitleId}>
      <Container>
        <div className="flex min-h-[clamp(18rem,35vw,32rem)] items-center justify-center">
          <div className="text-center">
            <h2 id={sectionTitleId} className="sr-only">
              About
            </h2>
            <p
              id={errorMessageId}
              role="alert"
              aria-live="assertive"
              className="text-(length:--font-body-fluid) text-muted"
            >
              {message}
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}

function AboutSectionContent() {
  const { t } = useTranslation("about");
  const sectionTitleId = "about-title";
  const sectionRef = useRef<HTMLElement | null>(null);
  const reduceMotion = usePrefersReducedMotion();
  useAboutSectionReveal({ sectionRef, reduceMotion });

  return (
    <Section ref={sectionRef} id={SECTION_IDS.about} aria-labelledby={sectionTitleId}>
      <Container className="responsive-flow">
        <div data-about-item data-about-direction="up">
          <SectionHeader
            titleId={sectionTitleId}
            title={t("title")}
            description={t("description")}
            className="whitespace-pre-line"
            titleClassName="max-w-[12ch]"
            descriptionClassName="max-w-[68ch]"
          />
        </div>

        <div
          className="grid gap-[clamp(1.25rem,3vw,3rem)] lg:grid-cols-[minmax(17rem,0.82fr)_minmax(0,1.18fr)] lg:items-start"
          data-about-item
          data-about-direction="left"
        >
          <aside className="relative overflow-hidden rounded-md border border-border/80 bg-[linear-gradient(145deg,color-mix(in_srgb,var(--color-card)_82%,transparent),color-mix(in_srgb,var(--color-bg)_92%,var(--color-primary)_8%))]">
            <div className="absolute inset-x-0 top-0 h-1 bg-primary" aria-hidden="true" />
            <div
              className="absolute right-[-12%] top-[-18%] h-[clamp(9rem,18vw,16rem)] w-[clamp(9rem,18vw,16rem)] rounded-full border border-primary/20 bg-primary/8"
              aria-hidden="true"
            />
            <div className="relative space-y-[clamp(1.5rem,3vw,2.75rem)] p-[clamp(1.25rem,3vw,2.5rem)]">
              <p className="font-mono text-xxs text-primary/85">{t("thesis.label")}</p>
              <p className="max-w-[24ch] text-[clamp(1.35rem,2vw,2.25rem)] font-semibold leading-[1.08] text-fg text-balance">
                {t("thesis.statement")}
              </p>
              <p className="max-w-[40ch] text-(length:--font-body-small) leading-relaxed text-muted text-pretty">
                {t("thesis.detail")}
              </p>
            </div>
          </aside>

          <ul
            className="rounded-md border border-border/80 bg-card/45 px-[clamp(1rem,2vw,1.5rem)]"
            aria-label={t("highlights.ariaLabel", "Destaques")}
          >
            {HIGHLIGHTS.map((key, index) => (
              <li
                key={key}
                data-about-item
                data-about-direction={index % 2 === 0 ? "right" : "up"}
              >
                <HighlightSignal highlightKey={key} index={index} t={t} />
              </li>
            ))}
          </ul>
        </div>

        <div
          className="grid gap-[clamp(1rem,2vw,1.75rem)] rounded-md border border-border/80 bg-bg/55 p-[clamp(1rem,2vw,1.75rem)] lg:grid-cols-[minmax(12rem,0.34fr)_1fr]"
          role="region"
          aria-label={t("stack.ariaLabel", "Tecnologias")}
          data-about-item
          data-about-direction="up"
        >
          <div className="space-y-2">
            <p className="font-mono text-xxs text-primary/85">{t("stack.label")}</p>
            <h3 className="max-w-[10ch] text-[clamp(1.45rem,2vw,2.6rem)] font-semibold leading-[1.05] text-balance">
              {t("stack.title")}
            </h3>
          </div>

          <div>
            {STACK_KEYS.map((key) => (
              <StackSection key={key} stackKey={key} t={t} />
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}

export function AboutSection() {
  const { t } = useTranslation("about");

  return (
    <ErrorBoundary
      fallback={
        <AboutErrorFallback
          message={t(
            "errors.unableToLoad",
            "Não foi possível carregar o conteúdo. Atualize a página.",
          )}
        />
      }
    >
      <AboutSectionContent />
    </ErrorBoundary>
  );
}
