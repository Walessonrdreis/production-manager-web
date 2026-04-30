import { z } from 'zod';

/**
 * Schema de validação para o Produto vindo da API Omie.
 * Pilar: Zod-First na Infra.
 */
export const OmieProductSchema = z.object({
  id: z.union([z.string(), z.number()]).optional().transform(val => val ? String(val) : undefined),
  codigo_produto: z.union([z.string(), z.number()]).optional().transform(val => val ? String(val) : undefined),
  codigo: z.string().optional(),
  descricao: z.string().optional().default('Sem descrição'),
  familia: z.string().optional(),
  descricao_familia: z.string().optional(),
  unidade: z.string().optional().default('UN'),
  valor_unitario: z.number().optional().default(0),
  estoque: z.number().optional().default(0),
  stockQuantity: z.number().optional().default(0),
  omieCode: z.union([z.string(), z.number()]).optional().transform(val => val ? String(val) : undefined),
}).passthrough();

export type OmieProduct = z.infer<typeof OmieProductSchema>;

/**
 * Valida uma lista de produtos da API.
 */
export const validateOmieProducts = (data: unknown) => {
  return z.array(OmieProductSchema).safeParse(data);
};
