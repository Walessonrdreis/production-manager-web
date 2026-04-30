import { Trash2, FileText } from 'lucide-react';
import { Card } from '../../../../components/ui/Card';
import { Input } from '../../../../components/ui/Input';
import { Button } from '../../../../components/ui/Button';

interface PlanningSelectedItemsProps {
  items: any[];
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemoveItem: (id: string) => void;
}

export function PlanningSelectedItems({ items, onUpdateQuantity, onRemoveItem }: PlanningSelectedItemsProps) {
  return (
    <Card>
      <div className="mb-4">
        <h2 className="text-lg font-bold text-slate-900">Itens Selecionados</h2>
        <p className="text-sm text-slate-500">Estes itens farão parte do documento de produção.</p>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 p-4 rounded-xl border border-blue-100 bg-blue-50/30">
            <div className="flex-1 min-w-0">
                <div className="font-bold text-slate-900 uppercase text-xs truncate">{item.description}</div>
                <div className="text-[10px] text-slate-500 font-mono italic">Cód: {item.code}</div>
            </div>
            <div className="w-20">
                <Input 
                  type="number" 
                  className="text-center h-9 font-bold" 
                  value={item.quantity} 
                  onChange={(e) => onUpdateQuantity(item.id, parseInt(e.target.value) || 1)}
                />
            </div>
            <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-50 h-9 w-9" onClick={() => onRemoveItem(item.id)}>
                <Trash2 size={16} />
            </Button>
          </div>
        ))}
        {items.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center text-slate-400">
                <FileText size={40} className="mb-2 opacity-20" />
                <p className="text-sm">Nenhum produto selecionado para planejamento.</p>
            </div>
        )}
      </div>
    </Card>
  );
}
