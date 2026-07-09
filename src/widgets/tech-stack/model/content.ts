import type { TFunction } from "i18next";
import { tStringArray } from "@shared/lib/i18n/tStringArray";
import { CATEGORY_KEYS } from "./layout";
import { STORY_STEP_KEYS } from "./storyScene";
import type {
  StoryCategory,
  StoryStepDef,
  TechStackCopy,
} from "./types";

export function buildTechStackCategories(t: TFunction<"techStack">): StoryCategory[] {
  return CATEGORY_KEYS.map((key) => ({
    key,
    title: t(`categories.${key}.title`),
    summary: t(`categories.${key}.summary`),
    items: tStringArray(t, `categories.${key}.items`),
  }));
}

export function buildTechStackStorySteps(t: TFunction<"techStack">): StoryStepDef[] {
  const storySteps = tStringArray(t, "storySteps");

  return STORY_STEP_KEYS.map((key, index) => ({
    key,
    label: storySteps[index] ?? storySteps[0] ?? key,
    eyebrow: t(`storyContent.${key}.eyebrow`),
    title: t(`storyContent.${key}.title`),
    body: t(`storyContent.${key}.body`),
    signal: t(`storyContent.${key}.signal`),
  }));
}

export function buildTechStackCopy(t: TFunction<"techStack">): TechStackCopy {
  return {
    title: t("title"),
    description: t("description"),
    hint: t("hint"),
    eyebrow: t("eyebrow"),
    introTitle: t("introTitle"),
    introBody: t("introBody"),
    outroTitle: t("outroTitle"),
    outroBody: t("outroBody"),
    finaleEyebrow: t("storyContent.finale.eyebrow"),
    stageAriaLabel: t("stage.ariaLabel"),
    storyProgressAriaLabel: t("storyProgress.ariaLabel"),
    storyProgressGoToStep: t("storyProgress.goToStep"),
    sceneLabels: tStringArray(t, "stage.labels"),
  };
}
