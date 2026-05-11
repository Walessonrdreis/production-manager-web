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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-4">
      <div className="col-span-full border-b border-slate-100 pb-2 flex items-center justify-between px-2">
         <button onClick={onToggleSelectAll} className="flex items-center text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors bg-white hover:bg-slate-50 px-3 py-1.5 rounded-md border border-slate-200">
           {allPageSelected ? (
             <><CheckSquare size={16} className="text-blue-600 mr-2" /> Desmarcar Todos</>
           ) : (
             <><Square size={16} className="text-slate-400 mr-2" /> Selecionar Todos</>
           )}
         </button>
      </div>

      {products.map((p) => {
        const saved = isSaved(p.id);
        const isSelected = selectedIds.has(p.id);
        
        return (
          <div 
            key={p.id} 
            className={cn(
              "group flex flex-col rounded-xl p-4 transition-all shadow-sm border", 
              isSelected ? "bg-blue-50/40 border-blue-200" : "bg-white border-slate-200 hover:shadow-md hover:border-blue-100 cursor-pointer"
            )}
            onClick={() => onToggleSelect(p.id)}
          >
            <div className="flex justify-between items-start mb-3 gap-2">
              <div className="flex items-start gap-2 pr-6">
                <button 
                  onClick={(e) => { e.stopPropagation(); onToggleSelect(p.id); }} 
                  className={cn("mt-0.5", isSelected ? "text-blue-600" : "text-slate-300 group-hover:text-slate-400")}
                  aria-label={`Selecionar produto ${p.code}`}
                >
                  {isSelected ? <CheckSquare size={18} /> : <Square size={18} />}
                </button>
                <div>
                   <span className="font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-[11px] font-bold block w-fit mb-1 truncate max-w-[150px]">
                     {p.code || p.id}
                   </span>
                   <h3 className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors uppercase leading-tight text-sm line-clamp-2" title={p.description}>
                     {p.description}
                   </h3>
                </div>
              </div>
              <div className="absolute top-3 right-3 text-center opacity-100 lg:opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity bg-white/80 backdrop-blur rounded overflow-hidden">
                <button 
                  onClick={(e) => { e.stopPropagation(); saved ? onRemoveProduct(p.id) : onSaveProduct(p); }}
                  className={cn("p-1.5 transition-colors", saved ? "text-emerald-500 hover:bg-emerald-50" : "text-slate-400 hover:text-blue-600 hover:bg-blue-50")}
                  title={saved ? "Remover de Meus Produtos" : "Salvar em Meus Produtos"}
                  aria-label={saved ? "Remover de Meus Produtos" : "Salvar em Meus Produtos"}
                >
                  {saved ? <BookmarkCheck size={20} /> : <BookmarkPlus size={20} />}
                </button>
              </div>
            </div>

            <div className="mt-auto grid grid-cols-2 gap-3 pt-4 border-t border-slate-50 pl-7 items-end">
               <div>
                  {p.family && (
                    <div className="text-[10px] text-slate-400 uppercase mb-1 line-clamp-1">{p.family}</div>
                  )}
                  <span className={cn("px-2 py-0.5 rounded text-[11px] font-bold mt-1 inline-block", p.stock > 10 ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-amber-50 text-amber-700 border border-amber-100")}>
                    Estoque: {p.stock}
                  </span>
               </div>
               <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-0.5">Preço Unit.</span>
                  <div className="font-bold text-slate-800 leading-none">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(p.price)}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{p.unit || 'un'}</div>
               </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
