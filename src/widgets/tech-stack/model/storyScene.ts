import type { CategoryKey } from "./layout";

export const STORY_STEP_KEYS = [
  "opening",
  "languages",
  "architectures",
  "devops",
  "ai",
  "extras",
  "finale",
] as const;

export type StoryStepKey = (typeof STORY_STEP_KEYS)[number];
export const CATEGORY_STORY_STEP_KEYS = STORY_STEP_KEYS.slice(1, -1) as readonly Exclude<
  StoryStepKey,
  "opening" | "finale"
>[];

export const TECH_STACK_DESKTOP_SLOTS = ["text", "visual", "menu"] as const;

export type TechStackDesktopSlot = (typeof TECH_STACK_DESKTOP_SLOTS)[number];
export type StoryScenePosition = "left" | "right" | "center" | "hidden";
export type StorySceneCloudMode = "orbit" | "stack-focus";
export type StorySceneSlotWidth = "equal" | "auto" | "hidden";

export type StoryScene = {
  stepKey: StoryStepKey;
  slotWidths: Readonly<Record<TechStackDesktopSlot, StorySceneSlotWidth>>;
  slotPositions: Readonly<Record<TechStackDesktopSlot, StoryScenePosition>>;
  cloudMode: StorySceneCloudMode;
  activeCategory: CategoryKey | null;
};

export type TechStackSceneSpec = {
  stepKey: StoryStepKey;
  intro: Readonly<{ autoAlpha: number; y: number }>;
  outro: Readonly<{ autoAlpha: number; y: number; filter: string }>;
  organized: boolean;
  cloudMode: StorySceneCloudMode;
  activeCategory: CategoryKey | null;
};

const DEFAULT_SLOT_WIDTHS: Readonly<Record<TechStackDesktopSlot, StorySceneSlotWidth>> = {
  text: "equal",
  visual: "equal",
  menu: "auto",
};

const DEFAULT_SLOT_POSITIONS: Readonly<Record<TechStackDesktopSlot, StoryScenePosition>> =
  {
    text: "left",
    visual: "right",
    menu: "right",
  };

function createStoryScene(
  stepKey: StoryStepKey,
  cloudMode: StorySceneCloudMode,
  activeCategory: CategoryKey | null,
): StoryScene {
  return {
    stepKey,
    slotWidths: DEFAULT_SLOT_WIDTHS,
    slotPositions: DEFAULT_SLOT_POSITIONS,
    cloudMode,
    activeCategory,
  };
}

function createSceneSpec(scene: StoryScene): TechStackSceneSpec {
  if (scene.stepKey === "opening") {
    return {
      stepKey: scene.stepKey,
      intro: { autoAlpha: 1, y: 0 },
      outro: { autoAlpha: 0, y: 48, filter: "blur(10px)" },
      organized: false,
      cloudMode: "orbit",
      activeCategory: null,
    };
  }

  if (scene.stepKey === "finale") {
    return {
      stepKey: scene.stepKey,
      intro: { autoAlpha: 0, y: -72 },
      outro: { autoAlpha: 1, y: 0, filter: "blur(0px)" },
      organized: false,
      cloudMode: "orbit",
      activeCategory: null,
    };
  }

  if (scene.cloudMode === "stack-focus" && scene.activeCategory) {
    return {
      stepKey: scene.stepKey,
      intro: { autoAlpha: 1, y: 0 },
      outro: { autoAlpha: 0, y: 48, filter: "blur(10px)" },
      organized: true,
      cloudMode: scene.cloudMode,
      activeCategory: scene.activeCategory,
    };
  }

  return {
    stepKey: scene.stepKey,
    intro: { autoAlpha: 1, y: 0 },
    outro: { autoAlpha: 0, y: 48, filter: "blur(10px)" },
    organized: false,
    cloudMode: "orbit",
    activeCategory: null,
  };
}

const STORY_SCENES: Record<StoryStepKey, StoryScene> = {
  opening: createStoryScene("opening", "orbit", null),
  languages: createStoryScene("languages", "stack-focus", "languages"),
  architectures: createStoryScene("architectures", "stack-focus", "architectures"),
  devops: createStoryScene("devops", "stack-focus", "devops"),
  ai: createStoryScene("ai", "stack-focus", "ai"),
  extras: createStoryScene("extras", "stack-focus", "extras"),
  finale: createStoryScene("finale", "orbit", null),
};

const STORY_SCENE_SPECS: Record<StoryStepKey, TechStackSceneSpec> = Object.fromEntries(
  Object.entries(STORY_SCENES).map(([stepKey, scene]) => [
    stepKey,
    createSceneSpec(scene),
  ]),
) as Record<StoryStepKey, TechStackSceneSpec>;

export function getStoryScene(stepKey: StoryStepKey): StoryScene {
  return STORY_SCENES[stepKey];
}

export function getTechStackSceneSpec(stepKey: StoryStepKey): TechStackSceneSpec {
  return STORY_SCENE_SPECS[stepKey];
}

export function isStorySceneSlotVisible(
  scene: StoryScene,
  slot: TechStackDesktopSlot,
): boolean {
  return scene.slotWidths[slot] !== "hidden";
}

export function getStorySceneSlotPosition(
  scene: StoryScene,
  slot: TechStackDesktopSlot,
): StoryScenePosition {
  return scene.slotPositions[slot];
}
