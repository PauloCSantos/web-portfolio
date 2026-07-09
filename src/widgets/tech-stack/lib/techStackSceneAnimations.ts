import { gsap } from "gsap";
import type { HorizontalCloudMetrics, TechStackChipBinding } from "./techStackSceneDom";

const CLOUD_CHIPS_PER_LANE = 4;
const MAX_MOVING_CLOUD_CHIPS = 24;

export function clearChipVisual(binding: TechStackChipBinding) {
  gsap.killTweensOf(binding.node);
  gsap.killTweensOf(binding.pill);
}

function setChipVisualMode(
  binding: TechStackChipBinding,
  mode: "hidden" | "orbit" | "stack",
) {
  binding.node.dataset.chipVisual = mode;
}

export function setChipHiddenBase(binding: TechStackChipBinding) {
  clearChipVisual(binding);
  setChipVisualMode(binding, "hidden");

  gsap.set(binding.node, {
    x: 0,
    y: 0,
    xPercent: binding.chip.organizedDesktopX,
    yPercent: binding.chip.organizedDesktopY,
    autoAlpha: 0,
    pointerEvents: "none",
  });

  if (binding.pill) {
    gsap.set(binding.pill, {
      opacity: 0,
      scale: 0.92,
    });
  }
}

export function animateChipToOrbit(
  binding: TechStackChipBinding,
  immediate: boolean,
  visibleIndex: number,
  metrics: HorizontalCloudMetrics,
) {
  clearChipVisual(binding);
  setChipVisualMode(binding, "orbit");

  const laneIndex = Math.floor(visibleIndex / CLOUD_CHIPS_PER_LANE);
  const columnIndex = visibleIndex % CLOUD_CHIPS_PER_LANE;
  const laneCount = Math.ceil(MAX_MOVING_CLOUD_CHIPS / CLOUD_CHIPS_PER_LANE);
  const usableHeight = Math.max(0, metrics.maxY - metrics.minY);
  const baseGap = laneCount > 1 ? usableHeight / (laneCount - 1) : 0;
  const alternateOffset = ((columnIndex + laneIndex) % 3) * metrics.laneOffset;
  const laneY = gsap.utils.clamp(
    metrics.minY,
    metrics.maxY,
    metrics.minY + laneIndex * baseGap + alternateOffset,
  );
  const reentryDistance = Math.max(0, metrics.speed * metrics.reentryDelay);
  const wrapMin = -reentryDistance;
  const wrapMax = metrics.width + metrics.overflow;
  const travelSpan = wrapMax - wrapMin;
  const initialX = gsap.utils.wrap(
    wrapMin,
    wrapMax,
    wrapMin +
      columnIndex * metrics.chipSpacing +
      (laneIndex % 2) * (metrics.chipSpacing * 0.5),
  );
  const duration = Math.max(8, travelSpan / metrics.speed);
  const wrapX = gsap.utils.wrap(wrapMin, wrapMax);

  gsap.set(binding.node, {
    xPercent: 0,
    yPercent: 0,
    x: initialX,
    y: laneY,
    autoAlpha: immediate ? 0 : 1,
    pointerEvents: "none",
  });

  if (immediate) {
    if (binding.pill) {
      gsap.set(binding.pill, {
        opacity: 0,
        scale: 1,
      });
    }

    return;
  }

  gsap.to(binding.node, {
    x: `+=${travelSpan}`,
    duration,
    ease: "none",
    repeat: -1,
    modifiers: {
      x: (value) => `${wrapX(Number.parseFloat(value))}px`,
    },
    overwrite: "auto",
  });

  if (binding.pill) {
    gsap.to(binding.pill, {
      opacity: 1,
      scale: 1,
      duration: 0.32,
      ease: "power2.out",
      overwrite: "auto",
    });
  }
}

export function animateChipToStack(binding: TechStackChipBinding, immediate: boolean) {
  clearChipVisual(binding);
  setChipVisualMode(binding, "stack");

  if (immediate) {
    gsap.set(binding.node, {
      x: 0,
      y: 0,
      xPercent: binding.chip.stackedDesktopX,
      yPercent: binding.chip.stackedDesktopY,
      autoAlpha: 1,
    });

    if (binding.pill) {
      gsap.set(binding.pill, {
        opacity: 1,
        scale: 1,
      });
    }

    return;
  }

  gsap.to(binding.node, {
    x: 0,
    y: 0,
    xPercent: binding.chip.stackedDesktopX,
    yPercent: binding.chip.stackedDesktopY,
    autoAlpha: 1,
    duration: immediate ? 0 : 0.56,
    ease: "power3.inOut",
    overwrite: "auto",
  });

  if (binding.pill) {
    gsap.to(binding.pill, {
      opacity: 1,
      scale: 1,
      duration: immediate ? 0 : 0.32,
      ease: "power2.out",
      overwrite: "auto",
    });
  }
}

export function animateChipToHidden(binding: TechStackChipBinding, immediate: boolean) {
  if (immediate) {
    setChipHiddenBase(binding);
    return;
  }

  clearChipVisual(binding);

  gsap.to(binding.node, {
    x: 0,
    y: 0,
    xPercent: binding.chip.organizedDesktopX,
    yPercent: binding.chip.organizedDesktopY,
    autoAlpha: 0,
    duration: immediate ? 0 : 0.34,
    ease: "power2.out",
    overwrite: "auto",
  });

  if (binding.pill) {
    gsap.to(binding.pill, {
      opacity: 0,
      scale: 0.92,
      duration: immediate ? 0 : 0.28,
      ease: "power2.out",
      overwrite: "auto",
    });
  }
}
