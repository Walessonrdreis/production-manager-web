import { useQuery } from '@tanstack/react-query';
import { OrderService } from '../features/orders/api';
import { Card } from '../shared/ui/Card';
import { Badge } from 'lucide-react'; // Simular um componente badge

export function OrdersPage() {
  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: OrderService.getOrders,
  });

  return (
    <div className="space-y-6 sm:space-y-8">
      <header>
        <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">Ordens de Venda</h1>
        <p className="text-xs sm:text-sm text-zinc-500">Acompanhe todos os pedidos pendentes e em produção</p>
      </header>

      <Card>
        {isLoading ? (
          <div className="flex h-60 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50">
                  <th className="pb-3 px-4 pt-3 font-semibold text-slate-900">Número</th>
                  <th className="pb-3 px-4 pt-3 font-semibold text-slate-900">Cliente</th>
                  <th className="pb-3 px-4 pt-3 font-semibold text-slate-900">Itens</th>
                  <th className="pb-3 px-4 pt-3 font-semibold text-slate-900 text-right">Data</th>
                  <th className="pb-3 px-4 pt-3 font-semibold text-slate-900 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders?.map((o) => (
                  <tr key={o.id} className="group hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-4 font-mono font-bold text-slate-900">#{o.orderNumber}</td>
                    <td className="py-4 px-4 font-medium text-slate-900">{o.customerName}</td>
                    <td className="py-4 px-4 text-slate-500">{o.items.length} produtos</td>
                    <td className="py-4 px-4 text-right text-slate-500">{new Date(o.createdAt).toLocaleDateString()}</td>
                    <td className="py-4 px-4 text-right">
                       <button className="text-blue-600 font-semibold hover:underline">Ver Detalhes</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
