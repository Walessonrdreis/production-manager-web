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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-4 px-1">
          {data.map((p, index) => {
            const producedQty = getProducedQuantity(p.description);
            const isFullyProduced = producedQty >= p.totalQuantity;
            const remainingQty = Math.max(0, p.totalQuantity - producedQty);
            const schedule = getSchedule(p.description);

            return (
              <div 
                key={index} 
                className={cn(
                  "group bg-white rounded-xl p-4 shadow-sm border hover:shadow-md transition-all flex flex-col cursor-pointer relative",
                  isFullyProduced ? "border-emerald-100 bg-emerald-50/10 grayscale-[0.3]" : "border-zinc-200 hover:border-blue-100"
                )}
                onClick={() => onSelectProduct(p.description)}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex gap-3 items-start pr-8">
                     <div 
                        className={cn(
                          "w-5 h-5 mt-0.5 rounded border flex shrink-0 items-center justify-center transition-all cursor-pointer",
                          isFullyProduced 
                            ? "bg-emerald-500 border-emerald-500 text-white" 
                            : "border-zinc-300 bg-white group-hover:border-blue-400"
                        )}
                        onClick={(e) => { e.stopPropagation(); onSelectProduct(p.description); }}
                        aria-label={`Status da produção para ${p.description}`}
                      >
                        {isFullyProduced && <CheckCircle2 size={14} strokeWidth={3} />}
                      </div>
                      <div>
                        <h3 className={cn(
                            "font-bold text-sm leading-tight transition-all uppercase line-clamp-2",
                            isFullyProduced ? "text-zinc-400 line-through" : "text-zinc-900 group-hover:text-blue-600"
                          )} 
                          title={p.description}
                        >
                          {p.description}
                        </h3>
                        {isFullyProduced && <span className="mt-1 w-fit text-[10px] font-bold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded uppercase block">Concluído</span>}
                      </div>
                  </div>
                  
                  <div className="absolute top-3 right-3 flex flex-col gap-1 opacity-100 lg:opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity bg-white/80 backdrop-blur rounded p-0.5">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-zinc-400 hover:text-emerald-600 hover:bg-emerald-50"
                        title="Marcar tudo como pronto"
                        aria-label={`Marcar tudo como pronto para ${p.description}`}
                        onClick={(e) => { e.stopPropagation(); onToggleProduct(p.description, p.totalQuantity); }}
                      >
                        <CheckSquare size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-zinc-400 hover:text-blue-600 hover:bg-blue-50"
                        title="Gerenciar Programação"
                        aria-label={`Gerenciar Programação para ${p.description}`}
                        onClick={(e) => { e.stopPropagation(); onOpenSchedule(p.description); }}
                      >
                        <Calendar size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50"
                        title="Ver detalhes"
                        aria-label={`Ver detalhes de ${p.description}`}
                        onClick={(e) => { e.stopPropagation(); onSelectProduct(p.description); }}
                      >
                        <ListFilter size={16} />
                      </Button>
                  </div>
                </div>

                <div className="mb-4 pl-8">
                  {schedule?.notes && (
                    <div className="flex items-center gap-1 mt-1 text-[10px] text-amber-600 font-medium italic bg-amber-50 rounded px-2 py-1 line-clamp-2" title={schedule.notes}>
                      <MessageSquare size={10} className="shrink-0" />
                      {schedule.notes}
                    </div>
                  )}
                </div>

                <div className="mt-auto grid grid-cols-2 gap-3 pt-3 border-t border-zinc-50 pl-8 items-end">
                   <div>
                       <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block mb-1">Programação</span>
                       {schedule ? (
                        <div 
                          className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={(e) => { e.stopPropagation(); onOpenSchedule(p.description); }}
                        >
                          <span className={cn(
                            "px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1.5 w-fit",
                            getBadgeColor(schedule.scheduledAt)
                          )}>
                            <Calendar size={10} />
                            {formatDate(schedule.scheduledAt)}
                          </span>
                        </div>
                      ) : (
                        <div 
                          className="text-[10px] text-zinc-400 font-medium italic hover:text-blue-500 transition-colors cursor-pointer flex items-center gap-1.5"
                          onClick={(e) => { e.stopPropagation(); onOpenSchedule(p.description); }}
                        >
                          <Calendar size={12} strokeWidth={2.5} />
                          Programar...
                        </div>
                      )}
                   </div>
                   <div className="text-right">
                       <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block mb-0.5">Pendente</span>
                       <div 
                        className={cn(
                          "font-bold text-lg leading-none transition-all",
                          isFullyProduced ? "text-zinc-300" : "text-blue-600"
                        )}
                      >
                        {remainingQty} <span className="text-[10px] text-zinc-400 font-normal uppercase ml-0.5">un</span>
                      </div>
                      {producedQty > 0 && producedQty < p.totalQuantity && (
                        <div className="text-[10px] text-emerald-500 font-normal mt-0.5" title={`${producedQty} marcados como produzidos`}>
                           (-{producedQty} marcados)
                        </div>
                      )}
                   </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
