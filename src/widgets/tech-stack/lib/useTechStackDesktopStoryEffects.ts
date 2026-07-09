import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { CategoryKey, TechChip } from "../model/layout";
import type {
  StoryCategory,
  StoryStepDef,
  TechStackDesktopChipGroups,
  TechStackDesktopRefs,
} from "../model/types";
import {
  createTechStackSceneController,
  type TechStackSceneController,
} from "./createTechStackSceneController";
import {
  applyReducedMotionState,
  setupDesktopStory,
} from "./techStackDesktopStoryRuntime";
import { getHorizontalCloudMetrics } from "./techStackSceneDom";
import { scheduleDesktopStorySetup } from "./techStackDesktopSetupScheduler";
import {
  clearUrlHash,
  getStableStepScrollTarget,
} from "./techStackStoryNavigation";
import { useTechStackLayoutSync } from "./useTechStackLayoutSync";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const INITIAL_CHIP_BATCH_SIZE = 8;

type DesktopStorySetupRefs = {
  section: HTMLDivElement;
  pinned: HTMLDivElement;
  header: HTMLDivElement;
  intro: HTMLDivElement;
  mediaFrame: HTMLDivElement;
  outro: HTMLDivElement;
};

type UseTechStackDesktopStoryEffectsParams = {
  enabled: boolean;
  dom: TechStackDesktopRefs;
  categories: readonly StoryCategory[];
  chips: readonly TechChip[];
  chipGroups: TechStackDesktopChipGroups;
  storyStepDefs: readonly StoryStepDef[];
  setHighlightedCategory: (value: CategoryKey | null) => void;
  setCurrentStoryStep: (value: number) => void;
};

export function useTechStackDesktopStoryEffects({
  enabled,
  dom,
  categories,
  chips,
  chipGroups,
  storyStepDefs,
  setHighlightedCategory,
  setCurrentStoryStep,
}: UseTechStackDesktopStoryEffectsParams) {
  const sceneControllerRef = useRef<TechStackSceneController | null>(null);
  const desktopScrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const desktopTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const scrollTweenRef = useRef<gsap.core.Tween | null>(null);
  const currentStepIndexRef = useRef(0);
  const storyStepDefsRef = useRef(storyStepDefs);
  const categoriesRef = useRef(categories);
  const chipsRef = useRef(chips);
  const chipGroupsRef = useRef(chipGroups);
  const hasSyncedLayoutRef = useRef(false);

  useEffect(() => {
    storyStepDefsRef.current = storyStepDefs;
    categoriesRef.current = categories;
    chipsRef.current = chips;
    chipGroupsRef.current = chipGroups;
  }, [storyStepDefs, categories, chips, chipGroups]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const section = dom.sectionRef.current;

    if (!section) {
      return;
    }

    let ctx: gsap.Context | null = null;
    let mm: gsap.MatchMedia | null = null;
    let storyCleanup: VoidFunction | null = null;
    let setupRefs: DesktopStorySetupRefs | null = null;
    let phaseTimeoutId: ReturnType<typeof globalThis.setTimeout> | null = null;
    let animationFrameId: number | null = null;
    let isPipelineCanceled = false;

    const cancelQueuedPhase = () => {
      if (phaseTimeoutId !== null) {
        globalThis.clearTimeout(phaseTimeoutId);
        phaseTimeoutId = null;
      }

      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    };

    const queueNextPhase = (phase: () => void) => {
      if (isPipelineCanceled) {
        return;
      }

      phaseTimeoutId = globalThis.setTimeout(() => {
        phaseTimeoutId = null;

        if (!isPipelineCanceled) {
          phase();
        }
      }, 0);
    };

    const queueNextFrame = (phase: () => void) => {
      if (isPipelineCanceled) {
        return;
      }

      animationFrameId = window.requestAnimationFrame(() => {
        animationFrameId = null;

        if (!isPipelineCanceled) {
          phase();
        }
      });
    };

    const runInContext = (phase: () => void) => {
      if (ctx) {
        ctx.add(phase);
        return;
      }

      phase();
    };

    const readSetupRefs = (): DesktopStorySetupRefs | null => {
      const section = dom.sectionRef.current;
      const pinned = dom.pinnedRef.current;
      const header = dom.headerRef.current;
      const intro = dom.introRef.current;
      const mediaFrame = dom.mediaFrameRef.current;
      const outro = dom.outroRef.current;

      if (!section || !pinned || !header || !intro || !mediaFrame || !outro) {
        return null;
      }

      return {
        section,
        pinned,
        header,
        intro,
        mediaFrame,
        outro,
      };
    };

    const cancelPipeline = () => {
      isPipelineCanceled = true;
      cancelQueuedPhase();
    };

    const resetStoryEffects = () => {
      scrollTweenRef.current?.kill();
      scrollTweenRef.current = null;
      storyCleanup?.();
      storyCleanup = null;
      sceneControllerRef.current?.reset();
      sceneControllerRef.current = null;
      desktopScrollTriggerRef.current = null;
      desktopTimelineRef.current = null;
      currentStepIndexRef.current = 0;
      hasSyncedLayoutRef.current = false;
    };

    const createPinnedTimeline = () => {
      const refs = setupRefs;
      const sceneController = sceneControllerRef.current;

      if (!refs || !sceneController || isPipelineCanceled) {
        return;
      }

      storyCleanup = setupDesktopStory({
        section: refs.section,
        pinned: refs.pinned,
        header: refs.header,
        mediaFrame: refs.mediaFrame,
        categories: categoriesRef.current,
        sceneController,
        desktopScrollTriggerRef,
        desktopTimelineRef,
        scrollTweenRef,
        currentStepIndexRef,
        applyInitialScene: false,
      });
    };

    const registerMatchMedia = () => {
      const refs = setupRefs;

      if (!refs || isPipelineCanceled) {
        return;
      }

      runInContext(() => {
        if (isPipelineCanceled) {
          return;
        }

        mm = gsap.matchMedia(refs.section);

        mm.add(
          {
            isDesktop: "(min-width: 768px)",
            reduceMotion: "(prefers-reduced-motion: reduce)",
          },
          ({ conditions }) => {
            if (!conditions?.isDesktop || isPipelineCanceled) {
              return undefined;
            }

            const sceneController = sceneControllerRef.current;

            if (!sceneController) {
              return undefined;
            }

            if (conditions.reduceMotion) {
              applyReducedMotionState(sceneController);
              return () => {
                sceneControllerRef.current?.reset();
              };
            }

            let timelineTimeoutId: ReturnType<typeof globalThis.setTimeout> | null = null;
            let localStoryCleanup: VoidFunction | null = null;

            ScrollTrigger.saveStyles(
              ".tech-stack-parallax-media, .tech-stack-content-layer, .tech-stack-foreground, .tech-stack-media-frame, .tech-stack-node, .tech-stack-intro-wrap, [data-story-outro]",
            );

            timelineTimeoutId = globalThis.setTimeout(() => {
              timelineTimeoutId = null;

              if (isPipelineCanceled) {
                return;
              }

              runInContext(() => {
                createPinnedTimeline();
                localStoryCleanup = storyCleanup;
              });
            }, 0);

            return () => {
              if (timelineTimeoutId !== null) {
                globalThis.clearTimeout(timelineTimeoutId);
                timelineTimeoutId = null;
              }

              localStoryCleanup?.();

              if (storyCleanup === localStoryCleanup) {
                storyCleanup = null;
              }
            };
          },
        );
      });
    };

    const applyInitialChipBatches = () => {
      const refs = setupRefs;
      const sceneController = sceneControllerRef.current;

      if (!refs || !sceneController || isPipelineCanceled) {
        return;
      }

      const cloudMetrics = getHorizontalCloudMetrics(refs.pinned);
      const chipCount = sceneController.getInitialChipCount();
      let nextChipIndex = 0;

      const applyNextBatch = () => {
        if (isPipelineCanceled) {
          return;
        }

        runInContext(() => {
          if (!isPipelineCanceled) {
            sceneController.applyInitialChipBatch({
              startIndex: nextChipIndex,
              batchSize: INITIAL_CHIP_BATCH_SIZE,
              cloudMetrics,
            });
          }
        });

        nextChipIndex += INITIAL_CHIP_BATCH_SIZE;

        if (nextChipIndex < chipCount) {
          queueNextFrame(applyNextBatch);
          return;
        }

        hasSyncedLayoutRef.current = true;
        queueNextPhase(registerMatchMedia);
      };

      applyNextBatch();
    };

    const applyInitialScene = () => {
      const refs = setupRefs;
      const sceneController = sceneControllerRef.current;

      if (!refs || !sceneController || isPipelineCanceled) {
        return;
      }

      runInContext(() => {
        if (!isPipelineCanceled) {
          gsap.set(refs.mediaFrame, {
            scale: 1.06,
            xPercent: window.matchMedia("(min-width: 768px) and (max-width: 1023px)")
              .matches
              ? 0
              : 12,
            yPercent: 4,
            rotateX: 7,
            rotateY: -5,
          });
          currentStepIndexRef.current = 0;
          sceneController.primeInitialScene();
        }
      });

      queueNextFrame(applyInitialChipBatches);
    };

    const collectRefsAndCreateController = () => {
      setupRefs = readSetupRefs();

      if (!setupRefs || isPipelineCanceled) {
        return;
      }

      const refs = setupRefs;

      ctx = gsap.context(() => {}, refs.section);

      runInContext(() => {
        sceneControllerRef.current = createTechStackSceneController({
          pinned: refs.pinned,
          intro: refs.intro,
          outro: refs.outro,
          chips: chipsRef.current,
          chipGroups: chipGroupsRef.current,
          refs: dom,
          setHighlightedCategory,
          setCurrentStoryStep,
        });
      });

      queueNextPhase(applyInitialScene);
    };

    const startSetupPipeline = () => {
      if (isPipelineCanceled) {
        return;
      }

      cancelQueuedPhase();
      animationFrameId = window.requestAnimationFrame(() => {
        animationFrameId = null;
        queueNextPhase(collectRefsAndCreateController);
      });
    };

    const cancelScheduledSetup = scheduleDesktopStorySetup({
      target: section,
      setup: startSetupPipeline,
    });

    return () => {
      cancelScheduledSetup();
      cancelPipeline();
      mm?.revert();
      mm = null;
      resetStoryEffects();
      ctx?.revert();
      ctx = null;
    };
  }, [dom, enabled, setCurrentStoryStep, setHighlightedCategory]);

  useTechStackLayoutSync({
    chips,
    chipGroups,
    sceneControllerRef,
    currentStepIndexRef,
    hasSyncedLayoutRef,
  });

  const handleSelectStoryStep = (index: number) => {
    const trigger = desktopScrollTriggerRef.current;
    const timeline = desktopTimelineRef.current;
    const targetStep = storyStepDefsRef.current[index];

    if (!trigger || !timeline || !targetStep) {
      return;
    }

    const targetY = getStableStepScrollTarget(trigger, timeline, index);

    scrollTweenRef.current?.kill();
    clearUrlHash();
    scrollTweenRef.current = gsap.to(window, {
      duration: 0.55,
      ease: "power3.inOut",
      scrollTo: {
        y: targetY,
        autoKill: false,
      },
      overwrite: "auto",
      onComplete: () => {
        scrollTweenRef.current = null;
      },
      onInterrupt: () => {
        scrollTweenRef.current = null;
      },
    });
  };

  return {
    handleSelectStoryStep,
  };
}
