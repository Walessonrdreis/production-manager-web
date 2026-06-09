import React from 'react';
import { ProductionOrder } from '../models/types';
import { Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

interface Props {
  orders: ProductionOrder[];
  isLoading: boolean;
}

const statusConfig = {
  PENDING: { label: 'Pendente', icon: Clock, className: 'text-amber-500 bg-amber-50 dark:bg-amber-500/10' },
  IN_PROGRESS: { label: 'Em Andamento', icon: AlertCircle, className: 'text-blue-500 bg-blue-50 dark:bg-blue-500/10' },
  COMPLETED: { label: 'Concluído', icon: CheckCircle2, className: 'text-green-500 bg-green-50 dark:bg-green-500/10' },
  CANCELED: { label: 'Cancelado', icon: XCircle, className: 'text-red-500 bg-red-50 dark:bg-red-500/10' },
};

export function ProductionOrderList({ orders, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12 text-slate-500">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 dark:border-white"></div>
        <span className="ml-3">Carregando ordens de produção...</span>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-center border rounded-lg border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
          <Clock className="w-6 h-6 text-slate-400" />
        </div>
        <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">Nenhuma Ordem Encontrada</h3>
        <p className="text-sm text-slate-500 max-w-sm mx-auto">
          Você não possui ordens de produção castradas. Crie sua primeira O.P. para começar.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500">
            <tr>
              <th scope="col" className="px-6 py-4 font-medium whitespace-nowrap">Código</th>
              <th scope="col" className="px-6 py-4 font-medium">Status</th>
              <th scope="col" className="px-6 py-4 font-medium">Itens</th>
              <th scope="col" className="px-6 py-4 font-medium whitespace-nowrap">Atualizado Em</th>
              <th scope="col" className="px-6 py-4 font-medium text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {orders.map((order) => {
              const status = statusConfig[order.status];
              const StatusIcon = status.icon;

              return (
                <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-medium text-slate-900 dark:text-white">{order.code}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.className}`}>
                      <StatusIcon className="w-3.5 h-3.5" />
                      {status.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-900 dark:text-white">{order.items.length} itens</span>
                      <span className="text-xs text-slate-400">Total qtde: {order.items.reduce((acc, i) => acc + i.quantity, 0)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                    {new Date(order.updatedAt).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors text-xs font-medium">
                        Detalhes
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
