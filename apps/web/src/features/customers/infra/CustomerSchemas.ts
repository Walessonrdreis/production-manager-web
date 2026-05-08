import { z } from 'zod';

export const CustomerSchema = z.object({
  id: z.string(),
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  document: z.string().optional(),
  email: z.string().email('E-mail inválido').optional().or(z.literal('')),
  phone: z.string().optional(),
  omieCode: z.string().optional(),
  updatedAt: z.string().optional().default(() => new Date().toISOString()),
}).passthrough();

export type CustomerInput = z.infer<typeof CustomerSchema>;
