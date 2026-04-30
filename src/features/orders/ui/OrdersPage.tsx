import { useState } from 'react';
import { useOrders, Order } from '../../../hooks/orders/useOrders';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { AlertCircle } from 'lucide-react';

import { OrdersHeader } from './components/OrdersHeader';
import { OrdersTable } from './components/OrdersTable';
import { OrderDetailsModal } from './components/OrderDetailsModal';

export function OrdersPage() {
  const { orders, isLoading, isError, error, refetchOrders } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="bg-red-50 p-6 rounded-2xl border border-red-100 max-w-sm">
          <AlertCircle size={32} className="text-red-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-red-900 mb-1">Erro ao Carregar Ordens</h2>
          <p className="text-red-700 text-sm mb-6">
            {(error as any)?.message || 'Não foi possível carregar os dados das ordens de venda.'}
          </p>
          <Button onClick={() => refetchOrders()} variant="outline" size="sm" className="w-full">
            Tentar Novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <OrdersHeader 
        ordersCount={orders?.length || 0}
        isLoading={isLoading}
        onRefresh={refetchOrders}
      />

      <Card>
        <OrdersTable 
          orders={orders || []}
          isLoading={isLoading}
          onOpenDetails={handleOpenDetails}
        />
      </Card>

      <OrderDetailsModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedOrder={selectedOrder}
      />
    </div>
  );
}
