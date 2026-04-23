import { useDashboard } from '../../hooks/api/useDashboard';
import { useOrders, Order } from '../../hooks/api/useOrders';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Package, RefreshCw, AlertCircle, TrendingUp, Clock, CheckCircle2, ListFilter, Plus, Minus, CheckSquare } from 'lucide-react';
import { useState, useMemo } from 'react';
import { cn } from '../../utils/cn';
import { useLocalProduced } from '../../hooks/local/useLocalProduced';
import { Modal } from '../../components/ui/Modal';

export function HomePage() {
  const { totals, isLoading: isApiLoading, isError, error, refetchTotals, isFetching, syncStage20 } = useDashboard();
  const { orders, isLoading: isOrdersLoading } = useOrders();
  const { producedRecords, toggleOrder, toggleAll, isLoading: isLocalLoading } = useLocalProduced();
  
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const isLoading = isApiLoading || isLocalLoading || isOrdersLoading;

  const currentProductData = useMemo(() => {
    if (!selectedProduct || !totals) return null;
    return totals.data.find(p => p.description === selectedProduct) || null;
  }, [selectedProduct, totals]);

  const ordersWithProduct = useMemo(() => {
    if (!selectedProduct || !orders) return [];
    return orders.filter(order => 
      order.items.some(item => item.description === selectedProduct)
    ).map(order => ({
      ...order,
      itemQuantity: order.items.find(item => item.description === selectedProduct)?.quantity || 0
    }));
  }, [selectedProduct, orders]);

  const handleToggleProduct = (description: string, totalNeeded: number) => {
    toggleAll(description, totalNeeded);
  };

  const handleToggleOrder = (orderId: string, description: string, quantity: number, orderNumber: string) => {
    const id = `order-${orderId}-${description}`;
    toggleOrder(id, description, quantity, orderId, orderNumber);
  };

  const isOrderProduced = (orderId: string, description: string) => {
    const id = `order-${orderId}-${description}`;
    return producedRecords.some(r => r.id === id);
  };

  const getProducedQuantity = (description: string) => {
    return producedRecords
      .filter(r => r.description === description)
      .reduce((acc, curr) => acc + (curr.quantity || 0), 0);
  };

  const totalProducedItemsCount = producedRecords.reduce((acc, curr) => acc + (curr.quantity || 0), 0);
  const adjustedTotal = Math.max(0, (totals?.totalItems || 0) - totalProducedItemsCount);

  if (isError) {
    const axiosError = error as any;
    const status = axiosError.response?.status || 'Erro';
    const statusText = axiosError.response?.statusText || 'Falha na comunicação';
    
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="bg-red-50 p-6 rounded-2xl border border-red-100 max-w-sm">
          <AlertCircle size={32} className="text-red-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-red-900 mb-1">Resposta do Servidor</h2>
          <p className="text-red-700 font-mono text-sm mb-6 bg-white py-2 rounded border border-red-100">
            HTTP {status}: {statusText}
          </p>
          <Button onClick={() => refetchTotals()} variant="outline" size="sm" className="w-full">
            Tentar Novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-8">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">Status de Produção</h1>
          <p className="text-xs sm:text-sm text-zinc-500">Etapa 20 - Produtos e Vendas em Aberto</p>
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          {(isFetching || syncStage20.isPending) && <RefreshCw size={16} className="animate-spin text-blue-500" />}
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full sm:w-auto text-xs"
            onClick={() => syncStage20.mutate()} 
            disabled={isFetching || syncStage20.isPending}
            isLoading={syncStage20.isPending}
          >
            Sincronizar agora
          </Button>
        </div>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        <Card className="border-l-4 border-l-blue-600">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <Package size={16} />
            <span className="text-xs font-semibold uppercase tracking-wider">Total de Itens</span>
          </div>
          <div className="text-3xl font-bold text-slate-900">
            {isLoading ? '...' : adjustedTotal}
          </div>
        </Card>
        
        <Card className="border-l-4 border-l-amber-500">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <TrendingUp size={16} className="text-amber-500" />
            <span className="text-xs font-semibold uppercase tracking-wider">SKUs Únicos</span>
          </div>
          <div className="text-3xl font-bold text-slate-900">
             {isLoading ? '...' : totals?.data.length || 0}
          </div>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <Clock size={16} className="text-emerald-500" />
            <span className="text-xs font-semibold uppercase tracking-wider">Última Atualização</span>
          </div>
          <div className="text-xl font-semibold text-slate-700">
            {isLoading ? '...' : totals?.lastUpdate ? new Date(totals.lastUpdate).toLocaleTimeString() : 'Agora'}
          </div>
        </Card>
      </div>

      {/* Main Totals Table */}
      <Card title="Planejamento Pendente" description="Clique em um produto para ver detalhes por pedido.">
        {isLoading ? (
          <div className="flex h-60 items-center justify-center">
            <RefreshCw size={32} className="animate-spin text-blue-600" />
          </div>
        ) : (totals?.data.length || 0) === 0 ? (
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
                {totals?.data.map((p, index) => {
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
                      <td className="py-4 px-4 text-center" onClick={() => {
                        setSelectedProduct(p.description);
                        setShowDetailsModal(true);
                      }}>
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
                      )} onClick={() => {
                        setSelectedProduct(p.description);
                        setShowDetailsModal(true);
                      }}>
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
                          onClick={() => handleToggleProduct(p.description, p.totalQuantity)}
                        >
                          <CheckSquare size={16} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-slate-400 hover:text-blue-600"
                          onClick={() => {
                            setSelectedProduct(p.description);
                            setShowDetailsModal(true);
                          }}
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

      {/* Details Modal */}
      <Modal 
        isOpen={showDetailsModal} 
        onClose={() => setShowDetailsModal(false)}
        title={selectedProduct || 'Detalhes do Produto'}
      >
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Pendente (API)</p>
              <p className="text-2xl font-bold text-slate-900">{currentProductData?.totalQuantity || 0} <span className="text-sm font-normal text-slate-500">unidades</span></p>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Status Local</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold text-emerald-600">{selectedProduct ? getProducedQuantity(selectedProduct) : 0}</p>
                <div className="h-8 w-px bg-slate-200 mx-1"></div>
                <p className="text-2xl font-bold text-slate-300">{currentProductData?.totalQuantity || 0}</p>
              </div>
            </div>
          </div>

          <div>
             <div className="flex justify-between items-center mb-3">
               <h3 className="text-sm font-bold text-slate-900">Pedidos contendo este item</h3>
               <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs h-8 text-blue-600 hover:bg-blue-50"
                onClick={() => {
                  if (currentProductData) handleToggleProduct(currentProductData.description, currentProductData.totalQuantity);
                }}
               >
                 <CheckSquare size={14} className="mr-1" />
                 Alternar Tudo
               </Button>
             </div>
             
             {ordersWithProduct.length === 0 ? (
               <div className="text-center py-8 text-slate-500 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                 Não encontramos pedidos detalhados para este item.
               </div>
             ) : (
               <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                 {ordersWithProduct.map((order) => {
                   const isProduced = isOrderProduced(order.id, selectedProduct!);
                   return (
                     <div 
                      key={order.id} 
                      className={cn(
                        "flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer",
                        isProduced ? "bg-emerald-50 border-emerald-100" : "bg-white border-slate-200 hover:border-blue-400"
                      )}
                      onClick={() => handleToggleOrder(order.id, selectedProduct!, Number(order.itemQuantity), order.orderNumber)}
                     >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-5 h-5 rounded border flex items-center justify-center transition-all",
                            isProduced ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-300 bg-white"
                          )}>
                            {isProduced && <CheckCircle2 size={12} strokeWidth={3} />}
                          </div>
                          <div>
                            <p className={cn("text-sm font-bold", isProduced ? "text-emerald-900" : "text-slate-900")}>Pedido #{order.orderNumber}</p>
                            <p className="text-xs text-slate-500">{order.customerName}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-slate-900">{order.itemQuantity} un</p>
                          <p className={cn("text-[10px] uppercase font-bold", isProduced ? "text-emerald-600" : "text-slate-400")}>
                            {isProduced ? 'Produzido' : 'Pendente'}
                          </p>
                        </div>
                     </div>
                   );
                 })}
               </div>
             )}
          </div>

          <div className="flex justify-end pt-2">
            <Button onClick={() => setShowDetailsModal(false)}>Fechar</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}