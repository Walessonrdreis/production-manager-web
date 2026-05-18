import {
  CheckCircle2,
  CheckSquare,
  ListFilter,
  RefreshCw,
  Calendar,
  MessageSquare,
} from "lucide-react";
import { Button } from "../../../../components/ui/Button";
import { Card } from "../../../../components/ui/Card";
import { cn } from "../../../../utils/cn";

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
  onOpenSchedule,
}: MonitoringTableProps) {
  const getSchedule = (description: string) => {
    return schedules.find((s) => s.description === description);
  };

  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  const getBadgeColor = (date: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Criar data local a partir da string YYYY-MM-DD para comparação justa
    const [year, month, day] = date.split("-").map(Number);
    const scheduled = new Date(year, month - 1, day);
    scheduled.setHours(0, 0, 0, 0);

    if (scheduled < today) return "bg-red-100 text-red-700 border-red-200";
    if (scheduled.getTime() === today.getTime())
      return "bg-amber-100 text-amber-700 border-amber-200";
    return "bg-blue-100 text-blue-700 border-blue-200";
  };

  return (
    <Card
      title="Planejamento Pendente"
      description="Gerencie as datas de produção e acompanhe o progresso."
    >
      {isLoading ? (
        <div className="flex h-60 items-center justify-center">
          <RefreshCw size={32} className="animate-spin text-blue-600" />
        </div>
      ) : data.length === 0 ? (
        <div className="text-center py-12 text-zinc-500 dark:text-zinc-400 italic">
          Nenhum item pendente para produção no momento.
        </div>
      ) : (
        <div className="flex flex-col gap-2 pb-4">
          {data.map((p, index) => {
            const producedQty = getProducedQuantity(p.description);
            const isFullyProduced = producedQty >= p.totalQuantity;
            const remainingQty = Math.max(0, p.totalQuantity - producedQty);
            const schedule = getSchedule(p.description);

            return (
              <div
                key={index}
                className={cn(
                  "group flex flex-col md:flex-row md:items-center justify-between p-3 md:px-4 gap-3 md:gap-4 bg-white dark:bg-slate-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer relative",
                  isFullyProduced
                    ? "border-emerald-100 bg-emerald-50/10 grayscale-[0.3]"
                    : "hover:border-blue-200",
                )}
                onClick={() => onSelectProduct(p.description)}
              >
                {/* Produto Info */}
                <div className="flex items-center gap-3 w-full md:w-[40%] min-w-0 shrink">
                  <div
                    className={cn(
                      "w-5 h-5 rounded border flex shrink-0 items-center justify-center transition-all cursor-pointer",
                      isFullyProduced
                        ? "bg-emerald-500 border-emerald-500 text-white"
                        : "border-zinc-300 bg-white dark:bg-slate-900 group-hover:border-blue-400",
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectProduct(p.description);
                    }}
                    aria-label={`Status da produção para ${p.description}`}
                  >
                    {isFullyProduced && (
                      <CheckCircle2 size={14} strokeWidth={3} />
                    )}
                  </div>
                  <div className="flex flex-col gap-1 min-w-0 flex-1">
                    <h3
                      className={cn(
                        "font-bold text-sm leading-tight transition-all uppercase truncate",
                        isFullyProduced
                          ? "text-zinc-400 line-through"
                          : "text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600",
                      )}
                      title={p.description}
                    >
                      {p.description}
                    </h3>
                    {isFullyProduced && (
                      <span className="w-max text-[10px] font-bold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded uppercase block">
                        Concluído
                      </span>
                    )}
                  </div>
                </div>

                {/* Notes */}
                <div className="flex flex-col items-start w-full md:w-[25%] shrink-0 min-w-0">
                  {schedule?.notes ? (
                    <div
                      className="flex items-center gap-1 text-[10px] text-amber-600 font-medium italic bg-amber-50 rounded px-2 py-1 max-w-full truncate"
                      title={schedule.notes}
                    >
                      <MessageSquare size={10} className="shrink-0" />
                      <span className="truncate">{schedule.notes}</span>
                    </div>
                  ) : (
                    <span className="text-[10px] text-zinc-300 italic">
                      Sem notas
                    </span>
                  )}
                </div>

                {/* Valores e Ações */}
                <div className="flex flex-wrap sm:flex-nowrap items-center justify-between w-full md:w-[35%] pt-3 border-t border-zinc-100 dark:border-zinc-800 md:border-t-0 md:pt-0 gap-3 shrink-0">
                  <div className="flex flex-col items-start md:items-end flex-1 min-w-[70px]">
                    <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider mb-0.5">
                      Pendente
                    </span>
                    <div className="flex items-baseline space-x-1">
                      <span
                        className={cn(
                          "font-black text-base leading-none transition-all",
                          isFullyProduced ? "text-zinc-300" : "text-blue-600",
                        )}
                      >
                        {remainingQty}
                      </span>
                      <span className="text-[10px] text-zinc-400 font-bold uppercase">
                        un
                      </span>
                    </div>
                    {producedQty > 0 && producedQty < p.totalQuantity && (
                      <div
                        className="text-[10px] text-emerald-500 font-normal mt-0.5 truncate"
                        title={`${producedQty} marcados como produzidos`}
                      >
                        (-{producedQty} feitos)
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-start md:items-end whitespace-nowrap flex-1 min-w-[90px]">
                    <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider mb-0.5">
                      Programação
                    </span>
                    {schedule ? (
                      <div
                        className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenSchedule(p.description);
                        }}
                      >
                        <span
                          className={cn(
                            "px-2 py-1 rounded-md text-[11px] font-bold border flex items-center gap-1.5 w-max",
                            getBadgeColor(schedule.scheduledAt),
                          )}
                        >
                          <Calendar size={12} />
                          {formatDate(schedule.scheduledAt)}
                        </span>
                      </div>
                    ) : (
                      <div
                        className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium italic hover:text-blue-500 transition-colors cursor-pointer flex items-center gap-1 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 px-2 py-1 rounded-md w-max"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenSchedule(p.description);
                        }}
                      >
                        <Calendar size={12} strokeWidth={2.5} />
                        Programar
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-1 shrink-0 ml-auto md:bg-transparent rounded-lg p-1 md:p-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs h-8 text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-800 dark:bg-zinc-800"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectProduct(p.description);
                      }}
                    >
                      Detalhes
                    </Button>
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
