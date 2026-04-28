export interface OrderItem {
  omieItemCode: string;
  description: string;
  quantity: string | number;
  unit: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  items: OrderItem[];
  status: string;
  etapa: string;
  cancelado: string;
  encerrado: string;
  createdAt: string;
  dataPrevisao: string;
  lastSyncAt: string;
}

export function findOrdersArray(obj: any, depth = 0): any[] | null {
  if (depth > 4) return null;
  if (Array.isArray(obj)) return obj;
  if (!obj || typeof obj !== 'object') return null;

  const priorityKeys = ['data', 'orders', 'items', 'registros', 'ordens_venda', 'rows', 'registers'];
  for (const key of priorityKeys) {
    if (Array.isArray(obj[key])) return obj[key];
  }

  for (const key in obj) {
    const value = obj[key];
    if (Array.isArray(value)) return value;
    if (value && typeof value === 'object') {
      const nested = findOrdersArray(value, depth + 1);
      if (nested) return nested;
    }
  }
  return null;
}

export function normalizeOrder(raw: any): Order {
  return {
    id: raw.omieCode || raw.id || raw._id || Math.random().toString(),
    orderNumber: raw.numeroPedido || raw.orderNumber || raw.numero_pedido || 'N/A',
    customerName: raw.customerName || raw.cliente || raw.nome_cliente || 'Cliente Omie',
    items: Array.isArray(raw.items) ? raw.items : [],
    status: raw.status || (raw.cancelado === 'Y' ? 'Cancelado' : raw.encerrado === 'Y' ? 'Encerrado' : 'Ativo'),
    etapa: raw.etapa || '20',
    cancelado: raw.cancelado || 'N',
    encerrado: raw.encerrado || 'N',
    createdAt: raw.lastSyncAt || raw.createdAt || new Date().toISOString(),
    dataPrevisao: raw.dataPrevisao || '',
    lastSyncAt: raw.lastSyncAt || ''
  };
}
