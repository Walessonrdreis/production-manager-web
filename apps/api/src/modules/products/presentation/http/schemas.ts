import { z } from 'zod';

export const SyncProductsSchema = z.object({
  query: z.object({
    limit: z.coerce.number().int().min(1).max(5000).optional().default(1000)
  })
});
