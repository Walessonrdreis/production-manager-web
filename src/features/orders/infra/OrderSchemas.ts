import { z } from 'zod';

/**
 * Schema para item de pedido da Omie.
 */
export const OmieOrderItemSchema = z.object({
  id_item: z.union([z.string(), z.number()]).optional(),
  codigo: z.string().optional(),
  descricao: z.string().optional(),
  quantidade: z.union([z.string(), z.number()]).optional().default(0),
  unidade: z.string().optional().default('UN'),
  valor_unitario: z.number().optional().default(0),
});

/**
 * Schema para pedido vindo da API Omie.
 * Pilar: Zod-First na Infra.
 */
export const OmieOrderSchema = z.object({
  codigo_pedido: z.union([z.string(), z.number()]).optional().transform(val => val ? String(val) : undefined),
  numero_pedido: z.string().optional().default('N/A'),
  cabecalho: z.object({
    codigo_cliente: z.number().optional(),
    data_previsao: z.string().optional(),
    etapa: z.string().optional().default('20'),
  }).optional(),
  cliente: z.string().optional().default('Cliente Omie'),
  detalhe: z.object({
    itens: z.array(OmieOrderItemSchema).optional().default([]),
  }).optional(),
  status: z.string().optional(),
  cancelado: z.string().optional().default('N'),
  encerrado: z.string().optional().default('N'),
  // Aliases e campos extras que o normalizer pode usar
  omieCode: z.union([z.string(), z.number()]).optional(),
  id: z.union([z.string(), z.number()]).optional(),
  numeroPedido: z.string().optional(),
  nome_cliente: z.string().optional(),
  items: z.array(z.any()).optional(),
}).passthrough();

export type OmieOrder = z.infer<typeof OmieOrderSchema>;

/**
 * Valida uma lista de pedidos da API.
 */
export const validateOmieOrders = (data: unknown) => {
  return z.array(OmieOrderSchema).safeParse(data);
};
