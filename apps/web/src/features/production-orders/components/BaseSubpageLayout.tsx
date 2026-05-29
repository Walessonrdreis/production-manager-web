import React from 'react';

interface BaseSubpageLayoutProps {
  title: string;
  onBack: () => void;
  children: React.ReactNode;
}

export function BaseSubpageLayout({ title, onBack, children }: BaseSubpageLayoutProps) {
  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950">
      <div className="flex items-center p-4 border-b border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <button onClick={onBack} className="mr-4 text-gray-500 hover:text-gray-800 dark:text-slate-400 dark:hover:text-slate-200 transition">
          &larr; Voltar
        </button>
        <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100">{title}</h2>
      </div>
      <div className="flex-1 overflow-auto p-4 text-slate-900 dark:text-slate-200">
        {children}
      </div>
    </div>
  );
}
