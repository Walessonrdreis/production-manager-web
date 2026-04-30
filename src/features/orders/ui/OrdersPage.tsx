import { useMemo, useState } from 'react';
import { useOrders, Order } from '../../../hooks/orders/useOrders';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { AlertCircle, Search } from 'lucide-react';
import { OrderLogic } from '../domain/OrderLogic';

import { OrdersHeader } from './components/OrdersHeader';
import { OrdersTable } from './components/OrdersTable';
import { OrderDetailsModal } from './components/OrderDetailsModal';

export function OrdersPage() {
  const { orders, isLoading, isError, error, refetchOrders } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filteredOrders = useMemo(() => {
    return OrderLogic.filterOrders(orders || [], search);
  }, [orders, search]);

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

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-slate-400" />
        </div>
        <input
          type="text"
          placeholder="Buscar pedidos ou clientes..."
          className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Card>
        <OrdersTable 
          orders={filteredOrders}
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
