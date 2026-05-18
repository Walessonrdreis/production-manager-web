import {
  CheckSquare,
  Square,
  Box,
  BookmarkCheck,
  BookmarkPlus,
} from "lucide-react";
import { cn } from "../../../../utils/cn";
import { Product } from "../../../../types/api";

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
  isLoading,
}: CatalogTableProps) {
  if (products.length === 0 && !isLoading) {
    return (
      <div className="text-center py-20">
        <Box className="text-slate-300 mx-auto mb-4" size={48} />
        <h3 className="text-slate-900 dark:text-slate-100 font-bold">Nenhum resultado</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Tente ajustar seus filtros.</p>
      </div>
    );
  }

  const allPageSelected =
    products.length > 0 && products.every((p) => selectedIds.has(p.id));

  return (
    <div className="flex flex-col gap-2 pb-4">
      <div className="border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 px-3 py-2 flex items-center justify-between rounded-xl mb-2 shadow-sm">
        <button
          onClick={onToggleSelectAll}
          className="flex items-center text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-700 transition-colors bg-white dark:bg-slate-900 hover:bg-blue-50 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm"
        >
          {allPageSelected ? (
            <>
              <CheckSquare size={16} className="text-blue-600 mr-2" /> Desmarcar
              Todos
            </>
          ) : (
            <>
              <Square size={16} className="text-slate-400 mr-2" /> Selecionar
              Todos
            </>
          )}
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {products.map((p) => {
          const saved = isSaved(p.id);
          const isSelected = selectedIds.has(p.id);

          return (
            <div
              key={p.id}
              className={cn(
                "group flex flex-col md:flex-row md:items-center justify-between p-3 md:px-4 gap-3 md:gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer relative",
                isSelected
                  ? "ring-2 ring-blue-500 border-blue-200 bg-blue-50/30"
                  : "hover:border-blue-200",
              )}
              onClick={() => onToggleSelect(p.id)}
            >
              {/* Produto Info */}
              <div className="flex items-center gap-3 w-full md:w-[45%] min-w-0 shrink">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleSelect(p.id);
                  }}
                  className={cn(
                    "shrink-0",
                    isSelected
                      ? "text-blue-600"
                      : "text-slate-300 group-hover:text-slate-400",
                  )}
                  aria-label={`Selecionar produto ${p.code}`}
                >
                  {isSelected ? (
                    <CheckSquare size={20} />
                  ) : (
                    <Square size={20} />
                  )}
                </button>
                <div className="flex flex-col gap-1.5 min-w-0 flex-1">
                  <span className="font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md text-xs font-bold block w-max">
                    {p.code || p.id}
                  </span>
                  <h3
                    className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-700 transition-colors uppercase leading-tight text-sm truncate"
                    title={p.description}
                  >
                    {p.description}
                  </h3>
                </div>
              </div>

              {/* Família */}
              <div className="flex flex-col items-start w-full md:w-[20%] shrink-0 min-w-0">
                {p.family && (
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase leading-none px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md truncate max-w-full">
                    Família: {p.family}
                  </span>
                )}
              </div>

              {/* Valores e Status */}
              <div className="flex flex-wrap sm:flex-nowrap items-center justify-between w-full md:w-[35%] pt-3 border-t border-slate-100 dark:border-slate-800 md:border-t-0 md:pt-0 gap-3 shrink-0">
                <div className="flex flex-col items-start md:items-end flex-1 min-w-[70px]">
                  <span
                    className={cn(
                      "px-2.5 py-1 rounded-md text-sm font-bold whitespace-nowrap",
                      p.stock > 10
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                        : "bg-amber-50 text-amber-700 border border-amber-100",
                    )}
                  >
                    {p.stock}{" "}
                    <span className="uppercase text-[10px] ml-0.5 opacity-70">
                      {p.unit || "un"}
                    </span>
                  </span>
                </div>

                <div className="flex flex-col items-end whitespace-nowrap flex-1 min-w-[80px]">
                  <span className="text-sm font-black text-slate-800 dark:text-slate-200">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(p.price)}
                  </span>
                </div>

                <div className="flex items-center justify-end shrink-0 ml-auto bg-slate-50 dark:bg-slate-900/50 md:bg-transparent rounded-lg p-1 md:p-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      saved ? onRemoveProduct(p.id) : onSaveProduct(p);
                    }}
                    className={cn(
                      "p-2 rounded-md md:rounded-full transition-colors",
                      saved
                        ? "text-emerald-600 bg-emerald-100 hover:bg-emerald-200"
                        : "text-slate-500 dark:text-slate-400 md:text-slate-400 bg-slate-100 dark:bg-slate-800 md:bg-transparent border border-transparent md:border-slate-200 dark:border-slate-800 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-200",
                    )}
                    title={
                      saved ? "Salvo em Estoques" : "Adicionar em Estoques"
                    }
                    aria-label={
                      saved ? "Salvo em Estoques" : "Adicionar em Estoques"
                    }
                  >
                    {saved ? (
                      <BookmarkCheck size={18} />
                    ) : (
                      <BookmarkPlus size={18} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
