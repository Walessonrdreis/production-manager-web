import { useQuery } from '@tanstack/react-query';
import { getOrders, Order, OrderItem } from '../../features/orders';

export type { Order, OrderItem };

export function useOrders() {
  const ordersQuery = useQuery({
    queryKey: ['orders'],
    queryFn: getOrders,
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
