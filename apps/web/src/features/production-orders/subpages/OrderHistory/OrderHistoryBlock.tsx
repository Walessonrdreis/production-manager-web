import React from 'react';

export function OrderHistoryBlock() {
  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:border-gray-500 transition-colors">
      <div className="p-5 border-b border-gray-100 bg-gray-50/50">
        <h3 className="font-semibold text-gray-800 flex items-center">
          <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
          Histórico de OPs
        </h3>
        <p className="text-xs text-gray-500 mt-1">Concluídas e arquivo morto</p>
      </div>
      <div className="p-5 flex-1 flex flex-col items-center justify-center">
        <div className="text-center">
          <span className="text-4xl font-bold text-gray-800">1,248</span>
          <span className="block text-sm font-medium text-gray-500 mt-1 uppercase tracking-wide">no total</span>
        </div>
      </div>
    </div>
  );
}
