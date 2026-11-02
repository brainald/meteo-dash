import { z } from "zod";

export const cityWeatherRecordSchema = z.object({
  date: z.iso.date(),
  minTemp: z.number(),
  maxTemp: z.number(),
  averageTemp: z.number(),
  precipitation: z.number(),
});

export const cityWeatherSchema = z.array(cityWeatherRecordSchema);

export type CityWeatherRecord = z.infer<typeof cityWeatherRecordSchema>;
