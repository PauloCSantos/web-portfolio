import type { CSSProperties } from "react";
import type { TechChip } from "./chipPlacement";
import {
  buildColumnsAndChips,
  computeDesktopCategoryX,
} from "./chipPlacement";
import {
  CATEGORY_KEYS,
  TECH_STACK_ORBIT_SPEED_MULTIPLIER,
} from "./layoutTokens";

type VarStyle = CSSProperties & Record<`--${string}`, string>;

export { buildColumnsAndChips, CATEGORY_KEYS, computeDesktopCategoryX };
export type { CategoryColumn, TechChip } from "./chipPlacement";
export type { CategoryKey } from "./layoutTokens";

export function chipVars(chip: TechChip, total: number): VarStyle {
  const i = chip.globalIndex;
  const angle = (i / Math.max(total, 1)) * Math.PI * 2 + chip.categoryIndex * 0.55;
  const radiusX = 24 + ((i * 7) % 14);
  const radiusY = 16 + ((i * 5) % 10);
  const floatX = 50 + Math.cos(angle) * radiusX;
  const floatY = 47 + Math.sin(angle * 1.27) * radiusY;
  const floatZ = -110 + ((i * 37) % 220);
  const rotX = -8 + ((i * 3) % 17);
  const rotY = -12 + ((i * 5) % 25);

  return {
    "--x": `${floatX}%`,
    "--y": `${floatY}%`,
    "--z": `${floatZ}px`,
    "--rx": `${rotX}deg`,
    "--ry": `${rotY}deg`,
    "--ox": `${chip.organizedDesktopX}%`,
    "--oy": `${chip.organizedDesktopY}%`,
    "--fx": `${chip.focusDesktopX}%`,
    "--fy": `${chip.focusDesktopY}%`,
    "--ox-mobile": `${chip.organizedMobileX}%`,
    "--oy-mobile": `${chip.organizedMobileY}%`,
    "--fx-mobile": `${chip.focusMobileX}%`,
    "--fy-mobile": `${chip.focusMobileY}%`,
    "--dur": `${(4.8 + (i % 7) * 0.7) / TECH_STACK_ORBIT_SPEED_MULTIPLIER}s`,
    "--delay": `${((i * 173) % 900) / 1000}s`,
    "--sphere-radius": `${chip.sphereRadiusPx}px`,
    "--sphere-seed-rx": `${chip.sphereSeedRotateXDeg}deg`,
    "--sphere-seed-ry": `${chip.sphereSeedRotateYDeg}deg`,
    "--sphere-tilt": `${chip.sphereOrbitTiltDeg}deg`,
    "--sphere-phase": `${chip.sphereOrbitPhaseTurn}turn`,
  };
}
