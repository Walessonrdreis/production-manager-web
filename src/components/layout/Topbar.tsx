import React from 'react';
import { Menu, Cloud, RefreshCw } from 'lucide-react';
import { useSyncStatus } from '../../hooks/ui/useSyncStatus';

interface TopbarProps {
  onToggleSidebar: () => void;
  title: string;
}

export function Topbar({ onToggleSidebar, title }: TopbarProps) {
  const { pendingCount, isSynced } = useSyncStatus();

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sticky top-0 z-40 transition-all">
      <div className="flex items-center gap-3">
        <button 
          onClick={onToggleSidebar}
          className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Menu"
        >
          <Menu size={20} />
        </button>
        <div className="flex flex-col">
          <h1 className="font-semibold text-slate-900 text-sm sm:text-base truncate max-w-[200px] sm:max-w-none">
            {title}
          </h1>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Sync Status */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-100">
          {isSynced ? (
            <>
              <Cloud size={14} className="text-emerald-500" />
              <span className="text-[10px] font-bold text-slate-500 uppercase">Sincronizado</span>
            </>
          ) : (
            <>
              <RefreshCw size={14} className="text-amber-500 animate-spin-slow" />
              <span className="text-[10px] font-bold text-amber-600 uppercase">
                {pendingCount} Pendente{pendingCount > 1 ? 's' : ''}
              </span>
            </>
          )}
        </div>

        <div className="flex flex-col items-end">
          <span className="text-[10px] sm:text-xs font-medium text-slate-500">Matriz</span>
          <span className="text-[8px] sm:text-[10px] text-emerald-600 font-bold uppercase">Conectado</span>
        </div>
      </div>
    </header>
  );
}
