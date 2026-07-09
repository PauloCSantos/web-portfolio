import { useMemo } from "react";
import type { TFunction } from "i18next";
import {
  buildTechStackCategories,
  buildTechStackCopy,
  buildTechStackStorySteps,
} from "../model/content";

type UseTechStackContentParams = {
  includeStorySteps?: boolean;
};

export function useTechStackContent(
  t: TFunction<"techStack">,
  { includeStorySteps = true }: UseTechStackContentParams = {},
) {
  const copy = useMemo(() => buildTechStackCopy(t), [t]);
  const categories = useMemo(() => buildTechStackCategories(t), [t]);
  const storyStepDefs = useMemo(
    () => (includeStorySteps ? buildTechStackStorySteps(t) : []),
    [includeStorySteps, t],
  );

  return {
    copy,
    categories,
    storyStepDefs,
  };
}
