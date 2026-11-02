import { z } from "zod";

export const cityOptionSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  region: z.string().min(1),
});

export const cityOptionsSchema = z.array(cityOptionSchema);
export const regionOptionsSchema = z.array(z.string().min(1));

export type CityOption = z.infer<typeof cityOptionSchema>;
