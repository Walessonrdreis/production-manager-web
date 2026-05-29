import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOmieProducts } from '@/hooks/catalog/useOmieProducts';

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
    }
  }, [selectedProduct, isOpen]);

  const filteredProducts = products?.filter((p: any) => {
    const term = search.toLowerCase();
    const target = `${p.code || ''} ${p.description || ''}`.toLowerCase();
    return target.includes(term);
  }) || [];

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div 
        className={`relative flex items-center w-full p-2.5 bg-white border ${isOpen ? 'border-blue-400 ring-2 ring-blue-100' : 'border-gray-300'} rounded-md transition-all cursor-text`}
        onClick={() => {
          if (!isOpen) setIsOpen(true);
          inputRef.current?.focus();
        }}
      >
        {!isOpen && selectedProduct && (
          <div className="absolute inset-0 flex items-center pl-2.5 pr-10 bg-white rounded-md pointer-events-none overflow-hidden">
            {selectedProduct.code && (
              <span className="flex-shrink-0 inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200 mr-2 uppercase tracking-wide">
                {selectedProduct.code}
              </span>
            )}
            <span className="truncate text-gray-900 text-sm font-medium">{selectedProduct.description}</span>
          </div>
        )}

        <input
          ref={inputRef}
          type="text"
          className={`w-full bg-transparent outline-none placeholder-gray-400 text-sm ${!isOpen && selectedProduct ? 'opacity-0' : 'opacity-100 text-gray-900'}`}
          placeholder={isLoading ? "Carregando..." : "Busque e selecione um produto..."}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            if (!isOpen) setIsOpen(true);
            if (value) onChange(''); // Clear selection if typing
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
        
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none bg-white rounded-r-md">
          {isLoading ? (
            <svg className="animate-spin h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-72 overflow-y-auto"
          >
            {filteredProducts.length > 0 ? (
              <div className="py-1">
                {filteredProducts.map((p: any) => (
                  <div
                    key={p.id}
                    className={`px-4 py-2 cursor-pointer transition-colors ${
                      value === p.id ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      onChange(p.id);
                      setSearch(p.description);
                      setIsOpen(false);
                    }}
                  >
                    {p.code && (
                      <span className="inline-block bg-gray-100 text-gray-600 text-[10px] px-1.5 py-0.5 rounded mr-2 font-mono border border-gray-200 uppercase tracking-wide">
                        {p.code}
                      </span>
                    )}
                    <span className="font-medium text-sm">{p.description}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-sm text-gray-500 text-center">Nenhum produto encontrado com este nome.</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function CreateOrderView() {
  const { data: products, isLoading: isProductsLoading } = useOmieProducts();
  
  const [formData, setFormData] = useState({
    product: '',
    quantity: 1,
    batch: '',
    expectedCompletionDate: '',
    loss: 0,
    observation: '',
    sector: 'tempering',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProductChange = (productId: string) => {
    setFormData((prev) => ({ ...prev, product: productId }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui no futuro orquestraremos a chamada para a API 2 (Domínio), 
    // que por sua vez enviará o comando de criação no ERP via API 1.
    console.log('Intenção de Criação de OP:', formData);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm border border-gray-200 mt-4">
      <div className="mb-6 border-b border-gray-100 pb-4">
        <h2 className="text-2xl font-bold text-gray-800">Nova Ordem de Produção</h2>
        <p className="text-sm text-gray-500 mt-1">Preencha os dados abaixo para enviar um comando de criação de OP.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Seção 1: Dados do ERP (API 1 Command) */}
        <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Dados de Produção (Integração ERP)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Produto</label>
              <ProductSearchCombobox
                products={products || []}
                isLoading={isProductsLoading}
                value={formData.product}
                onChange={handleProductChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade</label>
              <input 
                type="number" 
                name="quantity"
                min="1"
                value={formData.quantity}
                onChange={handleChange}
                className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data de Previsão de Conclusão</label>
              <input 
                type="date" 
                name="expectedCompletionDate"
                value={formData.expectedCompletionDate}
                onChange={handleChange}
                className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none"
                required
              />
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Observações (Mural da OP)</label>
              <textarea 
                name="observation"
                value={formData.observation}
                onChange={handleChange}
                rows={3}
                placeholder="Detalhes adicionais que irão para o ERP..."
                className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none resize-none"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Seção 2: Regras de Domínio Interno (API 2) */}
        <div className="bg-emerald-50/50 p-6 rounded-lg border border-emerald-200">
          <h3 className="text-lg font-semibold text-emerald-800 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            Controle de Domínio (Interno)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-emerald-900 mb-1">Lote (Rastreio Interno)</label>
              <input 
                type="text" 
                name="batch"
                value={formData.batch}
                onChange={handleChange}
                placeholder="Ex: LOTE-AB2023"
                className="w-full p-2.5 border border-emerald-200 rounded-md focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-emerald-900 mb-1">Margem de Perda (%)</label>
              <input 
                type="number" 
                name="loss"
                min="0"
                step="0.1"
                value={formData.loss}
                onChange={handleChange}
                className="w-full p-2.5 border border-emerald-200 rounded-md focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 outline-none"
              />
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-emerald-900 mb-1">Setor Inicial Padrão</label>
              <select 
                name="sector"
                value={formData.sector}
                onChange={handleChange}
                className="w-full p-2.5 border border-emerald-200 rounded-md focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 outline-none"
              >
                <option value="tempering">Temperagem / Preparação</option>
                <option value="manufacturing">Usinagem / Fabricação</option>
                <option value="packaging">Embalagem</option>
              </select>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
          <button 
            type="button" 
            className="px-6 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-md hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            Criar Ordem de Produção
          </button>
        </div>
      </form>
    </div>
  );
}
