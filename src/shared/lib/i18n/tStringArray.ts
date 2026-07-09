import type { TFunction, TOptions } from "i18next";

type Options = Omit<TOptions, "returnObjects" | "defaultValue"> & {
  defaultValue?: string[];
};

function isStringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) &&
    value.every((item): item is string => typeof item === "string")
  );
}

export function tStringArray(t: TFunction, key: string, options?: Options): string[] {
  const { defaultValue, ...tOptions } = options ?? {};

  const value = t(key, { ...tOptions, returnObjects: true }) as unknown;

  if (isStringArray(value)) {
    return value;
  }

  return defaultValue ?? [];
}
