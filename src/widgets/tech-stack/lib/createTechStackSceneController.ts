import { gsap } from "gsap";
import type { CategoryKey, TechChip } from "../model/layout";
import {
  getTechStackSceneSpec,
  STORY_STEP_KEYS,
  type StoryStepKey,
  type TechStackSceneSpec,
} from "../model/storyScene";
import type {
  TechStackDesktopChipGroups,
  TechStackDesktopRefs,
} from "../model/types";
import {
  animateChipToHidden,
  animateChipToOrbit,
  animateChipToStack,
  clearChipVisual,
  setChipHiddenBase,
} from "./techStackSceneAnimations";
import {
  collectSceneBindings,
  getHorizontalCloudMetrics,
  type HorizontalCloudMetrics,
  type TechStackChipBinding,
} from "./techStackSceneDom";

type CreateTechStackSceneControllerParams = {
  pinned: HTMLDivElement;
  intro: HTMLDivElement;
  outro: HTMLDivElement;
  chips: readonly TechChip[];
  chipGroups: TechStackDesktopChipGroups;
  refs?: TechStackDesktopRefs;
  setHighlightedCategory: (value: CategoryKey | null) => void;
  setCurrentStoryStep: (value: number) => void;
};

type SyncLayoutParams = {
  chips: readonly TechChip[];
  chipGroups: TechStackDesktopChipGroups;
  currentStepIndex?: number;
  immediate?: boolean;
};

export type TechStackSceneController = {
  primeInitialScene: () => void;
  getInitialChipCount: () => number;
  applyInitialChipBatch: (params: {
    startIndex: number;
    batchSize: number;
    cloudMetrics: HorizontalCloudMetrics;
  }) => void;
  applyStepIndex: (index: number, immediate?: boolean) => void;
  applyStepKey: (stepKey: StoryStepKey, immediate?: boolean) => void;
  applySceneSpec: (
    sceneSpec: TechStackSceneSpec,
    currentStepIndex?: number,
    immediate?: boolean,
  ) => void;
  syncLayout: (params: SyncLayoutParams) => void;
  reset: () => void;
};

type ChipVisualMode = "hidden" | "orbit" | "stack";

type ChipBindingIndexes = {
  bindingById: Map<string, TechStackChipBinding>;
  movingCloudBindings: TechStackChipBinding[];
  movingCloudVisibleIndexById: Map<string, number>;
  bindingsByCategory: Map<CategoryKey, TechStackChipBinding[]>;
};

type SceneControllerState = {
  chips: readonly TechChip[];
  chipGroups: TechStackDesktopChipGroups;
  currentSceneSpec: TechStackSceneSpec;
  highlightedCategory: CategoryKey | null;
  currentStepIndex: number;
  bindings: TechStackChipBinding[];
  indexes: ChipBindingIndexes;
  visualModes: Map<string, ChipVisualMode>;
};

function createChipBindingIndexes(
  chipBindings: readonly TechStackChipBinding[],
  movingCloudChipIds: ReadonlySet<string>,
): ChipBindingIndexes {
  const bindingById = new Map<string, TechStackChipBinding>();
  const movingCloudBindings: TechStackChipBinding[] = [];
  const movingCloudVisibleIndexById = new Map<string, number>();
  const bindingsByCategory = new Map<CategoryKey, TechStackChipBinding[]>();

  chipBindings.forEach((binding) => {
    if (!binding.node) {
      return;
    }

    bindingById.set(binding.chip.id, binding);

    if (movingCloudChipIds.has(binding.chip.id)) {
      movingCloudVisibleIndexById.set(binding.chip.id, movingCloudBindings.length);
      movingCloudBindings.push(binding);
    }

    const categoryBindings = bindingsByCategory.get(binding.chip.categoryKey) ?? [];
    categoryBindings.push(binding);
    bindingsByCategory.set(binding.chip.categoryKey, categoryBindings);
  });

  return {
    bindingById,
    movingCloudBindings,
    movingCloudVisibleIndexById,
    bindingsByCategory,
  };
}

export function createTechStackSceneController({
  pinned,
  intro,
  outro,
  chips,
  chipGroups,
  refs,
  setHighlightedCategory,
  setCurrentStoryStep,
}: CreateTechStackSceneControllerParams): TechStackSceneController {
  const initialSceneSpec = getTechStackSceneSpec(STORY_STEP_KEYS[0]);
  const { chipBindings: initialBindings } = collectSceneBindings({
    pinned,
    chips,
    refs,
  });

  const state: SceneControllerState = {
    chips,
    chipGroups,
    currentSceneSpec: initialSceneSpec,
    highlightedCategory: null,
    currentStepIndex: 0,
    bindings: initialBindings,
    indexes: createChipBindingIndexes(initialBindings, chipGroups.movingCloudChipIds),
    visualModes: new Map<string, ChipVisualMode>(),
  };

  const ensureInactiveChipsHidden = (activeChipIds: ReadonlySet<string>) => {
    state.bindings.forEach((binding) => {
      if (!binding.node) {
        return;
      }

      if (state.visualModes.has(binding.chip.id)) {
        return;
      }

      if (activeChipIds.has(binding.chip.id)) {
        state.visualModes.set(binding.chip.id, "hidden");
        return;
      }

      setChipHiddenBase(binding);
      state.visualModes.set(binding.chip.id, "hidden");
    });
  };

  const setChipMode = (binding: TechStackChipBinding, mode: ChipVisualMode) => {
    state.visualModes.set(binding.chip.id, mode);
  };

  const hideVisibleChipsExcept = (
    visibleChipIds: ReadonlySet<string>,
    immediate: boolean,
  ) => {
    state.visualModes.forEach((mode, chipId) => {
      if (mode === "hidden" || visibleChipIds.has(chipId)) {
        return;
      }

      const binding = state.indexes.bindingById.get(chipId);

      if (!binding) {
        state.visualModes.set(chipId, "hidden");
        return;
      }

      animateChipToHidden(binding, immediate);
      state.visualModes.set(chipId, "hidden");
    });
  };

  const refreshChipBindings = () => {
    const { chipBindings } = collectSceneBindings({
      pinned,
      chips: state.chips,
      refs,
    });
    state.bindings = chipBindings;
    state.indexes = createChipBindingIndexes(
      chipBindings,
      state.chipGroups.movingCloudChipIds,
    );
    state.visualModes = new Map<string, ChipVisualMode>();
  };

  const syncHighlightedCategory = (value: CategoryKey | null) => {
    if (state.highlightedCategory === value) {
      return;
    }

    state.highlightedCategory = value;
    setHighlightedCategory(value);
  };

  const syncCurrentStoryStep = (value: number) => {
    if (state.currentStepIndex === value) {
      return;
    }

    state.currentStepIndex = value;
    setCurrentStoryStep(value);
  };

  const applySceneSpec = (
    sceneSpec: TechStackSceneSpec,
    currentStepIndex = STORY_STEP_KEYS.indexOf(sceneSpec.stepKey),
    immediate = false,
  ) => {
    state.currentSceneSpec = sceneSpec;

    gsap.killTweensOf(intro);
    gsap.killTweensOf(outro);
    gsap.set(intro, sceneSpec.intro);
    gsap.set(outro, sceneSpec.outro);

    if (sceneSpec.cloudMode === "stack-focus" && sceneSpec.activeCategory) {
      syncHighlightedCategory(sceneSpec.activeCategory);

      const activeBindings =
        state.indexes.bindingsByCategory.get(sceneSpec.activeCategory) ?? [];
      const activeChipIds = new Set(
        state.chipGroups.categoryChipIdsByKey.get(sceneSpec.activeCategory) ?? [],
      );

      ensureInactiveChipsHidden(activeChipIds);

      activeBindings.forEach((binding) => {
        animateChipToStack(binding, immediate);
        setChipMode(binding, "stack");
      });

      hideVisibleChipsExcept(activeChipIds, immediate);
    } else {
      syncHighlightedCategory(null);

      const cloudMetrics = getHorizontalCloudMetrics(pinned);
      const orbitChipIds = state.chipGroups.movingCloudChipIds;
      let visibleChipIndex = 0;

      ensureInactiveChipsHidden(orbitChipIds);

      state.indexes.movingCloudBindings.forEach((binding) => {
        animateChipToOrbit(binding, immediate, visibleChipIndex, cloudMetrics);
        setChipMode(binding, "orbit");
        visibleChipIndex += 1;
      });

      hideVisibleChipsExcept(orbitChipIds, immediate);
    }

    syncCurrentStoryStep(currentStepIndex >= 0 ? currentStepIndex : 0);
  };

  const primeInitialScene = () => {
    const sceneSpec = getTechStackSceneSpec(STORY_STEP_KEYS[0]);
    state.currentSceneSpec = sceneSpec;
    syncHighlightedCategory(null);
    syncCurrentStoryStep(0);
    gsap.killTweensOf(intro);
    gsap.killTweensOf(outro);
    gsap.set(intro, sceneSpec.intro);
    gsap.set(outro, sceneSpec.outro);
  };

  const applyInitialChipBatch = ({
    startIndex,
    batchSize,
    cloudMetrics,
  }: {
    startIndex: number;
    batchSize: number;
    cloudMetrics: HorizontalCloudMetrics;
  }) => {
    const endIndex = Math.min(state.bindings.length, startIndex + batchSize);

    for (let index = startIndex; index < endIndex; index += 1) {
      const binding = state.bindings[index];

      if (!binding?.node) {
        continue;
      }

      const visibleIndex = state.indexes.movingCloudVisibleIndexById.get(
        binding.chip.id,
      );

      if (typeof visibleIndex === "number") {
        animateChipToOrbit(binding, true, visibleIndex, cloudMetrics);
        setChipMode(binding, "orbit");
        continue;
      }

      setChipHiddenBase(binding);
      setChipMode(binding, "hidden");
    }
  };

  return {
    primeInitialScene,
    getInitialChipCount: () => state.bindings.length,
    applyInitialChipBatch,
    applyStepIndex: (index, immediate = false) => {
      const stepKey = STORY_STEP_KEYS[index] ?? STORY_STEP_KEYS[0];
      const sceneSpec = getTechStackSceneSpec(stepKey);
      applySceneSpec(sceneSpec, index, immediate);
    },
    applyStepKey: (stepKey, immediate = false) => {
      const sceneSpec = getTechStackSceneSpec(stepKey);
      applySceneSpec(sceneSpec, STORY_STEP_KEYS.indexOf(stepKey), immediate);
    },
    applySceneSpec,
    syncLayout: ({
      chips: nextChips,
      chipGroups: nextChipGroups,
      currentStepIndex = STORY_STEP_KEYS.indexOf(state.currentSceneSpec.stepKey),
      immediate = true,
    }) => {
      state.chips = nextChips;
      state.chipGroups = nextChipGroups;
      refreshChipBindings();
      applySceneSpec(state.currentSceneSpec, currentStepIndex, immediate);
    },
    reset: () => {
      state.bindings.forEach((binding) => {
        if (!binding.node) {
          return;
        }
        clearChipVisual(binding);
        delete binding.node.dataset.chipVisual;
      });
      gsap.killTweensOf(intro);
      gsap.killTweensOf(outro);
      state.visualModes.clear();
      state.currentStepIndex = 0;
      state.highlightedCategory = null;
      setCurrentStoryStep(0);
      setHighlightedCategory(null);
    },
  };
}
