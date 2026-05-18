import { useSectors } from '../../../hooks/sectors/useSectors';
import { useCreateSector } from '../../../hooks/sectors/useCreateSector';
import { useUpdateSector } from '../../../hooks/sectors/useUpdateSector';
import { useStocks } from '../../../hooks/stocks/useStocks';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Modal } from '../../../components/ui/Modal';
import { useToast } from '../../../components/ui/Toast';
import { Plus, Trash2, Edit2, LayoutPanelLeft, Search, Check, X, Box, Tag, AlertCircle } from 'lucide-react';
import { useState, useMemo } from 'react';
import { Sector } from '../../../types/api';
import { SectorsLogic } from '../domain/SectorsLogic';

export function SectorsPage() {
  const { addToast } = useToast();
  const { data: sectors = [], isLoading: isLoadingSectors, isError, error } = useSectors();
  const createSector = useCreateSector();
  const updateSector = useUpdateSector();
  const { savedProducts, assignSector, updateProduct, isLoading: isLoadingProducts } = useStocks();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMappingModalOpen, setIsMappingModalOpen] = useState(false);
  const [mappingTab, setMappingTab] = useState<'assigned' | 'all'>('assigned');
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [productFormData, setProductFormData] = useState({ description: '', code: '', family: '', stock: 0, minStock: 0 });
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
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Setores de Produção</h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">Gerencie a organização física e lógica da fábrica</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
          <Button onClick={() => handleOpenModal()} size="sm" className="w-full sm:w-auto h-10 px-4 font-bold">
            <Plus size={18} className="mr-2" />
            Novo Setor
          </Button>
        </div>
      </header>

      <Card className="overflow-hidden border-zinc-200 dark:border-zinc-800/60 shadow-sm p-4 bg-transparent border-0 shadow-none sm:bg-white dark:bg-slate-900 sm:border sm:border-zinc-200 dark:border-zinc-800/60 sm:shadow-sm">
        <div className="sm:border-b sm:border-zinc-100 dark:border-zinc-800 sm:bg-zinc-50 dark:bg-zinc-900/50/50 mb-4 sm:mb-0 sm:p-4 sm:-mx-4 sm:-mt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
            <Input
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Buscar setores..."
              className="pl-10 h-10 text-sm bg-white dark:bg-slate-900"
            />
          </div>
          <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 shadow-sm">
            Total: <span className="text-zinc-900 dark:text-zinc-100 font-bold">{sectors.length}</span> setores
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:p-4">
          {isLoadingSectors ? (
            [1, 2, 3, 4, 5].map(i => (
              <div key={i} className="animate-pulse bg-white dark:bg-slate-900 border border-zinc-100 dark:border-zinc-800 rounded-xl p-5 w-full flex items-center justify-between">
                 <div className="h-4 w-12 bg-zinc-100 dark:bg-zinc-800 rounded" />
                 <div className="h-4 w-32 bg-zinc-100 dark:bg-zinc-800 rounded" />
                 <div className="h-3 w-48 bg-zinc-100 dark:bg-zinc-800 rounded" />
              </div>
            ))
          ) : isError ? (
            <div className="py-12 text-center bg-white dark:bg-slate-900 rounded-xl border border-zinc-100 dark:border-zinc-800 w-full">
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
            </div>
          ) : filteredSectors.length === 0 ? (
            <div className="py-12 text-center text-zinc-500 dark:text-zinc-400 italic bg-white dark:bg-slate-900 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 w-full">
              Nenhum setor encontrado.
            </div>
          ) : (
            filteredSectors.map((s) => (
              <div key={s.id} className="bg-white dark:bg-slate-900 rounded-xl p-4 sm:p-5 shadow-sm border border-zinc-200 dark:border-zinc-800/60 hover:shadow-md transition-all relative group flex flex-col sm:flex-row sm:items-center justify-between cursor-pointer group/card gap-4" onClick={() => handleOpenMapping(s)}>
                <div className="flex items-center gap-3 w-full sm:w-auto min-w-[200px]">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500 group-hover/card:scale-125 transition-transform" />
                  <div>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100 text-lg group-hover/card:text-blue-600 transition-colors leading-tight">
                      {s.name}
                    </span>
                    <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                      ID: <span className="font-mono text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded leading-none">{s.id.slice(-6).toUpperCase()}</span>
                    </div>
                  </div>
                </div>

                 <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 sm:line-clamp-1 flex-1 sm:max-w-md">
                   {s.description || 'Sem descrição'}
                 </p>

                <div className="flex items-center justify-between w-full sm:w-auto gap-4 sm:gap-6 mt-2 sm:mt-0">
                  <div className="text-left sm:text-right">
                     <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block mb-0.5">Produtos</span>
                     <span className="px-2.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-md text-sm font-bold shadow-none inline-flex justify-center min-w-[32px]">
                        {isLoadingProducts ? (
                          <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin my-[3px]" />
                        ) : (
                          sectorProductCounts[s.id] || 0
                        )}
                      </span>
                  </div>
                  
                  <div className="flex gap-2 lg:opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                     <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-9 w-9 border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 shadow-sm"
                        onClick={(e) => { e.stopPropagation(); handleOpenMapping(s); }}
                        title="Vincular Produtos"
                        aria-label={`Vincular Produtos no setor ${s.name}`}
                      >
                        <LayoutPanelLeft size={16} />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-9 w-9 border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 shadow-sm"
                        onClick={(e) => { e.stopPropagation(); handleOpenModal(s); }}
                        title="Editar Setor"
                        aria-label={`Editar setor ${s.name}`}
                      >
                        <Edit2 size={16} />
                      </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        title={editingSector ? 'Editar Setor' : 'Novo Setor'}
      >
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase ml-1">Nome do Setor</label>
            <Input
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Marcenaria, Metalúrgica..."
              className="h-11"
              autoFocus
            />
          </div>
          
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase ml-1">Descrição (opcional)</label>
            <textarea
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="Breve descrição das atividades deste setor..."
              className="w-full min-h-[100px] px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm resize-none"
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

      {/* Modal de Vínculo de Produtos / CRUD de Produtos do Setor */}
      <Modal
        isOpen={isMappingModalOpen}
        onClose={() => setIsMappingModalOpen(false)}
        title={`Gerenciar Produtos: ${mappingSector?.name}`}
      >
        <div className="flex flex-col h-[700px] max-h-[90vh]">
          {/* Header do Modal com Abas */}
          <div className="border-b border-zinc-100 dark:border-zinc-800 bg-white dark:bg-slate-900 sticky top-0 z-10">
            <div className="flex p-1 gap-1 bg-zinc-100 dark:bg-zinc-800/50 m-4 rounded-xl">
              <button
                onClick={() => setMappingTab('assigned')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${
                  mappingTab === 'assigned' 
                    ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm border border-zinc-200 dark:border-zinc-800' 
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:text-zinc-300'
                }`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${mappingTab === 'assigned' ? 'bg-blue-500' : 'bg-transparent border border-zinc-400'}`} />
                Produtos do Setor
              </button>
              <button
                onClick={() => setMappingTab('all')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${
                  mappingTab === 'all' 
                    ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm border border-zinc-200 dark:border-zinc-800' 
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:text-zinc-300'
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
                  className="pl-10 h-10 border-zinc-200 dark:border-zinc-800"
                />
              </div>
            </div>
          </div>

          {/* Lista de Produtos ou Formulário de Edição */}
          <div className="flex-1 overflow-y-auto p-4 bg-zinc-50 dark:bg-zinc-900/50/10">
            {editingProduct ? (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-200">
                <div className="flex items-center gap-2 pb-2 border-b border-zinc-100 dark:border-zinc-800 mb-4">
                  <span className="text-xs font-black text-zinc-400 uppercase tracking-widest">Editando Produto</span>
                  <div className="h-px flex-1 bg-zinc-100 dark:bg-zinc-800" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 space-y-1.5">
                    <label className="text-[10px] font-black text-zinc-500 dark:text-zinc-400 uppercase ml-1">Descrição do Produto</label>
                    <Input 
                      value={productFormData.description}
                      onChange={e => setProductFormData({...productFormData, description: e.target.value})}
                      className="h-10 text-xs font-bold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-zinc-500 dark:text-zinc-400 uppercase ml-1">Código (SKU)</label>
                    <Input 
                      value={productFormData.code}
                      onChange={e => setProductFormData({...productFormData, code: e.target.value})}
                      className="h-10 text-xs font-mono"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-zinc-500 dark:text-zinc-400 uppercase ml-1">Família</label>
                    <Input 
                      value={productFormData.family}
                      onChange={e => setProductFormData({...productFormData, family: e.target.value})}
                      className="h-10 text-xs font-bold uppercase"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-zinc-500 dark:text-zinc-400 uppercase ml-1">Estoque Atual</label>
                    <Input 
                      type="number"
                      value={productFormData.stock}
                      onChange={e => setProductFormData({...productFormData, stock: Number(e.target.value)})}
                      className="h-10 text-xs font-bold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-zinc-500 dark:text-zinc-400 uppercase ml-1">Estoque Mínimo</label>
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
                    <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4 border border-dashed border-zinc-200 dark:border-zinc-800">
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
                            : 'border-zinc-200 dark:border-zinc-800/60 bg-white dark:bg-slate-900 hover:border-zinc-300 shadow-sm'
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <div className="text-[11px] font-bold text-zinc-900 dark:text-zinc-100 truncate uppercase">
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
                              <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-bold flex items-center gap-0.5">
                                <Tag size={8} /> {product.family}
                              </span>
                            )}
                            <div className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isLowStock ? 'bg-red-50 text-red-600' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'}`}>
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
                                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-800 dark:bg-zinc-800'
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

          <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50/50 flex justify-between items-center">
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
