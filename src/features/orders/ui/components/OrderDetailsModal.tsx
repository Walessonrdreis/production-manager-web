import { Hash, Calendar, Tag, ClipboardList, Package } from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { Modal } from '../../../../components/ui/Modal';
import { Order } from '../../../../hooks/orders/useOrders';

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedOrder: Order | null;
}

export function OrderDetailsModal({ isOpen, onClose, selectedOrder }: OrderDetailsModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={selectedOrder ? `Pedido #${selectedOrder.orderNumber}` : 'Detalhes do Pedido'}
    >
      {selectedOrder && (
        <div className="space-y-6">
          <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 mb-2">
            <h4 className="text-[10px] text-blue-500 uppercase font-bold tracking-widest mb-1.5 flex items-center gap-1.5">
              <ClipboardList size={12} />
              Informações do Cliente
            </h4>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-base font-bold text-slate-900 leading-tight">{selectedOrder.customerName}</div>
                <div className="text-xs text-slate-500 mt-1">Código Omie: {selectedOrder.customerId || 'N/A'}</div>
              </div>
              {selectedOrder.isLocalCustomer && (
                <div className="bg-blue-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                  Identificado Localmente
                </div>
              )}
            </div>
          </div>

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
            <Button onClick={onClose} className="w-full">
              Fechar Detalhes
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
