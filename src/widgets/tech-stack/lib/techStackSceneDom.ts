import type { CategoryKey, TechChip } from "../model/layout";
import type {
  TechStackDesktopChipGroups,
  TechStackDesktopRefs,
} from "../model/types";

type BindingCollectionsParams = {
  pinned: HTMLDivElement;
  chips: readonly TechChip[];
  refs?: TechStackDesktopRefs;
};

export type TechStackChipBinding = {
  chip: TechChip;
  node: HTMLDivElement;
  pill: HTMLSpanElement | null;
};

export type HorizontalCloudMetrics = {
  minY: number;
  maxY: number;
  laneOffset: number;
  chipSpacing: number;
  overflow: number;
  reentryDelay: number;
  speed: number;
  height: number;
  width: number;
};

const MAX_MOVING_CLOUD_CHIPS = 24;

function getCssVarNumber(element: HTMLElement, variableName: string, fallback: number) {
  const value = Number.parseFloat(
    getComputedStyle(element).getPropertyValue(variableName),
  );
  return Number.isFinite(value) ? value : fallback;
}

export function getHorizontalCloudMetrics(
  container: HTMLDivElement,
): HorizontalCloudMetrics {
  const scene =
    container.querySelector<HTMLDivElement>(".tech-stack-scene") ??
    container.querySelector<HTMLDivElement>(".tech-stack-media-inset") ??
    container;
  const height = scene.clientHeight || container.clientHeight;
  const minPadding = getCssVarNumber(scene, "--tech-stack-cloud-padding-block-start", 28);
  const maxPadding = getCssVarNumber(scene, "--tech-stack-cloud-padding-block-end", 48);

  return {
    minY: minPadding,
    maxY: Math.max(minPadding + 120, height - maxPadding),
    laneOffset: getCssVarNumber(scene, "--tech-stack-cloud-lane-offset", 18),
    chipSpacing: getCssVarNumber(scene, "--tech-stack-cloud-chip-spacing", 320),
    overflow: getCssVarNumber(scene, "--tech-stack-cloud-overflow", 220),
    reentryDelay: getCssVarNumber(scene, "--tech-stack-cloud-reentry-delay", 0.5),
    speed: getCssVarNumber(scene, "--tech-stack-cloud-speed", 96),
    height,
    width: scene.clientWidth || container.clientWidth,
  };
}

export function getMovingCloudChipIds(chips: readonly TechChip[]) {
  if (chips.length <= MAX_MOVING_CLOUD_CHIPS) {
    return new Set(chips.map((chip) => chip.id));
  }

  const selectedIds = new Set<string>();
  const maxIndex = chips.length - 1;
  const step = maxIndex / Math.max(MAX_MOVING_CLOUD_CHIPS - 1, 1);

  for (let index = 0; index < MAX_MOVING_CLOUD_CHIPS; index += 1) {
    const chip = chips[Math.round(index * step)];

    if (chip) {
      selectedIds.add(chip.id);
    }
  }

  return selectedIds;
}

export function buildTechStackDesktopChipGroups(
  chips: readonly TechChip[],
): TechStackDesktopChipGroups {
  const categoryChipIdsByKey = new Map<CategoryKey, string[]>();

  chips.forEach((chip) => {
    const categoryChipIds = categoryChipIdsByKey.get(chip.categoryKey) ?? [];
    categoryChipIds.push(chip.id);
    categoryChipIdsByKey.set(chip.categoryKey, categoryChipIds);
  });

  return {
    allChips: chips,
    movingCloudChipIds: getMovingCloudChipIds(
      chips.filter((chip) => chip.kind === "item"),
    ),
    categoryChipIdsByKey,
  };
}

function getIndexedNodes<T extends Element>(
  refs: readonly (T | null)[] | undefined,
  fallback: NodeListOf<T>,
) {
  const fallbackNodes = Array.from(fallback);

  if (!refs?.length) {
    return fallbackNodes;
  }

  const length = Math.max(refs.length, fallbackNodes.length);

  return Array.from({ length }, (_, index) => refs[index] ?? fallbackNodes[index]);
}

export function collectSceneBindings({ pinned, chips, refs }: BindingCollectionsParams) {
  const chipNodes = getIndexedNodes(
    refs?.chipNodeRefs.current,
    pinned.querySelectorAll(".tech-stack-node"),
  );

  const chipBindings: TechStackChipBinding[] = chips.map((chip, index) => ({
    chip,
    node: chipNodes[index] as HTMLDivElement,
    pill:
      refs?.chipPillRefs.current[index] ??
      chipNodes[index]?.querySelector<HTMLSpanElement>(".tech-stack-chip-pill") ??
      null,
  }));

  return { chipBindings };
}
