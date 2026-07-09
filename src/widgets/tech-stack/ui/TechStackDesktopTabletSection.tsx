import { useMemo, useRef } from "react";
import { Container } from "@shared/ui/Container";
import {
  buildColumnsAndChips,
  computeDesktopCategoryX,
} from "../model/layout";
import type {
  StoryCategory,
  StoryStepDef,
  TechStackCopy,
  TechStackDesktopBindings,
  TechStackDesktopRefs,
  TechStackDesktopSceneViewModel,
} from "../model/types";
import { useStageSize } from "../lib/useStageSize";
import { useTechStackDesktopSceneState } from "../lib/useTechStackDesktopSceneState";
import { useTechStackDesktopStoryEffects } from "../lib/useTechStackDesktopStoryEffects";
import { buildTechStackDesktopChipGroups } from "../lib/techStackSceneDom";
import { TechStackDesktopView } from "./TechStackDesktopView";

type TechStackDesktopTabletSectionProps = {
  ids: {
    stageTitleId: string;
    hintId: string;
  };
  copy: TechStackCopy;
  categories: readonly StoryCategory[];
  storyStepDefs: readonly StoryStepDef[];
};

export function TechStackDesktopTabletSection({
  ids,
  copy,
  categories,
  storyStepDefs,
}: TechStackDesktopTabletSectionProps) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const pinnedRef = useRef<HTMLDivElement | null>(null);
  const desktopStageRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const introRef = useRef<HTMLDivElement | null>(null);
  const mediaFrameRef = useRef<HTMLDivElement | null>(null);
  const outroRef = useRef<HTMLDivElement | null>(null);
  const chipNodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const chipPillRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const stageWidth = useStageSize(desktopStageRef);
  const layoutReady = stageWidth > 0;
  const {
    highlightedCategory,
    setHighlightedCategory,
    currentStoryStep,
    setCurrentStoryStep,
    currentStoryScene,
  } = useTechStackDesktopSceneState(storyStepDefs);

  const desktopCategoryX = useMemo(
    () => computeDesktopCategoryX(stageWidth),
    [stageWidth],
  );
  const chips = useMemo(
    () => buildColumnsAndChips(categories, desktopCategoryX, { includeTitleChips: true }),
    [categories, desktopCategoryX],
  );
  const chipGroups = useMemo(() => buildTechStackDesktopChipGroups(chips), [chips]);

  const dom = useMemo<TechStackDesktopRefs>(
    () => ({
      sectionRef,
      pinnedRef,
      headerRef,
      introRef,
      outroRef,
      mediaFrameRef,
      stageRef: desktopStageRef,
      chipNodeRefs,
      chipPillRefs,
    }),
    [],
  );

  const bindings = useMemo<TechStackDesktopBindings>(
    () => ({
      headerRef: (node) => {
        headerRef.current = node;
      },
      introRef: (node) => {
        introRef.current = node;
      },
      outroRef: (node) => {
        outroRef.current = node;
      },
      mediaFrameRef: (node) => {
        mediaFrameRef.current = node;
      },
      stageRef: (node) => {
        desktopStageRef.current = node;
      },
      chipNodeRef: (index, node) => {
        chipNodeRefs.current[index] = node;
      },
      chipPillRef: (index, node) => {
        chipPillRefs.current[index] = node;
      },
    }),
    [],
  );

  const scene = useMemo<TechStackDesktopSceneViewModel>(
    () => ({
      chips,
      categories,
      chipGroups,
      highlightedCategory,
      currentStoryScene,
      storyStepDefs,
      currentStoryStep,
    }),
    [
      chips,
      categories,
      chipGroups,
      currentStoryScene,
      currentStoryStep,
      highlightedCategory,
      storyStepDefs,
    ],
  );

  const { handleSelectStoryStep } = useTechStackDesktopStoryEffects({
    enabled: layoutReady,
    dom,
    categories,
    chips,
    chipGroups,
    storyStepDefs,
    setHighlightedCategory,
    setCurrentStoryStep,
  });

  return (
    <div
      ref={sectionRef}
      className="tech-stack-story relative z-20 isolate mx-[calc(50%-50vw)] hidden w-screen border-y border-border/70 bg-card/50 shadow-stack md:block"
    >
      <div ref={pinnedRef} className="tech-stack-parallax-pinned relative z-10">
        <div
          aria-hidden
          className="tech-stack-parallax-media pointer-events-none absolute inset-0"
        />
        <div
          aria-hidden
          className="tech-stack-grid pointer-events-none absolute inset-0 opacity-40"
        />
        <div
          aria-hidden
          className="tech-stack-aurora pointer-events-none absolute inset-0"
        />
        <div
          aria-hidden
          className="tech-stack-orbit-lines pointer-events-none absolute inset-0"
        />
        <div
          aria-hidden
          className="tech-stack-content-layer pointer-events-none absolute inset-0"
        />
        <div
          aria-hidden
          className="tech-stack-foreground pointer-events-none absolute inset-0"
        >
          <div className="tech-stack-sheen" />
        </div>

        <Container className="relative z-10 h-full max-w-none px-(--layout-gutter) py-[clamp(1.5rem,3vw,3rem)]">
          <TechStackDesktopView
            bindings={bindings}
            ids={ids}
            copy={copy}
            scene={scene}
            onSelectStoryStep={handleSelectStoryStep}
          />
        </Container>
      </div>
    </div>
  );
}
