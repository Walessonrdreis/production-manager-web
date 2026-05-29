import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { productionOrdersApi } from '../../api/productionOrdersApi';

export function OpenedOrdersBlock() {
  const { data: orders, isLoading } = useQuery({
    queryKey: ['production-orders', 'opened'],
    queryFn: productionOrdersApi.getOpenedOrders,
  });

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:border-blue-300 transition-colors">
      <div className="p-5 border-b border-gray-100 bg-gray-50/50">
        <h3 className="font-semibold text-gray-800 flex items-center">
          <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Fila de Trabalho
        </h3>
        <p className="text-xs text-gray-500 mt-1">Aguardando produção no chão de fábrica</p>
      </div>
      <div className="p-5 bg-white flex-1 flex flex-col items-center justify-center">
        {isLoading ? (
           <div className="animate-pulse flex space-x-2 items-end">
             <div className="h-8 w-12 bg-gray-200 rounded"></div>
             <div className="h-4 w-16 bg-gray-200 rounded"></div>
           </div>
        ) : (
          <div className="text-center">
            <span className="text-4xl font-bold text-gray-800">{orders?.length || 0}</span>
            <span className="block text-sm font-medium text-gray-500 mt-1 uppercase tracking-wide">em aberto</span>
          </div>
        )}
      </div>
    </div>
  );
}
