import { Package, Eye } from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { Skeleton } from '../../../../components/ui/Skeleton';
import { Order } from '../../../../hooks/orders/useOrders';

interface OrdersTableProps {
  orders: Order[];
  isLoading: boolean;
  onOpenDetails: (order: Order) => void;
}

export function OrdersTable({ orders, isLoading, onOpenDetails }: OrdersTableProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-4 flex flex-col md:flex-row gap-4 h-auto md:h-[84px] items-start md:items-center">
            <div className="flex gap-4 flex-1 w-full">
              <Skeleton className="w-[80px] h-[50px] rounded-md shrink-0" />
              <div className="flex flex-col gap-2 flex-1">
                <Skeleton className="h-5 w-[50%] max-w-[200px] rounded" />
                <Skeleton className="h-4 w-[30%] max-w-[120px] rounded" />
              </div>
            </div>
            <div className="hidden sm:flex flex-1 flex-col gap-2 border-l border-slate-100 dark:border-slate-800 pl-6">
               <Skeleton className="h-3 w-[60px] rounded" />
               <Skeleton className="h-4 w-[120px] rounded" />
            </div>
            <div className="flex flex-1 justify-end w-full sm:w-auto">
               <div className="flex flex-col items-end gap-2 shrink-0">
                 <Skeleton className="h-3 w-[50px] rounded" />
                 <Skeleton className="h-5 w-[80px] rounded" />
               </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-24 flex flex-col items-center">
        <Package className="text-slate-200 mb-4" size={64} />
        <h3 className="text-slate-900 dark:text-slate-100 font-bold text-lg">Nenhuma ordem encontrada</h3>
        <p className="text-slate-500 dark:text-slate-400">O sistema não encontrou registros processados.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {orders.map((o) => (
        <div key={o.id} className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md transition-all p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 relative group cursor-pointer hover:border-blue-200" onClick={() => onOpenDetails(o)}>
          <div className="flex flex-1 items-center gap-4">
             <div className="pr-4 border-r border-slate-100 dark:border-slate-800">
                <div className="font-mono font-bold text-blue-700 text-sm bg-blue-50 px-2.5 py-1 rounded-md mb-1.5">#{o.orderNumber}</div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide inline-block ${o.cancelado === 'Y' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                   {o.status}
                 </span>
             </div>
             <div>
                <div className="flex items-center gap-2">
                  <div className="font-bold text-slate-800 dark:text-slate-200 text-base leading-tight">{o.customerName}</div>
                  {o.isLocalCustomer && (
                    <span className="bg-blue-100 text-blue-700 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">LOCAL</span>
                  )}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-1">Cod Cli: {o.customerId || 'N/A'}</div>
             </div>
          </div>

          <div className="flex-1 flex items-center justify-between gap-6 md:border-l md:border-slate-100 dark:border-slate-800 md:pl-6 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
             <div className="hidden sm:block">
               <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">Itens</div>
               <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200 font-medium text-sm">
                 <Package size={14} className="text-slate-400" />
                 {o.items?.length || 0} Itens
               </div>
                {o.items && o.items.length > 0 && (
                   <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-1 max-w-[150px] md:max-w-[180px]" title={o.items[0]?.description}>
                       {o.items[0]?.description}
                   </div>
               )}
             </div>
             
             <div className="text-right">
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">Previsão</div>
                <div className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                   {o.dataPrevisao ? new Date(o.dataPrevisao).toLocaleDateString('pt-BR') : '-'}
                </div>
                <div className="mt-1">
                  <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">Etapa {o.etapa}</span>
                </div>
             </div>
             
             <Button 
                variant="outline" 
                size="sm" 
                className="shrink-0 text-xs h-9 w-9 p-0 md:w-auto md:px-4 border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700 font-bold uppercase rounded-lg opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                onClick={(e) => { e.stopPropagation(); onOpenDetails(o); }}
                title="Ver detalhes"
             >
                <Eye size={16} className="md:hidden" />
                <span className="hidden md:inline">Detalhes</span>
             </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
