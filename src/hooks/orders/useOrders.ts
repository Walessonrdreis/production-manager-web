import { useQuery } from '@tanstack/react-query';
import { getOrders, Order, OrderItem } from '../../features/orders';

export type { Order, OrderItem };

export function useOrders() {
  const ordersQuery = useQuery({
    queryKey: ['orders'],
    queryFn: getOrders,
    refetchInterval: 1000 * 60 * 30,
    refetchIntervalInBackground: true,
    staleTime: 1000 * 60 * 30,
  });

  const result = ordersQuery.data;

  return {
    orders: result?.success ? result.data : [],
    isLoading: ordersQuery.isLoading,
    isError: ordersQuery.isError || (result !== undefined && !result.success),
    error: ordersQuery.error || (result?.success === false ? result.error : null),
    refetchOrders: ordersQuery.refetch,
  };
}
