import { useSectors } from '../../../hooks/sectors/useSectors';
import { useCreateSector } from '../../../hooks/sectors/useCreateSector';
import { useUpdateSector } from '../../../hooks/sectors/useUpdateSector';
import { useDeleteSector } from '../../../hooks/sectors/useDeleteSector';
import { useSyncSectors } from '../../../hooks/sectors/useSyncSectors';
import { useMyProducts } from '../../../hooks/products/useMyProducts';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Modal } from '../../../components/ui/Modal';
import { useToast } from '../../../components/ui/Toast';
import { Plus, Trash2, Edit2, LayoutPanelLeft, Search, Check, X, Box, Tag, AlertCircle, RefreshCcw } from 'lucide-react';
import { useState, useMemo } from 'react';
import { Sector } from '../../../types/api';
import { SectorsLogic } from '../domain/SectorsLogic';

export function SectorsPage() {
  const { addToast } = useToast();
  const { data: sectors = [], isLoading: isLoadingSectors, isError, error } = useSectors();
  const createSector = useCreateSector();
  const updateSector = useUpdateSector();
  const deleteSector = useDeleteSector();
  const syncSectors = useSyncSectors();
  const { savedProducts, assignSector, updateProduct, isLoading: isLoadingProducts } = useMyProducts();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isMappingModalOpen, setIsMappingModalOpen] = useState(false);
  const [mappingTab, setMappingTab] = useState<'assigned' | 'all'>('assigned');
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [productFormData, setProductFormData] = useState({ description: '', code: '', family: '', stock: 0, minStock: 0 });
  const [sectorToDelete, setSectorToDelete] = useState<{ id: string, name: string } | null>(null);
  const [mappingSector, setMappingSector] = useState<Sector | null>(null);
  const [editingSector, setEditingSector] = useState<Sector | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [mappingSearch, setMappingSearch] = useState('');

  // Removido o isLoading unificado que travava a UI inteira
  // const isLoading = isLoadingSectors || isLoadingProducts;

  // Calcula o número de produtos por setor com base nos favoritos (my-products)
  const sectorProductCounts = useMemo(() => {
    return SectorsLogic.calculateProductCounts(savedProducts);
  }, [savedProducts]);

  const filteredSectors = useMemo(() => {
    return SectorsLogic.filterSectors(sectors, searchTerm);
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

  const handleDeleteClick = (id: string, name: string) => {
    setSectorToDelete({ id, name });
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!sectorToDelete) return;

    try {
      await deleteSector.mutateAsync(sectorToDelete.id);
      // O sucesso e erro são tratados pelo hook useDeleteSector (onSuccess/onError)
    } catch (err: any) {
      // O mutateAsync pode lançar erro se a função interna falhar miseravelmente
    } finally {
      setIsDeleteModalOpen(false);
      setSectorToDelete(null);
    }
  };

  const handleOpenMapping = (sector: Sector) => {
    setMappingSector(sector);
    setIsMappingModalOpen(true);
    setMappingSearch('');
    setMappingTab('assigned');
  };

  const handleToggleProduct = async (productId: string) => {
    if (!mappingSector) return;
    await assignSector(productId, mappingSector.id);
  };

  const filteredMappingProducts = useMemo(() => {
    let base = savedProducts;
    if (mappingTab === 'assigned') {
      base = savedProducts.filter(p => p.sectorIds?.includes(mappingSector?.id || ''));
    }
    
    if (!mappingSearch) return base;
    const term = mappingSearch.toLowerCase().trim();
    
    return base.filter(p => {
      const description = (p.description || '').toLowerCase();
      const code = (p.code || '').toLowerCase();
      const family = (p.family || '').toLowerCase();
      const id = (p.id || '').toLowerCase();

      return description.includes(term) || 
             code.includes(term) || 
             family.includes(term) || 
             id.includes(term);
    });
  }, [savedProducts, mappingSearch, mappingTab, mappingSector]);

  const handleEditProductInSector = (product: any) => {
    setEditingProduct(product);
    setProductFormData({
      description: product.description,
      code: product.code || '',
      family: product.family || '',
      stock: product.stock || 0,
      minStock: product.minStock || 0
    });
  };

  const handleSaveProductEdit = async () => {
    if (!editingProduct) return;
    
    await updateProduct(editingProduct.id, {
      description: productFormData.description,
      code: productFormData.code,
      family: productFormData.family,
      stock: productFormData.stock,
      minStock: productFormData.minStock
    });
    
    setEditingProduct(null);
    addToast({ title: 'Sucesso', message: 'Produto atualizado com sucesso', type: 'success' });
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-20">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">Setores de Produção</h1>
          <p className="text-xs sm:text-sm text-zinc-500">Gerencie a organização física e lógica da fábrica</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
          <Button 
            variant="outline" 
            onClick={() => syncSectors.mutate()} 
            disabled={syncSectors.isPending}
            size="sm" 
            className="w-full sm:w-auto h-10 px-4 font-bold border-zinc-200"
          >
            <RefreshCcw size={18} className={`mr-2 ${syncSectors.isPending ? 'animate-spin' : ''}`} />
            Sincronizar
          </Button>
          <Button onClick={() => handleOpenModal()} size="sm" className="w-full sm:w-auto h-10 px-4 font-bold">
            <Plus size={18} className="mr-2" />
            Novo Setor
          </Button>
        </div>
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
              {isLoadingSectors ? (
                [1, 2, 3, 4, 5].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 w-12 bg-zinc-100 rounded" /></td>
                    <td className="px-6 py-4"><div className="h-4 w-32 bg-zinc-100 rounded" /></td>
                    <td className="px-6 py-4"><div className="h-4 w-48 bg-zinc-100 rounded" /></td>
                    <td className="px-6 py-4 text-center"><div className="h-4 w-8 bg-zinc-100 rounded mx-auto" /></td>
                    <td className="px-6 py-4 text-right"><div className="h-8 w-16 bg-zinc-100 rounded ml-auto" /></td>
                  </tr>
                ))
              ) : isError ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="text-red-500 font-medium">
                      {typeof error === 'string' ? error : (error as any)?.message || 'Erro ao carregar setores'}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="mt-2 text-blue-600 hover:text-blue-700"
                      onClick={() => window.location.reload()}
                    >
                      Tentar atualizar a página
                    </Button>
                  </td>
                </tr>
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
                      <div className="flex items-center gap-2 cursor-pointer group/name" onClick={() => handleOpenMapping(s)}>
                        <div className="w-2 h-2 rounded-full bg-blue-500 group-hover/name:scale-125 transition-transform" />
                        <span className="font-bold text-zinc-900 group-hover/name:text-blue-600 transition-colors">
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
                      <span className="px-2.5 py-1 bg-zinc-100 text-zinc-700 rounded-lg text-xs font-bold border border-zinc-200 shadow-sm min-w-[32px] inline-flex justify-center">
                        {isLoadingProducts ? (
                          <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          sectorProductCounts[s.id] || 0
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-zinc-400 hover:text-blue-600 hover:bg-blue-50"
                          onClick={() => handleOpenMapping(s)}
                          title="Vincular Produtos"
                        >
                          <LayoutPanelLeft size={14} />
                        </Button>
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
                          onClick={() => handleDeleteClick(s.id, s.name)}
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

      {/* Modal de Confirmação de Exclusão */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirmar Exclusão"
      >
        <div className="p-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
              <Trash2 size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-900">Excluir Setor?</h3>
              <p className="text-sm text-zinc-500 mt-1">
                Você está prestes a excluir o setor <strong className="text-zinc-900">{sectorToDelete?.name}</strong>.<br />
                Esta ação irá desativar o setor no sistema.
              </p>
            </div>
            
            <div className="flex gap-3 w-full pt-2">
              <Button 
                variant="outline" 
                className="flex-1 h-11" 
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={deleteSector.isPending}
              >
                Cancelar
              </Button>
              <Button 
                className="flex-1 h-11 bg-red-600 hover:bg-red-700 text-white font-bold"
                onClick={handleConfirmDelete}
                isLoading={deleteSector.isPending}
              >
                Sim, Excluir
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Modal de Vínculo de Produtos / CRUD de Produtos do Setor */}
      <Modal
        isOpen={isMappingModalOpen}
        onClose={() => setIsMappingModalOpen(false)}
        title={`Gerenciar Produtos: ${mappingSector?.name}`}
      >
        <div className="flex flex-col h-[700px] max-h-[90vh]">
          {/* Header do Modal com Abas */}
          <div className="border-b border-zinc-100 bg-white sticky top-0 z-10">
            <div className="flex p-1 gap-1 bg-zinc-100/50 m-4 rounded-xl">
              <button
                onClick={() => setMappingTab('assigned')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${
                  mappingTab === 'assigned' 
                    ? 'bg-white text-blue-600 shadow-sm border border-zinc-200' 
                    : 'text-zinc-500 hover:text-zinc-700'
                }`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${mappingTab === 'assigned' ? 'bg-blue-500' : 'bg-transparent border border-zinc-400'}`} />
                Produtos do Setor
              </button>
              <button
                onClick={() => setMappingTab('all')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${
                  mappingTab === 'all' 
                    ? 'bg-white text-blue-600 shadow-sm border border-zinc-200' 
                    : 'text-zinc-500 hover:text-zinc-700'
                }`}
              >
                <Plus size={14} />
                Vincular Novos
              </button>
            </div>

            <div className="px-4 pb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                <Input
                  value={mappingSearch}
                  onChange={e => setMappingSearch(e.target.value)}
                  placeholder={mappingTab === 'assigned' ? "Filtrar produtos do setor..." : "Buscar em todos os produtos..."}
                  className="pl-10 h-10 border-zinc-200"
                />
              </div>
            </div>
          </div>

          {/* Lista de Produtos ou Formulário de Edição */}
          <div className="flex-1 overflow-y-auto p-4 bg-zinc-50/10">
            {editingProduct ? (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-200">
                <div className="flex items-center gap-2 pb-2 border-b border-zinc-100 mb-4">
                  <span className="text-xs font-black text-zinc-400 uppercase tracking-widest">Editando Produto</span>
                  <div className="h-px flex-1 bg-zinc-100" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 space-y-1.5">
                    <label className="text-[10px] font-black text-zinc-500 uppercase ml-1">Descrição do Produto</label>
                    <Input 
                      value={productFormData.description}
                      onChange={e => setProductFormData({...productFormData, description: e.target.value})}
                      className="h-10 text-xs font-bold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-zinc-500 uppercase ml-1">Código (SKU)</label>
                    <Input 
                      value={productFormData.code}
                      onChange={e => setProductFormData({...productFormData, code: e.target.value})}
                      className="h-10 text-xs font-mono"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-zinc-500 uppercase ml-1">Família</label>
                    <Input 
                      value={productFormData.family}
                      onChange={e => setProductFormData({...productFormData, family: e.target.value})}
                      className="h-10 text-xs font-bold uppercase"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-zinc-500 uppercase ml-1">Estoque Atual</label>
                    <Input 
                      type="number"
                      value={productFormData.stock}
                      onChange={e => setProductFormData({...productFormData, stock: Number(e.target.value)})}
                      className="h-10 text-xs font-bold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-zinc-500 uppercase ml-1">Estoque Mínimo</label>
                    <Input 
                      type="number"
                      value={productFormData.minStock}
                      onChange={e => setProductFormData({...productFormData, minStock: Number(e.target.value)})}
                      className="h-10 text-xs font-bold text-red-600"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-6">
                  <Button 
                    variant="outline" 
                    className="flex-1 h-10 text-xs font-bold"
                    onClick={() => setEditingProduct(null)}
                  >
                    Voltar
                  </Button>
                  <Button 
                    className="flex-[2] h-10 text-xs font-bold bg-blue-600 text-white"
                    onClick={handleSaveProductEdit}
                  >
                    Salvar Detalhes
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredMappingProducts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-zinc-400">
                    <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mb-4 border border-dashed border-zinc-200">
                      {mappingTab === 'assigned' ? <Box size={24} className="opacity-30" /> : <Plus size={24} className="opacity-30" />}
                    </div>
                    <p className="text-sm font-medium">Nenhum produto {mappingTab === 'assigned' ? 'neste setor' : 'encontrado'}</p>
                    {mappingTab === 'assigned' && !mappingSearch && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="mt-2 text-blue-600 font-bold"
                        onClick={() => setMappingTab('all')}
                      >
                        Vincular produtos agora
                      </Button>
                    )}
                  </div>
                ) : (
                  filteredMappingProducts.map(product => {
                    const isThisSector = product.sectorIds?.includes(mappingSector?.id || '');
                    const otherSectors = (product.sectorIds || []).filter(id => id !== mappingSector?.id);
                    const isLowStock = product.minStock > 0 && product.stock < product.minStock;
                    
                    return (
                      <div 
                        key={product.id} 
                        className={`group relative flex items-center gap-3 p-3 rounded-xl border transition-all ${
                          isThisSector 
                            ? 'border-blue-100 bg-blue-50/40' 
                            : 'border-zinc-200/60 bg-white hover:border-zinc-300 shadow-sm'
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <div className="text-[11px] font-bold text-zinc-900 truncate uppercase">
                              {product.description}
                            </div>
                            {isLowStock && (
                              <div title="Estoque abaixo do mínimo" className="flex items-center text-red-500">
                                <AlertCircle size={10} />
                              </div>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
                            <span className="text-[10px] text-zinc-400 font-mono">CÓD: {product.code || product.id}</span>
                            {product.family && (
                              <span className="text-[10px] text-zinc-500 font-bold flex items-center gap-0.5">
                                <Tag size={8} /> {product.family}
                              </span>
                            )}
                            <div className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isLowStock ? 'bg-red-50 text-red-600' : 'bg-zinc-100 text-zinc-600'}`}>
                              {product.stock} {product.unit}
                            </div>
                            {otherSectors.length > 0 && (
                              <span className="text-[9px] text-zinc-400 font-medium">
                                + {otherSectors.length} {otherSectors.length === 1 ? 'outro setor' : 'outros setores'}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          {isThisSector && (
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-zinc-400 hover:text-blue-600 hover:bg-blue-50"
                              onClick={() => handleEditProductInSector(product)}
                              title="Editar Detalhes"
                            >
                              <Edit2 size={12} />
                            </Button>
                          )}
                          
                          <Button
                            size="sm"
                            variant={isThisSector ? "primary" : "outline"}
                            className={`h-8 px-3 text-[10px] font-black uppercase tracking-tight transition-all ${
                              isThisSector 
                                ? 'bg-blue-600 hover:bg-blue-700 text-white border-transparent' 
                                : 'text-zinc-600 hover:bg-zinc-100'
                            }`}
                            onClick={() => handleToggleProduct(product.id)}
                            title={otherSectors.length > 0 ? `Também vinculado a: ${otherSectors.map(id => sectors.find(s => s.id === id)?.name).join(', ')}` : ""}
                          >
                            {isThisSector ? <Trash2 size={12} /> : <Plus size={12} />}
                            <span className="ml-1.5">{isThisSector ? 'REMOVER' : 'VINCULAR'}</span>
                          </Button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>

          <div className="p-4 border-t border-zinc-100 bg-zinc-50/50 flex justify-between items-center">
            <div className="text-[10px] text-zinc-400 font-medium italic">
              {mappingTab === 'assigned' 
                ? `Exibindo ${filteredMappingProducts.length} produtos deste setor`
                : "Vincule produtos para que apareçam no planejamento deste setor"
              }
            </div>
            <Button 
              onClick={() => setIsMappingModalOpen(false)}
              className="px-6 font-bold h-10 text-xs"
            >
              Fechar Gerenciador
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
