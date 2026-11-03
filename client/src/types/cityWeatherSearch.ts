import { z } from "zod";
import { readWeatherSearch } from "../utils/sessionStorageManager";

export const cityWeatherSearchStorageKey = "city-weather-search";
const cityWeatherSearchValuesSchema = z.object({
  cityId: z.coerce.number().int().positive(),
  startDate: z.iso.date(),
  endDate: z.iso.date(),
  page: z.coerce.number().int().positive(),
  limit: z.coerce.number().int().min(1).max(100),
  offset: z.coerce.number().int().nonnegative(),
});

function getSavedCityWeatherSearch() {
  return readWeatherSearch(
    cityWeatherSearchStorageKey,
    cityWeatherSearchValuesSchema,
  );
}

export const defaultCityWeatherSearch = {
  cityId: 1,
  startDate: "2023-12-01",
  endDate: "2023-12-31",
  page: 1,
  limit: 10,
  offset: 0,
} as const;

export const cityWeatherSearchSchema = z.object({
  cityId: cityWeatherSearchValuesSchema.shape.cityId.default(
    () =>
      getSavedCityWeatherSearch()?.cityId ?? defaultCityWeatherSearch.cityId,
  ),
  startDate: cityWeatherSearchValuesSchema.shape.startDate.default(
    () =>
      getSavedCityWeatherSearch()?.startDate ??
      defaultCityWeatherSearch.startDate,
  ),
  endDate: cityWeatherSearchValuesSchema.shape.endDate.default(
    () =>
      getSavedCityWeatherSearch()?.endDate ?? defaultCityWeatherSearch.endDate,
  ),
  page: cityWeatherSearchValuesSchema.shape.page.default(
    () => getSavedCityWeatherSearch()?.page ?? defaultCityWeatherSearch.page,
  ),
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(100)
    .default(
      () =>
        getSavedCityWeatherSearch()?.limit ?? defaultCityWeatherSearch.limit,
    ),
  offset: cityWeatherSearchValuesSchema.shape.offset.default(
    () =>
      getSavedCityWeatherSearch()?.offset ?? defaultCityWeatherSearch.offset,
  ),
});

export type CityWeatherSearch = z.infer<typeof cityWeatherSearchSchema>;
