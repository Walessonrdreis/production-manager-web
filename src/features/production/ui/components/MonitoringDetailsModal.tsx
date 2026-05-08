import { CheckSquare, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { Modal } from '../../../../components/ui/Modal';
import { cn } from '../../../../utils/cn';
import { useState } from 'react';

interface MonitoringDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProduct: string | null;
  currentProductData: any;
  producedQuantity: number;
  ordersWithProduct: any[];
  isOrderProduced: (orderId: string, description: string) => boolean;
  getOrderProducedRecord?: (orderId: string, description: string) => any;
  onToggleProduct: (desc: string, qty: number) => void;
  onToggleOrder: (orderId: string, description: string, quantity: number, orderNumber: string) => void;
}

export function MonitoringDetailsModal({
  isOpen,
  onClose,
  selectedProduct,
  currentProductData,
  producedQuantity,
  ordersWithProduct,
  isOrderProduced,
  getOrderProducedRecord,
  onToggleProduct,
  onToggleOrder
}: MonitoringDetailsModalProps) {
  const [orderToConfirm, setOrderToConfirm] = useState<{ id: string, desc: string, qty: number, orderNumber: string } | null>(null);

  const handleOrderClick = (orderId: string, description: string, quantity: number, orderNumber: string, isProduced: boolean) => {
    if (isProduced) {
      setOrderToConfirm({ id: orderId, desc: description, qty: quantity, orderNumber });
    } else {
      onToggleOrder(orderId, description, quantity, orderNumber);
    }
  };

  const confirmUntoggle = () => {
    if (orderToConfirm) {
      onToggleOrder(orderToConfirm.id, orderToConfirm.desc, orderToConfirm.qty, orderToConfirm.orderNumber);
      setOrderToConfirm(null);
    }
  };

  return (
    <>
      <Modal 
        isOpen={isOpen} 
        onClose={onClose}
        title={selectedProduct || 'Detalhes do Produto'}
      >
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-zinc-50 p-4 rounded-xl border border-zinc-100">
            <div>
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Total Pendente (API)</p>
              <p className="text-2xl font-bold text-zinc-900">{currentProductData?.totalQuantity || 0} <span className="text-sm font-normal text-zinc-500">unidades</span></p>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Status Local</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold text-emerald-600">{producedQuantity}</p>
                <div className="h-8 w-px bg-zinc-200 mx-1"></div>
                <p className="text-2xl font-bold text-zinc-300">{currentProductData?.totalQuantity || 0}</p>
              </div>
            </div>
          </div>

          <div>
             <div className="flex justify-between items-center mb-3">
               <h3 className="text-sm font-bold text-zinc-900">Pedidos contendo este item</h3>
               <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs h-8 text-blue-600 hover:bg-blue-50"
                onClick={() => {
                  if (currentProductData) onToggleProduct(currentProductData.description, currentProductData.totalQuantity);
                }}
               >
                 <CheckSquare size={14} className="mr-1" />
                 Alternar Tudo
               </Button>
             </div>
             
             {ordersWithProduct.length === 0 ? (
               <div className="text-center py-8 text-zinc-500 bg-zinc-50/50 rounded-xl border border-dashed border-zinc-200">
                 Não encontramos pedidos detalhados para este item.
               </div>
             ) : (
               <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                 {ordersWithProduct.map((order) => {
                   const isProduced = isOrderProduced(order.id, selectedProduct!);
                   const record = isProduced && getOrderProducedRecord ? getOrderProducedRecord(order.id, selectedProduct!) : null;
                   
                   return (
                     <div 
                      key={order.id} 
                      className={cn(
                        "flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer",
                        isProduced ? "bg-emerald-50 border-emerald-100" : "bg-white border-zinc-200 hover:border-blue-400"
                      )}
                      onClick={() => handleOrderClick(order.id, selectedProduct!, Number(order.itemQuantity), order.orderNumber, isProduced)}
                     >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-5 h-5 rounded border flex items-center justify-center transition-all",
                            isProduced ? "bg-emerald-500 border-emerald-500 text-white" : "border-zinc-300 bg-white"
                          )}>
                            {isProduced && <CheckCircle2 size={12} strokeWidth={3} />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={cn(
                              "text-sm font-bold truncate leading-tight mb-0.5", 
                              isProduced ? "text-emerald-900" : "text-zinc-900",
                              order.customerName ? "text-[15px]" : ""
                            )}>
                              {order.customerName || 'Cliente não informado'}
                            </p>
                            <div className="flex items-center gap-2">
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                                #{order.orderNumber}
                              </span>
                              <span className="text-[10px] text-zinc-400 font-medium italic">ref. pedido</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-zinc-900">{order.itemQuantity} un</p>
                          <div className="flex flex-col items-end">
                            <p className={cn("text-[10px] uppercase font-bold", isProduced ? "text-emerald-600" : "text-zinc-400")}>
                              {isProduced ? 'Produzido' : 'Pendente'}
                            </p>
                            {isProduced && record?.updatedAt && (
                              <p className="text-[10px] text-emerald-700/80 mt-0.5 whitespace-nowrap">
                                {new Date(record.updatedAt).toLocaleString('pt-BR', { 
                                  day: '2-digit', month: '2-digit', year: '2-digit', 
                                  hour: '2-digit', minute: '2-digit'
                                })}
                              </p>
                            )}
                          </div>
                        </div>
                     </div>
                   );
                 })}
               </div>
             )}
          </div>

          <div className="flex justify-end pt-2">
            <Button onClick={onClose}>Fechar</Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={!!orderToConfirm}
        onClose={() => setOrderToConfirm(null)}
        title="Reverter Produção"
      >
        <div className="max-w-sm">
          <div className="flex items-center gap-3 text-amber-600 mb-4 bg-amber-50 p-3 rounded-lg border border-amber-200">
            <AlertTriangle className="shrink-0" size={24} />
            <p className="text-sm">Você está prestes a reverter a conclusão deste item. Ele voltará para o status Pendente.</p>
          </div>
          <p className="text-sm text-zinc-700 mb-6 focus:outline-none">
            Tem certeza de que deseja desfazer a marcação de <strong>produzido</strong> para este pedido?
          </p>
          <div className="flex gap-3 justify-end mt-6">
            <Button variant="outline" onClick={() => setOrderToConfirm(null)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={confirmUntoggle}>
              Sim, Reverter
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
