import React from 'react';
import { ProductionOrderV2 } from '../model/types';

interface OrderStatusBadgeProps {
  status: ProductionOrderV2['status'];
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const map: Record<ProductionOrderV2['status'], { label: string; color: string }> = {
    OPENED: { label: 'Aberto', color: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800/50' },
    LIVE: { label: 'Em Execução', color: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800/50' },
    REVIEW: { label: 'Revisão', color: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800/50' },
    HISTORY: { label: 'Concluído', color: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700' },
    CANCELLED: { label: 'Cancelado', color: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/50' },
  };

  const config = map[status] || map['OPENED'];

  return (
    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${config.color}`}>
      {config.label}
    </span>
  );
}
