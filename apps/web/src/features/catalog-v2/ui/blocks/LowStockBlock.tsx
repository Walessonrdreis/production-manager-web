import { DevBadge } from '../../../../components/ui/DevBadge';
import React, { useMemo } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useOmieProducts } from '../../../../hooks/catalog/useOmieProducts';

export function LowStockBlock() {
  const { data: products = [], isLoading } = useOmieProducts();

  const lowStockCount = useMemo(() => {
    return products.filter(p => {
      return (p.stock || 0) <= (p.minStock || 0); // Consider items without stock or below minimum threshold
    }).length;
  }, [products]);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm h-full flex flex-col items-start justify-between relative overflow-hidden">
      {lowStockCount > 0 && (
         <div className="absolute top-0 right-0 w-24 h-24 bg-orange-100 dark:bg-orange-900/20 rounded-bl-[100px] z-0" />
      )}
      <div className="bg-orange-100 dark:bg-orange-900/30 w-12 h-12 flex items-center justify-center rounded-xl mb-4 relative z-10">
        <AlertTriangle className="text-orange-600 dark:text-orange-400" size={24} />
      </div>
      <div className="flex-1 relative z-10">
        <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800 dark:text-slate-100">Estoque Baixo <DevBadge id="card.lowstockblock" /></h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Avisos de reposição e itens críticos.
        </p>
      </div>
      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 w-full flex items-center justify-between relative z-10">
        <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">Itens em Alerta</span>
        {isLoading ? (
          <div className="h-4 w-8 bg-slate-200 dark:bg-slate-700 animate-pulse rounded" />
        ) : (
          <span className={`text-lg font-bold ${lowStockCount > 0 ? 'text-orange-600 dark:text-orange-400' : 'text-slate-400'}`}>
            {lowStockCount}
          </span>
        )}
      </div>
    </div>
  );
}
