import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { lazy, Suspense } from "react";
import { PrettierLikeP } from "../ui/PrettierLikeP";
import { ResumeButton } from "@features/resume";
import { Container } from "@shared/ui/Container";
import { Section } from "@shared/ui/Section";
import { FocusTarget } from "@shared/lib/focus/FocusTargets";
import { useRegisterFocusTarget } from "@shared/lib/focus/focus";
import { usePrefersReducedMotion } from "@shared/lib/motion/usePrefersReducedMotion";
import { useIntroTransition } from "@shared/lib/motion/introTransitionContext";
import HeroBackgroundFallback from "../ui/HeroBackgroundFallback";
import { SECTION_IDS } from "@entities/section";
import { useHeroReveal } from "../lib/useHeroReveal";

const HeroBackground = lazy(() => import("../ui/HeroBackground"));

type HeroContentProps = {
  revealEnabled: boolean;
};

function HeroContent({ revealEnabled }: HeroContentProps) {
  const { t } = useTranslation("hero");
  const titleRef = useRegisterFocusTarget(FocusTarget.HeroTitle);
  const heroTitleId = "hero-title";
  const tags = t("tags", { returnObjects: true }) as string[];
  const proofs = t("proofs", { returnObjects: true }) as string[];

  return (
    <div className="grid items-end gap-[clamp(2rem,5vw,6rem)] lg:grid-cols-[minmax(9rem,0.56fr)_minmax(0,1.44fr)]">
      <div
        data-hero-item
        className="order-2 flex flex-col gap-[clamp(1rem,1.8vw,1.5rem)] lg:order-1"
      >
        <PrettierLikeP revealEnabled={revealEnabled} />

        <div className="max-w-[22rem] border-y border-border/70 py-[clamp(0.9rem,1.4vw,1.25rem)]">
          <p className="text-(length:--font-eyebrow) font-semibold text-muted">
            {t("signalLabel")}
          </p>

          <ul className="mt-3 flex flex-wrap gap-2" aria-label={t("signalLabel")}>
            {tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-primary/35 px-3 py-1 text-xxs font-semibold text-fg/80"
              >
                {tag}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="order-1 max-w-[min(100%,74rem)] space-y-[clamp(1rem,1.65vw,1.65rem)] lg:order-2">
        <h1
          data-hero-item
          id={heroTitleId}
          ref={titleRef}
          tabIndex={-1}
          itemProp="name"
          className="max-w-[11ch] text-[clamp(3.25rem,7.4vw,6rem)] font-semibold leading-[0.92] text-balance"
        >
          {t("name")}
        </h1>

        <p
          data-hero-item
          className="max-w-[54rem] text-[clamp(1.15rem,1.35vw,1.7rem)] font-medium leading-[1.5] text-fg/90 text-pretty"
        >
          {t("position")}
        </p>

        <p
          data-hero-item
          className="max-w-(--layout-readable) text-(length:--font-body-fluid) leading-relaxed text-fg/80 text-pretty"
        >
          {t("value")}
        </p>

        <div
          data-hero-item
          className="grid gap-3 border-y border-border/70 py-[clamp(1rem,1.6vw,1.5rem)] md:grid-cols-[minmax(9rem,0.35fr)_1fr]"
        >
          <p className="text-(length:--font-eyebrow) font-semibold text-muted">
            {t("proofLabel")}
          </p>

          <ul className="grid gap-2 text-(length:--font-body-small) leading-relaxed text-fg/78 md:grid-cols-3">
            {proofs.map((proof) => (
              <li key={proof} className="relative pl-4">
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-[0.72em] h-1.5 w-1.5 rounded-full bg-primary"
                />
                {proof}
              </li>
            ))}
          </ul>
        </div>

        <p
          data-hero-item
          className="max-w-3xl text-(length:--font-body-small) leading-relaxed text-muted"
        >
          {t("micro")}
        </p>

        <div data-hero-item className="w-full pt-[clamp(0.75rem,1.4vw,1.5rem)] sm:w-auto">
          <ResumeButton variant="compact" />
        </div>
      </div>
    </div>
  );
}

export function HeroSection() {
  const reduceMotion = usePrefersReducedMotion();
  const { heroRevealEnabled } = useIntroTransition();
  const containerRef = useRef<HTMLDivElement | null>(null);

  useHeroReveal({ containerRef, reduceMotion, enabled: heroRevealEnabled });

  return (
    <Section
      id={SECTION_IDS.hero}
      aria-labelledby="hero-title"
      className="relative flex min-h-[100svh] items-center justify-center border-t-0 pb-[clamp(2rem,8svh,5rem)] pt-[calc(var(--header-block-size)_+_clamp(1rem,4svh,2.5rem))] md:min-h-dvh md:py-0"
    >
      <Suspense fallback={<HeroBackgroundFallback />}>
        <HeroBackground animateEnabled={heroRevealEnabled} />
      </Suspense>

      <Container
        ref={containerRef}
        className="relative flex w-full max-w-[min(var(--layout-container),96rem)] flex-col gap-8"
      >
        <HeroContent revealEnabled={heroRevealEnabled} />
      </Container>
    </Section>
  );
}
