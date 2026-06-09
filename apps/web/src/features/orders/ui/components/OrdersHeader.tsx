import { DevBadge } from '../../../../components/ui/DevBadge';
import { RefreshCw } from 'lucide-react';
import { Button } from '../../../../components/ui/Button';

interface OrdersHeaderProps {
  ordersCount: number;
  isLoading: boolean;
  onRefresh: () => void;
}

export function OrdersHeader({ ordersCount, isLoading, onRefresh }: OrdersHeaderProps) {
  return (
    <header className="flex justify-between items-center">
      <div>
        <h1 className="flex items-center gap-2 text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Ordens de Venda <DevBadge id="ordersheader.title" /></h1>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">Total de pedidos: {ordersCount}</p>
      </div>
      <Button onClick={onRefresh} variant="ghost" size="icon" className="h-10 w-10">
          <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
      </Button>
    </header>
  );
}
