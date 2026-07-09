import type { CSSProperties } from "react";
import { cn } from "@shared/lib/tailwind/cn";
import type { TechStackMobileViewProps } from "../model/types";
import { useTechStackMobileCarousel } from "../lib/useTechStackMobileCarousel";
import { TechStackMobileSlide } from "./TechStackMobileSlide";

export function TechStackMobileView({
  ids,
  copy,
  scene,
  reduceMotion,
  onSelectSlide,
  onActiveSlideChange,
}: TechStackMobileViewProps) {
  const { trackRef, registerSlideRef, handleSelectSlide } = useTechStackMobileCarousel({
    activeSlideIndex: scene.activeSlideIndex,
    slideCount: scene.slides.length,
    reduceMotion,
    onActiveSlideChange,
    onSelectSlide,
  });

  return (
    <div className="space-y-5 md:hidden">
      <div className="tech-stack-mobile-hero">
        <div
          role="group"
          aria-labelledby={ids.stageTitleId}
          aria-describedby={ids.hintId}
          className="tech-stack-mobile-scene relative isolate select-none"
        >
          <h3 id={ids.stageTitleId} className="sr-only">
            {copy.stageAriaLabel}
          </h3>

          <div className="tech-stack-mobile-cloud">
            <div className="tech-stack-mobile-cloud-copy" aria-hidden>
              <p className="tech-stack-mobile-cloud-eyebrow">
                {scene.mobileSceneMode === "category"
                  ? scene.activeCategoryTitle
                  : copy.eyebrow}
              </p>
            </div>

            <ul className="tech-stack-mobile-chip-cloud" aria-hidden>
              {scene.visibleChips.map((chip) => (
                <li
                  key={chip.id}
                  className="tech-stack-mobile-chip-node"
                  data-active={
                    scene.highlightedCategory === chip.categoryKey ? "true" : "false"
                  }
                  style={
                    {
                      "--mobile-chip-x": `${chip.x}%`,
                      "--mobile-chip-y": `${chip.y}%`,
                      "--mobile-chip-rotate": `${chip.rotate}deg`,
                      "--mobile-chip-scale": String(chip.scale),
                    } as CSSProperties
                  }
                >
                  <span className="tech-stack-mobile-chip-pill">{chip.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="tech-stack-mobile-carousel" aria-roledescription="carousel">
        <div ref={trackRef} className="tech-stack-mobile-carousel-track">
          {scene.slides.map((slide, index) => (
            <section
              key={slide.id}
              ref={(node) => registerSlideRef(index, node)}
              className="tech-stack-mobile-slide"
              aria-hidden={scene.activeSlideIndex !== index}
            >
              <TechStackMobileSlide slide={slide} />
            </section>
          ))}
        </div>

        <div className="tech-stack-mobile-dots" aria-label={copy.storyProgressAriaLabel}>
          {scene.slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              className={cn(
                "tech-stack-mobile-dot",
                scene.activeSlideIndex === index && "is-active",
              )}
              aria-label={copy.storyProgressGoToStep.replace(
                "{{step}}",
                String(index + 1),
              )}
              aria-current={scene.activeSlideIndex === index ? "true" : undefined}
              onClick={() => handleSelectSlide(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
