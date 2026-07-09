import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { STORY_STEP_KEYS } from "../model/storyScene";

export function getStableStepScrollTarget(
  trigger: ScrollTrigger,
  timeline: gsap.core.Timeline,
  index: number,
) {
  const stepKey = STORY_STEP_KEYS[index];

  if (!stepKey) {
    return trigger.start;
  }

  const currentTime = timeline.labels[stepKey];

  if (typeof currentTime !== "number") {
    return trigger.labelToScroll(stepKey);
  }

  const nextStepKey = STORY_STEP_KEYS[index + 1];
  const nextTime =
    (nextStepKey ? timeline.labels[nextStepKey] : undefined) ?? timeline.duration();
  const clampedNextTime = Math.max(currentTime, nextTime);

  let targetTime = currentTime;

  if (index > 0 && index < STORY_STEP_KEYS.length - 1) {
    targetTime = currentTime + (clampedNextTime - currentTime) * 0.5;
  }

  const duration = Math.max(timeline.duration(), 0.0001);
  const progress = gsap.utils.clamp(0, 1, targetTime / duration);

  return gsap.utils.interpolate(trigger.start, trigger.end, progress);
}

export function clearUrlHash() {
  if (typeof window === "undefined" || !window.location.hash) {
    return;
  }

  const cleanUrl = `${window.location.pathname}${window.location.search}`;
  window.history.replaceState(window.history.state, "", cleanUrl);
}
