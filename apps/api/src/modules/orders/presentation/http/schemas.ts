import { z } from 'zod';

export const SyncOrdersSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).optional().default(1),
    pageSize: z.coerce.number().int().min(1).max(5000).optional().default(500)
  })
});
