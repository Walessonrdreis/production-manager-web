import { DevBadge } from '../../../../components/ui/DevBadge';
import React from 'react';

export function OrderReviewBlock() {
  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 overflow-hidden hover:border-amber-500 dark:hover:border-amber-600 transition-colors">
      <div className="p-5 border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/50">
        <h3 className="font-semibold text-gray-800 dark:text-slate-100 flex items-center">
          <svg className="w-5 h-5 mr-2 text-amber-500 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Aguardando Revisão
         <DevBadge id="card.orderreviewblock" /></h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">OPs com pendências ou pausadas</p>
      </div>
      <div className="p-5 flex-1 flex flex-col items-center justify-center">
        <div className="text-center">
          <span className="text-4xl font-bold text-gray-800 dark:text-slate-100">2</span>
          <span className="block text-sm font-medium text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-wide">com ações necessárias</span>
        </div>
      </div>
    </div>
  );
}
