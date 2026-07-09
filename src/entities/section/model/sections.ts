export const SECTION_IDS = {
  hero: "hero",
  about: "about",
  stack: "stack",
  education: "education",
  work: "work",
  contact: "contact",
} as const;

export type SectionId = (typeof SECTION_IDS)[keyof typeof SECTION_IDS];

export const SECTION_ORDER: SectionId[] = [
  SECTION_IDS.hero,
  SECTION_IDS.about,
  SECTION_IDS.stack,
  SECTION_IDS.education,
  SECTION_IDS.work,
  SECTION_IDS.contact,
];
