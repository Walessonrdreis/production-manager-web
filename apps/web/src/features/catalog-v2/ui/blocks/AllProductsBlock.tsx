import { DevBadge } from '../../../../components/ui/DevBadge';
import React from 'react';
import { Package } from 'lucide-react';
import { useOmieProducts } from '../../../../hooks/catalog/useOmieProducts';

export function AllProductsBlock() {
  const { data: products = [], isLoading } = useOmieProducts();

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm h-full flex flex-col items-start justify-between">
      <div className="bg-blue-100 dark:bg-blue-900/30 w-12 h-12 flex items-center justify-center rounded-xl mb-4">
        <Package className="text-blue-600 dark:text-blue-400" size={24} />
      </div>
      <div className="flex-1">
        <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800 dark:text-slate-100">Todos os Produtos <DevBadge id="card.allproductsblock" /></h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Acesso completo ao catálogo unificado.
        </p>
      </div>
      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 w-full flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">Total cadastrado</span>
        {isLoading ? (
          <div className="h-4 w-12 bg-slate-200 dark:bg-slate-700 animate-pulse rounded" />
        ) : (
          <span className="text-lg font-bold text-slate-900 dark:text-white">{products.length}</span>
        )}
      </div>
    </div>
  );
}
