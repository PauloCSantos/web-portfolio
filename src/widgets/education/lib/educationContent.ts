import type { TFunction } from "i18next";
import {
  hasStringArrayField,
  hasStringFields,
  isRecord,
  resolveTranslatedArray,
} from "@shared/lib/i18n";
import type { EducationItem } from "../model/types";

function isEducationItem(value: unknown): value is EducationItem {
  if (!isRecord(value)) {
    return false;
  }

  return (
    hasStringFields(value, [
      "id",
      "degree",
      "course",
      "institution",
      "status",
      "emphasis",
    ]) && hasStringArrayField(value, "proofPoints")
  );
}

export function resolveEducationItems(t: TFunction): EducationItem[] {
  return resolveTranslatedArray(t, "items", isEducationItem);
}
