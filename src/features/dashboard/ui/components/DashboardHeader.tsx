import { Button } from '../../../../components/ui/Button';
import { RefreshCw } from 'lucide-react';

interface DashboardHeaderProps {
  isFetching: boolean;
  isSyncing: boolean;
  onSync: () => void;
}

export function DashboardHeader({ isFetching, isSyncing, onSync }: DashboardHeaderProps) {
  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">Status de Produção</h1>
        <p className="text-xs sm:text-sm text-zinc-500">Etapa 20 - Produtos e Vendas em Aberto</p>
      </div>
      <div className="flex items-center gap-4 w-full sm:w-auto">
        {(isFetching || isSyncing) && <RefreshCw size={16} className="animate-spin text-blue-500" />}
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full sm:w-auto text-xs"
          onClick={onSync} 
          disabled={isFetching || isSyncing}
          isLoading={isSyncing}
        >
          Sincronizar agora
        </Button>
      </div>
    </header>
  );
}
