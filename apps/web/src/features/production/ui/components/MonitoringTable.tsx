import { CheckCircle2, CheckSquare, ListFilter, RefreshCw, Calendar, MessageSquare } from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { Card } from '../../../../components/ui/Card';
import { cn } from '../../../../utils/cn';

interface MonitoringTableProps {
  isLoading: boolean;
  data: any[];
  getProducedQuantity: (desc: string) => number;
  onToggleProduct: (desc: string, qty: number) => void;
  onSelectProduct: (desc: string) => void;
  schedules: any[];
  onOpenSchedule: (desc: string) => void;
}

export function MonitoringTable({
  isLoading,
  data,
  getProducedQuantity,
  onToggleProduct,
  onSelectProduct,
  schedules,
  onOpenSchedule
}: MonitoringTableProps) {
  const getSchedule = (description: string) => {
    return schedules.find(s => s.description === description);
  };

  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  const getBadgeColor = (date: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Criar data local a partir da string YYYY-MM-DD para comparação justa
    const [year, month, day] = date.split('-').map(Number);
    const scheduled = new Date(year, month - 1, day);
    scheduled.setHours(0, 0, 0, 0);

    if (scheduled < today) return 'bg-red-100 text-red-700 border-red-200';
    if (scheduled.getTime() === today.getTime()) return 'bg-amber-100 text-amber-700 border-amber-200';
    return 'bg-blue-100 text-blue-700 border-blue-200';
  };

  return (
    <Card title="Planejamento Pendente" description="Gerencie as datas de produção e acompanhe o progresso.">
      {isLoading ? (
        <div className="flex h-60 items-center justify-center">
          <RefreshCw size={32} className="animate-spin text-blue-600" />
        </div>
      ) : data.length === 0 ? (
        <div className="text-center py-12 text-zinc-500 italic">Nenhum item pendente para produção no momento.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/50">
                <th className="pb-3 px-4 pt-3 font-semibold text-zinc-900 w-12 text-center">Status</th>
                <th className="pb-3 px-4 pt-3 font-semibold text-zinc-900">Descrição do Produto</th>
                <th className="pb-3 px-4 pt-3 font-semibold text-zinc-900">Programação</th>
                <th className="pb-3 px-4 pt-3 font-semibold text-zinc-900 text-right">Total Pendente</th>
                <th className="pb-3 px-4 pt-3 font-semibold text-zinc-900 text-right w-32">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {data.map((p, index) => {
                const producedQty = getProducedQuantity(p.description);
                const isFullyProduced = producedQty >= p.totalQuantity;
                const remainingQty = Math.max(0, p.totalQuantity - producedQty);
                const schedule = getSchedule(p.description);

                return (
                  <tr 
                    key={index} 
                    className={cn(
                      "group hover:bg-zinc-50 transition-colors",
                      isFullyProduced && "bg-emerald-50/30 grayscale-[0.5]"
                    )}
                  >
                    <td className="py-4 px-4 text-center">
                      <div 
                        className={cn(
                          "w-5 h-5 rounded border flex items-center justify-center transition-all cursor-pointer",
                          isFullyProduced 
                            ? "bg-emerald-500 border-emerald-500 text-white" 
                            : "border-zinc-300 bg-white group-hover:border-blue-400"
                        )}
                        onClick={() => onSelectProduct(p.description)}
                      >
                        {isFullyProduced && <CheckCircle2 size={14} strokeWidth={3} />}
                      </div>
                    </td>
                    <td 
                      className={cn(
                        "py-4 px-4 font-medium transition-all cursor-pointer text-zinc-900",
                        isFullyProduced && "text-zinc-400 line-through"
                      )} 
                      onClick={() => onSelectProduct(p.description)}
                    >
                      <div className="flex flex-col">
                        <span>{p.description}</span>
                        {schedule?.notes && (
                          <div className="flex items-center gap-1 mt-1 text-[10px] text-amber-600 font-medium italic">
                            <MessageSquare size={10} />
                            {schedule.notes}
                          </div>
                        )}
                        {isFullyProduced && <span className="mt-1 w-fit text-[10px] font-bold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded uppercase">Concluído</span>}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {schedule ? (
                        <div 
                          className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => onOpenSchedule(p.description)}
                        >
                          <span className={cn(
                            "px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1.5",
                            getBadgeColor(schedule.scheduledAt)
                          )}>
                            <Calendar size={10} />
                            {formatDate(schedule.scheduledAt)}
                          </span>
                        </div>
                      ) : (
                        <div 
                          className="text-[10px] text-zinc-400 font-medium italic hover:text-blue-500 transition-colors cursor-pointer flex items-center gap-1.5"
                          onClick={() => onOpenSchedule(p.description)}
                        >
                          <Calendar size={12} strokeWidth={2.5} />
                          Programar...
                        </div>
                      )}
                    </td>
                    <td 
                      className={cn(
                        "py-4 px-4 text-right font-bold transition-all",
                        isFullyProduced ? "text-zinc-300" : "text-blue-600"
                      )}
                    >
                      {remainingQty} <span className="text-[10px] text-zinc-400 font-normal uppercase ml-1">un</span>
                      {producedQty > 0 && producedQty < p.totalQuantity && (
                        <div className="text-[10px] text-emerald-500 font-normal">(-{producedQty} marcados)</div>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right space-x-2 whitespace-nowrap">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-zinc-400 hover:text-emerald-600"
                        title="Marcar tudo como pronto"
                        onClick={() => onToggleProduct(p.description, p.totalQuantity)}
                      >
                        <CheckSquare size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-zinc-400 hover:text-blue-600"
                        title="Gerenciar Programação"
                        onClick={() => onOpenSchedule(p.description)}
                      >
                        <Calendar size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-zinc-400 hover:text-zinc-600"
                        title="Ver detalhes"
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
