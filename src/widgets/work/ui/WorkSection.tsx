import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Container } from "@shared/ui/Container";
import { usePrefersReducedMotion } from "@shared/lib/motion/usePrefersReducedMotion";
import { Section } from "@shared/ui/Section";
import { SectionHeader } from "@shared/ui/SectionHeader";
import type { WorkItem } from "../model/types";
import { SECTION_IDS } from "@entities/section";
import { resolveWorkItems } from "../lib/workContent";
import { useWorkSectionReveal } from "../lib/useWorkSectionReveal";
import { WorkTimelineItem } from "./WorkTimelineItem";

export function WorkSection() {
  const { t } = useTranslation("work");
  const sectionTitleId = "work-title";
  const sectionRef = useRef<HTMLElement | null>(null);
  const reduceMotion = usePrefersReducedMotion();
  const items: WorkItem[] = resolveWorkItems(t);

  useWorkSectionReveal({ sectionRef, reduceMotion });

  return (
    <Section
      ref={sectionRef}
      id={SECTION_IDS.work}
      aria-labelledby={sectionTitleId}
      deferRender
      deferIntrinsicSize="760px"
    >
      <Container className="max-w-[min(var(--layout-container),92rem)]">
        <SectionHeader
          titleId={sectionTitleId}
          title={t("title")}
          description={t("description")}
          maxWidthClassName="max-w-[min(var(--layout-readable),58rem)]"
          className="mb-[clamp(2.5rem,5vw,6rem)]"
          titleClassName="max-w-[12ch]"
        />

        <ol
          aria-label={t("timelineLabel", "Professional decision and impact record")}
          className="
            relative list-none space-y-[clamp(1.5rem,3vw,3rem)]
            before:absolute before:bottom-0 before:left-[clamp(0.625rem,1vw,0.875rem)] before:top-0
            before:w-px before:bg-border/80
            lg:before:left-[clamp(12rem,16vw,17rem)]
          "
        >
          {items.map((item, index) => (
            <WorkTimelineItem
              key={item.id}
              item={item}
              decisionLabel={t("decisionLabel", "Decision")}
              impactLabel={t("impactLabel", "Impact")}
              evidenceLabel={t("evidenceLabel", "Evidence")}
              stackLabel={t("stackLabel", "Technical environment")}
              currentLabel={index === 0 ? t("currentSignal", "Current work") : undefined}
            />
          ))}
        </ol>
      </Container>
    </Section>
  );
}
