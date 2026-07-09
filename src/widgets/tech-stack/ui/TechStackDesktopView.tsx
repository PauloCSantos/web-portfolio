import { memo, useMemo, type CSSProperties } from "react";
import { chipVars, type TechChip } from "../model/layout";
import {
  getStorySceneSlotPosition,
  isStorySceneSlotVisible,
} from "../model/storyScene";
import type { TechStackDesktopViewProps } from "../model/types";
import { HeadlineBlock } from "./HeadlineBlock";
import { OutroBlock } from "./OutroBlock";
import { StoryPins } from "./StoryPins";

type ChipCloudProps = {
  bindings: TechStackDesktopViewProps["bindings"];
  chips: readonly TechChip[];
};

type ChipNodeProps = {
  bindings: TechStackDesktopViewProps["bindings"];
  chip: TechChip;
  index: number;
  style: ReturnType<typeof chipVars>;
};

const ChipNode = memo(function ChipNode({ bindings, chip, index, style }: ChipNodeProps) {
  return (
    <div
      data-category={chip.categoryKey}
      data-chip-kind={chip.kind}
      ref={(node) => bindings.chipNodeRef(index, node)}
      className="tech-stack-node absolute inset-0"
      style={style}
    >
      <span className="tech-stack-chip pointer-events-none absolute left-0 top-0 rounded-full">
        <span
          ref={(node) => bindings.chipPillRef(index, node)}
          className={`tech-stack-chip-pill block rounded-[1.1rem] border border-border/70 bg-bg/80 px-3 py-1.5 text-xs font-medium text-fg shadow-sm backdrop-blur-sm lg:text-sm${
            chip.kind === "title" ? " tech-stack-chip-pill--title" : ""
          }`}
        >
          {chip.label}
        </span>
      </span>
    </div>
  );
});

const ChipCloud = memo(function ChipCloud({ bindings, chips }: ChipCloudProps) {
  const chipStyles = useMemo(
    () => chips.map((chip) => chipVars(chip, chips.length)),
    [chips],
  );

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0"
      style={{ transformStyle: "preserve-3d" }}
    >
      {chips.map((chip, index) => (
        <ChipNode
          key={chip.id}
          bindings={bindings}
          chip={chip}
          index={index}
          style={chipStyles[index]}
        />
      ))}
    </div>
  );
});

type ScenePositioningLayerProps = {
  labels: readonly string[];
};

const ScenePositioningLayer = memo(function ScenePositioningLayer({
  labels,
}: ScenePositioningLayerProps) {
  return (
    <div
      className="tech-stack-positioning-layer pointer-events-none absolute inset-0"
      aria-hidden
    >
      <div className="tech-stack-positioning-axis tech-stack-positioning-axis--horizontal" />
      <div className="tech-stack-positioning-axis tech-stack-positioning-axis--vertical" />
      <div className="tech-stack-positioning-labels">
        {labels.map((label, index) => (
          <span key={label} data-index={index}>
            {label}
          </span>
        ))}
      </div>
    </div>
  );
});

type StageTelemetryProps = {
  currentStep: number;
  labels: readonly string[];
  scene: TechStackDesktopViewProps["scene"];
};

const StageTelemetry = memo(function StageTelemetry({
  currentStep,
  labels,
  scene,
}: StageTelemetryProps) {
  const stepDef = scene.storyStepDefs[currentStep] ?? scene.storyStepDefs[0];
  const totalSteps = Math.max(scene.storyStepDefs.length, 1);
  const progress = totalSteps <= 1 ? 1 : currentStep / (totalSteps - 1);
  const activeCategory = scene.categories.find(
    (category) => category.key === scene.currentStoryScene.activeCategory,
  );
  const detail = activeCategory?.title ?? stepDef?.label;

  return (
    <div
      className="tech-stack-stage-telemetry"
      style={{ "--tech-stack-stage-progress": progress } as CSSProperties}
      aria-hidden="true"
    >
      <div className="tech-stack-stage-telemetry-bar">
        <span />
      </div>

      <div className="tech-stack-stage-telemetry-body">
        <p className="tech-stack-stage-telemetry-count">
          {String(currentStep + 1).padStart(2, "0")} /{" "}
          {String(totalSteps).padStart(2, "0")}
        </p>

        <div className="tech-stack-stage-telemetry-copy">
          <p>{stepDef?.signal}</p>
          {detail ? <span>{detail}</span> : null}
        </div>

        <ul className="tech-stack-stage-telemetry-labels">
          {labels.map((label) => (
            <li key={label}>{label}</li>
          ))}
        </ul>
      </div>
    </div>
  );
});

export function TechStackDesktopView({
  bindings,
  ids,
  copy,
  scene,
  onSelectStoryStep,
}: TechStackDesktopViewProps) {
  const currentStoryStepDef =
    scene.storyStepDefs[scene.currentStoryStep] ?? scene.storyStepDefs[0];
  const finaleStepDef =
    scene.storyStepDefs[scene.storyStepDefs.length - 1] ?? currentStoryStepDef;
  const showOutro = scene.currentStoryScene.stepKey === "finale";
  const storyStepLabels = useMemo(
    () => scene.storyStepDefs.map((step) => step.label),
    [scene.storyStepDefs],
  );

  return (
    <div
      className="tech-stack-shell hidden h-full md:grid"
      data-step={scene.currentStoryScene.stepKey}
    >
      <div
        className="tech-stack-shell-slot tech-stack-text-stage relative min-h-0"
        data-slot="text"
        data-visible={isStorySceneSlotVisible(scene.currentStoryScene, "text")}
        data-position={getStorySceneSlotPosition(scene.currentStoryScene, "text")}
      >
        <div
          ref={(node) => bindings.headerRef(node)}
          className="tech-stack-header"
          aria-hidden
        />

        <div className="tech-stack-stage-wrap">
          <div ref={(node) => bindings.introRef(node)} className="tech-stack-intro-wrap">
            <HeadlineBlock
              eyebrow={currentStoryStepDef?.eyebrow ?? copy.eyebrow}
              title={currentStoryStepDef?.title ?? copy.introTitle}
              body={currentStoryStepDef?.body ?? copy.introBody}
            />
          </div>

          <div
            ref={(node) => bindings.outroRef(node)}
            className="pointer-events-none absolute inset-0 flex items-center"
          >
            <OutroBlock
              eyebrow={finaleStepDef?.eyebrow ?? copy.finaleEyebrow}
              title={finaleStepDef?.title ?? copy.outroTitle}
              body={finaleStepDef?.body ?? copy.outroBody}
              visible={showOutro}
            />
          </div>
        </div>
      </div>

      <div
        className="tech-stack-shell-slot tech-stack-visual-stage relative min-h-0"
        data-slot="visual"
        data-visible={isStorySceneSlotVisible(scene.currentStoryScene, "visual")}
        data-position={getStorySceneSlotPosition(scene.currentStoryScene, "visual")}
      >
        <div
          ref={(node) => bindings.mediaFrameRef(node)}
          className="tech-stack-media-frame"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="tech-stack-media-inset">
            <StageTelemetry
              currentStep={scene.currentStoryStep}
              labels={copy.sceneLabels}
              scene={scene}
            />

            <div
              role="group"
              aria-labelledby={ids.stageTitleId}
              aria-describedby={ids.hintId}
              ref={(node) => bindings.stageRef(node)}
              className="tech-stack-scene relative isolate h-full select-none"
            >
              <h3 id={ids.stageTitleId} className="sr-only">
                {copy.stageAriaLabel}
              </h3>

              <ScenePositioningLayer labels={copy.sceneLabels} />
              <ChipCloud bindings={bindings} chips={scene.chips} />
            </div>
          </div>
        </div>
      </div>

      <div
        className="tech-stack-shell-slot tech-stack-menu-stage"
        data-slot="menu"
        data-visible={isStorySceneSlotVisible(scene.currentStoryScene, "menu")}
        data-position={getStorySceneSlotPosition(scene.currentStoryScene, "menu")}
      >
        <StoryPins
          ariaLabel={copy.storyProgressAriaLabel}
          steps={storyStepLabels}
          currentStep={scene.currentStoryStep}
          onSelectStep={onSelectStoryStep}
        />
      </div>
    </div>
  );
}
