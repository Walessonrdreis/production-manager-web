export class OrderMapper {
  static toDomain(raw: any) {
    const o = raw.order || {};
    const c = raw.client || {};
    const id = o.omieCode || raw.omieCode || raw.id;
    const totalValue = Array.isArray(raw.items) 
      ? raw.items.reduce((acc: number, cur: any) => acc + (Number(cur.totalPrice) || 0), 0)
      : 0;
      
    return {
      id,
      order_number: o.orderNumber || raw.numeroPedido || raw.order_number || id,
      customer_name: c.tradeName || c.legalName || raw.tradeName || raw.client?.tradeName || raw.client?.legalName || raw.customer?.tradeName || raw.customer?.legalName || raw.nome_fantasia || raw.razao_social || raw.cliente || raw.cliente?.nome_fantasia || raw.customerName || 'N/A',
      customer_id: c.omieClientCode || raw.customerId || raw.customer_id || null,
      status: o.stage || raw.etapa || raw.status || '20',
      total_value: totalValue || raw.total_value || 0,
      items: raw.items || [],
      created_at: o.expectedDate || raw.created_at || new Date().toISOString(),
      updated_at: raw.lastSyncAt || raw.updated_at || new Date().toISOString()
    };
  }
}
