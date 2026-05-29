import React from 'react';

export function LiveOrdersBlock() {
  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 overflow-hidden hover:border-orange-500 dark:hover:border-orange-600 transition-colors">
      <div className="p-5 border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/50">
        <h3 className="font-semibold text-gray-800 dark:text-slate-100 flex items-center">
          <svg className="w-5 h-5 mr-2 text-orange-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Em Execução
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Sendo produzidas neste momento</p>
      </div>
      <div className="p-5 flex-1 flex flex-col items-center justify-center relative overflow-hidden bg-white dark:bg-slate-900">
        <div className="absolute inset-0 bg-orange-50 dark:bg-orange-950/20 opacity-20 wavy-background-pattern"></div>
        <div className="relative text-center z-10">
          <div className="flex items-center justify-center space-x-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 dark:bg-orange-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500 dark:bg-orange-600"></span>
            </span>
            <span className="text-3xl font-bold text-gray-800 dark:text-slate-100">4</span>
          </div>
          <span className="block text-xs font-medium text-gray-500 dark:text-gray-400 mt-2 uppercase tracking-wide">máquinas rodando</span>
        </div>
      </div>
    </div>
  );
}
