export type AppLanguage = "pt-BR" | "en";
export function isAppLanguage(value: string): value is AppLanguage {
  return value === "pt-BR" || value === "en";
}

export function resolveAppLanguage(value?: string | null): AppLanguage {
  const normalized = (value ?? "").trim().toLowerCase();

  if (normalized === "en" || normalized.startsWith("en-")) {
    return "en";
  }

  if (normalized === "pt-br" || normalized.startsWith("pt-br")) {
    return "pt-BR";
  }

  return "en";
}
