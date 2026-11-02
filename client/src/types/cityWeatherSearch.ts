import { z } from "zod";

export const defaultCityWeatherSearch = {
  cityId: 1,
  startDate: "2023-12-01",
  endDate: "2023-12-31",
  page: 1,
  limit: 10,
  offset: 0,
} as const;

export const cityWeatherSearchSchema = z.object({
  cityId: z.coerce.number().int().positive().default(defaultCityWeatherSearch.cityId),
  startDate: z.iso.date().default(defaultCityWeatherSearch.startDate),
  endDate: z.iso.date().default(defaultCityWeatherSearch.endDate),
  page: z.coerce.number().int().positive().default(defaultCityWeatherSearch.page),
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(100)
    .default(defaultCityWeatherSearch.limit),
  offset: z.coerce
    .number()
    .int()
    .nonnegative()
    .default(defaultCityWeatherSearch.offset),
});

export type CityWeatherSearch = z.infer<typeof cityWeatherSearchSchema>;
