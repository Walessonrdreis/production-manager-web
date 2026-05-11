import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Trash2, Edit2, Search, Save, AlertCircle, AlertTriangle } from 'lucide-react';
import { useGoals } from '../../../../hooks/goals/useGoals';
import { useStocks } from '../../../../hooks/stocks/useStocks';
import { GoalPeriod, ProductionGoal } from '../../domain/Goal';

export function ProductGoalsTab() {
  const { goals, saveGoal, deleteGoal, updateGoal } = useGoals();
  const { savedProducts } = useStocks();
  
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

  // Filter only product goals
  const productGoals = goals.filter(g => !g.type || g.type === 'product');

  const filteredGoals = productGoals.filter(g => 
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
      const existingGoal = productGoals.find(g => {
        const matchProduct = product.code && g.productCode ? g.productCode === product.code : g.productDescription === product.description;
        return matchProduct && g.period === period;
      });
      if (existingGoal) {
        alert(`Já existe uma meta ${period === 'daily' ? 'diária' : period === 'weekly' ? 'semanal' : 'mensal'} para este produto.`);
        return;
      }

      await saveGoal({
        type: 'product',
        productCode: product.code,
        productDescription: product.description,
        targetQuantity: targetQty,
        period,
        isActive: true
      });
    } else {
      await updateGoal(editingGoal.id, {
        type: 'product',
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        {/* Abas */}
        <div className="flex border-b border-gray-200 flex-1">
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
        
        <button 
          onClick={openAddModal}
          className="ml-4 bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition-colors shadow-sm h-10"
        >
          <Plus className="w-5 h-5" />
          Nova Meta
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

      {/* Tabela de Metas -> Grid de Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredGoals.length === 0 ? (
          <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-xl border border-dashed border-gray-200">
            Nenhuma meta cadastrada para os critérios atuais.
          </div>
        ) : (
          filteredGoals.map((goal) => (
            <motion.div 
              layout
              key={goal.id} 
              className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all relative group flex flex-col cursor-pointer hover:border-indigo-100"
              onClick={() => openEditModal(goal)}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-3 pr-4">
                  <span 
                    className={`w-3 h-3 mt-1 rounded-full flex-shrink-0 shadow-inner ${goal.isActive ? 'bg-green-500' : 'bg-gray-300'}`} 
                    title={goal.isActive ? 'Ativo' : 'Inativo'}
                    aria-label={goal.isActive ? 'Status ativo' : 'Status inativo'}
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900 leading-tight">
                      {goal.productCode}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {goal.productDescription}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1 opacity-100 lg:opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity absolute top-4 right-4 bg-white/80 backdrop-blur-sm rounded-lg">
                  <button 
                    onClick={(e) => { e.stopPropagation(); openEditModal(goal); }}
                    className="text-gray-400 hover:text-indigo-600 p-1.5 rounded-md hover:bg-indigo-50 focus:bg-indigo-50 outline-none transition-colors"
                    title="Editar Meta"
                    aria-label={`Editar meta do produto ${goal.productDescription}`}
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setDeletingId(goal.id); }}
                    className="text-gray-400 hover:text-red-600 p-1.5 rounded-md hover:bg-red-50 focus:bg-red-50 outline-none transition-colors"
                    title="Excluir Meta"
                    aria-label={`Excluir meta do produto ${goal.productDescription}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="mt-auto flex justify-between items-end pt-4 border-t border-gray-50">
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1 uppercase tracking-wider">Quantidade Alvo</p>
                  <p className="text-2xl font-mono text-indigo-600 font-bold leading-none">{goal.targetQuantity}</p>
                </div>
                <div>
                  <span className="bg-indigo-50 text-indigo-700 px-2.5 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wide">
                    {goal.period === 'daily' ? 'Dia' : goal.period === 'weekly' ? 'Semana' : 'Mês'}
                  </span>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

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
            <h2 className="text-xl font-bold">{editingGoal ? 'Editar Meta' : 'Definir Meta de Produto'}</h2>
            
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
    </div>
  );
}
