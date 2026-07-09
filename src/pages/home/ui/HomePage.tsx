import { lazy, Suspense } from "react";
import { HeroSection } from "@widgets/hero";
import { TechStackSectionFallback } from "@widgets/tech-stack/fallback";
import type { SocialLinks } from "@entities/profile";
import { SECTION_IDS } from "@entities/section";
import { useIntroTransition } from "@shared/lib/motion/introTransitionContext";
import { ProgressiveSection } from "@shared/ui/ProgressiveSection";

const AboutSection = lazy(async () => {
  const module = await import("@widgets/about");
  return { default: module.AboutSection };
});

const TechStackSection = lazy(async () => {
  const module = await import("@widgets/tech-stack/section");
  return { default: module.TechStackSection };
});

const EducationSection = lazy(async () => {
  const module = await import("@widgets/education");
  return { default: module.EducationSection };
});

const WorkSection = lazy(async () => {
  const module = await import("@widgets/work");
  return { default: module.WorkSection };
});

const ContactSection = lazy(async () => {
  const module = await import("@widgets/contact");
  return { default: module.ContactSection };
});

type Props = {
  links?: SocialLinks;
};

function DeferredHomeSections({ links }: Props) {
  return (
    <>
      <ProgressiveSection
        anchorId={SECTION_IDS.about}
        minHeight="42rem"
        rootMargin="500px 0px"
      >
        <Suspense fallback={null}>
          <AboutSection />
        </Suspense>
      </ProgressiveSection>

      <ProgressiveSection
        anchorId={SECTION_IDS.stack}
        fallback={<TechStackSectionFallback />}
        minHeight="46rem"
        rootMargin="500px 0px"
      >
        <Suspense fallback={<TechStackSectionFallback />}>
          <TechStackSection />
        </Suspense>
      </ProgressiveSection>

      <ProgressiveSection anchorId={SECTION_IDS.education} minHeight="38rem">
        <Suspense fallback={null}>
          <EducationSection />
        </Suspense>
      </ProgressiveSection>

      <ProgressiveSection anchorId={SECTION_IDS.work} minHeight="44rem">
        <Suspense fallback={null}>
          <WorkSection />
        </Suspense>
      </ProgressiveSection>

      <ProgressiveSection anchorId={SECTION_IDS.contact} minHeight="32rem">
        <Suspense fallback={null}>
          <ContactSection links={links} />
        </Suspense>
      </ProgressiveSection>
    </>
  );
}

export function HomePage({ links }: Props) {
  const { deferredContentReady } = useIntroTransition();

  return (
    <>
      <HeroSection />
      {deferredContentReady ? <DeferredHomeSections links={links} /> : null}
    </>
  );
}
