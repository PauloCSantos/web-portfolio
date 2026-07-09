import type { MobileTechStackSlide as MobileTechStackSlideModel } from "../model/types";

type TechStackMobileSlideProps = {
  slide: MobileTechStackSlideModel;
};

function assertNever(value: never): never {
  throw new Error(`Unhandled mobile tech stack slide: ${JSON.stringify(value)}`);
}

export function TechStackMobileSlide({ slide }: TechStackMobileSlideProps) {
  switch (slide.kind) {
    case "intro":
      return (
        <div className="tech-stack-mobile-panel tech-stack-mobile-panel-intro">
          <p className="tech-stack-mobile-eyebrow">{slide.eyebrow}</p>
          <h2 className="tech-stack-mobile-title">{slide.title}</h2>
          <p className="tech-stack-mobile-body">{slide.body}</p>
          <p className="tech-stack-mobile-meta">{slide.meta}</p>
        </div>
      );

    case "category":
      return (
        <article className="tech-stack-mobile-card">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <h3 className="tech-stack-mobile-card-title">{slide.category.title}</h3>
              <p className="tech-stack-mobile-summary">{slide.category.summary}</p>
            </div>
            <span className="tech-stack-mobile-step-number">
              {String(slide.stepNumber).padStart(2, "0")}
            </span>
          </div>
          <ul
            className="tech-stack-mobile-evidence-list"
            aria-label={slide.category.title}
          >
            {slide.category.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      );

    case "outro":
      return (
        <div className="tech-stack-mobile-panel tech-stack-mobile-panel-outro">
          <p className="tech-stack-mobile-eyebrow">{slide.eyebrow}</p>
          <h3 className="tech-stack-mobile-title">{slide.title}</h3>
          <p className="tech-stack-mobile-body">{slide.body}</p>
        </div>
      );

    default:
      return assertNever(slide);
  }
}
