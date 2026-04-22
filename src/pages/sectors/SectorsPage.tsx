import { useSectors } from '../../hooks/api/useSectors';
import { useProducts } from '../../hooks/api/useProducts';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { Plus, Trash2, Edit2, LayoutPanelLeft, Search } from 'lucide-react';
import { useState, useMemo } from 'react';
import { Sector } from '../../types/api';

export function SectorsPage() {
  const { addToast } = useToast();
  const { sectors, isLoading: isLoadingSectors, createSector, updateSector, deleteSector } = useSectors();
  const { products, isLoading: isLoadingProducts } = useProducts();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSector, setEditingSector] = useState<Sector | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const isLoading = isLoadingSectors || isLoadingProducts;

  // Calcula o número de produtos por setor
  const sectorProductCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach(p => {
      if (p.sectorId) {
        counts[p.sectorId] = (counts[p.sectorId] || 0) + 1;
      }
    });
    return counts;
  }, [products]);

  const filteredSectors = useMemo(() => {
    if (!searchTerm) return sectors;
    return sectors.filter(s => 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sectors, searchTerm]);

  const handleOpenModal = (sector?: Sector) => {
    if (sector) {
      setEditingSector(sector);
      setFormData({ name: sector.name, description: sector.description || '' });
    } else {
      setEditingSector(null);
      setFormData({ name: '', description: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSector(null);
    setFormData({ name: '', description: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      addToast({ title: 'Erro', message: 'O nome do setor é obrigatório', type: 'error' });
      return;
    }

    try {
      if (editingSector) {
        await updateSector.mutateAsync({ 
          id: editingSector.id, 
          sector: formData 
        });
        addToast({ title: 'Sucesso', message: 'Setor atualizado com sucesso', type: 'success' });
      } else {
        await createSector.mutateAsync(formData);
        addToast({ title: 'Sucesso', message: 'Setor criado com sucesso', type: 'success' });
      }
      handleCloseModal();
    } catch (err: any) {
      addToast({ 
        title: 'Erro', 
        message: err.message || 'Falha ao processar operação', 
        type: 'error' 
      });
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Tem certeza que deseja excluir o setor "${name}"? Esta ação não pode ser desfeita.`)) {
      return;
    }

    try {
      await deleteSector.mutateAsync(id);
      addToast({ title: 'Sucesso', message: 'Setor removido com sucesso', type: 'success' });
    } catch (err: any) {
      addToast({ 
        title: 'Erro', 
        message: err.message || 'Falha ao excluir setor', 
        type: 'error' 
      });
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-20">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">Setores de Produção</h1>
          <p className="text-xs sm:text-sm text-zinc-500">Gerencie a organização física e lógica da fábrica</p>
        </div>
        <Button onClick={() => handleOpenModal()} size="sm" className="w-full sm:w-auto h-10 px-4 font-bold">
          <Plus size={18} className="mr-2" />
          Novo Setor
        </Button>
      </header>

      <Card className="overflow-hidden border-zinc-200/60 shadow-sm">
        <div className="p-4 border-b border-zinc-100 bg-zinc-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
            <Input
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Buscar setores..."
              className="pl-10 h-10 text-sm"
            />
          </div>
          <div className="text-xs font-medium text-zinc-500 bg-white px-3 py-1.5 rounded-full border border-zinc-200 shadow-sm">
            Total: <span className="text-zinc-900 font-bold">{sectors.length}</span> setores
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-100">
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Nome</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Descrição</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider text-center">Produtos</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {isLoading ? (
                [1, 2, 3, 4, 5].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 w-12 bg-zinc-100 rounded" /></td>
                    <td className="px-6 py-4"><div className="h-4 w-32 bg-zinc-100 rounded" /></td>
                    <td className="px-6 py-4"><div className="h-4 w-48 bg-zinc-100 rounded" /></td>
                    <td className="px-6 py-4 text-center"><div className="h-4 w-8 bg-zinc-100 rounded mx-auto" /></td>
                    <td className="px-6 py-4 text-right"><div className="h-8 w-16 bg-zinc-100 rounded ml-auto" /></td>
                  </tr>
                ))
              ) : filteredSectors.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-zinc-500 italic">
                    Nenhum setor encontrado.
                  </td>
                </tr>
              ) : (
                filteredSectors.map((s) => (
                  <tr key={s.id} className="hover:bg-zinc-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-mono font-bold text-zinc-400 bg-zinc-100 px-1.5 py-0.5 rounded">
                        {s.id.slice(-6).toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <span className="font-bold text-zinc-900 group-hover:text-blue-600 transition-colors">
                          {s.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-zinc-500 line-clamp-1 max-w-xs">
                        {s.description || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-2.5 py-1 bg-zinc-100 text-zinc-700 rounded-lg text-xs font-bold border border-zinc-200 shadow-sm">
                        {sectorProductCounts[s.id] || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-zinc-400 hover:text-blue-600 hover:bg-blue-50"
                          onClick={() => handleOpenModal(s)}
                          title="Editar Setor"
                        >
                          <Edit2 size={14} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-zinc-400 hover:text-red-500 hover:bg-red-50"
                          onClick={() => handleDelete(s.id, s.name)}
                          title="Excluir Setor"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        title={editingSector ? 'Editar Setor' : 'Novo Setor'}
      >
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Nome do Setor</label>
            <Input
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Marcenaria, Metalúrgica..."
              className="h-11"
              autoFocus
            />
          </div>
          
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Descrição (opcional)</label>
            <textarea
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="Breve descrição das atividades deste setor..."
              className="w-full min-h-[100px] px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1 h-11 font-bold" 
              onClick={handleCloseModal}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="flex-[2] h-11 font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20"
              isLoading={createSector.isPending || updateSector.isPending}
            >
              {editingSector ? 'Salvar Alterações' : 'Criar Setor'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
