import React from 'react';

interface BaseSubpageLayoutProps {
  title: string;
  onBack: () => void;
  children: React.ReactNode;
}

export function BaseSubpageLayout({ title, onBack, children }: BaseSubpageLayoutProps) {
  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="flex items-center p-4 border-b border-gray-200 bg-white shadow-sm">
        <button onClick={onBack} className="mr-4 text-gray-500 hover:text-gray-800 transition">
          &larr; Voltar
        </button>
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      </div>
      <div className="flex-1 overflow-auto p-4">
        {children}
      </div>
    </div>
  );
}
