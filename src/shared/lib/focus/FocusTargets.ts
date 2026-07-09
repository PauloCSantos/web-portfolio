export const FocusTarget = {
  HeroTitle: "heroTitle",
  MenuStart: "menuStart",
} as const;

export type FocusTarget = (typeof FocusTarget)[keyof typeof FocusTarget];
