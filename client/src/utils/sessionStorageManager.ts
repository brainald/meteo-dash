import { z } from "zod";

export function readWeatherSearch<T>(
  storageKey: string,
  schema: z.ZodType<T>,
): T | undefined {
  if (typeof window === "undefined") {
    return undefined;
  }

  const savedSearch = window.sessionStorage.getItem(storageKey);
  if (savedSearch === null) {
    return undefined;
  }

  let savedValue: unknown;
  try {
    savedValue = JSON.parse(savedSearch);
  } catch (error) {
    if (!(error instanceof SyntaxError)) {
      throw error;
    }

    window.sessionStorage.removeItem(storageKey);
    return undefined;
  }

  const parsedSearch = schema.safeParse(savedValue);
  if (parsedSearch.success) {
    return parsedSearch.data;
  }

  window.sessionStorage.removeItem(storageKey);
  return undefined;
}

export function saveWeatherSearch(
  storageKey: string,
  search: Record<string, unknown>,
): void {
  if (typeof window !== "undefined") {
    window.sessionStorage.setItem(storageKey, JSON.stringify(search));
  }
}
