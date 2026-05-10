import React, { useState, useEffect } from 'react';
import { Menu, Cloud, RefreshCw } from 'lucide-react';
import { useSyncStatus } from '../../hooks/ui/useSyncStatus';
import { PendingChangesModal } from '../modals/PendingChangesModal';

interface TopbarProps {
  onToggleSidebar: () => void;
  title: string;
}

export function Topbar({ onToggleSidebar, title }: TopbarProps) {
  const { isSyncing, lastSync, triggerSync } = useSyncStatus();
  const [isPendingModalOpen, setIsPendingModalOpen] = useState(false);
  const [timeAgo, setTimeAgo] = useState('agora');

  useEffect(() => {
    const interval = setInterval(() => {
      const diffMs = Date.now() - lastSync.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins === 0) setTimeAgo('agora');
      else if (diffMins === 1) setTimeAgo('há 1 min');
      else setTimeAgo(`há ${diffMins} min`);
    }, 10000); // 10s
    return () => clearInterval(interval);
  }, [lastSync]);

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
        {/* Sync Status Button */}
        <button 
          onClick={() => triggerSync()}
          disabled={isSyncing}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all hover:shadow-sm active:scale-95 ${
            isSyncing
              ? 'bg-amber-50 border-amber-100 text-amber-600'
              : 'bg-slate-50 border-slate-100 hover:bg-slate-100 text-slate-500'
          }`}
          title="Forçar Sincronização e Atualização"
        >
          <RefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} />
          <span className="text-[10px] font-bold uppercase hidden sm:inline-block">
            {isSyncing ? 'Sincronizando...' : `Sincronizado ${timeAgo}`}
          </span>
        </button>

        <div className="flex flex-col items-end">
          <span className="text-[10px] sm:text-xs font-medium text-slate-500">Matriz</span>
          <span className="text-[8px] sm:text-[10px] text-emerald-600 font-bold uppercase">Conectado</span>
        </div>
      </div>

      <PendingChangesModal 
        isOpen={isPendingModalOpen} 
        onClose={() => setIsPendingModalOpen(false)} 
      />
    </header>
  );
}
