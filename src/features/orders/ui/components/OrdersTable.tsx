import { Package, RefreshCw } from 'lucide-react';
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
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="bg-slate-50/80 border-b border-slate-200">
            <th className="py-4 px-4 font-bold text-slate-500 uppercase text-[10px] tracking-wider">Número Pedido</th>
            <th className="py-4 px-4 font-bold text-slate-500 uppercase text-[10px] tracking-wider">Status/Etapa</th>
            <th className="py-4 px-4 font-bold text-slate-500 uppercase text-[10px] tracking-wider">Resumo Itens</th>
            <th className="py-4 px-4 font-bold text-slate-500 uppercase text-[10px] tracking-wider text-right">Previsão</th>
            <th className="py-4 px-4 font-bold text-slate-500 uppercase text-[10px] tracking-wider text-center">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {orders.map((o) => (
            <tr key={o.id} className="group hover:bg-slate-50/50 transition-all">
              <td className="py-4 px-4">
                  <div className="font-mono font-bold text-blue-600 text-sm">#{o.orderNumber}</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">ID Omie: {o.id}</div>
              </td>
              <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                       <span className={`h-2 w-2 rounded-full ${o.cancelado === 'Y' ? 'bg-red-500' : 'bg-emerald-500'}`} />
                       <span className="font-bold text-slate-700 capitalize">{o.status}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium bg-slate-100 px-1.5 py-0.5 rounded w-fit mt-1">Etapa {o.etapa}</div>
              </td>
              <td className="py-4 px-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-900 font-medium">
                    <Package size={14} className="text-slate-400" />
                    {o.items?.length || 0} Itens
                  </div>
                  {o.items && o.items.length > 0 && (
                      <div className="text-[10px] text-slate-500 truncate max-w-[200px]">
                          {o.items[0]?.description}...
                      </div>
                  )}
                </div>
              </td>
              <td className="py-4 px-4 text-right">
                <div className="font-bold text-slate-700">
                  {o.dataPrevisao ? new Date(o.dataPrevisao).toLocaleDateString('pt-BR') : '-'}
                </div>
                <div className="text-[10px] text-slate-400 italic">Sync: {o.createdAt ? new Date(o.createdAt).toLocaleTimeString('pt-BR') : 'N/A'}</div>
              </td>
              <td className="py-4 px-4 text-center">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-[10px] h-7 px-3 border-blue-200 text-blue-600 hover:bg-blue-50 font-bold uppercase rounded-lg"
                  onClick={() => onOpenDetails(o)}
                >
                  Detalhes
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
