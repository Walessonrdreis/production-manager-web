import { DevBadge } from '../../../components/ui/DevBadge';
import React, { useState } from 'react';
import { useCollaborators } from '../../../hooks/collaborators/useCollaborators';
import { useSectors } from '../../../hooks/sectors/useSectors';
import { Plus, Users, Pencil, Trash2, ShieldAlert } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import { Collaborator } from '../../../types/api';
import { cn } from '../../../utils/cn';

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
           <DevBadge id="collaboratorspage.title" /></h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Gerencie as pessoas e capacidade da sua fábrica</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="shadow-md">
          <Plus className="w-4 h-4 mr-2" />
          Novo Colaborador
        </Button>
      </div>

      <div className="flex flex-col gap-3 pb-4">
        {collaborators.length === 0 ? (
          <div className="text-center py-12 text-zinc-500 dark:text-zinc-400 italic bg-white dark:bg-slate-900 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800">
            Nenhum colaborador cadastrado.
          </div>
        ) : (
          collaborators.map((collab) => {
            const sector = sectors.find(s => s.id === collab.sectorId);
            return (
              <div 
                key={collab.id} 
                className="group bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm border border-zinc-200 dark:border-zinc-800 hover:shadow-md hover:border-blue-100 transition-all cursor-pointer relative flex flex-col sm:flex-row sm:items-center justify-between gap-4" 
                onClick={() => setViewingCollaborator(collab)}
              >
                <div className="flex flex-1 items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    <span className="text-blue-700 font-bold text-lg">{collab.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 transition-colors line-clamp-1" title={collab.name}>
                      {collab.name}
                    </h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-1">{collab.role || 'Sem cargo definido'}</p>
                  </div>
                </div>

                <div className="flex flex-1 items-center justify-between gap-6 sm:border-l sm:border-zinc-100 dark:border-zinc-800 sm:pl-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-zinc-100 dark:border-zinc-800">
                  <div className="flex flex-wrap gap-1.5 align-middle items-center">
                    {sector && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase">
                        {sector.name}
                      </span>
                    )}
                    {collab.category && collab.category !== 'Nenhuma' && (
                       <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase">
                         {collab.category}
                       </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex flex-col text-right">
                       <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider mb-0.5">Status</span>
                       <span className={cn(
                         "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold w-fit uppercase",
                         collab.status === 'active' 
                           ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                           : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800'
                       )}>
                         <span className={cn("w-1.5 h-1.5 rounded-full mr-1.5", collab.status === 'active' ? 'bg-emerald-500' : 'bg-zinc-400')} />
                         {collab.status === 'active' ? 'Ativo' : 'Inativo'}
                       </span>
                    </div>

                    <div className="flex gap-2 lg:opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity pl-2 border-l border-zinc-100 dark:border-zinc-800">
                       <button
                          onClick={(e) => { e.stopPropagation(); handleOpenModal(collab); }}
                          className="p-2 border border-zinc-100 dark:border-zinc-800 text-zinc-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 rounded-lg transition-all shadow-sm"
                          title="Editar"
                          aria-label={`Editar colaborador ${collab.name}`}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); setDeletingId(collab.id); }}
                          className="p-2 border border-zinc-100 dark:border-zinc-800 text-zinc-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 rounded-lg transition-all shadow-sm"
                          title="Remover"
                          aria-label={`Remover colaborador ${collab.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
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
              className="flex h-10 w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
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
                className="flex h-10 w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
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
              className="flex h-10 w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
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
            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
               <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">{viewingCollaborator.name}</h3>
               <p className="text-sm text-slate-500 dark:text-slate-400">{viewingCollaborator.role || 'Sem função definida'}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="block text-xs font-bold text-slate-400 uppercase">Setor</span>
                <span className="block mt-1 font-medium text-slate-700 dark:text-slate-300">
                  {sectors.find(s => s.id === viewingCollaborator.sectorId)?.name || '-'}
                </span>
              </div>
              <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
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
