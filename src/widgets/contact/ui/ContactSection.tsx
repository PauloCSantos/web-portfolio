import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Container } from "@shared/ui/Container";
import { usePrefersReducedMotion } from "@shared/lib/motion/usePrefersReducedMotion";
import { Section } from "@shared/ui/Section";
import { SECTION_IDS } from "@entities/section";
import type { SocialLinks } from "@entities/profile";
import { useContactSectionReveal } from "../lib/useContactSectionReveal";
import { ContactActionList } from "./ContactActionList";

type Props = {
  links?: SocialLinks;
};

type QualificationItem = {
  label: string;
  description: string;
};

export function ContactSection({ links }: Props) {
  const { t } = useTranslation("contact");
  const sectionTitleId = "contact-title";
  const panelTitleId = "contact-panel-title";
  const sectionRef = useRef<HTMLElement | null>(null);
  const reduceMotion = usePrefersReducedMotion();
  const qualificationItems = t("qualificationItems", {
    returnObjects: true,
  }) as QualificationItem[];

  useContactSectionReveal({ sectionRef, reduceMotion });

  return (
    <Section
      ref={sectionRef}
      id={SECTION_IDS.contact}
      aria-labelledby={sectionTitleId}
      deferRender
      deferIntrinsicSize="560px"
      className="overflow-hidden bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-card)_66%,transparent),var(--color-bg)_54%,color-mix(in_srgb,var(--color-primary)_10%,var(--color-bg)))]"
    >
      <Container className="grid items-end gap-[clamp(2rem,5vw,6rem)] lg:grid-cols-[minmax(0,1.05fr)_minmax(22rem,0.7fr)]">
        <div className="max-w-232 space-y-[clamp(1.25rem,2.5vw,2.5rem)]">
          <p
            data-contact-item
            className="max-w-[18rem] text-(length:--font-body-small) font-semibold leading-relaxed text-primary"
          >
            {t("positioning")}
          </p>

          <div data-contact-item className="space-y-5">
            <h2
              id={sectionTitleId}
              className="max-w-[12ch] text-[clamp(2.7rem,6vw,5.8rem)] font-semibold leading-[0.98] text-balance"
            >
              {t("title")}
            </h2>
            <p className="max-w-[62ch] text-(length:--font-body-fluid) leading-[1.75] text-fg/82 text-pretty">
              {t("description")}
            </p>
          </div>

          <dl
            data-contact-item
            className="grid max-w-3xl gap-0 border-y border-border/80 text-left"
          >
            {qualificationItems.map((item) => (
              <div
                key={item.label}
                className="grid gap-3 border-b border-border/70 py-5 last:border-b-0 sm:grid-cols-[9rem_minmax(0,1fr)]"
              >
                <dt className="text-(length:--font-body-small) font-semibold text-fg">
                  {item.label}
                </dt>
                <dd className="text-(length:--font-body-small) leading-relaxed text-muted text-pretty">
                  {item.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <aside
          data-contact-item
          aria-labelledby={panelTitleId}
          className="relative overflow-hidden rounded-[1.25rem] border border-border/80 bg-bg/76 p-[clamp(1.25rem,2.4vw,2.25rem)]"
        >
          <div className="absolute inset-x-0 top-0 h-1 bg-primary" aria-hidden="true" />
          <div className="space-y-6">
            <div className="space-y-3">
              <h3
                id={panelTitleId}
                className="text-[clamp(1.45rem,1.2vw+1.1rem,2.1rem)] font-semibold leading-tight text-balance"
              >
                {t("panelTitle")}
              </h3>
              <p className="text-(length:--font-body-small) leading-relaxed text-muted text-pretty">
                {t("panelDescription")}
              </p>
            </div>

            <ContactActionList
              links={links}
              ariaLabel={t("ctaGroupLabel")}
              linkedinLabel={t("linkedin")}
              linkedinDescription={t("linkedinDescription")}
              githubLabel={t("github")}
              githubDescription={t("githubDescription")}
              resumeDescription={t("resumeDescription")}
              newTabHint={t("opensInNewTab")}
            />
          </div>
        </aside>
      </Container>
    </Section>
  );
}
