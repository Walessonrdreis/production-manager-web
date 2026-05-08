import { Package, TrendingUp, Clock } from 'lucide-react';
import { Card } from '../../../../components/ui/Card';

interface MonitoringStatsProps {
  totalItems: number;
  uniqueSkus: number;
  lastUpdate?: string;
  isLoading: boolean;
}

export function MonitoringStats({ totalItems, uniqueSkus, lastUpdate, isLoading }: MonitoringStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
      <Card className="border-l-4 border-l-blue-600">
        <div className="flex items-center gap-2 text-zinc-500 mb-2">
          <Package size={16} />
          <span className="text-xs font-semibold uppercase tracking-wider">Total de Itens</span>
        </div>
        <div className="text-3xl font-bold text-zinc-900">
          {isLoading ? '...' : totalItems}
        </div>
      </Card>
      
      <Card className="border-l-4 border-l-amber-500">
        <div className="flex items-center gap-2 text-zinc-500 mb-2">
          <TrendingUp size={16} className="text-amber-500" />
          <span className="text-xs font-semibold uppercase tracking-wider">SKUs Únicos</span>
        </div>
        <div className="text-3xl font-bold text-zinc-900">
           {isLoading ? '...' : uniqueSkus}
        </div>
      </Card>

      <Card className="border-l-4 border-l-emerald-500">
        <div className="flex items-center gap-2 text-zinc-500 mb-2">
          <Clock size={16} className="text-emerald-500" />
          <span className="text-xs font-semibold uppercase tracking-wider">Última Atualização</span>
        </div>
        <div className="text-xl font-semibold text-zinc-700">
          {isLoading ? '...' : lastUpdate ? new Date(lastUpdate).toLocaleTimeString() : 'Agora'}
        </div>
      </Card>
    </div>
  );
}
