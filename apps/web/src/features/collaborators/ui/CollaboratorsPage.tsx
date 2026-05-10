import React, { useState } from 'react';
import { useCollaborators } from '../../../hooks/collaborators/useCollaborators';
import { useSectors } from '../../../hooks/sectors/useSectors';
import { Plus, Users, Pencil, Trash2, ShieldAlert } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import { Collaborator } from '../../../types/api';

export function CollaboratorsPage() {
  const { collaborators, isLoading, create, update, remove } = useCollaborators();
  const { data: sectors = [] } = useSectors();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCollaborator, setEditingCollaborator] = useState<Collaborator | null>(null);
  const [viewingCollaborator, setViewingCollaborator] = useState<Collaborator | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<{
    name: string;
    role: string;
    sectorId: string;
    category: string;
    dailyGoal: number | '';
    status: string;
  }>({
    name: '',
    role: '',
    sectorId: '',
    category: 'Nenhuma',
    dailyGoal: '',
    status: 'active'
  });

  const handleOpenModal = (collaborator?: Collaborator) => {
    if (collaborator) {
      setEditingCollaborator(collaborator);
      setFormData({
        name: collaborator.name || '',
        role: collaborator.role || '',
        sectorId: collaborator.sectorId || '',
        category: collaborator.category || 'Nenhuma',
        dailyGoal: collaborator.dailyGoal || '',
        status: collaborator.status || 'active'
      });
    } else {
      setEditingCollaborator(null);
      setFormData({
        name: '',
        role: '',
        sectorId: '',
        category: 'Nenhuma',
        dailyGoal: '',
        status: 'active'
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCollaborator(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCollaborator) {
      await update({ id: editingCollaborator.id, data: { ...formData, dailyGoal: formData.dailyGoal ? Number(formData.dailyGoal) : undefined } });
    } else {
      await create({ ...formData, dailyGoal: formData.dailyGoal ? Number(formData.dailyGoal) : undefined });
    }
    handleCloseModal();
  };

  const handleConfirmDelete = async () => {
    if (deletingId) {
      await remove(deletingId);
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return <div className="p-8 flex justify-center items-center h-full">Carregando...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-600" />
            Equipe / Colaboradores
          </h1>
          <p className="text-gray-500 mt-1">Gerencie as pessoas e capacidade da sua fábrica</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="shadow-md">
          <Plus className="w-4 h-4 mr-2" />
          Novo Colaborador
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-500">
              <tr>
                <th className="px-6 py-4 font-medium">Nome</th>
                <th className="px-6 py-4 font-medium">Função/Cargo</th>
                <th className="px-6 py-4 font-medium">Setor</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {collaborators.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    Nenhum colaborador cadastrado.
                  </td>
                </tr>
              ) : (
                collaborators.map((collab) => {
                  const sector = sectors.find(s => s.id === collab.sectorId);
                  return (
                    <tr 
                      key={collab.id} 
                      className="hover:bg-gray-50/50 transition-colors cursor-pointer" 
                      onClick={() => setViewingCollaborator(collab)}
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">{collab.name}</td>
                      <td className="px-6 py-4 text-gray-600">{collab.role || '-'}</td>
                      <td className="px-6 py-4 text-gray-600">
                        {sector ? (
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-50 text-blue-700">
                            {sector.name}
                          </span>
                        ) : (
                          '-'
                        )}
                        {collab.category && collab.category !== 'Nenhuma' && (
                           <span className="inline-flex items-center px-2 py-1 ml-2 rounded text-xs font-medium bg-emerald-50 text-emerald-700">
                             {collab.category}
                           </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                          collab.status === 'active' 
                            ? 'bg-green-50 text-green-700' 
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {collab.status === 'active' ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleOpenModal(collab); }}
                            className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
                            title="Editar"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); setDeletingId(collab.id); }}
                            className="p-1 text-gray-400 hover:text-rose-600 transition-colors"
                            title="Remover"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingCollaborator ? 'Editar Colaborador' : 'Novo Colaborador'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
            <Input
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: João da Silva"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Função / Cargo</label>
            <Input
              value={formData.role}
              onChange={e => setFormData({ ...formData, role: e.target.value })}
              placeholder="Ex: Operador de Máquina"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Setor</label>
            <select
              className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
              value={formData.sectorId}
              onChange={e => setFormData({ ...formData, sectorId: e.target.value })}
            >
              <option value="">Selecione um setor (opcional)</option>
              {sectors.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoria de Produto</label>
              <select
                className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="Nenhuma">Nenhuma</option>
                <option value="Vegano">Vegano</option>
                <option value="Ao leite">Ao leite</option>
                <option value="Ambos">Ambos</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Meta Diária (Qtd)</label>
              <Input
                type="number"
                value={formData.dailyGoal}
                onChange={e => setFormData({ ...formData, dailyGoal: e.target.value ? Number(e.target.value) : '' })}
                placeholder="Ex: 50"
                min="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
              value={formData.status}
              onChange={e => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="active">Ativo</option>
              <option value="inactive">Inativo</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button type="submit">
              {editingCollaborator ? 'Salvar Alterações' : 'Adicionar Colaborador'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deletingId}
        title="Remover Colaborador"
        message="Tem certeza que deseja remover este colaborador? O histórico de produção dele será mantido."
        confirmLabel="Remover"
        cancelLabel="Cancelar"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingId(null)}
      />

      <Modal
        isOpen={!!viewingCollaborator}
        onClose={() => setViewingCollaborator(null)}
        title="Detalhes do Colaborador"
      >
        {viewingCollaborator && (
          <div className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
               <h3 className="text-lg font-bold text-slate-800">{viewingCollaborator.name}</h3>
               <p className="text-sm text-slate-500">{viewingCollaborator.role || 'Sem função definida'}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <span className="block text-xs font-bold text-slate-400 uppercase">Setor</span>
                <span className="block mt-1 font-medium text-slate-700">
                  {sectors.find(s => s.id === viewingCollaborator.sectorId)?.name || '-'}
                </span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <span className="block text-xs font-bold text-slate-400 uppercase">Status</span>
                <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium ${
                    viewingCollaborator.status === 'active' 
                      ? 'bg-green-50 text-green-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {viewingCollaborator.status === 'active' ? 'Ativo' : 'Inativo'}
                  </span>
              </div>
              <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                <span className="block text-xs font-bold text-emerald-600 uppercase">Categoria Ref.</span>
                <span className="block mt-1 font-bold text-emerald-800">
                  {viewingCollaborator.category || 'Nenhuma'}
                </span>
              </div>
              <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-100">
                <span className="block text-xs font-bold text-indigo-600 uppercase">Meta Diária</span>
                <span className="block mt-1 font-bold text-indigo-800">
                  {viewingCollaborator.dailyGoal ? `${viewingCollaborator.dailyGoal} un.` : 'Não definida'}
                </span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
