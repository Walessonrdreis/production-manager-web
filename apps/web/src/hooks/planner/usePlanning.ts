import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, useCallback } from 'react';
import { 
  addPlanningItem, 
  addBulkPlanningItems,
  updatePlanningItem, 
  removePlanningItem, 
  clearPlanning,
  getPlanningItems
} from '../../features/planner';
import { Product } from '../../types/api';
import { useToast } from '../../components/ui/Toast';
import { PlanningRepository } from '../../features/planner/infra/PlanningRepository';
import { Result } from '../../lib/Result';

export function usePlanning() {
  const { success, error: toastError } = useToast();
  const queryClient = useQueryClient();
  
  const { data: rawItems = [], isLoading } = useQuery({
    queryKey: ['planningItems'],
    queryFn: () => PlanningRepository.getAll()
  });

  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['planningItems'] });
  }, [queryClient]);

  const items = rawItems || [];

  const [period, setPeriodState] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [scheduledAt, setScheduledAt] = useState<string>(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  });

  const addItem = async (product: Product, quantity: number, sectorId: string, sectorName: string) => {
    const result = await addPlanningItem(product, quantity, sectorId, sectorName, scheduledAt);
    if (!result.success) {
      toastError(result.error);
    } else {
      success('Item adicionado e programado.');
      invalidate();
    }
    return result;
  };

  const addBulkItems = async (products: Product[], sectorId: string, sectorName: string) => {
    const result = await addBulkPlanningItems(products, sectorId, sectorName, scheduledAt);
    if (!result.success) {
      toastError(result.error);
    } else {
      success(`${products.length} itens adicionados.`);
      invalidate();
    }
    return result;
  };

  const updateQuantity = async (id: string | number, quantity: number) => {
    const result = await updatePlanningItem(id, quantity);
    if (!result.success) {
      toastError(result.error);
    } else {
      invalidate();
    }
    return result;
  };

  const removeItem = async (id: string | number) => {
    const result = await removePlanningItem(id);
    if (!result.success) {
      toastError(result.error);
    } else {
      success('Item removido do planejamento.');
      invalidate();
    }
    return result;
  };

  const clear = async () => {
    const result = await clearPlanning();
    if (!result.success) {
      toastError(result.error);
    } else {
      success('Planejamento limpo.');
      invalidate();
    }
    return result;
  };

  return {
    items,
    isLoading,
    error: null,
    addItem,
    addBulkItems,
    updateQuantity,
    removeItem,
    clearPlanning: clear,
    period,
    setPeriod: (p: 'daily' | 'weekly' | 'monthly') => setPeriodState(p),
    scheduledAt,
    setScheduledAt: async (date: string) => {
      setScheduledAt(date);
    },
    generateOrders: async () => {
      if (items.length === 0) return Result.fail('Nenhum item para gerar ordens.');
      
      const { setProductionSchedule } = await import('../../features/production');
      
      let hasError = false;
      for (const item of items) {
        const result = await setProductionSchedule(
          item.description,
          scheduledAt,
          `Ordem de Produção - ${period}`,
          item.productCode,
          item.quantity,
          item.sectorId,
          item.sectorName
        );
        if (!result.success) hasError = true;
      }
      
      if (hasError) {
        toastError('Algumas ordens de produção falharam ao ser geradas.');
        return Result.fail('Falha parcial');
      } else {
        success('Ordens de Produção geradas com sucesso!');
        await clear(); // Limpa o planejamento atual para iniciar um novo
        return Result.ok(undefined);
      }
    }
  };
}
