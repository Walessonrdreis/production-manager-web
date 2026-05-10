import { Product } from '../../../../types/api';
import { X, Package, Tag, Archive, DollarSign, Target, FilePlus2, Edit2, Trash2, AlertTriangle, Layers } from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { useGoals } from '../../../../hooks/goals/useGoals';
import { useState, useMemo, useEffect } from 'react';
import { GoalPeriod } from '../../../goals/domain/Goal';
import { ConfirmDialog } from '../../../../components/ui/ConfirmDialog';
import { useSectors } from '../../../../hooks/sectors/useSectors';
import { useMyProducts } from '../../../../hooks/products/useMyProducts';

interface ProductDetailsModalProps {
  product: Product | null;
  demandMap?: Record<string, number>;
  isOpen: boolean;
  onClose: () => void;
  onPlanProduct?: (product: Product) => void;
}

export function ProductDetailsModal({ product, demandMap = {}, isOpen, onClose, onPlanProduct }: ProductDetailsModalProps) {
  const { goals, saveGoal, deleteGoal, updateGoal } = useGoals();
  const { data: sectors = [] } = useSectors();
  const { updateProduct } = useMyProducts();
  
  const [editingGoal, setEditingGoal] = useState<string | null>(null);
  const [targetQty, setTargetQty] = useState<number>(0);
  const [period, setPeriod] = useState<GoalPeriod>('monthly');
  const [goalToDelete, setGoalToDelete] = useState<string | null>(null);

  const [editingMinStock, setEditingMinStock] = useState(false);
  const [minStockValue, setMinStockValue] = useState<number>(0);

  useEffect(() => {
    if (product) {
      setMinStockValue(product.minStock || 0);
      setEditingMinStock(false);
    }
  }, [product]);

  const productGoals = useMemo(() => {
    if (!product) return [];
    return goals.filter(g => g.productCode === product.code || g.productDescription === product.description);
  }, [product, goals]);

  if (!isOpen || !product) return null;

  const productCode = String(product.code || product.id || product.description);
  const demand = demandMap[productCode] || 0;
  const stock = product.stock || 0;
  const deficit = stock - demand;
  const minStock = product.minStock || 0;
  
  const isCritical = deficit < 0;
  const isWarning = !isCritical && ((stock <= minStock && minStock > 0) || (demand > 0 && deficit <= minStock));

  const handleSaveGoal = async () => {
    if (targetQty <= 0) return;

    if (editingGoal) {
      await updateGoal(editingGoal, {
        targetQuantity: targetQty,
        period,
      });
      setEditingGoal(null);
    } else {
      const existing = productGoals.find(g => g.period === period);
      if (existing) {
        alert('Já existe uma meta para este período. Edite-a ao invés de criar outra.');
        return;
      }
      await saveGoal({
        productCode: String(product.code || product.id),
        productDescription: product.description,
        targetQuantity: targetQty,
        period,
        isActive: true
      });
    }
    setTargetQty(0);
    setPeriod('monthly');
  };

  const startEdit = (goal: any) => {
    setEditingGoal(goal.id);
    setTargetQty(goal.targetQuantity);
    setPeriod(goal.period);
  };

  const handleSaveMinStock = async () => {
    if (!product) return;
    await updateProduct(product.id, { minStock: minStockValue });
    setEditingMinStock(false);
  };

  const handleToggleSector = async (sectorId: string) => {
    if (!product) return;
    const currentSectors = product.sectorIds || [];
    let newSectors: string[];
    if (currentSectors.includes(sectorId)) {
      newSectors = currentSectors.filter(id => id !== sectorId);
    } else {
      newSectors = [...currentSectors, sectorId];
    }
    await updateProduct(product.id, { sectorIds: newSectors });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className={`p-6 border-b flex justify-between items-start ${isCritical ? 'bg-red-50/80 border-red-100' : isWarning ? 'bg-amber-50/80 border-amber-100' : 'bg-slate-50/50 border-slate-100'}`}>
          <div className="flex items-start space-x-4">
            <div className={`p-3 rounded-xl ${isCritical ? 'bg-red-100 text-red-600' : isWarning ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
              <Package size={24} />
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${isCritical ? 'bg-red-100 text-red-700' : isWarning ? 'bg-amber-100 text-amber-700' : 'bg-blue-50 text-blue-600'}`}>
                  {product.code || product.id}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded">
                  DETALHES DO PRODUTO
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 uppercase leading-tight pr-8">
                {product.description}
              </h2>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition-colors shrink-0"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <div className="flex items-center space-x-2 text-slate-500 mb-2">
                  <Tag size={16} />
                  <span className="text-xs font-bold uppercase tracking-wider">Classificação</span>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Família</div>
                    <div className="font-medium text-slate-900 uppercase">{product.family || 'Não informada'}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Identificação Interna</div>
                    <div className="font-mono text-sm text-slate-900">{product.id}</div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <div className="flex items-center space-x-2 text-slate-500 mb-3">
                  <Layers size={16} />
                  <span className="text-xs font-bold uppercase tracking-wider">Roteiro de Produção (Setores)</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {sectors.length === 0 ? (
                    <span className="text-xs text-slate-400 italic">Nenhum setor cadastrado. Vá em Setores para criar.</span>
                  ) : (
                    sectors.map(sector => {
                      const isSelected = (product.sectorIds || []).includes(sector.id);
                      return (
                        <button
                          key={sector.id}
                          onClick={() => handleToggleSector(sector.id)}
                          className={`px-3 py-1.5 text-xs font-bold uppercase rounded-lg border transition-colors ${
                            isSelected 
                              ? 'bg-blue-100 border-blue-200 text-blue-700 hover:bg-blue-200' 
                              : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-100 hover:border-slate-300'
                          }`}
                        >
                          {sector.name}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className={`rounded-xl p-4 border ${isCritical ? 'bg-red-50 border-red-100' : isWarning ? 'bg-amber-50 border-amber-100' : 'bg-slate-50 border-slate-100'}`}>
                <div className={`flex items-center space-x-2 mb-2 ${isCritical ? 'text-red-500' : isWarning ? 'text-amber-500' : 'text-slate-500'}`}>
                  {isCritical || isWarning ? <AlertTriangle size={16} /> : <Archive size={16} />}
                  <span className="text-xs font-bold uppercase tracking-wider">Inventário & Demanda</span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Estoque Atual</div>
                    <div className="flex items-baseline space-x-1 mt-1">
                      <span className={`text-2xl font-bold ${stock === 0 ? 'text-slate-400' : isCritical ? 'text-red-700' : 'text-slate-900'}`}>{stock}</span>
                      <span className="text-xs font-bold text-slate-500 uppercase">{product.unit}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Demanda Pendente</div>
                    <div className="flex items-baseline space-x-1 mt-1">
                      <span className={`text-xl font-bold ${demand > 0 ? (isCritical ? 'text-red-700' : 'text-amber-600') : 'text-slate-400'}`}>{demand}</span>
                      <span className="text-xs font-bold text-slate-500 uppercase">{product.unit}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold text-indigo-600 mb-1">Estoque Mín.</div>
                    {editingMinStock ? (
                      <div className="flex items-center space-x-1">
                        <input
                          type="number"
                          className="w-16 px-1.5 py-0.5 text-sm font-bold border border-indigo-300 rounded text-indigo-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          value={minStockValue || ''}
                          onChange={(e) => setMinStockValue(Number(e.target.value))}
                          autoFocus
                          onKeyDown={(e) => e.key === 'Enter' && handleSaveMinStock()}
                          onBlur={handleSaveMinStock}
                        />
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1 mt-[2px] group cursor-pointer" onClick={() => setEditingMinStock(true)}>
                        <span className="text-xl font-bold text-indigo-600">{minStock}</span>
                        <Edit2 size={12} className="text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    )}
                  </div>
                  <div className="col-span-3 pt-2 border-t border-slate-200/50">
                    <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Status / Déficit</div>
                    <div className={`text-sm font-bold ${isCritical ? 'text-red-600' : isWarning ? 'text-amber-600' : 'text-emerald-600'}`}>
                      {isCritical 
                        ? `Déficit Imediato: ${Math.abs(deficit)} ${product.unit}` 
                        : isWarning 
                          ? `Atenção: Saldo Restante: ${deficit} ${product.unit} (Mín: ${minStock})` 
                          : `Estoque Seguro: Saldo Livre: ${deficit} ${product.unit}`
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2 text-indigo-600">
                <Target size={20} />
                <h3 className="font-bold uppercase tracking-wider">Metas de Produção</h3>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4 bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                <h4 className="text-xs font-bold uppercase text-indigo-400">
                  {editingGoal ? 'Editar Meta' : 'Nova Meta'}
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Quantidade</label>
                    <input 
                      type="number"
                      value={targetQty || ''}
                      onChange={e => setTargetQty(Number(e.target.value))}
                      className="w-full text-sm p-2 rounded border border-slate-200 focus:outline-none focus:border-indigo-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Período</label>
                    <select 
                      value={period}
                      onChange={e => setPeriod(e.target.value as GoalPeriod)}
                      className="w-full text-sm p-2 rounded border border-slate-200 focus:outline-none focus:border-indigo-400"
                    >
                      <option value="daily">Diário</option>
                      <option value="weekly">Semanal</option>
                      <option value="monthly">Mensal</option>
                    </select>
                  </div>
                  <div className="col-span-2 flex gap-2">
                    {editingGoal && (
                      <Button variant="ghost" className="flex-1 text-xs" onClick={() => {
                        setEditingGoal(null);
                        setTargetQty(0);
                      }}>Cancelar</Button>
                    )}
                    <Button variant="primary" className="flex-1 text-xs bg-indigo-600 hover:bg-indigo-700" onClick={handleSaveGoal} disabled={targetQty <= 0}>
                      {editingGoal ? 'Atualizar' : 'Adicionar Meta'}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                <h4 className="text-xs font-bold uppercase text-slate-400 mb-3">Metas Atuais</h4>
                {productGoals.length === 0 ? (
                  <p className="text-sm text-slate-500 italic">Nenhuma meta configurada para este produto.</p>
                ) : (
                  productGoals.map(goal => (
                    <div key={goal.id} className="flex justify-between items-center p-3 bg-slate-50 border border-slate-100 rounded-lg group">
                      <div>
                        <div className="text-xs font-bold text-slate-700 uppercase">
                          {goal.period === 'daily' ? 'Diária' : goal.period === 'weekly' ? 'Semanal' : 'Mensal'}
                        </div>
                        <div className="text-lg font-bold text-indigo-600 flex items-baseline gap-1">
                          {goal.targetQuantity}
                          <span className="text-[10px] text-slate-400">{product.unit}</span>
                        </div>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => startEdit(goal)} className="p-1.5 text-slate-400 hover:text-indigo-600 rounded hover:bg-indigo-50">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => setGoalToDelete(goal.id)} className="p-1.5 text-slate-400 hover:text-red-600 rounded hover:bg-red-50">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
          {onPlanProduct ? (
            <Button 
              onClick={() => {
                onPlanProduct(product);
                onClose();
              }} 
              variant="outline" 
              className="border-indigo-200 text-indigo-600 hover:bg-indigo-50"
            >
              <FilePlus2 size={18} className="mr-2" />
              Planejar Produção
            </Button>
          ) : <div></div>}
          <Button onClick={onClose} variant="primary">
            Fechar
          </Button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!goalToDelete}
        title="Excluir Meta"
        message="Tem certeza que deseja excluir esta meta de produção? Esta ação não pode ser desfeita."
        confirmLabel="Sim, Excluir"
        onConfirm={() => {
          if (goalToDelete) deleteGoal(goalToDelete);
          setGoalToDelete(null);
        }}
        onCancel={() => setGoalToDelete(null)}
      />
    </div>
  );
}
