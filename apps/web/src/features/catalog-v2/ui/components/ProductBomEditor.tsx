import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Layers, Plus, Search, HelpCircle, Save, Settings, Package, Link, AlertCircle, X } from 'lucide-react';
import { Product } from '../../../../types/api';
import { cn } from '../../../../utils/cn';
import { Button } from '../../../../components/ui/Button';
import { RecipeCalculator, RecipeUnit } from '../../domain/RecipeCalculator';
import { useRecipeResolver, DraftRecipeItem } from '../../domain/useRecipeResolver';

interface ProductBomEditorProps {
  product: Product;
  rawProducts: Product[];
}

export function ProductBomEditor({ product, rawProducts }: ProductBomEditorProps) {
  const hasBom = Array.isArray(product.bom) && product.bom.length > 0;
  
  // Controls if we are viewing the empty state or the actual editors
  const [isEditing, setIsEditing] = useState(hasBom);
  
  // 'direct' = Adição Direta CRUD normal, 'assistant' = Assistente de Formulação
  const [editorMode, setEditorMode] = useState<'direct' | 'assistant'>('direct');

  if (!isEditing) {
    return (
      <div className="animate-in fade-in slide-in-from-right-2 duration-200">
        <div className="bg-slate-50 dark:bg-slate-800/30 border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-10 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 text-amber-500 dark:text-amber-400 flex items-center justify-center rounded-full mb-4 shadow-sm">
            <AlertCircle size={32} />
          </div>
          <h5 className="text-xl text-slate-900 dark:text-slate-100 font-bold mb-2">Estrutura não montada</h5>
          <p className="text-slate-500 dark:text-slate-400 text-base max-w-lg mb-6">
            Este produto ainda não possui lista de insumos (BOM). Monte agora para poder gerenciar seus custos e emitir ordens de produção.
          </p>
          <Button 
            onClick={() => setIsEditing(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold gap-2 border-none shadow-sm transition-all hover:shadow-md"
          >
            <Plus size={20} />
            Criar Componentes da Estrutura
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-right-2 duration-200">
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:items-center justify-between gap-4 mb-6">
        <div>
          <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Layers size={20} className="text-blue-500 dark:text-blue-400" />
            Insumos Necessários
          </h4>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Composição para fabricar 1 {product.unit} de {product.description}.
          </p>
        </div>
        
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg shrink-0">
          <button
            onClick={() => setEditorMode('direct')}
            className={cn(
              "px-3 py-1.5 text-xs font-bold rounded-md transition-colors",
              editorMode === 'direct' 
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm" 
                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            )}
          >
            Adição Direta
          </button>
          <button
            onClick={() => setEditorMode('assistant')}
            className={cn(
              "px-3 py-1.5 text-xs font-bold rounded-md transition-colors flex items-center gap-1.5",
              editorMode === 'assistant' 
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm" 
                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            )}
          >
            <Settings size={14} /> Assistente de Receita
          </button>
        </div>
      </div>
      
      {editorMode === 'direct' ? (
        <DirectAdditionView product={product} rawProducts={rawProducts} hasBom={hasBom} />
      ) : (
        <RecipeAssistantView product={product} />
      )}
    </div>
  );
}

// ==========================================
// VIEWS
// ==========================================

function DirectAdditionView({ product, rawProducts, hasBom }: { product: Product, rawProducts: Product[], hasBom: boolean }) {
  return (
    <div>
      <div className="flex gap-2 mb-4 justify-end">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Buscar insumo..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        <Button size="sm" variant="outline" className="h-9 font-bold gap-2 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 border-slate-200">
          <Plus size={16} />
          Adicionar 
        </Button>
      </div>

      {!hasBom ? (
        <div className="text-center py-10 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
          <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 text-amber-500 dark:text-amber-400 mx-auto flex items-center justify-center rounded-full mb-3">
            <AlertCircle size={24} />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">Estrutura não montada</h3>
          <p className="text-xs text-slate-500 mb-4 max-w-sm mx-auto">Este produto ainda não possui lista de insumos. Adicione componentes acima ou utilize o Assistente.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="hidden sm:grid grid-cols-12 gap-4 px-4 py-2 bg-slate-50 dark:bg-slate-800/30 rounded-lg text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            <div className="col-span-5">Código / Insumo</div>
            <div className="col-span-4 text-center">Consumo vs Saldo</div>
            <div className="col-span-3 text-right">Custo Estimado</div>
          </div>

          {product.bom?.map((item, idx) => {
            const insumoInfo = rawProducts.find(p => p.id === item.productId || p.code === item.productId);
            const insumoStock = insumoInfo?.stock || 0;
            const stockColor = insumoStock >= item.quantity 
              ? 'text-emerald-600 dark:text-emerald-400' 
              : 'text-rose-600 dark:text-rose-400';

            return (
              <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:px-4 sm:py-3 hover:border-blue-200 dark:hover:border-blue-800 transition-colors group">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 sm:items-center">
                  <div className="col-span-5">
                    <div className="font-bold text-slate-900 dark:text-slate-100 mb-0.5">{item.productId}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                      {insumoInfo ? insumoInfo.description : 'Insumo Produtivo'}
                    </div>
                  </div>
                  
                  <div className="col-span-4 flex items-center justify-between sm:justify-center">
                    <span className="text-xs text-slate-500 sm:hidden uppercase font-bold">Consumo:</span>
                    <div className="flex flex-col items-end sm:items-center">
                      <div className="flex items-baseline gap-1">
                        <span className="font-bold text-slate-900 dark:text-slate-100 text-base">{item.quantity}</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">un consumidas</span>
                      </div>
                      <div className={`text-xs font-medium mt-0.5 ${stockColor}`}>
                        {insumoStock} un em estoque
                      </div>
                    </div>
                  </div>

                  <div className="col-span-3 flex items-center justify-between sm:justify-end">
                    <span className="text-xs text-slate-500 sm:hidden uppercase font-bold">Custo:</span>
                    <div className="font-medium text-slate-900 dark:text-slate-100">
                      {item.cost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function RecipeAssistantView({ product }: { product: Product }) {
  const [lossPercentage, setLossPercentage] = useState<number>(0);
  const [drafts, setDrafts] = useState<DraftRecipeItem[]>([
    { id: '1', name: 'Açúcar Refinado', quantity: 500, unit: 'g', isPackaging: false },
    { id: '2', name: 'Essência de Chocolate', quantity: 50, unit: 'ml', isPackaging: false },
    { id: '3', name: 'Caixa de Papelão Decorada', quantity: 1, unit: 'un', isPackaging: true },
  ]);

  const { resolvedItems, allMatched, products: rawProducts } = useRecipeResolver(drafts);
  
  const [linkingRowId, setLinkingRowId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setLinkingRowId(null);
      }
    }
    
    if (linkingRowId !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [linkingRowId]);

  const result = useMemo(() => {
    return RecipeCalculator.calculate(drafts, lossPercentage);
  }, [drafts, lossPercentage]);

  const addRow = () => {
    setDrafts(prev => [
      ...prev, 
      { id: Date.now().toString(), name: '', quantity: 0, unit: 'kg', isPackaging: false }
    ]);
  };

  const updateRow = (id: string, updates: Partial<DraftRecipeItem>) => {
    setDrafts(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  };
  
  const removeRow = (id: string) => {
    setDrafts(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="border border-indigo-100 dark:border-indigo-900/50 bg-indigo-50/30 dark:bg-indigo-950/20 rounded-xl p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
        <div>
          <h3 className="font-bold text-indigo-900 dark:text-indigo-100">Formula de Normalização (1KG Máster)</h3>
          <p className="text-xs text-indigo-600 dark:text-indigo-300 mt-1 max-w-lg">
            Insira os ingredientes da sua receita padrão. O sistema transformará tudo para a proporção equivalente a 1 Quilograma líquido para facilitar as baixas na Ordem de Produção.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800">
             <span className="text-xs font-bold text-slate-500">Perda (%)</span>
             <input 
               type="number"
               min="0" max="99"
               value={lossPercentage}
               onChange={(e) => setLossPercentage(Number(e.target.value) || 0)}
               className="w-12 bg-transparent text-sm font-bold text-slate-900 dark:text-slate-100 text-right outline-none"
             />
          </div>
        </div>
      </div>
      
      <div className="space-y-3 mb-6">
        {resolvedItems.map((item, index) => {
           return (
             <div key={item.id} className="flex flex-col lg:flex-row gap-3 bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm relative group">
                <div className="flex-1 flex flex-col gap-2">
                   {/* Linha 1: Input do Nome e Match */}
                   <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-2">
                     <div className="flex items-center gap-2 flex-1">
                       <span className="text-xs font-bold text-slate-400 w-5 shrink-0">{index + 1}.</span>
                       <input 
                         value={item.name}
                         onChange={e => updateRow(item.id, { name: e.target.value, matchedProductId: undefined })}
                         className="flex-1 font-bold text-sm bg-transparent outline-none placeholder:text-slate-300 dark:placeholder:text-slate-700 min-w-0"
                         placeholder="Ex: Açúcar União"
                       />
                     </div>
                     <div className="pl-7 lg:pl-0 shrink-0 relative">
                       {item.matchStatus === 'matched' ? (
                         <span className="w-full lg:w-auto justify-center lg:justify-start inline-flex items-center gap-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-3 lg:px-2 py-1.5 lg:py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider">
                           <Link size={10} /> Sincronizado
                         </span>
                       ) : (
                         <button 
                           onClick={() => {
                             if (linkingRowId === item.id) {
                               setLinkingRowId(null);
                             } else {
                               setLinkingRowId(item.id);
                               setSearchTerm(item.name);
                             }
                           }}
                           className="w-full lg:w-auto text-[10px] px-3 lg:px-2 py-1.5 lg:py-1 rounded-md bg-amber-100/50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 font-bold uppercase tracking-wider hover:bg-amber-200 transition-colors"
                         >
                           Vincular a Produto
                         </button>
                       )}

                       {linkingRowId === item.id && (
                         <div ref={popoverRef} className="absolute right-0 lg:right-auto lg:left-0 top-full mt-2 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-20 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                           <div className="p-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 bg-slate-50 dark:bg-slate-950/50 relative">
                             <Search size={14} className="text-slate-400 ml-1 shrink-0" />
                             <input 
                               autoFocus
                               value={searchTerm}
                               onChange={e => setSearchTerm(e.target.value)}
                               placeholder="Buscar no catálogo..."
                               className="w-full bg-transparent text-sm outline-none font-medium text-slate-800 dark:text-slate-200 pr-6"
                             />
                             <button
                               onClick={() => setLinkingRowId(null)}
                               className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                             >
                               <X size={14} />
                             </button>
                           </div>
                           <div className="max-h-56 overflow-y-auto p-1 flex flex-col">
                             {rawProducts
                               .filter(p => !searchTerm || p.description.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.toLowerCase().includes(searchTerm.toLowerCase()))
                               .slice(0, 20)
                               .map(p => (
                                 <button
                                   key={p.id}
                                   onClick={() => {
                                     updateRow(item.id, { name: p.description, matchedProductId: p.id });
                                     setLinkingRowId(null);
                                   }}
                                   className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg flex flex-col transition-colors group/item"
                                 >
                                   <span className="font-bold text-slate-800 dark:text-slate-200 group-hover/item:text-indigo-600 dark:group-hover/item:text-indigo-400 line-clamp-1">{p.description}</span>
                                   <span className="text-[10px] text-slate-500 font-mono mt-0.5">{p.id}</span>
                                 </button>
                               ))}
                               
                             {rawProducts.filter(p => !searchTerm || p.description.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 && (
                               <div className="p-4 text-center text-sm text-slate-500">
                                 Nenhum produto encontrado.
                               </div>
                             )}
                           </div>
                         </div>
                       )}
                     </div>
                   </div>
                </div>

                {/* Linha 2 Inputs de Medida */}
                <div className="flex items-center gap-2 lg:ml-auto">
                   <input 
                     type="number"
                     placeholder="0"
                     value={item.quantity || ''}
                     onChange={e => updateRow(item.id, { quantity: Number(e.target.value) || 0 })}
                     className="w-16 px-2 py-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-md text-sm text-right outline-none font-medium"
                   />
                   <select 
                     value={item.unit}
                     onChange={e => updateRow(item.id, { unit: e.target.value as RecipeUnit })}
                     className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-md px-2 py-1 text-sm outline-none font-bold text-slate-600 dark:text-slate-300"
                   >
                     <option value="g">g</option>
                     <option value="kg">kg</option>
                     <option value="ml">ml</option>
                     <option value="l">L</option>
                     <option value="un">UN</option>
                   </select>

                   <label className="flex items-center gap-1.5 ml-2 mr-2 cursor-pointer select-none group/pkg">
                     <div className={cn(
                       "w-4 h-4 rounded flex items-center justify-center transition-colors",
                       item.isPackaging ? "bg-indigo-600 text-white" : "bg-slate-200 dark:bg-slate-800 group-hover/pkg:bg-slate-300"
                     )}>
                        {item.isPackaging && <svg width="10" height="8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                     </div>
                     <span className="text-[10px] font-bold uppercase text-slate-500">Embal.</span>
                     <input type="checkbox" className="hidden" checked={item.isPackaging} onChange={e => updateRow(item.id, { isPackaging: e.target.checked, unit: e.target.checked ? 'un' : 'kg' })} />
                   </label>

                   <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 hidden lg:block mx-1"></div>

                   <button 
                     onClick={() => removeRow(item.id)}
                     className="ml-2 w-7 h-7 flex items-center justify-center rounded text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                   >
                     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                   </button>
                </div>
             </div>
           )
        })}
      </div>

      {resolvedItems.length > 0 && result.items.length > 0 && (
        <div className="mb-6 bg-white dark:bg-slate-900 rounded-xl border border-indigo-200 dark:border-indigo-900 overflow-hidden">
          <div className="px-4 py-3 bg-indigo-50 dark:bg-indigo-900/30 border-b border-indigo-100 dark:border-indigo-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h4 className="font-bold text-sm text-indigo-900 dark:text-indigo-100 uppercase tracking-tight">
              Fórmula Normalizada (1KG)
            </h4>
            <div className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
               Rendimento Real: <span className="font-bold text-emerald-600 dark:text-emerald-400">{result.netYieldKg.toLocaleString('pt-BR', { maximumFractionDigits: 3 })} kg</span>
            </div>
          </div>
          
          {/* Desktop Table View */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-[10px] uppercase font-bold text-slate-500 bg-slate-50 dark:bg-slate-950/50">
                <tr>
                  <th className="px-4 py-2 border-b border-slate-200 dark:border-slate-800">Insumo</th>
                  <th className="px-4 py-2 border-b border-slate-200 dark:border-slate-800 text-right">Massa Original</th>
                  <th className="px-4 py-2 border-b border-slate-200 dark:border-slate-800 text-right">Fórmula (por 1KG)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {result.items.map((calcInfo, idx) => {
                  const originalItem = resolvedItems.find(i => i.id === calcInfo.id);
                  return (
                    <tr key={calcInfo.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                      <td className="px-4 py-2 font-medium text-slate-900 dark:text-slate-100">
                        {originalItem?.name || 'Item ' + (idx + 1)}
                        {calcInfo.isPackaging && <span className="ml-2 text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-500">EMBALAGEM</span>}
                      </td>
                      <td className="px-4 py-2 text-right text-slate-500 dark:text-slate-400">
                        {calcInfo.quantity} {calcInfo.unit}
                      </td>
                      <td className="px-4 py-2 text-right font-bold text-indigo-600 dark:text-indigo-400">
                        {calcInfo.normalizedQuantity.toLocaleString('pt-BR', { maximumFractionDigits: 6 })} {calcInfo.normalizedUnit}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View */}
          <div className="sm:hidden flex flex-col divide-y divide-slate-100 dark:divide-slate-800/60">
            {result.items.map((calcInfo, idx) => {
              const originalItem = resolvedItems.find(i => i.id === calcInfo.id);
              return (
                <div key={calcInfo.id} className="p-3 flex justify-between items-center bg-white dark:bg-slate-900">
                   <div className="flex flex-col gap-0.5">
                     <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{originalItem?.name || 'Item ' + (idx + 1)}</span>
                     <div className="flex items-center gap-1.5 text-xs text-slate-500">
                       <span>Orig: {calcInfo.quantity} {calcInfo.unit}</span>
                       {calcInfo.isPackaging && <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">Embalagem</span>}
                     </div>
                   </div>
                   <div className="text-right flex flex-col">
                     <span className="text-[10px] font-bold text-slate-400 uppercase">Fórmula 1KG</span>
                     <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                       {calcInfo.normalizedQuantity.toLocaleString('pt-BR', { maximumFractionDigits: 6 })} {calcInfo.normalizedUnit}
                     </span>
                   </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between flex-wrap gap-4">
        <Button variant="outline" onClick={addRow} className="gap-2 font-bold text-sm h-8 bg-white dark:bg-slate-900">
           <Plus size={14} /> Nova Linha
        </Button>
        <div className="flex items-center gap-6">
           <div className="text-right">
              <div className="text-[10px] uppercase font-bold text-slate-500 mb-0.5">Massa Bruta Original</div>
              <div className="text-sm font-bold">{result.totalRawWeightKg.toLocaleString('pt-BR', { maximumFractionDigits: 3 })} kg</div>
           </div>
           <div className="text-right">
              <div className="text-[10px] uppercase font-bold text-slate-500 mb-0.5">Rendimento Líquido</div>
              <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{result.netYieldKg.toLocaleString('pt-BR', { maximumFractionDigits: 3 })} kg</div>
           </div>
           <Button className="gap-2 font-bold" disabled={!allMatched || drafts.length === 0}>
              <Save size={16} /> Salvar Receita no Omie
           </Button>
        </div>
      </div>
    </div>
  );
}
