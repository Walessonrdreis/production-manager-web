import { useQuery, useMutation } from '@tanstack/react-query';
import { DashboardService } from '../features/dashboard/api';
import { ENDPOINTS } from '../shared/api/endpoints';
import { Card } from '../shared/ui/Card';
import { Package, RefreshCw, AlertCircle, TrendingUp, Clock, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '../shared/ui/Button';
import { useState } from 'react';
import { cn } from '../shared/lib/utils';

export function DashboardPage() {
  const [producedItems, setProducedItems] = useState<Record<string, boolean>>({});

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['stage20-totals'],
    queryFn: DashboardService.getStage20Totals,
    refetchInterval: 30000,
    refetchOnWindowFocus: true,
    retry: 2,
  });

  const syncMutation = useMutation({
    mutationFn: DashboardService.syncStage20,
    onSuccess: () => {
      refetch();
    },
  });

  const toggleProduced = (id: string | number) => {
    setProducedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  if (isError) {
    const axiosError = error as any;
    const status = axiosError.response?.status || 'Erro';
    const statusText = axiosError.response?.statusText || 'Falha na comunicação';
    
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="bg-red-50 p-6 rounded-2xl border border-red-100 max-w-sm">
          <AlertCircle size={32} className="text-red-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-red-900 mb-1">Resposta do Servidor</h2>
          <p className="text-red-700 font-mono text-sm mb-6 bg-white py-2 rounded border border-red-100">
            HTTP {status}: {statusText}
          </p>
          <Button onClick={() => refetch()} variant="outline" size="sm" className="w-full">
            Tentar Novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-8">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">Status de Produção</h1>
          <p className="text-xs sm:text-sm text-zinc-500">Etapa 20 - Produtos e Vendas em Aberto</p>
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          {(isFetching || syncMutation.isPending) && <RefreshCw size={16} className="animate-spin text-blue-500" />}
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full sm:w-auto text-xs"
            onClick={() => syncMutation.mutate()} 
            disabled={isFetching || syncMutation.isPending}
            isLoading={syncMutation.isPending}
          >
            Sincronizar agora
          </Button>
        </div>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        <Card className="border-l-4 border-l-blue-600">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <Package size={16} />
            <span className="text-xs font-semibold uppercase tracking-wider">Total de Itens</span>
          </div>
          <div className="text-3xl font-bold text-slate-900">
            {isLoading ? '...' : data?.totalItems || 0}
          </div>
        </Card>
        
        <Card className="border-l-4 border-l-amber-500">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <TrendingUp size={16} className="text-amber-500" />
            <span className="text-xs font-semibold uppercase tracking-wider">SKUs Únicos</span>
          </div>
          <div className="text-3xl font-bold text-slate-900">
             {isLoading ? '...' : data?.data.length || 0}
          </div>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <Clock size={16} className="text-emerald-500" />
            <span className="text-xs font-semibold uppercase tracking-wider">Última Atualização</span>
          </div>
          <div className="text-xl font-semibold text-slate-700">
            {isLoading ? '...' : data?.lastUpdate ? new Date(data.lastUpdate).toLocaleTimeString() : 'Agora'}
          </div>
        </Card>
      </div>

      {/* Main Totals Table */}
      <Card title="Planejamento Pendente" description="Totais de produtos que precisam iniciar produção.">
        {isLoading ? (
          <div className="flex h-60 items-center justify-center">
            <RefreshCw size={32} className="animate-spin text-blue-600" />
          </div>
        ) : (data?.data.length || 0) === 0 ? (
          <div className="text-center py-12 text-slate-500">Nenhum item pendente para produção no momento.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50">
                  <th className="pb-3 px-4 pt-3 font-semibold text-slate-900 w-12 text-center">Status</th>
                  <th className="pb-3 px-4 pt-3 font-semibold text-slate-900">Descrição do Produto</th>
                  <th className="pb-3 px-4 pt-3 font-semibold text-slate-900 text-right">Quantidade Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data?.data.map((p, index) => {
                  const isProduced = producedItems[p.description] || false;
                  return (
                    <tr 
                      key={index} 
                      className={cn(
                        "group hover:bg-slate-50 transition-colors cursor-pointer",
                        isProduced && "bg-emerald-50/30 grayscale-[0.5]"
                      )}
                      onClick={() => toggleProduced(p.description)}
                    >
                      <td className="py-4 px-4 text-center">
                        <div className={cn(
                          "w-5 h-5 rounded border flex items-center justify-center transition-all",
                          isProduced 
                            ? "bg-emerald-500 border-emerald-500 text-white" 
                            : "border-slate-300 bg-white group-hover:border-blue-400"
                        )}>
                          {isProduced && <CheckCircle2 size={14} strokeWidth={3} />}
                        </div>
                      </td>
                      <td className={cn(
                        "py-4 px-4 font-medium transition-all",
                        isProduced ? "text-slate-400 line-through" : "text-slate-900"
                      )}>
                        {p.description}
                      </td>
                      <td className={cn(
                        "py-4 px-4 text-right font-bold transition-all",
                        isProduced ? "text-slate-300" : "text-blue-600"
                      )}>
                        {p.totalQuantity} <span className="text-[10px] text-slate-400 font-normal uppercase ml-1">un</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
