import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { productionOrdersApi } from '../../api/productionOrdersApi';
import { OrderCardCompact } from '../../components/OrderCardCompact';
import { OrderFilterGrid, OrderFilterState } from '../../components/OrderFilterGrid';

export function OpenedOrdersView() {
  const { data: orders, isLoading, error } = useQuery({
    queryKey: ['production-orders', 'opened'],
    queryFn: productionOrdersApi.getOpenedOrders,
  });

  const [filters, setFilters] = useState<OrderFilterState>({
    search: '',
    status: 'ALL',
    dateRange: 'ALL'
  });

  const handleFilterChange = (newFilters: Partial<OrderFilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const filteredOrders = useMemo(() => {
    if (!orders) return [];

    return orders.filter(order => {
      // Search text logic (case insensitive)
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        if (!order.id.toLowerCase().includes(searchLower) && 
            !order.item.toLowerCase().includes(searchLower)) {
          return false;
        }
      }

      // Status chip logic
      if (filters.status !== 'ALL' && order.status !== filters.status) {
        return false;
      }

      // Date Range logic
      if (filters.dateRange !== 'ALL') {
        const orderDate = new Date(order.createdAt);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - orderDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (filters.dateRange === 'TODAY' && diffDays > 1) return false;
        if (filters.dateRange === 'LAST_7_DAYS' && diffDays > 7) return false;
        if (filters.dateRange === 'OLDER' && diffDays <= 7) return false;
      }

      return true;
    });
  }, [orders, filters]);

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      <div className="bg-white p-4 border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <OrderFilterGrid filters={filters} onFilterChange={handleFilterChange} />
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
        {isLoading ? (
          <div className="flex flex-col space-y-4">
            <div className="h-24 bg-gray-200 animate-pulse rounded-lg"></div>
            <div className="h-24 bg-gray-200 animate-pulse rounded-lg"></div>
            <div className="h-24 bg-gray-200 animate-pulse rounded-lg"></div>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 text-red-600 rounded">Erro ao carregar OPs em aberto.</div>
        ) : filteredOrders.length > 0 ? (
          <AnimatePresence mode="popLayout">
            {filteredOrders.map((order) => (
              <motion.div
                key={order.id}
                layout
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <OrderCardCompact 
                  order={order} 
                  searchTerm={filters.search}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
           <div className="text-center p-12 bg-white rounded shadow-sm border border-gray-100">
             <p className="text-gray-500">Nenhuma OP encontrada com estes filtros.</p>
           </div>
        )}
      </div>
    </div>
  );
}
