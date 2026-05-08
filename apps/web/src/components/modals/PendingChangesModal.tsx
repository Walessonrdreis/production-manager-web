import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { usePendingDetails, PendingItem } from '../../hooks/ui/usePendingDetails';
import { Package, Calendar, Settings, Info, CloudAlert, Database, RefreshCw, Target } from 'lucide-react';
import { motion } from 'framer-motion';

interface PendingChangesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TYPE_CONFIG = {
  produced: {
    icon: Database,
    color: 'text-blue-500',
    bg: 'bg-blue-50',
    label: 'Produção'
  },
  planning: {
    icon: Calendar,
    color: 'text-purple-500',
    bg: 'bg-purple-50',
    label: 'Planejamento'
  },
  catalog: {
    icon: Package,
    color: 'text-amber-500',
    bg: 'bg-amber-50',
    label: 'Catálogo'
  },
  sector: {
    icon: Settings,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50',
    label: 'Configuração'
  },
  goal: {
    icon: Target,
    color: 'text-rose-500',
    bg: 'bg-rose-50',
    label: 'Metas'
  }
};

export function PendingChangesModal({ isOpen, onClose }: PendingChangesModalProps) {
  const { items, count, isEmpty, syncAllPending } = usePendingDetails();
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    setIsSyncing(true);
    await syncAllPending();
    setIsSyncing(false);
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Alterações Pendentes de Sincronização"
      className="max-w-2xl"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3 p-4 rounded-xl bg-amber-50 border border-amber-100 mb-4">
          <div className="flex items-center gap-3">
             <Info className="text-amber-600 shrink-0" size={20} />
             <p className="text-sm text-amber-800">
               Estes dados foram salvos localmente e podem ser sincronizados com o servidor central manualmente.
             </p>
          </div>
          {!isEmpty && (
            <button
              onClick={handleSync}
              disabled={isSyncing}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-emerald-700 transition disabled:opacity-50 whitespace-nowrap"
            >
              <RefreshCw size={16} className={isSyncing ? "animate-spin" : ""} />
              {isSyncing ? "Sincronizando..." : "Sincronizar Agora"}
            </button>
          )}
        </div>

        {isEmpty ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="h-16 w-16 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
              <CloudAlert className="text-emerald-500" size={32} />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Tudo em ordem!</h3>
            <p className="text-slate-500 max-w-xs">
              Não há alterações pendentes no momento. Todos os seus dados estão sincronizados com o SQLite e Servidor.
            </p>
          </div>
        ) : (
          <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-2 custom-scrollbar">
            {items.map((item: PendingItem, index: number) => {
              const config = TYPE_CONFIG[item.type];
              const Icon = config.icon;
              
              return (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  key={`${item.type}-${item.id}`}
                  className="flex items-start gap-4 p-3 rounded-lg border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all group"
                >
                  <div className={`p-2 rounded-lg ${config.bg} ${config.color} shrink-0`}>
                    <Icon size={18} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-semibold text-slate-900 truncate">
                        {item.title}
                      </h4>
                      <span className="text-[10px] font-bold uppercase py-0.5 px-2 rounded-full bg-slate-100 text-slate-500 shrink-0">
                        {config.label}
                      </span>
                    </div>
                    {item.subtitle && (
                      <p className="text-xs text-slate-500 mt-0.5">
                        {item.subtitle}
                      </p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {!isEmpty && (
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>{count} item{count > 1 ? 's' : ''} aguardando sincronização</span>
            <span>Local v{new Date().toLocaleDateString()}</span>
          </div>
        )}
      </div>
    </Modal>
  );
}
