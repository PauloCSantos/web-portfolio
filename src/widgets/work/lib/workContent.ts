import type { TFunction } from "i18next";
import {
  hasStringArrayField,
  hasStringFields,
  isRecord,
  resolveTranslatedArray,
} from "@shared/lib/i18n";
import type { WorkItem } from "../model/types";

function isWorkItem(value: unknown): value is WorkItem {
  if (!isRecord(value)) {
    return false;
  }

  return (
    hasStringFields(value, [
      "id",
      "company",
      "role",
      "period",
      "context",
      "decision",
      "impact",
    ]) &&
    hasStringArrayField(value, "evidence") &&
    hasStringArrayField(value, "stack")
  );
}

export function resolveWorkItems(t: TFunction): WorkItem[] {
  return resolveTranslatedArray(t, "items", isWorkItem);
}
