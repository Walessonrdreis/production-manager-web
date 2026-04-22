import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../services/api/client';
import { ENDPOINTS } from '../../services/api/endpoints';

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

function normalizeOrder(raw: any): Order {
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

export function useOrders() {
  const ordersQuery = useQuery({
    queryKey: ['orders'],
    queryFn: async (): Promise<Order[]> => {
      const response = await apiClient.get(ENDPOINTS.ORDERS.BASE);
      const res = response.data;
      
      console.log('Orders API Raw Response:', res);
      
      let rawOrders: any[] = [];

      // Função auxiliar para encontrar o primeiro array significativo no objeto
      function findOrdersArray(obj: any, depth = 0): any[] | null {
        if (depth > 4) return null; // Prevenção de loop infinito e excesso de profundidade
        if (Array.isArray(obj)) return obj;
        if (!obj || typeof obj !== 'object') return null;

        // Tenta chaves conhecidas primeiro por performance
        const priorityKeys = ['data', 'orders', 'items', 'registros', 'ordens_venda', 'rows', 'registers'];
        for (const key of priorityKeys) {
          if (Array.isArray(obj[key])) return obj[key];
        }

        // Busca exaustiva em todas as chaves
        for (const key in obj) {
          const value = obj[key];
          if (Array.isArray(value)) return value;
          
          // Se for um objeto, desce um nível
          if (value && typeof value === 'object') {
            const nested = findOrdersArray(value, depth + 1);
            if (nested) return nested;
          }
        }
        return null;
      }

      rawOrders = findOrdersArray(res) || [];
      
      console.log(`Found ${rawOrders.length} orders after search.`);
      if (rawOrders.length > 0) {
        console.log('First order sample:', rawOrders[0]);
      } else {
        console.warn('Could not find orders array in response structure.');
      }

      return rawOrders.map(normalizeOrder);
    },
    // Sincronização automática a cada 30 minutos (30 * 60 * 1000)
    refetchInterval: 1000 * 60 * 30,
    // Garante que o intervalo continue funcionando mesmo quando a janela não está em foco
    refetchIntervalInBackground: true,
    // Aumentamos o staleTime para 30 minutos. 
    // Assim, ao reiniciar o sistema, se houver dados no cache (persistido no localStorage)
    // que tenham menos de 30 minutos, o React Query usará o cache em vez de fazer nova requisição.
    staleTime: 1000 * 60 * 30,
  });

  return {
    orders: ordersQuery.data || [],
    isLoading: ordersQuery.isLoading,
    isError: ordersQuery.isError,
    error: ordersQuery.error,
    refetchOrders: ordersQuery.refetch,
  };
}
