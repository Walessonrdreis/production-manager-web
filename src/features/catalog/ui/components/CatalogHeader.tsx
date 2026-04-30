import { Button } from '../../../../components/ui/Button';
import { RefreshCw } from 'lucide-react';

interface CatalogHeaderProps {
  productsCount: number;
  isFetching: boolean;
  onSync: () => void;
  isSyncing: boolean;
}

export function CatalogHeader({ productsCount, isFetching, onSync, isSyncing }: CatalogHeaderProps) {
  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">Catálogo de Produtos</h1>
        <p className="text-zinc-500 text-xs sm:text-sm">
          {isFetching ? 'Atualizando catálogo...' : `Exibindo ${productsCount} produtos sincronizados`}
        </p>
      </div>
      <div className="flex gap-2 w-full sm:w-auto">
        <button 
          onClick={onSync} 
          disabled={isSyncing}
          className="flex-1 sm:flex-none inline-flex items-center justify-center rounded-xl px-4 py-2 text-xs font-bold transition-all border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw size={14} className={`mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
          Sincronizar
        </button>
      </div>
    </header>
  );
}
