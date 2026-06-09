import { useState, useCallback, useEffect } from 'react';
import { ProductionOrder, CreateProductionOrderDTO, UpdateProductionOrderDTO } from '../models/types';
import { getProductionOrderGateway } from '../api/gateway';

export function useProductionOrders() {
  const [orders, setOrders] = useState<ProductionOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const service = getProductionOrderGateway();

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await service.list();
      setOrders(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar ordens de produção');
    } finally {
      setIsLoading(false);
    }
  }, [service]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const createOrder = async (data: CreateProductionOrderDTO) => {
    setIsLoading(true);
    setError(null);
    try {
      const newOrder = await service.create(data);
      setOrders(prev => [...prev, newOrder]);
      return newOrder;
    } catch (err: any) {
      setError(err.message || 'Erro ao criar ordem de produção');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrder = async (id: string, data: UpdateProductionOrderDTO) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedOrder = await service.update(id, data);
      setOrders(prev => prev.map(o => o.id === id ? updatedOrder : o));
      return updatedOrder;
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar ordem de produção');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const cancelOrder = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await service.cancel(id);
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'CANCELED', updatedAt: new Date().toISOString() } : o));
    } catch (err: any) {
      setError(err.message || 'Erro ao cancelar ordem de produção');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    orders,
    isLoading,
    error,
    fetchOrders,
    createOrder,
    updateOrder,
    cancelOrder
  };
}
