import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Trash2, Edit2, Search, Save, Settings2 } from 'lucide-react';
import { useProductionOrders } from '../../../../hooks/orders/useProductionOrders';
import { useStocks } from '../../../../hooks/stocks/useStocks';
import { useSectors } from '../../../../hooks/sectors/useSectors';
import { useCollaborators } from '../../../../hooks/collaborators/useCollaborators';
import { ProductionOrder, ProductionOrderStatus } from '../../domain/ProductionOrder';

export function ProductionOrdersTab() {
  const { productionOrders, isLoading, createProductionOrder, updateProductionOrder, deleteProductionOrder } = useProductionOrders();
  const { savedProducts } = useStocks();
  const { data: sectors = [] } = useSectors();
  const { collaborators = [] } = useCollaborators();
  
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<ProductionOrder | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  // Form State
  const [lote, setLote] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedSectorId, setSelectedSectorId] = useState('');
  const [selectedCollaboratorId, setSelectedCollaboratorId] = useState('');
  const [status, setStatus] = useState<ProductionOrderStatus>('pending');

  const filteredOrders = productionOrders.filter(o => 
    (o.productDescription || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (o.lote || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAddModal = () => {
    setEditingOrder(null);
    setLote('');
    setSelectedProductId('');
    setQuantity(1);
    setSelectedSectorId('');
    setSelectedCollaboratorId('');
    setStatus('pending');
    setIsModalOpen(true);
  };

  const openEditModal = (order: ProductionOrder) => {
    const product = savedProducts.find(p => 
      (order.productId && p.id === order.productId) || 
      (order.productCode && p.code === order.productCode) || 
      (order.productDescription && p.description === order.productDescription)
    );
    setEditingOrder(order);
    setLote(order.lote || '');
    setSelectedProductId(product ? product.id : '');
    setQuantity(order.quantity || 1);
    setSelectedSectorId(order.sectorId || '');
    setSelectedCollaboratorId(order.collaboratorId || '');
    setStatus(order.status || 'pending');
    setIsModalOpen(true);
  };

  const handleSaveOrder = async () => {
    const product = savedProducts.find(p => p.id === selectedProductId);
    const sector = sectors.find(s => s.id === selectedSectorId);
    const collaborator = collaborators.find(c => c.id === selectedCollaboratorId);
    
    if (!product || quantity <= 0 || !lote) return;

    try {
      if (!editingOrder) {
        await createProductionOrder({
          lote,
          productId: product.id,
          productCode: product.code as string,
          productDescription: product.description,
          quantity,
          sectorId: sector?.id,
          sectorName: sector?.name,
          collaboratorId: collaborator?.id,
          collaboratorName: collaborator?.name,
          status,
        });
      } else {
        await updateProductionOrder({
          id: editingOrder.id,
          data: {
            lote,
            productId: product.id,
            productCode: product.code as string,
            productDescription: product.description,
            quantity,
            sectorId: sector?.id,
            sectorName: sector?.name,
            collaboratorId: collaborator?.id,
            collaboratorName: collaborator?.name,
            status,
          }
        });
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar a ordem de produção');
    }
  };

  const confirmDelete = async () => {
    if (deletingId) {
      try {
        await deleteProductionOrder(deletingId);
      } catch (err) {
        console.error(err);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const statusColors: Record<ProductionOrderStatus, string> = {
    pending: 'bg-yellow-50 text-yellow-700',
    in_progress: 'bg-blue-50 text-blue-700',
    completed: 'bg-green-50 text-green-700',
    cancelled: 'bg-red-50 text-red-700',
  };

  const statusLabels: Record<ProductionOrderStatus, string> = {
    pending: 'Pendente',
    in_progress: 'Em Andamento',
    completed: 'Concluído',
    cancelled: 'Cancelado',
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Settings2 className="w-6 h-6 text-indigo-600" />
          Ordens de Produção (OP)
        </h2>
        <button 
          onClick={openAddModal}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition-colors shadow-sm h-10"
        >
          <Plus className="w-5 h-5" />
          Nova OP
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Pesquisar por Lote ou Produto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-xl border border-dashed border-gray-200">
            Carregando ordens de produção...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-xl border border-dashed border-gray-200">
            Nenhuma ordem de produção encontrada.
          </div>
        ) : (
          filteredOrders.map((order) => (
            <motion.div 
              layout
              key={order.id} 
              className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all relative group flex flex-col cursor-pointer hover:border-indigo-100"
              onClick={() => openEditModal(order)}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="pr-4">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                      LOTE: {order.lote}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${statusColors[order.status]}`}>
                      {statusLabels[order.status]}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 leading-tight">
                    {order.productDescription}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5 font-mono">[{order.productCode}]</p>
                </div>
                <div className="flex gap-1 opacity-100 lg:opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity absolute top-4 right-4 bg-white/80 backdrop-blur-sm rounded-lg">
                  <button 
                    onClick={(e) => { e.stopPropagation(); openEditModal(order); }}
                    className="text-gray-400 hover:text-indigo-600 p-1.5 rounded-md hover:bg-indigo-50 focus:bg-indigo-50 outline-none transition-colors"
                    title="Editar OP"
                    aria-label={`Editar OP ${order.lote}`}
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setDeletingId(order.id); }}
                    className="text-gray-400 hover:text-red-600 p-1.5 rounded-md hover:bg-red-50 focus:bg-red-50 outline-none transition-colors"
                    title="Excluir OP"
                    aria-label={`Excluir OP ${order.lote}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="mt-auto grid grid-cols-2 gap-3 pt-4 border-t border-gray-50 flex-grow content-end">
                <div>
                  <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mb-1">Setor / Resp.</p>
                  <p className="text-sm font-medium text-gray-700 truncate" title={order.sectorName || 'Não definido'}>
                    {order.sectorName || '-'}
                  </p>
                  <p className="text-xs text-gray-500 truncate" title={order.collaboratorName || 'Não definido'}>
                    {order.collaboratorName || '-'}
                  </p>
                </div>
                <div className="text-right flex flex-col justify-end">
                  <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mb-0.5">Quantidade</p>
                  <p className="text-2xl font-mono text-indigo-600 font-bold leading-none">{order.quantity}</p>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {isModalOpen && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div 
            initial={{ scale: 0.95 }} animate={{ scale: 1 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4"
          >
            <h2 className="text-xl font-bold">{editingOrder ? 'Editar OP' : 'Nova Ordem de Produção'}</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lote</label>
                <input 
                  type="text" 
                  value={lote}
                  onChange={(e) => setLote(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="EX: LOTE-2026"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Produto</label>
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
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade</label>
                  <input 
                    type="number" 
                    value={quantity || ''}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select 
                    value={status}
                    onChange={(e) => setStatus(e.target.value as ProductionOrderStatus)}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="pending">Pendente</option>
                    <option value="in_progress">Em Andamento</option>
                    <option value="completed">Concluído</option>
                    <option value="cancelled">Cancelado</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Setor Alvo (Opcional)</label>
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
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Responsável (Opcional)</label>
                <select 
                  value={selectedCollaboratorId}
                  onChange={(e) => setSelectedCollaboratorId(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="">Selecione um responsável...</option>
                  {collaborators.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-2 border rounded-lg font-medium hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button 
                onClick={handleSaveOrder}
                disabled={!selectedProductId || quantity <= 0 || !lote}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                {editingOrder ? 'Salvar Edição' : 'Criar OP'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

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
              <h2 className="text-xl font-bold">Atenção!</h2>
            </div>
            <p className="text-gray-600 font-medium">Tem certeza que deseja excluir esta OP? Esta ação não pode ser desfeita.</p>
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
