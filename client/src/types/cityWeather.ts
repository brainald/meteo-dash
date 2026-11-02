import { z } from "zod";
import { paginationSchema } from "./pagination";
import { weatherSummarySchema } from "./weatherSummary";

export const cityWeatherRecordSchema = z.object({
  date: z.iso.date(),
  minTemp: z.number(),
  maxTemp: z.number(),
  averageTemp: z.number(),
  precipitation: z.number(),
});

export const cityWeatherSchema = paginationSchema.extend({
  data: z.array(cityWeatherRecordSchema),
  summary: weatherSummarySchema,
});

export type CityWeatherRecord = z.infer<typeof cityWeatherRecordSchema>;
export type CityWeatherResponse = z.infer<typeof cityWeatherSchema>;
