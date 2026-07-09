import { useMemo, useState } from "react";
import { Container } from "@shared/ui/Container";
import { usePrefersReducedMotion } from "@shared/lib/motion/usePrefersReducedMotion";
import {
  buildColumnsAndChips,
  computeDesktopCategoryX,
  type CategoryKey,
  type TechChip,
} from "../model/layout";
import type {
  MobileSceneMode,
  MobileTechStackSlide,
  MobileVisibleChip,
  StoryCategory,
  TechStackCopy,
  TechStackMobileSceneViewModel,
} from "../model/types";
import { TechStackMobileView } from "./TechStackMobileView";

type TechStackMobileSectionProps = {
  ids: {
    stageTitleId: string;
    hintId: string;
  };
  copy: TechStackCopy;
  categories: readonly StoryCategory[];
};

const SUMMARY_CHIP_LAYOUT = [
  { x: 36, y: 24, rotate: 0, scale: 1 },
  { x: 64, y: 35, rotate: 0, scale: 1 },
  { x: 36, y: 46, rotate: 0, scale: 1 },
  { x: 64, y: 57, rotate: 0, scale: 1 },
  { x: 36, y: 68, rotate: 0, scale: 1 },
  { x: 64, y: 79, rotate: 0, scale: 1 },
] as const;

const MOBILE_STACK_START_Y = 24;
const MOBILE_STACK_END_Y = 79;
const MOBILE_STACK_LEFT_X = 36;
const MOBILE_STACK_RIGHT_X = 64;

function buildMobileSlides(
  copy: TechStackCopy,
  categories: readonly StoryCategory[],
): MobileTechStackSlide[] {
  return [
    {
      id: "intro",
      kind: "intro",
      eyebrow: copy.title,
      title: copy.introTitle,
      body: copy.introBody,
      meta: copy.hint,
    },
    ...categories.map((category, index) => ({
      id: ["category", category.key].join("-") as MobileTechStackSlide["id"],
      kind: "category" as const,
      category,
      stepNumber: index + 1,
    })),
    {
      id: "outro",
      kind: "outro",
      eyebrow: copy.finaleEyebrow,
      title: copy.outroTitle,
      body: copy.outroBody,
    },
  ];
}

function getMobileSceneMode(slide: MobileTechStackSlide | undefined): MobileSceneMode {
  if (!slide || slide.kind === "intro") {
    return "summary";
  }

  if (slide.kind === "outro") {
    return "outro";
  }

  return "category";
}

function pickSummaryChips(categories: readonly StoryCategory[]): string[] {
  const selected: string[] = [];
  let itemIndex = 0;

  while (selected.length < SUMMARY_CHIP_LAYOUT.length) {
    let foundItem = false;

    for (const category of categories) {
      const item = category.items[itemIndex];

      if (!item) {
        continue;
      }

      selected.push(item);
      foundItem = true;

      if (selected.length === SUMMARY_CHIP_LAYOUT.length) {
        break;
      }
    }

    if (!foundItem) {
      break;
    }

    itemIndex += 1;
  }

  return selected;
}

function buildVisibleChips(
  chips: readonly TechChip[],
  categories: readonly StoryCategory[],
  activeSlide: MobileTechStackSlide | undefined,
): MobileVisibleChip[] {
  const sceneMode = getMobileSceneMode(activeSlide);

  if (sceneMode === "category" && activeSlide?.kind === "category") {
    return chips
      .filter((chip) => chip.categoryKey === activeSlide.category.key)
      .map((chip, index, activeChips) => {
        const y =
          activeChips.length > 1
            ? MOBILE_STACK_START_Y +
              (index / (activeChips.length - 1)) *
                (MOBILE_STACK_END_Y - MOBILE_STACK_START_Y)
            : 50;

        return {
          id: chip.id,
          label: chip.label,
          categoryKey: chip.categoryKey,
          categoryTitle: chip.categoryTitle,
          x: index % 2 === 0 ? MOBILE_STACK_LEFT_X : MOBILE_STACK_RIGHT_X,
          y: Number(y.toFixed(2)),
          rotate: 0,
          scale: 1,
        };
      });
  }

  const summaryLabels = pickSummaryChips(categories);

  return summaryLabels
    .map((label) => chips.find((chip) => chip.label === label))
    .filter((chip): chip is TechChip => Boolean(chip))
    .map((chip, index) => ({
      id: chip.id,
      label: chip.label,
      categoryKey: chip.categoryKey,
      categoryTitle: chip.categoryTitle,
      ...SUMMARY_CHIP_LAYOUT[index],
    }));
}

export function TechStackMobileSection({
  ids,
  copy,
  categories,
}: TechStackMobileSectionProps) {
  const reduceMotion = usePrefersReducedMotion();
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  const desktopCategoryX = useMemo(() => computeDesktopCategoryX(0), []);
  const chips = useMemo(
    () => buildColumnsAndChips(categories, desktopCategoryX),
    [categories, desktopCategoryX],
  );
  const slides = useMemo(() => buildMobileSlides(copy, categories), [copy, categories]);
  const maxSlideIndex = Math.max(slides.length - 1, 0);
  const boundedActiveSlideIndex = Math.min(activeSlideIndex, maxSlideIndex);
  const activeSlide = slides[boundedActiveSlideIndex] ?? slides[0];
  const mobileSceneMode = getMobileSceneMode(activeSlide);
  const highlightedCategory: CategoryKey | null =
    activeSlide?.kind === "category" ? activeSlide.category.key : null;
  const visibleChips = useMemo(
    () => buildVisibleChips(chips, categories, activeSlide),
    [activeSlide, categories, chips],
  );

  const scene = useMemo<TechStackMobileSceneViewModel>(
    () => ({
      slides,
      activeSlideIndex: boundedActiveSlideIndex,
      mobileSceneMode,
      highlightedCategory,
      activeCategoryTitle:
        activeSlide?.kind === "category" ? activeSlide.category.title : null,
      visibleChips,
    }),
    [
      activeSlide,
      boundedActiveSlideIndex,
      highlightedCategory,
      mobileSceneMode,
      slides,
      visibleChips,
    ],
  );

  const handleSelectSlide = (index: number) => {
    setActiveSlideIndex(Math.min(index, maxSlideIndex));
  };

  return (
    <div className="tech-stack-story relative z-20 isolate mx-[calc(50%-50vw)] w-screen border-y border-border/70 bg-card/50 shadow-stack md:hidden">
      <div
        className="tech-stack-mobile-shell relative z-10"
        data-scene-mode={scene.mobileSceneMode}
        data-focus-category={scene.highlightedCategory ?? "none"}
      >
        <div
          aria-hidden
          className="tech-stack-mobile-shell-backdrop pointer-events-none absolute inset-0"
        />

        <Container className="relative z-10 h-full max-w-none px-(--layout-gutter) py-[clamp(1rem,4vw,1.5rem)]">
          <TechStackMobileView
            ids={ids}
            copy={copy}
            scene={scene}
            reduceMotion={reduceMotion}
            onSelectSlide={handleSelectSlide}
            onActiveSlideChange={handleSelectSlide}
          />
        </Container>
      </div>
    </div>
  );
}
