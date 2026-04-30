import { CheckSquare, CheckCircle2 } from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { Modal } from '../../../../components/ui/Modal';
import { cn } from '../../../../utils/cn';

interface DashboardDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProduct: string | null;
  currentProductData: any;
  producedQuantity: number;
  ordersWithProduct: any[];
  isOrderProduced: (orderId: string, description: string) => boolean;
  onToggleProduct: (desc: string, qty: number) => void;
  onToggleOrder: (orderId: string, description: string, quantity: number, orderNumber: string) => void;
}

export function DashboardDetailsModal({
  isOpen,
  onClose,
  selectedProduct,
  currentProductData,
  producedQuantity,
  ordersWithProduct,
  isOrderProduced,
  onToggleProduct,
  onToggleOrder
}: DashboardDetailsModalProps) {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
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
              <p className="text-2xl font-bold text-emerald-600">{producedQuantity}</p>
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
                if (currentProductData) onToggleProduct(currentProductData.description, currentProductData.totalQuantity);
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
                    onClick={() => onToggleOrder(order.id, selectedProduct!, Number(order.itemQuantity), order.orderNumber)}
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
          <Button onClick={onClose}>Fechar</Button>
        </div>
      </div>
    </Modal>
  );
}
