export const CATEGORY_KEYS = [
  "languages",
  "architectures",
  "devops",
  "ai",
  "extras",
] as const;

export type CategoryKey = (typeof CATEGORY_KEYS)[number];

export const DEFAULT_DESKTOP_CATEGORY_X = [12, 31, 50, 69, 88];
export const MOBILE_CATEGORY_X = [30, 70];
export const MOBILE_CATEGORY_HEADER_Y = [10, 10, 38, 38, 66];
export const MOBILE_CATEGORY_ITEMS_START_Y = [18, 18, 46, 46, 74];
export const DESKTOP_CATEGORY_HEADER_Y = 13;
export const DESKTOP_ITEMS_END_Y = 86;
export const MOBILE_ITEMS_END_Y = [40, 40, 68, 68, 96];
export const FOCUS_DESKTOP_COLUMN_X = 50;
export const FOCUS_MOBILE_COLUMN_X = 50;
export const FOCUS_DESKTOP_CENTER_Y = 54;
export const FOCUS_MOBILE_CENTER_Y = 48;
export const FOCUS_DESKTOP_LABEL_X = 50;
export const FOCUS_DESKTOP_LABEL_Y = 16;
export const STACK_DESKTOP_COLUMN_X = 50;
export const STACK_DESKTOP_TITLE_Y = 20;
export const STACK_DESKTOP_ITEMS_START_Y = 34;
export const STACK_DESKTOP_ITEMS_END_Y = 77;
export const FOCUS_MOBILE_LABEL_X = 50;
export const FOCUS_MOBILE_LABEL_Y = 14;
export const ORGANIZE_SETTLE_MS = 180;
export const DESKTOP_CATEGORY_COUNT = 5;
export const CHIP_SAFE_HALF_PX = 136;
export const TECH_STACK_ORBIT_SPEED_MULTIPLIER = 3.2;
