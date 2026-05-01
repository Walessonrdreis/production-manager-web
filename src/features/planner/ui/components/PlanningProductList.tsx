import { Search, Plus } from 'lucide-react';
import { Card } from '../../../../components/ui/Card';
import { Input } from '../../../../components/ui/Input';
import { Button } from '../../../../components/ui/Button';

interface PlanningProductListProps {
  search: string;
  onSearchChange: (val: string) => void;
  filteredProducts: any[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onBulkAdd: () => void;
  onAddItem: (p: any, qty: number) => void;
  activeSectorName?: string;
}

export function PlanningProductList({
  search, onSearchChange,
  filteredProducts,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onBulkAdd,
  onAddItem,
  activeSectorName
}: PlanningProductListProps) {
  return (
    <Card>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Adicionar Produtos</h2>
          <p className="text-sm text-slate-500">
            Destino: <span className="font-bold text-blue-600">{activeSectorName || 'Nenhum setor selecionado'}</span>
          </p>
        </div>
        {selectedIds.length > 0 && (
          <Button 
            size="sm" 
            onClick={onBulkAdd}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-9 px-4 rounded-lg animate-in fade-in slide-in-from-top-2"
          >
            <Plus size={16} className="mr-2" />
            Adicionar {selectedIds.length}
          </Button>
        )}
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <Input 
          placeholder="Digite a descrição, Código ou Família..." 
          className="pl-10 h-11"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {filteredProducts.length > 0 && (
        <div className="mb-2 flex items-center gap-2 px-2">
          <input 
            type="checkbox" 
            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            checked={selectedIds.length === filteredProducts.length && filteredProducts.length > 0}
            onChange={onToggleSelectAll}
          />
          <span className="text-[10px] font-bold text-slate-500 uppercase">Selecionar Todos</span>
        </div>
      )}

      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
        {filteredProducts.map((p) => (
          <div key={p.id} className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
            <input 
              type="checkbox" 
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              checked={selectedIds.includes(p.id)}
              onChange={() => onToggleSelect(p.id)}
            />
            
            <div className="flex-1 min-w-0 pr-2">
                <div className="font-bold text-slate-900 uppercase text-xs truncate">{p.description}</div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                  <div className="text-[10px] text-blue-600 font-mono font-bold">ID: {p.id}</div>
                  {p.family && <div className="text-[10px] text-zinc-500 font-bold uppercase">Família: {p.family}</div>}
                  <div className="text-[10px] text-slate-500 font-bold uppercase">ESTOQUE: {p.stock} {p.unit}</div>
                  <div className="text-[10px] text-slate-900 font-bold">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(p.price)}
                  </div>
                </div>
            </div>
            <Button size="sm" variant="ghost" onClick={() => onAddItem(p, 1)} className="hover:bg-blue-50 text-blue-600 shrink-0 h-8 w-8 p-0">
                <Plus size={18} />
            </Button>
          </div>
        ))}
        {filteredProducts.length === 0 && (
          <div className="text-center py-10 text-slate-400 italic text-sm">
            {search.length > 0 ? 'Nenhum produto encontrado na busca' : 'Nenhum produto salvo em "Meus Produtos"'}
          </div>
        )}
      </div>
    </Card>
  );
}
