import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Trash2, Edit2, Search, Save, AlertCircle, AlertTriangle } from 'lucide-react';
import { useGoals } from '../../../../hooks/goals/useGoals';
import { useSectors } from '../../../../hooks/sectors/useSectors';
import { GoalPeriod, ProductionGoal } from '../../domain/Goal';

export function SectorGoalsTab() {
  const { goals, saveGoal, deleteGoal, updateGoal } = useGoals();
  const { data: sectors = [] } = useSectors();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<GoalPeriod | 'all'>('monthly');
  
  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingGoal, setEditingGoal] = useState<ProductionGoal | null>(null);
  
  // Form State
  const [selectedSectorId, setSelectedSectorId] = useState('');
  const [targetQty, setTargetQty] = useState<number>(0);
  const [period, setPeriod] = useState<GoalPeriod>('monthly');

  // Filter only sector goals
  const sectorGoals = goals.filter(g => g.type === 'sector');

  const filteredGoals = sectorGoals.filter(g => 
    (activeTab === 'all' || g.period === activeTab) &&
    ((g.sectorName || '').toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const openAddModal = () => {
    setEditingGoal(null);
    setSelectedSectorId('');
    setTargetQty(0);
    setPeriod('monthly');
    setIsModalOpen(true);
  };

  const openEditModal = (goal: ProductionGoal) => {
    setEditingGoal(goal);
    setSelectedSectorId(goal.sectorId || '');
    setTargetQty(goal.targetQuantity || 0);
    setPeriod(goal.period || 'monthly');
    setIsModalOpen(true);
  };

  const handleSaveGoal = async () => {
    const sector = sectors.find(s => s.id === selectedSectorId);
    if (!sector || targetQty <= 0) return;

    if (!editingGoal) {
      // Validação: Impedir metas duplicadas
      const existingGoal = sectorGoals.find(g => g.sectorId === sector.id && g.period === period);
      if (existingGoal) {
        alert(`Já existe uma meta ${period === 'daily' ? 'diária' : period === 'weekly' ? 'semanal' : 'mensal'} para este setor.`);
        return;
      }

      await saveGoal({
        type: 'sector',
        sectorId: sector.id,
        sectorName: sector.name,
        targetQuantity: targetQty,
        period,
        isActive: true
      });
    } else {
      await updateGoal(editingGoal.id, {
        type: 'sector',
        sectorId: sector.id,
        sectorName: sector.name,
        targetQuantity: targetQty,
        period,
        isActive: true
      });
    }

    setIsModalOpen(false);
    setSelectedSectorId('');
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
            placeholder="Pesquisar por Setor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
      </div>

      {/* Tabela de Metas -> Grid de Cards */}
      <div className="flex flex-col gap-3">
        {filteredGoals.length === 0 ? (
          <div className="py-12 text-center text-gray-500 bg-white rounded-xl border border-dashed border-gray-200">
            Nenhuma meta cadastrada para os critérios atuais.
          </div>
        ) : (
          filteredGoals.map((goal) => (
            <motion.div 
              layout
              key={goal.id} 
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all relative group flex flex-col sm:flex-row sm:items-center justify-between cursor-pointer hover:border-indigo-200 gap-4"
              onClick={() => openEditModal(goal)}
            >
              <div className="flex items-center gap-4 flex-1">
                 <span 
                  className={`w-3 h-3 rounded-full flex-shrink-0 shadow-inner ${goal.isActive ? 'bg-green-500' : 'bg-gray-300'}`} 
                  title={goal.isActive ? 'Ativo' : 'Inativo'}
                  aria-label={goal.isActive ? 'Status ativo' : 'Status inativo'}
                />
                <h3 className="font-bold text-gray-900 leading-tight flex-1">
                  {goal.sectorName || 'Desconhecido'}
                </h3>
              </div>
              
              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 p-3 sm:p-0 border-gray-50 mt-2 sm:mt-0">
                <div className="text-left sm:text-right">
                  <p className="text-[10px] text-gray-400 font-bold mb-0.5 uppercase tracking-wider">Quantidade Alvo</p>
                  <p className="text-2xl font-mono text-indigo-600 font-black leading-none">{goal.targetQuantity}</p>
                </div>
                
                <div>
                  <span className="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide border border-indigo-100">
                    {goal.period === 'daily' ? 'Dia' : goal.period === 'weekly' ? 'Semana' : 'Mês'}
                  </span>
                </div>

                <div className="flex gap-2 lg:opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity pl-2 border-l border-gray-100">
                  <button 
                    onClick={(e) => { e.stopPropagation(); openEditModal(goal); }}
                    className="text-gray-400 hover:text-indigo-600 p-2 border border-gray-100 rounded-lg hover:border-indigo-200 hover:bg-indigo-50 focus:bg-indigo-50 outline-none transition-all shadow-sm"
                    title="Editar Meta"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setDeletingId(goal.id); }}
                    className="text-gray-400 hover:text-red-600 p-2 border border-gray-100 rounded-lg hover:border-red-200 hover:bg-red-50 focus:bg-red-50 outline-none transition-all shadow-sm"
                    title="Excluir Meta"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
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
            <h2 className="text-xl font-bold">{editingGoal ? 'Editar Meta' : 'Definir Meta de Setor'}</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Setor</label>
                <select 
                  value={selectedSectorId}
                  onChange={(e) => setSelectedSectorId(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="">Selecione um setor...</option>
                  {sectors.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
                {sectors.length === 0 && (
                  <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Adicione setores na página de Setores.
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
                disabled={!selectedSectorId || targetQty <= 0}
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
