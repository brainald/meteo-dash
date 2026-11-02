import { z } from "zod";

const weatherExtremeSchema = z
  .object({
    date: z.iso.date(),
    value: z.number(),
  })
  .nullable();

export const weatherSummarySchema = z.object({
  warmestDay: weatherExtremeSchema,
  coolestDay: weatherExtremeSchema,
  wettestDay: weatherExtremeSchema,
});

export type WeatherSummary = z.infer<typeof weatherSummarySchema>;
