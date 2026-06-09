import React, { useState } from 'react';
import { X, Package, Save, AlertCircle } from 'lucide-react';
import { CreateProductInput } from '../../api/CreateProductContract';
import { CreateProductGateway } from '../../models/CreateProductGateway';

interface CreateProductFormModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateProductFormModal({ onClose, onSuccess }: CreateProductFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateProductInput>({
    codigo: '',
    descricao: '',
    unidade: 'UN',
    preco_unitario: 0,
    estoque_minimo: 0,
    familia: '',
    tipoItem: '04' // Default for Produto Acabado
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'preco_unitario' || name === 'estoque_minimo' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.codigo || !formData.descricao) {
      setError('Código e descrição são obrigatórios.');
      return;
    }

    setLoading(true);
    setError(null);

    const gateway = CreateProductGateway.getInstance();
    const result = await gateway.execute(formData);

    setLoading(false);

    if (result.status === 'ERROR') {
      setError(result.message || 'Falha ao criar produto.');
    } else {
      onSuccess();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-lg border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Package size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Novo Produto</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Criar um item no sistema e refleti-lo no Omie</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-start gap-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm border border-red-100 dark:border-red-900/30">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Código *</label>
              <input
                type="text"
                name="codigo"
                value={formData.codigo}
                onChange={handleChange}
                placeholder="Ex: PA-100"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 dark:focus:ring-emerald-400/50"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Tipo Item</label>
              <select
                name="tipoItem"
                value={formData.tipoItem}
                onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 dark:focus:ring-emerald-400/50"
              >
                <option value="00">Mercadoria</option>
                <option value="04">Produto Acabado</option>
                <option value="03">Produto em Processo</option>
                <option value="01">Insumo / Matéria-Prima</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Descrição *</label>
            <input
              type="text"
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              placeholder="Ex: Mesa de Madeira"
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 dark:focus:ring-emerald-400/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Unidade</label>
              <input
                type="text"
                name="unidade"
                value={formData.unidade}
                onChange={handleChange}
                placeholder="Ex: UN"
                maxLength={3}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 dark:focus:ring-emerald-400/50"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Família</label>
              <input
                type="text"
                name="familia"
                value={formData.familia}
                onChange={handleChange}
                placeholder="Ex: Móveis"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 dark:focus:ring-emerald-400/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Preço Venda (R$)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                name="preco_unitario"
                value={formData.preco_unitario}
                onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 dark:focus:ring-emerald-400/50"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Estoque Mínimo</label>
              <input
                type="number"
                min="0"
                step="1"
                name="estoque_minimo"
                value={formData.estoque_minimo}
                onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 dark:focus:ring-emerald-400/50"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-600/50 rounded-xl transition-colors"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save size={16} />
              )}
              {loading ? 'Salvando...' : 'Salvar Produto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
