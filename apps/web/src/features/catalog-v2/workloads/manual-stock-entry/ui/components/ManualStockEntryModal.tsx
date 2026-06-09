import React, { useState } from 'react';
import { X, Save, AlertCircle, TrendingUp } from 'lucide-react';
import { ManualStockEntryInput } from '../../api/ManualStockEntryContract';
import { ManualStockEntryGateway } from '../../models/ManualStockEntryGateway';

interface ManualStockEntryModalProps {
  productId: string;
  codigo: string;
  descricao: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function ManualStockEntryModal({ productId, codigo, descricao, onClose, onSuccess }: ManualStockEntryModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<Omit<ManualStockEntryInput, 'productId' | 'codigo'>>({
    date: new Date().toISOString().split('T')[0],
    quantity: 1,
    unitValue: 0,
    observation: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' || name === 'unitValue' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.date || formData.quantity <= 0 || formData.unitValue <= 0) {
      setError('Data, quantidade maior que zero e valor unitário maior que zero são obrigatórios.');
      return;
    }

    setLoading(true);
    setError(null);

    const gateway = ManualStockEntryGateway.getInstance();
    const result = await gateway.execute({
      productId,
      codigo,
      ...formData
    });

    setLoading(false);

    if (result.status === 'ERROR') {
      setError(result.message || 'Falha ao processar movimento.');
    } else {
      onSuccess();
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-lg border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400">
              <TrendingUp size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Entrada Manual de Estoque</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[250px]">
                {codigo} - {descricao}
              </p>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Data do Movimento *</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Quantidade *</label>
              <input
                type="number"
                step="0.001"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="Ex: 50"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Valor Unitário (R$) *</label>
            <input
              type="number"
              step="0.01"
              min="0"
              name="unitValue"
              value={formData.unitValue}
              onChange={handleChange}
              placeholder="Ex: 12.50"
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Observação</label>
            <textarea
              name="observation"
              value={formData.observation}
              onChange={handleChange}
              placeholder="Ex: Entrada manual sem nota fiscal"
              rows={3}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50 resize-none"
            />
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
              className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 rounded-xl transition-colors shadow-sm shadow-blue-900/20"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save size={16} />
              )}
              {loading ? 'Processando...' : 'Confirmar Entrada'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
