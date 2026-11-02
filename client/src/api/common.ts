import type z from "zod";

export function getApiUrl(): string {
  const apiUrl = import.meta.env.VITE_API_URL;
  if (!apiUrl) {
    throw new Error("VITE_API_URL is not configured.");
  }
  return apiUrl;
}

export async function fetchData<T>(
  url: string,
  schema: z.ZodType<T>,
  signal: AbortSignal,
): Promise<T> {
  const response = await fetch(`${getApiUrl()}${url}`, { signal });
  if (!response.ok) {
    throw new Error(`Request failed (${response.status}): ${url}`);
  }

  return schema.parse(await response.json());
}
