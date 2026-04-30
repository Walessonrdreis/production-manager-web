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

  return {
    orders: ordersQuery.data || [],
    isLoading: ordersQuery.isLoading,
    isError: ordersQuery.isError,
    error: ordersQuery.error,
    refetchOrders: ordersQuery.refetch,
  };
}
