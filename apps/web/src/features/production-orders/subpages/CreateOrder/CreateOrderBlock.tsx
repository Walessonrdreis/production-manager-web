import { DevBadge } from '../../../../components/ui/DevBadge';
import React from 'react';

export function CreateOrderBlock() {
  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 overflow-hidden hover:border-emerald-500 dark:hover:border-emerald-600 transition-colors">
      <div className="p-5 border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/50">
        <h3 className="font-semibold text-gray-800 dark:text-slate-100 flex items-center">
          <svg className="w-5 h-5 mr-2 text-emerald-500 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Planejamento de OP
         <DevBadge id="card.createorderblock" /></h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Lançar ou programar nova ordem de produção</p>
      </div>
      <div className="p-5 flex-1 flex flex-col items-center justify-center">
        <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-3">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <span className="text-sm font-medium text-gray-800 dark:text-slate-200">Criar Nova OP</span>
      </div>
    </div>
  );
}
