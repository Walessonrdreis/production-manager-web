import { Product } from '../../../types/api';

/**
 * Heurística para encontrar o total de registros na resposta da API
 */
export function findMetaTotal(obj: any, depth = 0): number | null {
  if (!obj || typeof obj !== 'object' || depth > 4) return null;
  if (obj.meta && typeof obj.meta.total === 'number') return obj.meta.total;
  
  const totalKeys = ['total_registros', 'totalItems', 'total', 'total_itens', 'count_total'];
  for (const key of totalKeys) {
    if (typeof obj[key] === 'number' && obj[key] > 0) return obj[key];
  }
  for (const key in obj) {
    const found = findMetaTotal(obj[key], depth + 1);
    if (found !== null) return found;
  }
  return null;
}

/**
 * Heurística para encontrar o array de dados na resposta da API
 */
export function findArray(obj: any, depth = 0): any[] | null {
  if (Array.isArray(obj)) return obj;
  if (!obj || typeof obj !== 'object' || depth > 3) return null;
  const keys = ['data', 'products', 'records', 'registros', 'items', 'registros_produto', 'obj', 'rows'];
  for (const key of keys) {
    if (Array.isArray(obj[key])) return obj[key];
  }
  for (const key in obj) {
    const f = findArray(obj[key], depth + 1);
    if (f) return f;
  }
  return null;
}

/**
 * Normaliza um produto bruto da API para o formato de domínio
 */
export function normalizeProduct(p: any): Product {
  return {
    id: String(p.omieCode || p.id || p.codigo_produto || ''),
    code: String(p.codigo || p.code || ''),
    description: String(p.descricao || p.description || p.descr_detalhada || 'Sem descrição'),
    family: String(p.descricao_familia || p.familyDescription || p.familia || p.family || ''),
    stock: Number(p.stockQuantity || p.estoque || p.stock || 0),
    price: Number(p.valor_unitario || p.price || 0),
    unit: String(p.unidade || p.unit || 'UN'),
    sectorId: p.sectorId
  };
}
