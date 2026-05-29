import React from 'react';
import { ProductionOrderV2 } from '../model/types';
import { OrderStatusBadge } from './OrderStatusBadge';

interface OrderCardCompactProps {
  order: ProductionOrderV2;
  searchTerm?: string;
}

function highlightText(text: string, highlight?: string) {
  if (!highlight || highlight.trim() === '') return <>{text}</>;
  
  const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
  return (
    <>
      {parts.map((part, i) => 
        part.toLowerCase() === highlight.toLowerCase() ? (
          <span key={i} className="bg-yellow-200 text-yellow-900 rounded-sm px-0.5">{part}</span>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        )
      )}
    </>
  );
}

export function OrderCardCompact({ order, searchTerm }: OrderCardCompactProps) {
  return (
    <div className="p-4 border border-gray-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 shadow-sm hover:shadow dark:hover:shadow-slate-800 transition flex justify-between items-center group">
      <div className="flex flex-col">
        <div className="flex items-center space-x-3 mb-1">
          <span className="font-bold text-gray-900 dark:text-slate-100 border-b-2 border-transparent group-hover:border-blue-500 transition-colors">
            #{highlightText(order.id, searchTerm)}
          </span>
          <OrderStatusBadge status={order.status} />
        </div>
        <div className="text-sm font-medium text-gray-800 dark:text-slate-200">
          {highlightText(order.item, searchTerm)} <span className="text-gray-500 dark:text-gray-400 font-normal ml-2">x{order.quantity}</span>
        </div>
        <p className="text-xs text-gray-400 dark:text-slate-500 mt-2">Criada em: {new Date(order.createdAt).toLocaleDateString()} às {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
      </div>
      <div className="flex items-center justify-center p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 dark:text-slate-500 group-hover:text-blue-500 dark:group-hover:text-blue-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  );
}
