import { z } from 'zod';

export const SyncClientsSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).optional().default(1),
    pageSize: z.coerce.number().int().min(1).max(10000).optional().default(5000)
  })
});
