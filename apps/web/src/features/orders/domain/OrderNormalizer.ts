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
  customerId?: string; // ID local do cliente se identificado
  isLocalCustomer?: boolean;
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
  const rawItems = Array.isArray(raw.items) 
    ? raw.items 
    : (Array.isArray(raw.detalhe?.itens) ? raw.detalhe.itens : []);

  // Normalizar itens para garantir nomes de campos consistentes
  const items = rawItems.map((item: any) => ({
    omieItemCode: String(item.product?.sku || item.product?.productId || item.codigo_produto || item.omieItemCode || ''),
    description: item.product?.description || item.descricao || item.description || 'Item sem descrição',
    quantity: Number(item.quantity || item.quantidade || 0),
    unit: item.product?.unit || item.unidade || item.unit || 'UN'
  }));

  return {
    id: String(raw.order?.omieCode || raw.omieCode || raw.id || raw.codigo_pedido || Math.random().toString()),
    orderNumber: raw.order?.orderNumber || raw.numeroPedido || raw.orderNumber || raw.order_number || raw.numero_pedido || 'N/A',
    customerName: raw.client?.tradeName || raw.client?.legalName || raw.customerName || raw.customer_name || raw.cliente || raw.nome_cliente || 'Cliente Omie',
    customerId: raw.client?.omieClientCode ? String(raw.client.omieClientCode) : (raw.customer_id ? String(raw.customer_id) : (raw.customerId ? String(raw.customerId) : (raw.cabecalho?.codigo_cliente ? String(raw.cabecalho.codigo_cliente) : undefined))),
    items,
    status: raw.order ? (raw.order.cancelled ? 'Cancelado' : raw.order.closed ? 'Encerrado' : 'Ativo') : (raw.status || (raw.cancelado === 'Y' ? 'Cancelado' : raw.encerrado === 'Y' ? 'Encerrado' : 'Ativo')),
    etapa: raw.order?.stage || raw.etapa || raw.status || raw.cabecalho?.etapa || '20',
    cancelado: raw.order ? (raw.order.cancelled ? 'Y' : 'N') : (raw.cancelado || 'N'),
    encerrado: raw.order ? (raw.order.closed ? 'Y' : 'N') : (raw.encerrado || 'N'),
    createdAt: raw.order?.expectedDate || raw.lastSyncAt || raw.createdAt || raw.created_at || new Date().toISOString(),
    dataPrevisao: raw.order?.expectedDate || raw.dataPrevisao || raw.created_at || raw.cabecalho?.data_previsao || '',
    lastSyncAt: raw.lastSyncAt || raw.updated_at || ''
  };
}
