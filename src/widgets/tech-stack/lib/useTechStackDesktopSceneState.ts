import { useMemo, useState } from "react";
import type { CategoryKey } from "../model/layout";
import { STORY_STEP_KEYS, getStoryScene } from "../model/storyScene";
import type { StoryStepDef } from "../model/types";

export function useTechStackDesktopSceneState(storyStepDefs: readonly StoryStepDef[]) {
  const [highlightedCategory, setHighlightedCategory] = useState<CategoryKey | null>(
    null,
  );
  const [currentStoryStep, setCurrentStoryStep] = useState(0);

  const currentStepKey = storyStepDefs[currentStoryStep]?.key ?? STORY_STEP_KEYS[0];
  const currentStoryScene = useMemo(
    () => getStoryScene(currentStepKey),
    [currentStepKey],
  );

  return {
    highlightedCategory,
    setHighlightedCategory,
    currentStoryStep,
    setCurrentStoryStep,
    currentStoryScene,
  };
}
