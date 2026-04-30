import { CheckSquare, Square, Box, BookmarkCheck, BookmarkPlus } from 'lucide-react';
import { cn } from '../../../../utils/cn';
import { Product } from '../../../../types/api';

interface CatalogTableProps {
  products: Product[];
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  isSaved: (id: string) => boolean;
  onSaveProduct: (p: Product) => void;
  onRemoveProduct: (id: string) => void;
  isLoading: boolean;
}

export function CatalogTable({
  products,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  isSaved,
  onSaveProduct,
  onRemoveProduct,
  isLoading
}: CatalogTableProps) {
  if (products.length === 0 && !isLoading) {
    return (
      <div className="text-center py-20">
        <Box className="text-slate-300 mx-auto mb-4" size={48} />
        <h3 className="text-slate-900 font-bold">Nenhum resultado</h3>
        <p className="text-slate-500 text-sm">Tente ajustar seus filtros.</p>
      </div>
    );
  }

  const allPageSelected = products.length > 0 && products.every(p => selectedIds.has(p.id));

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm border-separate border-spacing-0">
        <thead>
          <tr className="bg-slate-50/50">
            <th className="pb-3 px-4 pt-4 border-b border-slate-100 text-center w-12">
              <button onClick={onToggleSelectAll} className="text-slate-400 hover:text-blue-600 transition-colors">
                {allPageSelected ? <CheckSquare size={18} className="text-blue-600" /> : <Square size={18} />}
              </button>
            </th>
            <th className="pb-3 px-4 pt-4 font-semibold text-slate-500 uppercase text-[10px] border-b border-slate-100 w-28">Cód.</th>
            <th className="pb-3 px-4 pt-4 font-semibold text-slate-500 uppercase text-[10px] border-b border-slate-100">Produto</th>
            <th className="pb-3 px-4 pt-4 font-semibold text-slate-500 uppercase text-[10px] border-b border-slate-100 text-right w-24">Estoque</th>
            <th className="pb-3 px-4 pt-4 font-semibold text-slate-500 uppercase text-[10px] border-b border-slate-100 text-right w-32">Preço</th>
            <th className="pb-3 px-4 pt-4 border-b border-slate-100 w-12"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {products.map((p) => {
            const saved = isSaved(p.id);
            const isSelected = selectedIds.has(p.id);
            
            return (
              <tr key={p.id} className={cn("group transition-colors", isSelected ? "bg-blue-50/40" : "hover:bg-slate-50/80")}>
                <td className="py-4 px-4 text-center">
                  <button onClick={() => onToggleSelect(p.id)} className={cn(isSelected ? "text-blue-600" : "text-slate-300 hover:text-slate-400")}>
                    {isSelected ? <CheckSquare size={18} /> : <Square size={18} />}
                  </button>
                </td>
                <td className="py-4 px-4 font-mono text-blue-600 text-[11px] truncate max-w-[90px]">{p.code || p.id}</td>
                <td className="py-2.5 px-4">
                  <div className="max-w-[200px] sm:max-w-[250px] lg:max-w-[300px]">
                    <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors uppercase leading-tight text-xs sm:text-sm break-words whitespace-normal">
                      {p.description}
                    </div>
                    <div className="text-[10px] text-slate-400 uppercase mt-0.5">{p.family}</div>
                  </div>
                </td>
                <td className="py-4 px-4 text-right">
                  <span className={cn("px-2 py-1 rounded text-xs font-bold", p.stock > 10 ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700")}>
                    {p.stock} {p.unit || 'un'}
                  </span>
                </td>
                <td className="py-4 px-4 text-right font-bold text-slate-700">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(p.price)}
                </td>
                <td className="py-4 px-4 text-center">
                  <button 
                    onClick={() => saved ? onRemoveProduct(p.id) : onSaveProduct(p)}
                    className={cn("p-2 rounded-lg transition-all", saved ? "text-emerald-500 bg-emerald-50" : "text-slate-300 hover:text-blue-600")}
                  >
                    {saved ? <BookmarkCheck size={18} /> : <BookmarkPlus size={18} />}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
