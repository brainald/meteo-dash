import { z } from "zod";
import { readWeatherSearch } from "../utils/sessionStorageManager";

export const regionWeatherSearchStorageKey = "region-weather-search";
const regionWeatherSearchValuesSchema = z.object({
  region: z.string(),
  startDate: z.iso.date(),
  endDate: z.iso.date(),
  page: z.coerce.number().int().positive(),
  limit: z.coerce.number().int().min(1).max(100),
  offset: z.coerce.number().int().nonnegative(),
});

function getSavedRegionWeatherSearch() {
  return readWeatherSearch(
    regionWeatherSearchStorageKey,
    regionWeatherSearchValuesSchema,
  );
}

export const defaultRegionWeatherSearch = {
  region: "Dunántúl",
  startDate: "2023-12-01",
  endDate: "2023-12-31",
  page: 1,
  limit: 10,
  offset: 0,
} as const;

export const regionWeatherSearchSchema = z.object({
  region: regionWeatherSearchValuesSchema.shape.region.default(
    getSavedRegionWeatherSearch()?.region ?? defaultRegionWeatherSearch.region,
  ),
  startDate: regionWeatherSearchValuesSchema.shape.startDate.default(
    getSavedRegionWeatherSearch()?.startDate ??
      defaultRegionWeatherSearch.startDate,
  ),
  endDate: regionWeatherSearchValuesSchema.shape.endDate.default(
    getSavedRegionWeatherSearch()?.endDate ??
      defaultRegionWeatherSearch.endDate,
  ),
  page: regionWeatherSearchValuesSchema.shape.page.default(
    getSavedRegionWeatherSearch()?.page ?? defaultRegionWeatherSearch.page,
  ),
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(100)
    .default(
      getSavedRegionWeatherSearch()?.limit ?? defaultRegionWeatherSearch.limit,
    ),
  offset: regionWeatherSearchValuesSchema.shape.offset.default(
    getSavedRegionWeatherSearch()?.offset ?? defaultRegionWeatherSearch.offset,
  ),
});

export type RegionWeatherSearch = z.infer<typeof regionWeatherSearchSchema>;
