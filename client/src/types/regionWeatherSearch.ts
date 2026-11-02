import { z } from "zod";

export const defaultRegionWeatherSearch = {
  region: "Dunántúl",
  startDate: "2023-12-01",
  endDate: "2023-12-31",
  page: 1,
  limit: 10,
  offset: 0,
} as const;

export const regionWeatherSearchSchema = z.object({
  region: z.string().default(defaultRegionWeatherSearch.region),
  startDate: z.iso.date().default(defaultRegionWeatherSearch.startDate),
  endDate: z.iso.date().default(defaultRegionWeatherSearch.endDate),
  page: z.coerce.number().int().positive().default(defaultRegionWeatherSearch.page),
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(100)
    .default(defaultRegionWeatherSearch.limit),
  offset: z.coerce
    .number()
    .int()
    .nonnegative()
    .default(defaultRegionWeatherSearch.offset),
});

export type RegionWeatherSearch = z.infer<typeof regionWeatherSearchSchema>;
