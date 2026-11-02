import { z } from "zod";

export const paginationSchema = z.object({
  page: z.number().int().positive(),
  limit: z.number().int().positive().max(100),
  offset: z.number().int().nonnegative(),
  total: z.number().int().nonnegative(),
});

export type Pagination = z.infer<typeof paginationSchema>;

export type PaginatedResponse<T> = Pagination & Readonly<{ data: T[] }>;
