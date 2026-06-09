import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useOmieProducts } from '../../../../hooks/catalog/useOmieProducts';
import { productionOrdersApi } from '../../api/productionOrdersApi';
import { AlertCircle } from 'lucide-react';
import { DevBadge } from '../../../../components/ui/DevBadge';

interface ProductComboboxProps {
  products: any[];
  isLoading: boolean;
  value: string;
  onChange: (val: string) => void;
}

function ProductSearchCombobox({ products = [], isLoading, value, onChange }: ProductComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedProduct = products?.find((p: any) => p.id === value);

  useEffect(() => {
    // Focus automatically on mount
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    // Sync search text with selected product when closed
    if (selectedProduct && !isOpen) {
      setSearch(selectedProduct.description);
    } else if (!value) {
      setSearch('');
    }
  }, [selectedProduct, isOpen, value]);

  const filteredProducts = products?.filter((p: any) => {
    const term = search.toLowerCase();
    const target = `${p.code || ''} ${p.description || ''}`.toLowerCase();
    return target.includes(term);
  }) || [];

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div 
        className={`relative flex items-center w-full p-2.5 bg-white dark:bg-slate-900 border ${isOpen ? 'border-blue-400 dark:border-blue-500 ring-2 ring-blue-100 dark:ring-blue-900/50' : 'border-gray-300 dark:border-slate-700'} rounded-md transition-all cursor-text`}
        onClick={() => {
          if (!isOpen) setIsOpen(true);
          inputRef.current?.focus();
        }}
      >
        {!isOpen && selectedProduct && (
          <div className="absolute inset-0 flex items-center pl-2.5 pr-10 bg-white dark:bg-slate-900 rounded-md pointer-events-none overflow-hidden">
            {selectedProduct.code && (
              <span className="flex-shrink-0 inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 mr-2 uppercase tracking-wide">
                {selectedProduct.code}
              </span>
            )}
            <span className="truncate text-gray-900 dark:text-slate-100 text-sm font-medium">{selectedProduct.description}</span>
          </div>
        )}

        <input
          ref={inputRef}
          type="text"
          className={`w-full bg-transparent outline-none placeholder-gray-400 dark:placeholder-slate-500 text-sm ${!isOpen && selectedProduct ? 'opacity-0' : 'opacity-100 text-gray-900 dark:text-slate-100'}`}
          placeholder={isLoading ? "Carregando..." : "Busque e selecione um produto..."}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            if (!isOpen) setIsOpen(true);
            // We do NOT clear value aggressively here as it triggers loops or bad UX, we just let typing happen
          }}
          onFocus={(e) => {
            setIsOpen(true);
            setTimeout(() => {
              e.target.select();
            }, 10);
          }}
          disabled={isLoading}
          required={!value}
        />
        
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none bg-white dark:bg-slate-900 rounded-r-md">
          {isLoading ? (
            <svg className="animate-spin h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg className="w-4 h-4 text-gray-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-md shadow-lg max-h-72 overflow-y-auto"
          >
            {filteredProducts.length > 0 ? (
              <div className="py-1">
                {filteredProducts.map((p: any) => (
                  <div
                    key={p.id}
                    className={`px-4 py-2 cursor-pointer transition-colors ${
                      value === p.id 
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                        : 'text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700/50'
                    }`}
                    onClick={() => {
                      onChange(p.id);
                      setSearch(p.description);
                      setIsOpen(false);
                    }}
                  >
                    {p.code && (
                      <span className="inline-block bg-gray-100 dark:bg-slate-900 text-gray-600 dark:text-slate-400 text-[10px] px-1.5 py-0.5 rounded mr-2 font-mono border border-gray-200 dark:border-slate-700 uppercase tracking-wide">
                        {p.code}
                      </span>
                    )}
                    <span className="font-medium text-sm">{p.description}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-sm text-gray-500 dark:text-slate-400 text-center">Nenhum produto encontrado com este nome.</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function CreateSingleOrderView({ onSuccess }: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data: products, isLoading: isProductsLoading } = useOmieProducts();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Modal State para produto sem estrutura
  const [showMissingBomModal, setShowMissingBomModal] = useState(false);
  const [pendingProductId, setPendingProductId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    product: '',
    quantity: 1,
    batch: '',
    expectedCompletionDate: '',
    createdAt: '', // Added createdAt to the form state
    loss: 0,
    observation: '',
    sector: 'tempering',
  });

  const selectedProduct = products?.find((p: any) => p.id === formData.product);
  const unitLabel = selectedProduct?.unit ? `(${selectedProduct.unit})` : '(%)';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProductChange = (productId: string) => {
    const product = products?.find((p: any) => p.id === productId);
    
    // MOCK: Verifica a estrutura 'bom' real do produto carregado
    const hasBom = Array.isArray(product?.bom) && product.bom.length > 0;
    
    // Se o produto NÃO TIVER ESTRUTURA (hasBom === false), exibe modal bloqueante.
    if (!hasBom) { 
      setPendingProductId(productId);
      setShowMissingBomModal(true);
      return;
    }

    setFormData((prev) => ({ ...prev, product: productId }));
  };

  const handleConfirmCreateBom = () => {
    // Navegar para a página de catálogo v2 para gerenciar estruturas
    navigate(`/v2/catalog?view=with-bom&expandProduct=${pendingProductId}`);
  };

  const handleDeclineCreateBom = () => {
    // Reseta o input (não seleciona o produto) e fecha a modal
    setShowMissingBomModal(false);
    setPendingProductId(null);
    setFormData((prev) => ({ ...prev, product: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.product) {
      alert("Selecione um produto.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await productionOrdersApi.createOrder({
        items: [{ productId: formData.product, quantity: Number(formData.quantity) }],
        notes: formData.observation,
        productName: selectedProduct?.description,
        batch: formData.batch,
        sector: formData.sector,
        expectedCompletionDate: formData.expectedCompletionDate,
        createdAt: formData.createdAt ? new Date(formData.createdAt).toISOString() : undefined,
      });
      // Invalida a querie de OPs abertas assim que for criada
      queryClient.invalidateQueries({ queryKey: ['production-orders', 'opened'] });
      
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error('Erro ao criar OP:', error);
      setErrorMessage(error.message || 'Erro inesperado ao criar ordem de produção.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-gray-200 dark:border-slate-800 mt-4">
      {/* Modal Missing BOM */}
      <AnimatePresence>
        {showMissingBomModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-slate-700"
            >
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-200 dark:border-amber-800/50">
                  <AlertCircle size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">Estrutura Inexistente</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
                  Este produto ainda não possui uma estrutura de produção (BOM) cadastrada. 
                  Deseja criá-la agora?
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button 
                    onClick={handleDeclineCreateBom}
                    className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-medium rounded-lg transition-colors"
                  >
                    Não, escolher outro
                  </button>
                  <button 
                    onClick={handleConfirmCreateBom}
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors border-none"
                  >
                    Sim, criar estrutura
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="mb-6 border-b border-gray-100 dark:border-slate-800 pb-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100">Nova Ordem de Produção</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Preencha os dados abaixo para enviar um comando de criação de OP.</p>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/50 rounded-md">
          <div className="flex">
            <svg className="w-5 h-5 text-red-500 dark:text-red-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <h4 className="text-sm font-semibold text-red-800 dark:text-red-300">Falha na Validação (Conformidade ERP)</h4>
              <p className="text-sm text-red-700 dark:text-red-400 mt-1">{errorMessage}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Seção 1: Dados do ERP (API 1 Command) */}
        <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Dados de Produção (ERP & Interno)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1 md:col-span-3">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                Produto
                <DevBadge domain="api1" />
              </label>
              <ProductSearchCombobox
                products={products || []}
                isLoading={isProductsLoading}
                value={formData.product}
                onChange={handleProductChange}
              />
            </div>

            <div className="col-span-1 md:col-span-2">
               <label className="text-sm font-medium text-emerald-900 dark:text-emerald-300 mb-1 flex items-center">
                 Lote (Rastreio Interno)
                 <DevBadge domain="api2" />
               </label>
               <input 
                 type="text" 
                 name="batch"
                 value={formData.batch}
                 onChange={handleChange}
                 placeholder="Ex: LOTE-AB2023"
                 className="w-full p-2.5 bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 text-gray-900 dark:text-slate-100 rounded-md focus:ring-2 focus:ring-emerald-100 dark:focus:ring-emerald-900 focus:border-emerald-400 dark:focus:border-emerald-500 outline-none"
               />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                Quantidade
                <DevBadge domain="api1" />
              </label>
              <input 
                type="number" 
                name="quantity"
                min="1"
                value={formData.quantity}
                onChange={handleChange}
                className="w-full p-2.5 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-slate-100 rounded-md focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-blue-400 dark:focus:border-blue-500 outline-none"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                  Data de Criação (Opcional)
                  <DevBadge domain="api1" />
                </label>
              </div>
              <div className="flex flex-col gap-2">
                <input 
                  type="date" 
                  name="createdAt"
                  value={formData.createdAt}
                  onChange={handleChange}
                  onClick={(e) => {
                    try {
                      if (typeof e.currentTarget.showPicker === 'function') {
                        e.currentTarget.showPicker();
                      }
                    } catch (err) {}
                  }}
                  className="w-full p-2.5 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-slate-100 rounded-md focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-blue-400 dark:focus:border-blue-500 outline-none cursor-pointer [color-scheme:light] dark:[color-scheme:dark]"
                />
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const today = new Date().toISOString().split('T')[0];
                      setFormData(prev => ({ ...prev, createdAt: today }));
                    }}
                    className="text-xs px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-700"
                  >
                    Hoje
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, createdAt: '' }))}
                    className="text-xs px-2.5 py-1 rounded-md text-slate-500 hover:text-slate-700 hover:bg-slate-200 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-700 transition-colors border border-transparent"
                  >
                    Automático (Hoje)
                  </button>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                  Previsão de Conclusão
                  <DevBadge domain="api1" />
                </label>
              </div>
              <div className="flex flex-col gap-2">
                <input 
                  type="date" 
                  name="expectedCompletionDate"
                  value={formData.expectedCompletionDate}
                  onChange={handleChange}
                  onClick={(e) => {
                    try {
                      if (typeof e.currentTarget.showPicker === 'function') {
                        e.currentTarget.showPicker();
                      }
                    } catch (err) {}
                  }}
                  className="w-full p-2.5 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-slate-100 rounded-md focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-blue-400 dark:focus:border-blue-500 outline-none cursor-pointer [color-scheme:light] dark:[color-scheme:dark]"
                  required
                />
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const today = new Date().toISOString().split('T')[0];
                      setFormData(prev => ({ ...prev, expectedCompletionDate: today }));
                    }}
                    className="text-xs px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-700"
                  >
                    Hoje
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const tomorrow = new Date();
                      tomorrow.setDate(tomorrow.getDate() + 1);
                      setFormData(prev => ({ ...prev, expectedCompletionDate: tomorrow.toISOString().split('T')[0] }));
                    }}
                    className="text-xs px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-700"
                  >
                    Amanhã
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const nextWeek = new Date();
                      nextWeek.setDate(nextWeek.getDate() + 7);
                      setFormData(prev => ({ ...prev, expectedCompletionDate: nextWeek.toISOString().split('T')[0] }));
                    }}
                    className="text-xs px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-700"
                  >
                    1 Semana
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-emerald-900 dark:text-emerald-300 mb-1 flex items-center">
                Margem de Perda {unitLabel}
                <DevBadge domain="mixed" />
              </label>
              <input 
                type="number" 
                name="loss"
                min="0"
                step="0.1"
                value={formData.loss}
                onChange={handleChange}
                className="w-full p-2.5 bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 text-gray-900 dark:text-slate-100 rounded-md focus:ring-2 focus:ring-emerald-100 dark:focus:ring-emerald-900 focus:border-emerald-400 dark:focus:border-emerald-500 outline-none"
              />
            </div>

            <div className="col-span-1 md:col-span-3">
              <label className="text-sm font-medium text-emerald-900 dark:text-emerald-300 mb-1 flex items-center">
                Setor Inicial Padrão
                <DevBadge domain="api2" />
              </label>
              <select 
                name="sector"
                value={formData.sector}
                onChange={handleChange}
                className="w-full p-2.5 bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 text-gray-900 dark:text-slate-100 rounded-md focus:ring-2 focus:ring-emerald-100 dark:focus:ring-emerald-900 focus:border-emerald-400 dark:focus:border-emerald-500 outline-none"
              >
                <option value="tempering">Temperagem / Preparação</option>
                <option value="manufacturing">Usinagem / Fabricação</option>
                <option value="packaging">Embalagem</option>
              </select>
            </div>

            <div className="col-span-1 md:col-span-3">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                Observações (Mural da OP)
                <DevBadge domain="api1" />
              </label>
              <textarea 
                name="observation"
                value={formData.observation}
                onChange={handleChange}
                rows={3}
                placeholder="Detalhes adicionais que irão para o ERP..."
                className="w-full p-2.5 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-slate-100 rounded-md focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-blue-400 dark:focus:border-blue-500 outline-none resize-none"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-gray-100 dark:border-slate-800 flex justify-end gap-3">
          <button 
            type="button" 
            className="px-6 py-2.5 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 font-medium rounded-md hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-blue-600 outline-none text-white font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processando...
              </>
            ) : (
              'Criar Ordem de Produção'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

import { CreateBatchOrdersView } from './CreateBatchOrdersView';

export function CreateOrderView({ onSuccess }: { onSuccess?: () => void }) {
  const [activeTab, setActiveTab] = useState<'single' | 'batch'>('single');

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Tabs */}
      <div className="flex bg-gray-100/50 dark:bg-slate-800/50 p-1 rounded-lg border border-gray-200 dark:border-slate-800 shrink-0 w-max">
        <button
          onClick={() => setActiveTab('single')}
          className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'single'
              ? 'bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-400 shadow-sm'
              : 'text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          Criação Individual
        </button>
        <button
          onClick={() => setActiveTab('batch')}
          className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'batch'
              ? 'bg-white dark:bg-slate-900 text-purple-700 dark:text-purple-400 shadow-sm border border-purple-100 dark:border-purple-900/50'
              : 'text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          Criação em Lote (Excel)
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.15 }}
        >
          {activeTab === 'single' ? (
            <CreateSingleOrderView onSuccess={onSuccess} />
          ) : (
            <CreateBatchOrdersView onSuccess={onSuccess} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
