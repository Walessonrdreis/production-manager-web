import { Modal } from '../../../../components/ui/Modal';
import { Button } from '../../../../components/ui/Button';
import { StockType } from '../../../../types/api';
import { useState } from 'react';
import { Layers } from 'lucide-react';
import { cn } from '../../../../utils/cn';

interface SaveToStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (stockType: StockType) => void;
  count: number;
}

const STOCK_TYPES: { id: StockType; label: string; description: string }[] = [
  { id: 'Barras', label: 'Barras', description: 'Barras produzidas (Branco, Ao Leite, Amargo, etc.)' },
  { id: 'Confeitaria', label: 'Confeitaria', description: 'Produtos acabados da confeitaria.' },
  { id: 'Chocolate Refinado', label: 'Chocolate Refinado', description: 'Massa de cacau e produtos em refino.' },
  { id: 'Insumos', label: 'Insumos', description: 'Matéria-prima (açúcar, cacau, leite, embalagens).' },
  { id: 'Limpeza', label: 'Limpeza', description: 'Produtos de limpeza e higienização.' },
  { id: 'Maquinários', label: 'Maquinários', description: 'Peças e equipamentos produtivos.' }
];

export function SaveToStockModal({ isOpen, onClose, onConfirm, count }: SaveToStockModalProps) {
  const [selectedStock, setSelectedStock] = useState<StockType>('Barras');

  const handleConfirm = () => {
    onConfirm(selectedStock);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Adicionar aos Estoques">
      <div className="p-6">
        <div className="mb-6">
          <p className="text-slate-600 dark:text-slate-400">
            Você está adicionando <strong className="text-slate-900 dark:text-slate-100">{count} {count === 1 ? 'produto' : 'produtos'}</strong>.
            Em qual estoque você deseja salvá-los?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          {STOCK_TYPES.map(stock => (
            <div
              key={stock.id}
              onClick={() => setSelectedStock(stock.id)}
              className={cn(
                "cursor-pointer border rounded-xl p-3 flex flex-col gap-1 transition-colors",
                selectedStock === stock.id 
                  ? "border-blue-500 bg-blue-50 text-blue-900" 
                  : "border-slate-200 dark:border-slate-800 hover:border-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300"
              )}
            >
              <div className="flex items-center justify-between">
                 <span className="font-bold text-sm">{stock.label}</span>
                 <Layers size={16} className={selectedStock === stock.id ? "text-blue-500" : "text-slate-400"} />
              </div>
              <p className={cn("text-xs leading-snug", selectedStock === stock.id ? "text-blue-700" : "text-slate-500 dark:text-slate-400")}>
                 {stock.description}
              </p>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button variant="primary" onClick={handleConfirm} className="bg-blue-600 hover:bg-blue-700 text-white">
            Confirmar e Salvar
          </Button>
        </div>
      </div>
    </Modal>
  );
}
