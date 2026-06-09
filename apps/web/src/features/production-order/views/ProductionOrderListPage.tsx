import { DevBadge } from '../../../components/ui/DevBadge';
import React from 'react';
import { useProductionOrders } from '../hooks/useProductionOrders';
import { ProductionOrderList } from '../components/ProductionOrderList';
import { ArrowLeft } from 'lucide-react';

interface Props {
  onBack?: () => void;
}

export function ProductionOrderListPage({ onBack }: Props) {
  const { orders, isLoading, error } = useProductionOrders();

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 border-x border-slate-200 dark:border-slate-800">
      <div className="flex flex-col sm:flex-row pb-6 mb-6 gap-4 sm:items-center justify-between border-b border-slate-200 dark:border-slate-800 p-6">
        <div>
          {onBack && (
            <button
              onClick={onBack}
              className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar ao Hub
            </button>
          )}
          <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
            Ordens de Produção
           <DevBadge id="productionorderlistpage.title" /></h1>
          <p className="text-sm text-slate-500 max-w-xl mt-2 line-clamp-2">
            Controle e acompanhamento das OPs em andamento.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="h-9 px-4 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors bg-slate-900 text-white shadow hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90">
            Nova Ordem
          </button>
        </div>
      </div>

      <div className="px-6 flex-1 overflow-auto pb-6">
        {error && (
          <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-slate-800 dark:text-red-400" role="alert">
            {error}
          </div>
        )}
        <ProductionOrderList orders={orders} isLoading={isLoading} />
      </div>
    </div>
  );
}

