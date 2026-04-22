import { useState } from 'react';
import { useOrders, Order } from '../../hooks/api/useOrders';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { RefreshCw, Package, AlertCircle, Calendar, Hash, Tag, ClipboardList } from 'lucide-react';

export function OrdersPage() {
  const { orders, isLoading, isError, error, refetchOrders } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  console.log('OrdersPage rendering with data:', orders);

  const handleOpenDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="bg-red-50 p-6 rounded-2xl border border-red-100 max-w-sm">
          <AlertCircle size={32} className="text-red-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-red-900 mb-1">Erro ao Carregar Ordens</h2>
          <p className="text-red-700 text-sm mb-6">
            {(error as any)?.message || 'Não foi possível carregar os dados das ordens de venda.'}
          </p>
          <Button onClick={() => refetchOrders()} variant="outline" size="sm" className="w-full">
            Tentar Novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">Ordens de Venda</h1>
          <p className="text-xs sm:text-sm text-zinc-500">Total de pedidos: {orders?.length || 0}</p>
        </div>
        <Button onClick={() => refetchOrders()} variant="ghost" size="icon" className="h-10 w-10">
            <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
        </Button>
      </header>

      <Card>
        {isLoading ? (
          <div className="flex h-60 items-center justify-center">
            <RefreshCw size={40} className="animate-spin text-blue-600" />
          </div>
        ) : !orders || orders.length === 0 ? (
          <div className="text-center py-24 flex flex-col items-center">
            <Package className="text-slate-200 mb-4" size={64} />
            <h3 className="text-slate-900 font-bold text-lg">Nenhuma ordem encontrada</h3>
            <p className="text-slate-500">O sistema não encontrou registros processados.</p>
          </div>
        ) : (
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
                        onClick={() => handleOpenDetails(o)}
                      >
                        Detalhes
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Details Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedOrder ? `Pedido #${selectedOrder.orderNumber}` : 'Detalhes do Pedido'}
      >
        {selectedOrder && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                <div className="flex items-center gap-2 text-[10px] text-zinc-400 uppercase font-bold tracking-wider mb-1">
                  <Hash size={12} />
                  Omie Code
                </div>
                <div className="text-sm font-mono font-bold text-zinc-700">{selectedOrder.id}</div>
              </div>
              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                <div className="flex items-center gap-2 text-[10px] text-zinc-400 uppercase font-bold tracking-wider mb-1">
                  <Calendar size={12} />
                  Previsão
                </div>
                <div className="text-sm font-bold text-zinc-700">
                  {selectedOrder.dataPrevisao ? new Date(selectedOrder.dataPrevisao).toLocaleDateString('pt-BR') : 'N/A'}
                </div>
              </div>
              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                <div className="flex items-center gap-2 text-[10px] text-zinc-400 uppercase font-bold tracking-wider mb-1">
                  <Tag size={12} />
                  Etapa
                </div>
                <div className="text-sm font-bold text-zinc-700">{selectedOrder.etapa}</div>
              </div>
               <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                <div className="flex items-center gap-2 text-[10px] text-zinc-400 uppercase font-bold tracking-wider mb-1">
                  <ClipboardList size={12} />
                  Status
                </div>
                <div className="text-sm font-bold text-zinc-700 capitalize">{selectedOrder.status}</div>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Package size={14} />
                Lista de Itens ({selectedOrder.items?.length || 0})
              </h3>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-white border border-zinc-100 rounded-xl shadow-sm">
                    <div className="flex-1 min-w-0 pr-4">
                      <div className="text-sm font-bold text-zinc-900 truncate">{item.description}</div>
                      <div className="text-[10px] text-zinc-400 font-mono">CODE: {item.omieItemCode}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-blue-600">{item.quantity}</div>
                      <div className="text-[10px] text-zinc-400 uppercase font-bold">{item.unit}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <Button onClick={() => setIsModalOpen(false)} className="w-full">
                Fechar Detalhes
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
