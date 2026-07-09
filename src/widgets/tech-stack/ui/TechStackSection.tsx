import { lazy, Suspense } from "react";
import { useTranslation } from "react-i18next";
import "./TechStackSection.css";
import { Section } from "@shared/ui/Section";
import { SECTION_IDS } from "@entities/section";
import { useTechStackContent } from "../lib/useTechStackContent";
import { useMediaQuery } from "@shared/lib/dom/useMediaQuery";

const TECH_STACK_DESKTOP_QUERY = "(min-width: 768px)";

const TechStackDesktopTabletSection = lazy(async () => {
  const module = await import("./TechStackDesktopTabletSection");
  return { default: module.TechStackDesktopTabletSection };
});

const TechStackMobileSection = lazy(async () => {
  const module = await import("./TechStackMobileSection");
  return { default: module.TechStackMobileSection };
});

export function TechStackSection() {
  const { t } = useTranslation("techStack");
  const isDesktopLayout = useMediaQuery(TECH_STACK_DESKTOP_QUERY);
  const sectionTitleId = "stack-title";
  const desktopStageTitleId = "stack-stage-desktop";
  const mobileStageTitleId = "stack-stage-mobile";
  const hintId = "stack-hint";
  const { copy, categories, storyStepDefs } = useTechStackContent(t, {
    includeStorySteps: isDesktopLayout === true,
  });

  return (
    <Section
      id={SECTION_IDS.stack}
      tone="muted"
      aria-labelledby={sectionTitleId}
      className="py-0 sm:py-0 lg:py-0"
    >
      <h2 id={sectionTitleId} className="sr-only">
        {copy.title}
      </h2>
      <p id={hintId} className="sr-only">
        {copy.hint}
      </p>

      <Suspense fallback={null}>
        {isDesktopLayout === true ? (
          <TechStackDesktopTabletSection
            ids={{ stageTitleId: desktopStageTitleId, hintId }}
            copy={copy}
            categories={categories}
            storyStepDefs={storyStepDefs}
          />
        ) : null}

        {isDesktopLayout === false ? (
          <TechStackMobileSection
            ids={{ stageTitleId: mobileStageTitleId, hintId }}
            copy={copy}
            categories={categories}
          />
        ) : null}
      </Suspense>
    </Section>
  );
}
