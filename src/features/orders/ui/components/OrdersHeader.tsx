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
        <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">Ordens de Venda</h1>
        <p className="text-xs sm:text-sm text-zinc-500">Total de pedidos: {ordersCount}</p>
      </div>
      <Button onClick={onRefresh} variant="ghost" size="icon" className="h-10 w-10">
          <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
      </Button>
    </header>
  );
}
