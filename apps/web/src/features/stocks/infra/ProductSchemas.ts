import { z } from 'zod';

export const omieProductSchema = z.object({
  codigo_produto: z.number().optional(),
  codigo: z.string().optional(),
  descricao: z.string().optional(),
  familia: z.string().optional(),
  valor_unitario: z.number().optional().catch(0),
  estoque: z.number().optional().catch(0),
}).passthrough();

export const omieProductsResponseSchema = z.array(omieProductSchema);

export function validateOmieProducts(data: any): { success: boolean; data?: any; error?: any } {
  const result = omieProductsResponseSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: result.error };
}
