import { DevBadge } from '../../../../components/ui/DevBadge';
import React, { useMemo } from 'react';
import { Layers } from 'lucide-react';
import { useOmieProducts } from '../../../../hooks/catalog/useOmieProducts';

export function WithBomBlock() {
  const { data: products = [], isLoading } = useOmieProducts();

  const bomCount = useMemo(() => {
    // Para simplificar a POC que já injeta BOM fake lá, vamos contar produtos "fakes" com BOM,
    // Mas logicamente o filtro será validado no CatalogV2.
    // Usaremos a mesma lógica do CatalogV2Page:
    return products.filter(p => {
       if (p.bom && p.bom.length > 0) return true;
       // Condição Mock que aplicamos na UI principal:
       const randomNum = p.id.length % 3;
       if (randomNum !== 0) return true;
       return false;
    }).length;
  }, [products]);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm h-full flex flex-col items-start justify-between">
      <div className="bg-indigo-100 dark:bg-indigo-900/30 w-12 h-12 flex items-center justify-center rounded-xl mb-4">
        <Layers className="text-indigo-600 dark:text-indigo-400" size={24} />
      </div>
      <div className="flex-1">
        <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800 dark:text-slate-100">Gerenciar Estruturas <DevBadge id="card.withbomblock" /></h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Visualizar, adicionar ou atualizar as estruturas de produção (BOM) dos produtos.
        </p>
      </div>
      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 w-full flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">Itens Estruturados</span>
        {isLoading ? (
          <div className="h-4 w-8 bg-slate-200 dark:bg-slate-700 animate-pulse rounded" />
        ) : (
          <span className="text-lg font-bold text-slate-900 dark:text-white">
            {bomCount}
          </span>
        )}
      </div>
    </div>
  );
}
