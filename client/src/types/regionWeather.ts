import { z } from "zod";
import { paginationSchema } from "./pagination";
import { weatherSummarySchema } from "./weatherSummary";

export const regionWeatherRecordSchema = z.object({
  date: z.iso.date(),
  minTemp: z.number(),
  maxTemp: z.number(),
  averageTemp: z.number(),
  precipitation: z.number(),
});

export const regionWeatherSchema = paginationSchema.extend({
  data: z.array(regionWeatherRecordSchema),
  summary: weatherSummarySchema,
});

export type RegionWeatherRecord = z.infer<typeof regionWeatherRecordSchema>;
export type RegionWeatherResponse = z.infer<typeof regionWeatherSchema>;
