import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Container } from "@shared/ui/Container";
import { usePrefersReducedMotion } from "@shared/lib/motion/usePrefersReducedMotion";
import { Section } from "@shared/ui/Section";
import { SECTION_IDS } from "@entities/section";
import { resolveEducationItems } from "../lib/educationContent";
import { useEducationSectionReveal } from "../lib/useEducationSectionReveal";
import { EducationCard } from "./EducationCard";

export function EducationSection() {
  const { t } = useTranslation("education");
  const sectionTitleId = "education-title";
  const sectionRef = useRef<HTMLElement | null>(null);
  const reduceMotion = usePrefersReducedMotion();
  const items = resolveEducationItems(t);

  useEducationSectionReveal({ sectionRef, reduceMotion });

  return (
    <Section
      ref={sectionRef}
      id={SECTION_IDS.education}
      aria-labelledby={sectionTitleId}
      deferRender
      deferIntrinsicSize="720px"
    >
      <Container className="grid gap-[clamp(2rem,5vw,6rem)]">
        <div
          data-education-header
          className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(20rem,0.55fr)] lg:items-end"
        >
          <div className="grid max-w-(--layout-readable) gap-5">
            <h2
              id={sectionTitleId}
              className="max-w-[11ch] text-(length:--font-section-title) font-semibold leading-[1.02] text-balance"
            >
              {t("title")}
            </h2>
            <p className="max-w-[62ch] text-(length:--font-body-fluid) leading-relaxed text-muted text-pretty">
              {t("intro")}
            </p>
          </div>

          <aside
            data-education-thesis
            className="relative border-y border-border/80 py-5 lg:mb-2"
            aria-label={t("thesis.label")}
          >
            <p className="font-(family-name:--font-mono) text-xxs leading-5 text-primary">
              {t("thesis.label")}
            </p>
            <p className="mt-3 max-w-[42rem] text-(length:--font-body-small) leading-relaxed text-fg text-pretty">
              {t("thesis.text")}
            </p>
          </aside>
        </div>

        <ul
          aria-label={t("listLabel", "Formações")}
          data-education-list
          className="list-none p-0"
        >
          {items.map((item, index) => (
            <EducationCard
              key={item.id}
              item={item}
              index={index}
              degreeLabel={t("meta.degree")}
              institutionLabel={t("meta.institution")}
              periodLabel={t("meta.period")}
              focusLabel={t("meta.focus")}
              proofLabel={t("proofLabel")}
            />
          ))}
        </ul>
      </Container>
    </Section>
  );
}
