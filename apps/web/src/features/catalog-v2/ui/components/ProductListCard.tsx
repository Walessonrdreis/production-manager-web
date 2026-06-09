import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useSearchParams } from 'react-router-dom';
import { Product } from '../../../../types/api';
import { Package, ChevronRight, Layers, Plus, X, Search, FileText } from 'lucide-react';
import { cn } from '../../../../utils/cn';
import { Button } from '../../../../components/ui/Button';
import { useOmieProducts } from '../../../../hooks/catalog/useOmieProducts';
import { ManualStockEntryButton } from '../../workloads/manual-stock-entry/ui/components/ManualStockEntryButton';
import { ProductBomEditor } from './ProductBomEditor';

interface ProductListCardProps {
  product: Product;
  isBomView?: boolean;
}

export function ProductListCard({ product, isBomView = false }: ProductListCardProps) {
  const { data: rawProducts = [] } = useOmieProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const shouldExpand = searchParams.get('expandProduct') === product.id;
  
  const [expanded, setExpanded] = useState(shouldExpand);

  useEffect(() => {
    if (shouldExpand && !expanded) {
      setExpanded(true);
    }
  }, [shouldExpand]);

  const closeExpanded = () => {
    setExpanded(false);
    if (shouldExpand) {
      setSearchParams(prev => {
        const p = new URLSearchParams(prev);
        p.delete('expandProduct');
        return p;
      });
    }
  };

  return (
    <>
      <div 
        className={cn(
          "bg-white dark:bg-slate-900 border transition-all duration-200 cursor-pointer select-none overflow-hidden",
          isBomView ? "rounded-lg" : "rounded-xl",
          "border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md"
        )}
        onClick={() => {
          setExpanded(true);
        }}
      >
        <div className={cn(
          "flex flex-col sm:flex-row sm:items-center",
          isBomView ? "p-3 sm:px-4 sm:py-2 sm:h-16 gap-3 sm:gap-6" : "p-4 sm:p-5 gap-4"
        )}>
          <div className={cn(
            "bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center shrink-0",
            isBomView ? "w-10 h-10 rounded-md hidden sm:flex" : "w-12 h-12 rounded-lg"
          )}>
            <Package className="text-slate-400 dark:text-slate-500" size={isBomView ? 20 : 24} />
          </div>
          
          <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
            <div className={cn("flex flex-col", isBomView ? "sm:w-1/3 shrink-0" : "")}>
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className={cn("font-bold text-slate-900 dark:text-slate-100 truncate", isBomView ? "text-sm" : "text-base")}>
                  {product.description}
                </h3>
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                <span className="font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300">
                  {product.id}
                </span>
                {!isBomView && (
                  <>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600" />
                      <span>{product.family}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {isBomView && (
              <div className="hidden sm:flex flex-1 items-center gap-6 text-sm">
                <div className="flex-1">
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">Família</div>
                  <div className="font-medium text-slate-800 dark:text-slate-200 truncate">{product.family || '-'}</div>
                </div>
                <div className="w-24 text-center">
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">Componentes</div>
                  <div className="font-bold text-indigo-600 dark:text-indigo-400 inline-flex items-center gap-1">
                    <Layers size={14} />
                    {product.bom?.length || 0}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className={cn(
            "flex items-center shrink-0 border-slate-100 dark:border-slate-800",
            isBomView ? "mt-2 sm:mt-0 ml-auto gap-4" : "mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-0 gap-4"
          )}>
            <div className={cn("flex items-center gap-6", isBomView ? "sm:flex" : "hidden sm:flex")}>
              <div className="text-right">
                <div className={cn("font-bold text-blue-600 dark:text-blue-400", isBomView ? "text-xs" : "text-sm")}>
                  {product.stock} <span className="text-xs font-normal text-slate-500 dark:text-slate-400">{product.unit}</span>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Estoque Atual</div>
              </div>
            </div>
            <div className="p-2 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 rounded-lg transition-colors ml-auto sm:ml-0 flex items-center justify-center bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
              {isBomView ? (
                 <span className="text-xs font-bold text-slate-600 dark:text-slate-300 px-1 hidden sm:inline-block mr-1">Gerenciar</span>
              ) : null}
              <ChevronRight size={isBomView ? 16 : 20} />
            </div>
          </div>
        </div>
      </div>

      {expanded && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 dark:bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl shadow-2xl relative border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
            
            {/* Modal Header c/ Tabs */}
            <div className="bg-white dark:bg-slate-900 dark:border-slate-800 px-6 pt-6 rounded-t-2xl flex flex-col shrink-0">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center shrink-0">
                    <Package className="text-blue-600 dark:text-blue-400" size={28} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-slate-100 text-xl leading-tight">{product.description}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-mono mt-1">Cód: {product.code || product.id}</p>
                  </div>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); closeExpanded(); }} 
                  className="p-2 -mr-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-300 rounded-full transition-colors"
                  title="Fechar"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 overflow-y-auto flex-1">
              
              {!isBomView ? (
                <div className="space-y-8 animate-in fade-in slide-in-from-left-2 duration-200">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">

                      <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Família</div>
                      <div className="text-sm font-bold text-slate-900 dark:text-slate-100">{product.family || 'Não informada'}</div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                      <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Unidade M.</div>
                      <div className="text-sm font-bold text-slate-900 dark:text-slate-100">{product.unit || 'UN'}</div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                      <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Preço Venda</div>
                      <div className="text-sm font-bold text-slate-900 dark:text-slate-100">{product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                      <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Custo Estimado</div>
                      <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {product.bom?.reduce((acc, curr) => acc + (curr.cost * curr.quantity), 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || 'R$ 0,00'}
                      </div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                      <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Estoque Físico</div>
                      <div className="text-sm font-bold text-blue-600 dark:text-blue-400">
                        {product.stock || 0} <span className="text-xs font-normal text-slate-500 dark:text-slate-400">{product.unit}</span>
                      </div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                      <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Estoque Mínimo</div>
                      <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {product.minStock || 0} <span className="text-xs font-normal text-slate-500 dark:text-slate-400">{product.unit}</span>
                      </div>
                    </div>
                  </div>

                  {/* Ações Futuras */}
                  <div className="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl p-5">
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-2">Comandos Rápidos</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Selecione uma ação para este produto</p>
                    <div className="flex gap-3">
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2 border-none">
                        <Plus size={16} /> Emitir Ordem de Produção
                      </Button>
                      <ManualStockEntryButton 
                        productId={product.id}
                        codigo={product.code || product.id}
                        descricao={product.description}
                      />
                      <Button variant="outline" className="dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
                        Ver Histórico
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <ProductBomEditor product={product} rawProducts={rawProducts} />
              )}
              
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
