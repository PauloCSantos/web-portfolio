import { cn } from "@shared/lib/tailwind/cn";

type StoryPinsProps = {
  ariaLabel: string;
  steps: string[];
  currentStep: number;
  onSelectStep: (index: number) => void;
};

export function StoryPins({
  ariaLabel,
  steps,
  currentStep,
  onSelectStep,
}: StoryPinsProps) {
  return (
    <nav className="tech-stack-story-pins" aria-label={ariaLabel}>
      <ol className="tech-stack-story-pins-list">
        {steps.map((step, index) => (
          <li key={step}>
            <button
              type="button"
              className={cn("tech-stack-story-pin", currentStep === index && "is-active")}
              aria-current={currentStep === index ? "step" : undefined}
              aria-label={step}
              title={step}
              onClick={() => onSelectStep(index)}
            >
              <span className="tech-stack-story-pin-dot" />
              <span className="tech-stack-story-pin-label">{step}</span>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}
