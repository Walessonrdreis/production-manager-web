import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface BaseSubpageLayoutProps {
  title: string;
  onBack: () => void;
  children: React.ReactNode;
}

export function BaseSubpageLayout({ title, onBack, children }: BaseSubpageLayoutProps) {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header Fixo */}
      <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm z-10 sticky top-0">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{title}</h2>
        </div>
      </div>

      {/* Conteúdo Rolável */}
      <div className="flex-1 overflow-y-auto w-full">
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
