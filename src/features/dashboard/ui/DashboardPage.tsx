import { useDashboardTotals } from '../../../hooks/dashboard/useDashboardTotals';
import { useSyncStage20 } from '../../../hooks/dashboard/useSyncStage20';
import { useOrders } from '../../../hooks/orders/useOrders';
import { Button } from '../../../components/ui/Button';
import { AlertCircle } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useLocalProduced } from '../../../hooks/dashboard/useLocalProduced';

import { DashboardHeader } from './components/DashboardHeader';
import { DashboardStats } from './components/DashboardStats';
import { DashboardPlanningTable } from './components/DashboardPlanningTable';
import { DashboardDetailsModal } from './components/DashboardDetailsModal';
import { DashboardLogic } from '../domain/DashboardLogic';

export function DashboardPage() {
  const { data: totals, isLoading: isApiLoading, isError, error, refetch: refetchTotals, isFetching } = useDashboardTotals();
  const syncStage20 = useSyncStage20();
  const { orders, isLoading: isOrdersLoading } = useOrders();
  const { producedRecords, toggleOrder, toggleAll, isLoading: isLocalLoading } = useLocalProduced();
  
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const isLoading = isApiLoading || isLocalLoading || isOrdersLoading;

  const currentProductData = useMemo(() => {
    if (!selectedProduct || !totals) return null;
    return totals.data.find(p => p.description === selectedProduct) || null;
  }, [selectedProduct, totals]);

  const ordersWithProduct = useMemo(() => {
    if (!selectedProduct || !orders) return [];
    return DashboardLogic.filterOrdersByProduct(orders, selectedProduct);
  }, [selectedProduct, orders]);

  const handleToggleProduct = (description: string, totalNeeded: number) => {
    toggleAll(description, totalNeeded);
  };

  const handleToggleOrder = (orderId: string, description: string, quantity: number, orderNumber: string) => {
    const id = DashboardLogic.generateProducedId(orderId, description);
    toggleOrder(id, description, quantity, orderId, orderNumber);
  };

  const isOrderProduced = (orderId: string, description: string) => {
    const id = DashboardLogic.generateProducedId(orderId, description);
    return producedRecords.some(r => r.id === id);
  };

  const getProducedQuantity = (description: string) => {
    return DashboardLogic.calculateProducedQuantity(producedRecords, description);
  };

  const totalProducedItemsCount = DashboardLogic.calculateTotalProduced(producedRecords);
  const adjustedTotal = Math.max(0, (totals?.totalItems || 0) - totalProducedItemsCount);

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="bg-red-50 p-6 rounded-2xl border border-red-100 max-w-sm">
          <AlertCircle size={32} className="text-red-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-red-900 mb-1">Atenção</h2>
          <p className="text-red-700 text-sm mb-6 bg-white py-2 px-4 rounded border border-red-100 italic">
            {typeof error === 'string' ? error : 'Ocorreu um erro ao carregar os dados.'}
          </p>
          <Button onClick={() => refetchTotals()} variant="outline" size="sm" className="w-full">
            Tentar Novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-8">
      <DashboardHeader 
        isFetching={isFetching}
        isSyncing={syncStage20.isPending}
        onSync={() => syncStage20.mutate()}
      />

      <DashboardStats 
        totalItems={adjustedTotal}
        uniqueSkus={totals?.data.length || 0}
        lastUpdate={totals?.lastUpdate}
        isLoading={isLoading}
      />

      <DashboardPlanningTable 
        isLoading={isLoading}
        data={totals?.data || []}
        getProducedQuantity={getProducedQuantity}
        onToggleProduct={handleToggleProduct}
        onSelectProduct={(desc) => {
          setSelectedProduct(desc);
          setShowDetailsModal(true);
        }}
      />

      <DashboardDetailsModal 
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        selectedProduct={selectedProduct}
        currentProductData={currentProductData}
        producedQuantity={selectedProduct ? getProducedQuantity(selectedProduct) : 0}
        ordersWithProduct={ordersWithProduct}
        isOrderProduced={isOrderProduced}
        onToggleProduct={handleToggleProduct}
        onToggleOrder={handleToggleOrder}
      />
    </div>
  );
}
