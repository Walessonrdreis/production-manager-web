import React, { useState, useMemo } from 'react';
import { X, Search, ChevronRight, Package, ArrowLeft } from 'lucide-react';
import { Product } from '../../../../../../types/api';
import { useOmieProducts } from '../../../../../../hooks/catalog/useOmieProducts';
import { ProductBomEditor } from '../../../../ui/components/ProductBomEditor';
import { DevBadge } from '../../../../../../components/ui/DevBadge';

interface CreateBomWizardModalProps {
  onClose: () => void;
}

export function CreateBomWizardModal({ onClose }: CreateBomWizardModalProps) {
  const { data: rawProducts = [], isLoading } = useOmieProducts();
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Consider as "no BOM" if bom is undefined or empty. Also inject mock rules if V2 mock
  const eligibleProducts = useMemo(() => {
    return rawProducts.filter(p => {
      // Allow user to find products that actually have NO BOM
      if (p.id.includes('v2-mock')) {
         return !p.bom || p.bom.length === 0;
      }
      
      const randomNum = p.id.length % 3;
      if (randomNum !== 0) return false; // This mimics our "has BOM" mock condition in CatalogV2List
      
      return !p.bom || p.bom.length === 0;
    }).filter(p => {
      if (!search) return true;
      const term = search.toLowerCase();
      return p.description.toLowerCase().includes(term) || p.id.toLowerCase().includes(term);
    });
  }, [rawProducts, search]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 dark:bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className={`bg-white dark:bg-slate-900 w-full flex flex-col rounded-2xl shadow-2xl relative border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200 ${
          selectedProduct ? 'max-w-4xl max-h-[90vh]' : 'max-w-2xl h-[600px]'
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex flex-col">
            <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100">
              {selectedProduct ? (
                <>
                  <button 
                    onClick={() => setSelectedProduct(null)}
                    className="p-1 -ml-1 mr-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  Montagem de Estrutura
                </>
              ) : (
                'Nova Estrutura de Produto'
              )}
              <DevBadge id="catalog.bom.wizard" />
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {selectedProduct 
                ? `Construindo BOM para: ${selectedProduct.description}` 
                : 'Selecione um produto base para montar a composição estruturada (BOM).'}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 -mr-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-300 rounded-full transition-colors"
            title="Fechar"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {!selectedProduct ? (
            <div className="space-y-4 h-full flex flex-col">
              <div className="relative shrink-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Pesquisar por descrição ou código..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                />
              </div>

              <div className="flex-1 overflow-y-auto min-h-0 space-y-2 mt-2">
                {isLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="animate-pulse flex items-center gap-4 p-3 border border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                      <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-lg shrink-0" />
                      <div className="flex-1 space-y-2">
                         <div className="w-1/3 h-4 bg-slate-200 dark:bg-slate-700 rounded" />
                         <div className="w-1/4 h-3 bg-slate-200 dark:bg-slate-700 rounded" />
                      </div>
                    </div>
                  ))
                ) : eligibleProducts.length > 0 ? (
                  eligibleProducts.map(product => (
                    <button
                      key={product.id}
                      onClick={() => setSelectedProduct(product)}
                      className="w-full text-left flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-sm transition-all group"
                    >
                      <div className="flex items-center gap-4 min-w-0 flex-1">
                        <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-center border border-slate-100 dark:border-slate-700 shrink-0">
                          <Package className="text-slate-400" size={20} />
                        </div>
                        <div className="min-w-0 pr-4">
                           <div className="font-bold text-sm text-slate-800 dark:text-slate-200 truncate">{product.description}</div>
                           <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                             <span className="font-mono">{product.code || product.id}</span>
                             {product.family && (
                               <>
                                 <span className="w-1 h-1 rounded-full bg-slate-300" />
                                 <span className="truncate">{product.family}</span>
                               </>
                             )}
                           </div>
                        </div>
                      </div>
                      <div className="p-1.5 rounded-md text-slate-300 group-hover:text-indigo-600 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 transition-colors shrink-0">
                        <ChevronRight size={18} />
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 dark:text-slate-400">
                     <Package size={40} className="mb-4 opacity-20" />
                     <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-1">Nenhum produto elegível</h3>
                     <p className="text-sm">Todos os produtos desta busca já possuem estrutura montada ou não foram encontrados.</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="animate-in slide-in-from-right-4 duration-300">
              <ProductBomEditor product={selectedProduct} rawProducts={rawProducts} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
