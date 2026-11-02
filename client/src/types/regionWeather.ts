import { z } from "zod";

export const regionWeatherRecordSchema = z.object({
  date: z.iso.date(),
  minTemp: z.number(),
  maxTemp: z.number(),
  averageTemp: z.number(),
  precipitation: z.number(),
});

export const regionWeatherSchema = z.array(regionWeatherRecordSchema);

export type RegionWeatherRecord = z.infer<typeof regionWeatherRecordSchema>;
