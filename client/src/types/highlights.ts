import { z } from "zod";

export const cityCountSchema = z.object({
  count: z.number().int().nonnegative(),
});

export const regionCountSchema = z.object({
  count: z.number().int().nonnegative(),
});

export const highestTemperatureSchema = z
  .object({
    temperature: z.number(),
    city: z.string().min(1),
    date: z.iso.date(),
  })
  .nullable();

export type HighestTemperature = z.infer<typeof highestTemperatureSchema>;
