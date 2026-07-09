import type { MutableRefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  CATEGORY_STORY_STEP_KEYS,
  STORY_STEP_KEYS,
  type TechStackSceneSpec,
} from "../model/storyScene";
import type { StoryCategory } from "../model/types";
import type { TechStackSceneController } from "./createTechStackSceneController";

type StoryProgressRefs = {
  desktopScrollTriggerRef: MutableRefObject<ScrollTrigger | null>;
  desktopTimelineRef: MutableRefObject<gsap.core.Timeline | null>;
  scrollTweenRef: MutableRefObject<gsap.core.Tween | null>;
  currentStepIndexRef: MutableRefObject<number>;
};

const REDUCED_MOTION_SCENE_SPEC: TechStackSceneSpec = {
  stepKey: "opening",
  intro: { autoAlpha: 1, y: 0 },
  outro: { autoAlpha: 0, y: 48, filter: "blur(10px)" },
  organized: true,
  cloudMode: "orbit",
  activeCategory: null,
};

const OPENING_END = 0.27;
const OPENING_TO_CATEGORY_GAP = 0.02;
const CATEGORY_STEP_SPACING = 0.1;
const FINALE_OFFSET = 0.08;
const TABLET_MEDIA_QUERY = "(min-width: 768px) and (max-width: 1023px)";

function getMediaFrameXPercent(desktopValue: number) {
  if (typeof window === "undefined") {
    return desktopValue;
  }

  return window.matchMedia(TABLET_MEDIA_QUERY).matches ? 0 : desktopValue;
}

function getStoryStepIndexFromTime(
  timeline: gsap.core.Timeline,
  stepKeys: readonly (typeof STORY_STEP_KEYS)[number][],
) {
  const currentTime = timeline.time();
  let nextIndex = 0;

  for (let i = 0; i < stepKeys.length; i += 1) {
    const labelTime = timeline.labels[stepKeys[i]] ?? 0;
    if (currentTime >= labelTime) {
      nextIndex = i;
    }
  }

  return nextIndex;
}

export function applyReducedMotionState(sceneController: TechStackSceneController) {
  sceneController.applySceneSpec(REDUCED_MOTION_SCENE_SPEC, 0, true);
}

export function applyDesktopStoryInitialState({
  mediaFrame,
  sceneController,
  currentStepIndexRef,
}: {
  mediaFrame: HTMLDivElement;
  sceneController: TechStackSceneController;
  currentStepIndexRef: MutableRefObject<number>;
}) {
  gsap.set(mediaFrame, {
    scale: 1.06,
    xPercent: getMediaFrameXPercent(12),
    yPercent: 4,
    rotateX: 7,
    rotateY: -5,
  });

  currentStepIndexRef.current = 0;
  sceneController.applyStepIndex(0, true);
}

export function setupDesktopStory({
  section,
  pinned,
  header,
  mediaFrame,
  categories,
  sceneController,
  desktopScrollTriggerRef,
  desktopTimelineRef,
  scrollTweenRef,
  currentStepIndexRef,
  applyInitialScene = true,
}: {
  section: HTMLDivElement;
  pinned: HTMLDivElement;
  header: HTMLDivElement;
  mediaFrame: HTMLDivElement;
  categories: readonly StoryCategory[];
  sceneController: TechStackSceneController;
  applyInitialScene?: boolean;
} & StoryProgressRefs) {
  const q = gsap.utils.selector(pinned);
  const firstCategoryStart = OPENING_END + OPENING_TO_CATEGORY_GAP;
  const finaleStart =
    firstCategoryStart +
    Math.max(CATEGORY_STORY_STEP_KEYS.length - 1, 0) * CATEGORY_STEP_SPACING +
    FINALE_OFFSET;

  if (applyInitialScene) {
    applyDesktopStoryInitialState({
      mediaFrame,
      sceneController,
      currentStepIndexRef,
    });
  }

  const syncStoryStep = (stepIndex: number, immediate = false) => {
    if (stepIndex === currentStepIndexRef.current && !immediate) {
      return;
    }

    currentStepIndexRef.current = stepIndex;
    sceneController.applyStepIndex(stepIndex, immediate);
  };

  const timeline = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: () => `+=${Math.round(window.innerHeight * 4.2)}`,
      scrub: 1.1,
      pin: pinned,
      pinSpacing: true,
      anticipatePin: 1,
      fastScrollEnd: true,
      invalidateOnRefresh: true,
      onRefresh: () => {
        const stepIndex = getStoryStepIndexFromTime(timeline, STORY_STEP_KEYS);
        const isActive = timeline.scrollTrigger?.isActive ?? false;
        currentStepIndexRef.current = stepIndex;
        sceneController.applyStepIndex(stepIndex, !isActive);
      },
      onEnter: () => {
        const stepIndex = getStoryStepIndexFromTime(timeline, STORY_STEP_KEYS);
        currentStepIndexRef.current = stepIndex;
        sceneController.applyStepIndex(stepIndex, false);
      },
      onUpdate: (self) => {
        desktopScrollTriggerRef.current = self;
        syncStoryStep(getStoryStepIndexFromTime(timeline, STORY_STEP_KEYS));
      },
      onEnterBack: () => {
        const stepIndex = getStoryStepIndexFromTime(timeline, STORY_STEP_KEYS);
        currentStepIndexRef.current = stepIndex;
        sceneController.applyStepIndex(stepIndex, false);
      },
      onLeave: () => {
        syncStoryStep(STORY_STEP_KEYS.length - 1, true);
      },
      onLeaveBack: () => {
        syncStoryStep(0, true);
      },
    },
  });

  desktopTimelineRef.current = timeline;
  desktopScrollTriggerRef.current = timeline.scrollTrigger ?? null;

  timeline
    .addLabel("opening", 0)
    .to(
      header,
      {
        autoAlpha: 0.56,
        y: -8,
        duration: 0.18,
      },
      0.04,
    )
    .to(
      mediaFrame,
      {
        scale: 1,
        xPercent: getMediaFrameXPercent(10),
        yPercent: 0,
        rotateX: 0,
        rotateY: 0,
        duration: 0.2,
      },
      0,
    )
    .to(
      q(".tech-stack-parallax-media"),
      {
        yPercent: -10,
        scale: 1.08,
        duration: 0.7,
      },
      0,
    )
    .to(
      q(".tech-stack-content-layer"),
      {
        yPercent: -18,
        duration: 0.7,
      },
      0.04,
    )
    .fromTo(
      q(".tech-stack-foreground"),
      { autoAlpha: 0, yPercent: 12 },
      { autoAlpha: 1, yPercent: 0, duration: 0.22 },
      0.12,
    )
    .addLabel("transition", OPENING_END);

  categories.forEach((_, index) => {
    const start = firstCategoryStart + index * CATEGORY_STEP_SPACING;
    const stepKey = CATEGORY_STORY_STEP_KEYS[index];

    if (!stepKey) {
      return;
    }

    timeline.addLabel(stepKey, start);
  });

  timeline.to(
    header,
    {
      autoAlpha: 0.24,
      y: -14,
      duration: 0.12,
    },
    0.88,
  );

  timeline.to(
    mediaFrame,
    {
      xPercent: getMediaFrameXPercent(20),
      scale: 1.02,
      yPercent: 0,
      duration: 0.18,
      ease: "power2.inOut",
    },
    0.86,
  );

  timeline.addLabel("finale", finaleStart).to({}, { duration: 0 }, finaleStart + 0.08);

  return () => {
    scrollTweenRef.current?.kill();
    scrollTweenRef.current = null;
    desktopScrollTriggerRef.current = null;
    desktopTimelineRef.current = null;
    currentStepIndexRef.current = 0;
    sceneController.reset();
    timeline.scrollTrigger?.kill();
    timeline.kill();
  };
}
