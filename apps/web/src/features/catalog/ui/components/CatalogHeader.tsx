import { DevBadge } from '../../../../components/ui/DevBadge';
import { Button } from '../../../../components/ui/Button';
import { RefreshCw, Package } from 'lucide-react';

interface CatalogHeaderProps {
  productsCount: number;
  isFetching: boolean;
  onSync: () => void;
  isSyncing: boolean;
  onSyncStock: () => void;
  isSyncingStock: boolean;
}

export function CatalogHeader({ productsCount, isFetching, onSync, isSyncing, onSyncStock, isSyncingStock }: CatalogHeaderProps) {
  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="flex items-center gap-2 text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Catálogo de Produtos <DevBadge id="catalogheader.title" /></h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm">
          {isFetching ? 'Atualizando catálogo...' : `Exibindo ${productsCount} produtos sincronizados`}
        </p>
      </div>
      <div className="flex gap-2 w-full sm:w-auto">
        <button 
          onClick={onSyncStock} 
          disabled={isSyncingStock}
          className="flex-1 sm:flex-none inline-flex items-center justify-center rounded-xl px-4 py-2 text-xs font-bold transition-all border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 disabled:opacity-50"
        >
          <Package size={14} className={`mr-2 ${isSyncingStock ? 'animate-spin' : ''}`} />
          Atualizar Estoque
        </button>
        <button 
          onClick={onSync} 
          disabled={isSyncing}
          className="flex-1 sm:flex-none inline-flex items-center justify-center rounded-xl px-4 py-2 text-xs font-bold transition-all border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-900/50 disabled:opacity-50"
        >
          <RefreshCw size={14} className={`mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
          Sincronizar Tudo
        </button>
      </div>
    </header>
  );
}
