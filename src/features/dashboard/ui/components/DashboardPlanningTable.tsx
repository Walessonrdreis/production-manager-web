import { CheckCircle2, CheckSquare, ListFilter, RefreshCw } from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { Card } from '../../../../components/ui/Card';
import { cn } from '../../../../utils/cn';

interface DashboardPlanningTableProps {
  isLoading: boolean;
  data: any[];
  getProducedQuantity: (desc: string) => number;
  onToggleProduct: (desc: string, qty: number) => void;
  onSelectProduct: (desc: string) => void;
}

export function DashboardPlanningTable({
  isLoading,
  data,
  getProducedQuantity,
  onToggleProduct,
  onSelectProduct
}: DashboardPlanningTableProps) {
  return (
    <Card title="Planejamento Pendente" description="Clique em um produto para ver detalhes por pedido.">
      {isLoading ? (
        <div className="flex h-60 items-center justify-center">
          <RefreshCw size={32} className="animate-spin text-blue-600" />
        </div>
      ) : data.length === 0 ? (
        <div className="text-center py-12 text-slate-500">Nenhum item pendente para produção no momento.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50">
                <th className="pb-3 px-4 pt-3 font-semibold text-slate-900 w-12 text-center">Status</th>
                <th className="pb-3 px-4 pt-3 font-semibold text-slate-900">Descrição do Produto</th>
                <th className="pb-3 px-4 pt-3 font-semibold text-slate-900 text-right">Total Pendente</th>
                <th className="pb-3 px-4 pt-3 font-semibold text-slate-900 text-right w-32">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.map((p, index) => {
                const producedQty = getProducedQuantity(p.description);
                const isFullyProduced = producedQty >= p.totalQuantity;
                const remainingQty = Math.max(0, p.totalQuantity - producedQty);

                return (
                  <tr 
                    key={index} 
                    className={cn(
                      "group hover:bg-slate-50 transition-colors",
                      isFullyProduced && "bg-emerald-50/30 grayscale-[0.5]"
                    )}
                  >
                    <td className="py-4 px-4 text-center" onClick={() => onSelectProduct(p.description)}>
                      <div className={cn(
                        "w-5 h-5 rounded border flex items-center justify-center transition-all cursor-pointer",
                        isFullyProduced 
                          ? "bg-emerald-500 border-emerald-500 text-white" 
                          : "border-slate-300 bg-white group-hover:border-blue-400"
                      )}>
                        {isFullyProduced && <CheckCircle2 size={14} strokeWidth={3} />}
                      </div>
                    </td>
                    <td className={cn(
                      "py-4 px-4 font-medium transition-all cursor-pointer",
                      isFullyProduced ? "text-slate-400 line-through" : "text-slate-900"
                    )} onClick={() => onSelectProduct(p.description)}>
                      {p.description}
                      {isFullyProduced && <span className="ml-2 text-[10px] font-bold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded uppercase">Concluído</span>}
                    </td>
                    <td className={cn(
                      "py-4 px-4 text-right font-bold transition-all",
                      isFullyProduced ? "text-slate-300" : "text-blue-600"
                    )}>
                      {remainingQty} <span className="text-[10px] text-slate-400 font-normal uppercase ml-1">un</span>
                      {producedQty > 0 && producedQty < p.totalQuantity && (
                        <div className="text-[10px] text-emerald-500 font-normal">(-{producedQty} marcados)</div>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-slate-400 hover:text-emerald-600"
                        title="Marcar tudo como pronto"
                        onClick={() => onToggleProduct(p.description, p.totalQuantity)}
                      >
                        <CheckSquare size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-slate-400 hover:text-blue-600"
                        onClick={() => onSelectProduct(p.description)}
                      >
                        <ListFilter size={16} />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
