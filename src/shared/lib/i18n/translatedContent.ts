import type { TFunction } from "i18next";

export function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function hasStringFields(
  record: Record<string, unknown>,
  fields: readonly string[],
) {
  return fields.every((field) => typeof record[field] === "string");
}

export function hasStringArrayField(
  record: Record<string, unknown>,
  field: string,
) {
  const value = record[field];

  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

export function resolveTranslatedArray<TItem>(
  t: TFunction,
  key: string,
  isItem: (value: unknown) => value is TItem,
) {
  const rawItems = t(key, { returnObjects: true }) as unknown;

  return Array.isArray(rawItems) ? rawItems.filter(isItem) : [];
}
