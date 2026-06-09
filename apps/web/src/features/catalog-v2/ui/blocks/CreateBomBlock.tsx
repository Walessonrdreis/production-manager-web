import { DevBadge } from '../../../../components/ui/DevBadge';
import React from 'react';
import { Layers } from 'lucide-react';

export function CreateBomBlock() {
  return (
    <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 dark:from-indigo-800 dark:to-indigo-950 p-6 rounded-2xl shadow-sm h-full flex flex-col items-start justify-between text-white border border-indigo-500/30">
      <div className="bg-white/20 w-12 h-12 flex items-center justify-center rounded-xl mb-4">
        <Layers className="text-white" size={24} />
      </div>
      <div className="flex-1">
        <h3 className="flex items-center gap-2 text-lg font-bold text-white">Criar Estrutura <DevBadge id="card.createbomblock" /></h3>
        <p className="text-sm text-indigo-100 mt-1">
          Montar e vincular insumos a um produto base do catálogo (BOM).
        </p>
      </div>
      <div className="mt-4 pt-4 border-t border-white/20 w-full flex items-center justify-between">
        <span className="text-sm font-semibold text-white">Acesso Rápido</span>
        <div className="bg-white/10 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
          Novo
        </div>
      </div>
    </div>
  );
}
