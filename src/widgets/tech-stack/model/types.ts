import type { MutableRefObject } from "react";
import type {
  CategoryColumn,
  CategoryKey,
  TechChip,
} from "./layout";
import type { StoryScene, StoryStepKey } from "./storyScene";

export type StoryCategory = CategoryColumn & {
  summary: string;
};

export type StoryStepDef = {
  key: StoryStepKey;
  label: string;
  eyebrow: string;
  title: string;
  body: string;
  signal: string;
};

export type TechStackDesktopRefs = {
  sectionRef: MutableRefObject<HTMLDivElement | null>;
  pinnedRef: MutableRefObject<HTMLDivElement | null>;
  headerRef: MutableRefObject<HTMLDivElement | null>;
  introRef: MutableRefObject<HTMLDivElement | null>;
  outroRef: MutableRefObject<HTMLDivElement | null>;
  mediaFrameRef: MutableRefObject<HTMLDivElement | null>;
  stageRef: MutableRefObject<HTMLDivElement | null>;
  chipNodeRefs: MutableRefObject<(HTMLDivElement | null)[]>;
  chipPillRefs: MutableRefObject<(HTMLSpanElement | null)[]>;
};

export type TechStackDesktopBindings = {
  headerRef: (node: HTMLDivElement | null) => void;
  introRef: (node: HTMLDivElement | null) => void;
  outroRef: (node: HTMLDivElement | null) => void;
  mediaFrameRef: (node: HTMLDivElement | null) => void;
  stageRef: (node: HTMLDivElement | null) => void;
  chipNodeRef: (index: number, node: HTMLDivElement | null) => void;
  chipPillRef: (index: number, node: HTMLSpanElement | null) => void;
};

export type TechStackCopy = {
  title: string;
  description: string;
  hint: string;
  eyebrow: string;
  introTitle: string;
  introBody: string;
  outroTitle: string;
  outroBody: string;
  finaleEyebrow: string;
  stageAriaLabel: string;
  storyProgressAriaLabel: string;
  storyProgressGoToStep: string;
  sceneLabels: readonly string[];
};

export type TechStackDesktopSceneViewModel = {
  chips: readonly TechChip[];
  categories: readonly StoryCategory[];
  chipGroups: TechStackDesktopChipGroups;
  highlightedCategory: CategoryKey | null;
  currentStoryScene: StoryScene;
  storyStepDefs: readonly StoryStepDef[];
  currentStoryStep: number;
};

export type TechStackDesktopChipGroups = {
  allChips: readonly TechChip[];
  movingCloudChipIds: ReadonlySet<string>;
  categoryChipIdsByKey: ReadonlyMap<CategoryKey, readonly string[]>;
};

export type MobileTechStackSlide =
  | {
      id: "intro";
      kind: "intro";
      eyebrow: string;
      title: string;
      body: string;
      meta: string;
    }
  | {
      id: string;
      kind: "category";
      category: StoryCategory;
      stepNumber: number;
    }
  | {
      id: "outro";
      kind: "outro";
      eyebrow: string;
      title: string;
      body: string;
    };

export type MobileSceneMode = "summary" | "category" | "outro";

export type MobileVisibleChip = {
  id: string;
  label: string;
  categoryKey: CategoryKey;
  categoryTitle: string;
  x: number;
  y: number;
  rotate: number;
  scale: number;
};

export type TechStackMobileSceneViewModel = {
  slides: readonly MobileTechStackSlide[];
  activeSlideIndex: number;
  mobileSceneMode: MobileSceneMode;
  highlightedCategory: CategoryKey | null;
  activeCategoryTitle: string | null;
  visibleChips: readonly MobileVisibleChip[];
};

export type TechStackDesktopViewProps = {
  bindings: TechStackDesktopBindings;
  ids: {
    stageTitleId: string;
    hintId: string;
  };
  copy: TechStackCopy;
  scene: TechStackDesktopSceneViewModel;
  onSelectStoryStep: (index: number) => void;
};

export type TechStackMobileViewProps = {
  ids: {
    stageTitleId: string;
    hintId: string;
  };
  copy: TechStackCopy;
  scene: TechStackMobileSceneViewModel;
  reduceMotion: boolean;
  onSelectSlide: (index: number) => void;
  onActiveSlideChange: (index: number) => void;
};
