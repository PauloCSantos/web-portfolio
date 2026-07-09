import {
  CHIP_SAFE_HALF_PX,
  DESKTOP_CATEGORY_COUNT,
  DESKTOP_CATEGORY_HEADER_Y,
  DESKTOP_ITEMS_END_Y,
  FOCUS_DESKTOP_CENTER_Y,
  FOCUS_DESKTOP_COLUMN_X,
  FOCUS_MOBILE_CENTER_Y,
  FOCUS_MOBILE_COLUMN_X,
  STACK_DESKTOP_COLUMN_X,
  STACK_DESKTOP_ITEMS_END_Y,
  STACK_DESKTOP_ITEMS_START_Y,
  STACK_DESKTOP_TITLE_Y,
  MOBILE_CATEGORY_ITEMS_START_Y,
  MOBILE_CATEGORY_X,
  MOBILE_ITEMS_END_Y,
  type CategoryKey,
  DEFAULT_DESKTOP_CATEGORY_X,
} from "./layoutTokens";

export type CategoryColumn = {
  key: CategoryKey;
  title: string;
  items: string[];
};

export type TechChip = {
  id: string;
  label: string;
  kind: "title" | "item";
  categoryKey: CategoryKey;
  categoryTitle: string;
  categoryIndex: number;
  itemIndex: number;
  globalIndex: number;
  organizedDesktopX: number;
  organizedDesktopY: number;
  focusDesktopX: number;
  focusDesktopY: number;
  stackedDesktopX: number;
  stackedDesktopY: number;
  organizedMobileX: number;
  organizedMobileY: number;
  focusMobileX: number;
  focusMobileY: number;
  sphereRadiusPx: number;
  sphereSeedRotateXDeg: number;
  sphereSeedRotateYDeg: number;
  sphereOrbitTiltDeg: number;
  sphereOrbitPhaseTurn: number;
};

type BuildColumnsAndChipsOptions = {
  includeTitleChips?: boolean;
};

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export function computeDesktopCategoryX(width: number) {
  if (!width || Number.isNaN(width)) {
    return DEFAULT_DESKTOP_CATEGORY_X;
  }

  const safePadPct = Math.min(18, Math.max(10, (CHIP_SAFE_HALF_PX / width) * 100));
  const minX = safePadPct;
  const maxX = 100 - safePadPct;
  const step = (maxX - minX) / (DESKTOP_CATEGORY_COUNT - 1);

  return Array.from({ length: DESKTOP_CATEGORY_COUNT }, (_, i) =>
    Number((minX + step * i).toFixed(2)),
  );
}

export function buildColumnsAndChips(
  categories: readonly CategoryColumn[],
  desktopCategoryX: readonly number[],
  options: BuildColumnsAndChipsOptions = {},
): TechChip[] {
  const chips: TechChip[] = [];
  let globalIndex = 0;
  const includeTitleChips = options.includeTitleChips ?? false;

  const desktopCounts = categories.map((category) => category.items.length);
  const desktopMax = Math.max(...desktopCounts, 1);
  const desktopStartY = 24;
  const desktopGap =
    desktopMax > 1
      ? Math.max(4.8, (DESKTOP_ITEMS_END_Y - desktopStartY) / (desktopMax - 1))
      : 0;

  for (let categoryIndex = 0; categoryIndex < categories.length; categoryIndex += 1) {
    const category = categories[categoryIndex];
    const mobileCol = categoryIndex % 2;
    const mobileStartY = MOBILE_CATEGORY_ITEMS_START_Y[categoryIndex];
    const mobileEndY = MOBILE_ITEMS_END_Y[categoryIndex];
    const mobileGap =
      category.items.length > 1
        ? Math.max(4.1, (mobileEndY - mobileStartY) / (category.items.length - 1))
        : 0;
    const focusDesktopGap =
      category.items.length > 1
        ? Math.max(5.2, Math.min(8.2, 34 / (category.items.length - 1)))
        : 0;
    const focusDesktopStartY =
      FOCUS_DESKTOP_CENTER_Y -
      (focusDesktopGap * Math.max(category.items.length - 1, 0)) / 2;
    const stackDesktopGap =
      category.items.length > 1
        ? Math.max(
            5.8,
            Math.min(
              8.8,
              (STACK_DESKTOP_ITEMS_END_Y - STACK_DESKTOP_ITEMS_START_Y) /
                (category.items.length - 1),
            ),
          )
        : 0;
    const focusMobileGap =
      category.items.length > 1
        ? Math.max(4.8, Math.min(7.4, 30 / (category.items.length - 1)))
        : 0;
    const focusMobileStartY =
      FOCUS_MOBILE_CENTER_Y -
      (focusMobileGap * Math.max(category.items.length - 1, 0)) / 2;
    const stackDesktopStartY =
      STACK_DESKTOP_ITEMS_START_Y +
      (STACK_DESKTOP_ITEMS_END_Y -
        STACK_DESKTOP_ITEMS_START_Y -
        stackDesktopGap * Math.max(category.items.length - 1, 0)) /
        2;

    if (includeTitleChips) {
      chips.push({
        id: `${category.key}-title`,
        label: category.title,
        kind: "title",
        categoryKey: category.key,
        categoryTitle: category.title,
        categoryIndex,
        itemIndex: -1,
        globalIndex,
        organizedDesktopX: desktopCategoryX[categoryIndex],
        organizedDesktopY: DESKTOP_CATEGORY_HEADER_Y,
        focusDesktopX: FOCUS_DESKTOP_COLUMN_X,
        focusDesktopY: STACK_DESKTOP_TITLE_Y,
        stackedDesktopX: STACK_DESKTOP_COLUMN_X,
        stackedDesktopY: STACK_DESKTOP_TITLE_Y,
        organizedMobileX: MOBILE_CATEGORY_X[mobileCol],
        organizedMobileY: mobileStartY,
        focusMobileX: FOCUS_MOBILE_COLUMN_X,
        focusMobileY: FOCUS_MOBILE_CENTER_Y,
        sphereRadiusPx: 118 + ((globalIndex * 19) % 46),
        sphereSeedRotateXDeg: -58 + ((globalIndex * 17) % 116),
        sphereSeedRotateYDeg: (globalIndex * 31) % 360,
        sphereOrbitTiltDeg: -42 + ((globalIndex * 13) % 84),
        sphereOrbitPhaseTurn: ((globalIndex * 73) % 1000) / 1000,
      });
    }

    for (let itemIndex = 0; itemIndex < category.items.length; itemIndex += 1) {
      const label = category.items[itemIndex];
      chips.push({
        id: `${category.key}-${slugify(label)}-${itemIndex}`,
        label,
        kind: "item",
        categoryKey: category.key,
        categoryTitle: category.title,
        categoryIndex,
        itemIndex,
        globalIndex,
        organizedDesktopX: desktopCategoryX[categoryIndex],
        organizedDesktopY: desktopStartY + itemIndex * desktopGap,
        focusDesktopX: FOCUS_DESKTOP_COLUMN_X,
        focusDesktopY: focusDesktopStartY + itemIndex * focusDesktopGap,
        stackedDesktopX: STACK_DESKTOP_COLUMN_X,
        stackedDesktopY: stackDesktopStartY + itemIndex * stackDesktopGap,
        organizedMobileX: MOBILE_CATEGORY_X[mobileCol],
        organizedMobileY: mobileStartY + itemIndex * mobileGap,
        focusMobileX: FOCUS_MOBILE_COLUMN_X,
        focusMobileY: focusMobileStartY + itemIndex * focusMobileGap,
        sphereRadiusPx: 118 + ((globalIndex * 19) % 46),
        sphereSeedRotateXDeg: -58 + ((globalIndex * 17) % 116),
        sphereSeedRotateYDeg: (globalIndex * 31) % 360,
        sphereOrbitTiltDeg: -42 + ((globalIndex * 13) % 84),
        sphereOrbitPhaseTurn: ((globalIndex * 73) % 1000) / 1000,
      });
      globalIndex += 1;
    }
  }

  return chips;
}
