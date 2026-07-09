import { Container } from "@shared/ui/Container";
import { Section } from "@shared/ui/Section";
import { SectionHeader } from "@shared/ui/SectionHeader";
import { SECTION_IDS } from "@entities/section";

export function TechStackSectionFallback() {
  const sectionTitleId = "stack-title";
  const loadingStatusId = "stack-loading-status";

  return (
    <Section
      id={SECTION_IDS.stack}
      tone="muted"
      aria-busy="true"
      aria-labelledby={sectionTitleId}
      aria-describedby={loadingStatusId}
    >
      <Container className="space-y-(--section-stack-gap)">
        <SectionHeader
          titleId={sectionTitleId}
          title="Tech Stack"
          description="Loading scroll-driven stack story..."
          className="max-w-(--layout-readable)"
        />

        <p id={loadingStatusId} role="status" aria-live="polite" className="sr-only">
          Loading scroll-driven stack story.
        </p>

        <div
          aria-hidden="true"
          className="relative overflow-hidden rounded-md border border-border/70 bg-card/50 shadow-stack"
        >
          <div className="h-[clamp(28rem,52vw,46rem)] p-(--card-padding)">
            <div className="responsive-grid h-full">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="self-start rounded-full border border-border/70 bg-bg/70 px-3 py-2 text-xs text-muted"
                  style={{
                    transform: `translateY(${(i % 4) * 20}px)`,
                    width: `${88 + ((i * 11) % 42)}px`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
