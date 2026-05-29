import React from 'react';

export function OrderMetricsBlock() {
  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 overflow-hidden hover:border-purple-500 dark:hover:border-purple-600 transition-colors">
      <div className="p-5 border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/50">
        <h3 className="font-semibold text-gray-800 dark:text-slate-100 flex items-center">
          <svg className="w-5 h-5 mr-2 text-purple-500 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
          Indicadores
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Eficiência (OEE) e KPIs</p>
      </div>
      <div className="p-5 flex-1 flex flex-col items-center justify-center">
        <div className="flex items-end justify-center space-x-1 pb-2">
          <div className="w-4 bg-purple-200 dark:bg-purple-900/50 rounded-t h-8"></div>
          <div className="w-4 bg-purple-300 dark:bg-purple-800/60 rounded-t h-12"></div>
          <div className="w-4 bg-purple-400 dark:bg-purple-700/80 rounded-t h-10"></div>
          <div className="w-4 bg-purple-500 dark:bg-purple-600 rounded-t h-16"></div>
          <div className="w-4 bg-purple-600 dark:bg-purple-500 rounded-t h-20"></div>
        </div>
        <span className="block text-sm font-medium text-gray-500 dark:text-gray-400 mt-2 uppercase tracking-wide">Visão Geral</span>
      </div>
    </div>
  );
}
