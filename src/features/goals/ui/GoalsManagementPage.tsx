import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Target, Plus, Trash2, Edit2, Search, Filter, Save, AlertCircle, AlertTriangle } from 'lucide-react';
import { useGoals } from '../../../hooks/goals/useGoals';
import { useMyProducts } from '../../../hooks/products/useMyProducts';
import { GoalPeriod, ProductionGoal } from '../domain/Goal';

export function GoalsManagementPage() {
  const { goals, saveGoal, deleteGoal, updateGoal } = useGoals();
  const { savedProducts } = useMyProducts();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<GoalPeriod | 'all'>('monthly');
  
  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingGoal, setEditingGoal] = useState<ProductionGoal | null>(null);
  
  // Form State
  const [selectedProductId, setSelectedProductId] = useState('');
  const [targetQty, setTargetQty] = useState<number>(0);
  const [period, setPeriod] = useState<GoalPeriod>('monthly');

  const filteredGoals = goals.filter(g => 
    (activeTab === 'all' || g.period === activeTab) &&
    ((g.productDescription || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (g.productCode || '').toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const openAddModal = () => {
    setEditingGoal(null);
    setSelectedProductId('');
    setTargetQty(0);
    setPeriod('monthly');
    setIsModalOpen(true);
  };

  const openEditModal = (goal: ProductionGoal) => {
    const product = savedProducts.find(p => p.code === goal.productCode || p.description === goal.productDescription);
    setEditingGoal(goal);
    setSelectedProductId(product ? product.id : '');
    setTargetQty(goal.targetQuantity || 0);
    setPeriod(goal.period || 'monthly');
    setIsModalOpen(true);
  };

  const handleSaveGoal = async () => {
    const product = savedProducts.find(p => p.id === selectedProductId);
    if (!product || targetQty <= 0) return;

    if (!editingGoal) {
      // Validação: Impedir metas duplicadas
      const existingGoal = goals.find(g => {
        const matchProduct = product.code && g.productCode ? g.productCode === product.code : g.productDescription === product.description;
        return matchProduct && g.period === period;
      });
      if (existingGoal) {
        alert(`Já existe uma meta ${period === 'daily' ? 'diária' : period === 'weekly' ? 'semanal' : 'mensal'} para este produto.`);
        return;
      }

      await saveGoal({
        productCode: product.code,
        productDescription: product.description,
        targetQuantity: targetQty,
        period,
        isActive: true
      });
    } else {
      await updateGoal(editingGoal.id, {
        productCode: product.code,
        productDescription: product.description,
        targetQuantity: targetQty,
        period,
        isActive: true
      });
    }

    setIsModalOpen(false);
    setSelectedProductId('');
    setTargetQty(0);
    setEditingGoal(null);
  };

  const confirmDelete = async () => {
    if (deletingId) {
      await deleteGoal(deletingId);
      setDeletingId(null);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6" id="goals-page">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Target className="w-8 h-8 text-indigo-600" />
            Metas de Produção
          </h1>
          <p className="text-gray-500">Defina objetivos numéricos por SKU para balizar o planejamento.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition-colors shadow-sm"
          id="btn-new-goal"
        >
          <Plus className="w-5 h-5" />
          Nova Meta
        </button>
      </header>

      {/* Abas */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('monthly')}
          className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors ${activeTab === 'monthly' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
        >
          Mensais
        </button>
        <button
          onClick={() => setActiveTab('weekly')}
          className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors ${activeTab === 'weekly' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
        >
          Semanais
        </button>
        <button
          onClick={() => setActiveTab('daily')}
          className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors ${activeTab === 'daily' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
        >
          Diárias
        </button>
        <button
          onClick={() => setActiveTab('all')}
          className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors ${activeTab === 'all' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
        >
          Todas
        </button>
      </div>

      {/* Busca e Filtros */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Pesquisar por Código ou Descrição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
      </div>

      {/* Modal de Confirmação de Deleção */}
      {deletingId && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div 
            initial={{ scale: 0.95 }} animate={{ scale: 1 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-4"
          >
            <div className="flex items-center gap-3 text-red-600">
              <AlertTriangle className="w-6 h-6" />
              <h2 className="text-xl font-bold">Atenção!</h2>
            </div>
            <p className="text-gray-600 font-medium">Tem certeza que deseja excluir esta meta? Esta ação não pode ser desfeita.</p>
            <div className="flex gap-3 pt-4">
              <button 
                onClick={() => setDeletingId(null)}
                className="flex-1 px-4 py-2 border rounded-lg font-medium hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700"
              >
                Sim, Excluir
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Modal de Adição/Edição */}
      {isModalOpen && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div 
            initial={{ scale: 0.95 }} animate={{ scale: 1 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4"
          >
            <h2 className="text-xl font-bold">{editingGoal ? 'Editar Meta' : 'Definir Meta'}</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Produto do Catálogo (Meus Produtos)</label>
                <select 
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="">Selecione um produto...</option>
                  {savedProducts.map(p => (
                    <option key={p.id} value={p.id}>{p.code} - {p.description}</option>
                  ))}
                </select>
                {savedProducts.length === 0 && (
                  <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Adicione produtos em "Meus Produtos" primeiro.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meta Quantitativa</label>
                  <input 
                    type="number" 
                    value={targetQty || ''}
                    onChange={(e) => setTargetQty(Number(e.target.value))}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Período</label>
                  <select 
                    value={period}
                    onChange={(e) => setPeriod(e.target.value as GoalPeriod)}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="daily">Diário</option>
                    <option value="weekly">Semanal</option>
                    <option value="monthly">Mensal</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button 
                onClick={() => { setIsModalOpen(false); setEditingGoal(null); }}
                className="flex-1 px-4 py-2 border rounded-lg font-medium hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button 
                onClick={handleSaveGoal}
                disabled={!selectedProductId || targetQty <= 0}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                {editingGoal ? 'Atualizar Meta' : 'Salvar Meta'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Tabela de Metas */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-xs font-semibold text-gray-600 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">SKU / Produto</th>
              <th className="px-6 py-4">Quantidade Alvo</th>
              <th className="px-6 py-4">Período</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 italic">
            {filteredGoals.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-400 not-italic">
                  Nenhuma meta cadastrada para os critérios atuais.
                </td>
              </tr>
            ) : (
              filteredGoals.map((goal) => (
                <motion.tr 
                  layout
                  key={goal.id} 
                  className="hover:bg-gray-50 transition-colors group not-italic"
                >
                  <td className="px-6 py-4">
                    <span className={`w-2.5 h-2.5 rounded-full inline-block ${goal.isActive ? 'bg-green-500' : 'bg-gray-300'}`} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{goal.productCode}</div>
                    <div className="text-sm text-gray-500">{goal.productDescription}</div>
                  </td>
                  <td className="px-6 py-4 font-mono text-indigo-600 font-bold">
                    {goal.targetQuantity}
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-xs font-medium uppercase">
                      {goal.period === 'daily' ? 'Dia' : goal.period === 'weekly' ? 'Semana' : 'Mês'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => openEditModal(goal)}
                        className="text-gray-400 hover:text-indigo-600 p-2 rounded-lg hover:bg-indigo-50 transition-colors"
                        title="Editar Meta"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => setDeletingId(goal.id)}
                        className="text-gray-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors"
                        title="Excluir Meta"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
