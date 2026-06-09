import { DevBadge } from '../../../../components/ui/DevBadge';
import React from 'react';
import { PlusCircle } from 'lucide-react';

export function CreateProductBlock() {
  return (
    <div className="bg-gradient-to-br from-blue-600 to-blue-800 dark:from-blue-800 dark:to-blue-950 p-6 rounded-2xl shadow-sm h-full flex flex-col items-start justify-between text-white border border-blue-500/30">
      <div className="bg-white/20 w-12 h-12 flex items-center justify-center rounded-xl mb-4">
        <PlusCircle className="text-white" size={24} />
      </div>
      <div className="flex-1">
        <h3 className="flex items-center gap-2 text-lg font-bold text-white">Criar Produto <DevBadge id="card.createproductblock" /></h3>
        <p className="text-sm text-blue-100 mt-1">
          Adicionar um novo item ao catálogo e despachar para o ERP.
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
