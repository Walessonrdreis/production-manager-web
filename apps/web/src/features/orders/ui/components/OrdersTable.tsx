import { Package, RefreshCw, Eye } from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { Order } from '../../../../hooks/orders/useOrders';

interface OrdersTableProps {
  orders: Order[];
  isLoading: boolean;
  onOpenDetails: (order: Order) => void;
}

export function OrdersTable({ orders, isLoading, onOpenDetails }: OrdersTableProps) {
  if (isLoading) {
    return (
      <div className="flex h-60 items-center justify-center">
        <RefreshCw size={40} className="animate-spin text-blue-600" />
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-24 flex flex-col items-center">
        <Package className="text-slate-200 mb-4" size={64} />
        <h3 className="text-slate-900 font-bold text-lg">Nenhuma ordem encontrada</h3>
        <p className="text-slate-500">O sistema não encontrou registros processados.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {orders.map((o) => (
        <div key={o.id} className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all p-5 flex flex-col relative group cursor-pointer hover:border-blue-200" onClick={() => onOpenDetails(o)}>
          <div className="flex justify-between items-start mb-4 gap-2">
            <div className="pr-2">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="font-mono font-bold text-blue-700 text-sm bg-blue-50 px-2.5 py-0.5 rounded-md">#{o.orderNumber}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide ${o.cancelado === 'Y' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                   {o.status}
                 </span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <div className="font-bold text-slate-800 line-clamp-1">{o.customerName}</div>
                {o.isLocalCustomer && (
                  <span className="bg-blue-100 text-blue-700 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0">LOCAL</span>
                )}
              </div>
              <div className="text-[11px] text-slate-500 font-mono mt-1">Cod Cli: {o.customerId || 'N/A'}</div>
            </div>
            
            <Button 
               variant="outline" 
               size="sm" 
               className="shrink-0 text-xs h-9 w-9 p-0 md:w-auto md:px-4 border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700 font-bold uppercase rounded-lg opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity bg-white shadow-sm"
               onClick={(e) => { e.stopPropagation(); onOpenDetails(o); }}
               title="Ver detalhes"
               aria-label={`Ver detalhes do pedido ${o.orderNumber}`}
             >
               <Eye size={16} className="md:hidden" />
               <span className="hidden md:inline">Detalhes</span>
             </Button>
          </div>

          <div className="mt-auto grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
            <div className="space-y-1">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Itens</div>
              <div className="flex items-center gap-1.5 text-slate-800 font-medium text-sm">
                <Package size={14} className="text-slate-400" />
                {o.items?.length || 0} Itens
              </div>
               {o.items && o.items.length > 0 && (
                  <div className="text-[11px] text-slate-500 truncate mt-1" title={o.items[0]?.description}>
                      {o.items[0]?.description}
                  </div>
              )}
            </div>
            
            <div className="text-right space-y-1 flex flex-col justify-between">
               <div>
                 <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Previsão</div>
                 <div className="font-bold text-slate-800 text-sm">
                    {o.dataPrevisao ? new Date(o.dataPrevisao).toLocaleDateString('pt-BR') : '-'}
                 </div>
               </div>
               <div className="mt-auto pt-1">
                 <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">Etapa {o.etapa}</span>
               </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
