import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ProductService, Product } from '../features/products/api';
import { SectorService } from '../features/sectors/api';
import { Card } from '../shared/ui/Card';
import { Input } from '../shared/ui/Input';
import { Button } from '../shared/ui/Button';
import { 
  Search, RefreshCw, Box, Layers, Filter, 
  ChevronDown, ChevronUp, ChevronLeft, ChevronRight,
  CheckSquare, Square, BookmarkPlus, BookmarkCheck,
  MoreVertical, ListFilter
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { cn } from '../shared/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useMyProductsStore } from '../shared/stores/myProductsStore';
import { useToast } from '../shared/ui/Toast';

export function ProductsPage() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const { saveProduct, isSaved, removeProduct } = useMyProductsStore();
  
  // Estados de busca e navegação
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage] = useState(20);
  
  // Estados de filtros avançados
  const [sectorFilter, setSectorFilter] = useState('');
  const [stockLevel, setStockLevel] = useState<'all' | 'low' | 'normal'>('all');
  const [familyFilter, setFamilyFilter] = useState('');
  
  // Estado de seleção múltipla
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  
  const { data: rawProducts, isLoading, isError, error, isFetching, refetch } = useQuery({
    queryKey: ['products-raw'],
    queryFn: () => ProductService.getProducts(),
    staleTime: 1000 * 60 * 5, 
    retry: 1
  });

  const totalItemsCount = rawProducts?.length || 0;
  const allProductsList = rawProducts || [];

  // Filtragem Local baseada nos estados dos seletores
  const filteredProducts = useMemo(() => {
    return allProductsList.filter(p => {
      // Filtro de Busca (Descrição, Código, ID ou Família)
      const matchesSearch = !search || 
        p.description.toLowerCase().includes(search.toLowerCase()) || 
        p.code.toLowerCase().includes(search.toLowerCase()) ||
        p.id.toLowerCase().includes(search.toLowerCase()) ||
        p.family.toLowerCase().includes(search.toLowerCase());
      
      // Filtro de Família (Categoria)
      const matchesFamily = !familyFilter || familyFilter === 'Todas' || p.family === familyFilter;
      
      // Filtro de Setor
      const matchesSector = !sectorFilter || (sectorFilter === 'none' ? !p.sectorId : p.sectorId === sectorFilter);
      
      // Filtro de Estoque
      const matchesStock = stockLevel === 'all' || 
        (stockLevel === 'low' ? p.stock <= 10 : p.stock > 10);
      
      return matchesSearch && matchesFamily && matchesSector && matchesStock;
    });
  }, [allProductsList, search, familyFilter, sectorFilter, stockLevel]);

  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / perPage);
  
  // Extração de Categorias (Famílias) únicas de todo o catálogo
  const families = useMemo(() => {
    const unique = new Set(allProductsList.map(p => p.family).filter(Boolean));
    return ['Todas', ...Array.from(unique).sort()];
  }, [allProductsList]);

  // Paginação Local sobre a lista já filtrada
  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * perPage;
    return filteredProducts.slice(start, start + perPage);
  }, [filteredProducts, page, perPage]);

  const { data: sectors } = useQuery({
    queryKey: ['sectors'],
    queryFn: SectorService.getSectors
  });

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.add(id);
    setSelectedIds(newSelected);
  };

  const toggleSelectPage = () => {
    const pageIds = paginatedProducts.map(p => p.id);
    const allPageSelected = pageIds.every(id => selectedIds.has(id));
    
    const newSelected = new Set(selectedIds);
    if (allPageSelected) {
      pageIds.forEach(id => newSelected.delete(id));
    } else {
      pageIds.forEach(id => newSelected.add(id));
    }
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredProducts.length && filteredProducts.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredProducts.map(p => p.id)));
    }
  };

  const handleSaveSelected = () => {
    const selectedItems = filteredProducts.filter(p => selectedIds.has(p.id));
    selectedItems.forEach(p => saveProduct(p));
    
    addToast({
      title: 'Produtos Salvos',
      message: `${selectedIds.size} produtos adicionados à sua lista pessoal.`,
      type: 'success'
    });
    
    setSelectedIds(new Set());
  };

  const syncMutation = useMutation({
    mutationFn: ProductService.syncWithOmie,
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['products-raw'] });
      addToast({
        title: 'Sincronização',
        message: data?.message || 'Catálogo atualizado com sucesso via Omie!',
        type: 'success'
      });
    }
  });

  if (isError) {
// ... (bloco de erro simplificado)
    return (
      <div className="p-8 text-center">
        <div className="bg-red-50 p-6 rounded-xl border border-red-100 max-w-sm mx-auto">
          <p className="text-red-700 font-mono text-sm mb-6">Erro: {(error as any)?.message}</p>
          <Button onClick={() => refetch()} variant="outline" size="sm" className="w-full">Tentar novamente</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Catálogo de Produtos</h1>
          <p className="text-zinc-500 text-sm">
            {isFetching ? 'Atualizando catálogo...' : `Exibindo ${totalItemsCount} produtos sincronizados do Omie`}
          </p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button 
            onClick={() => syncMutation.mutate()} 
            isLoading={syncMutation.isPending}
            variant="outline"
            className="flex-1 md:flex-none"
          >
            <RefreshCw size={16} className="mr-2" />
            Sincronizar
          </Button>
        </div>
      </header>

      <Card>
        <div className="space-y-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-[2]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <Input 
                placeholder="Buscar por descrição ou código..." 
                className="pl-10 h-11"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            
            <div className="flex-1 min-w-[200px]">
              <div className="relative group">
                <ListFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                <select 
                  value={familyFilter || 'Todas'}
                  onChange={(e) => {
                    setFamilyFilter(e.target.value === 'Todas' ? '' : e.target.value);
                    setPage(1);
                  }}
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer"
                >
                  {families.map(f => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                variant={showFilters ? 'secondary' : 'outline'} 
                onClick={() => setShowFilters(!showFilters)}
                className="flex gap-2 h-11 px-4"
              >
                <Filter size={18} />
                <span className="hidden sm:inline">Mais Filtros</span>
                {showFilters ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </Button>
            </div>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 'auto', height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Setor de Atuação</label>
                    <select 
                      value={sectorFilter}
                      onChange={(e) => {
                        setSectorFilter(e.target.value);
                        setPage(1);
                      }}
                      className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-xs focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option value="">Todos os Setores</option>
                      {sectors?.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                      <option value="none">Não Vinculado</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Disponibilidade</label>
                    <div className="flex gap-1">
                      {(['all', 'low', 'normal'] as const).map((level) => (
                        <button
                          key={level}
                          onClick={() => {
                            setStockLevel(level);
                            setPage(1);
                          }}
                          className={cn(
                            "flex-1 h-10 rounded-lg border text-[10px] font-bold transition-all uppercase",
                            stockLevel === level 
                              ? "bg-slate-900 border-slate-900 text-white shadow-sm" 
                              : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                          )}
                        >
                          {level === 'all' ? 'Ver Tudo' : level === 'low' ? 'Baixo' : 'Normal'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Toolbar de Seleção */}
        {selectedIds.size > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between p-3 mb-4 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-200"
          >
            <div className="flex items-center gap-4 ml-2">
              <span className="text-sm font-bold">{selectedIds.size} itens selecionados</span>
              <div className="h-4 w-px bg-blue-400" />
              <button 
                onClick={toggleSelectAll}
                className="text-xs font-medium hover:underline flex items-center gap-1"
              >
                {selectedIds.size === filteredProducts.length ? 'Desmarcar Tudo' : 'Selecionar Todo o Catálogo'}
              </button>
            </div>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="ghost" 
                className="text-white hover:bg-blue-700"
                onClick={() => setSelectedIds(new Set())}
              >
                Limpar Seleção
              </Button>
              <Button 
                size="sm" 
                className="bg-white text-blue-600 hover:bg-blue-50 font-bold"
                icon={<BookmarkPlus size={16} />}
                onClick={handleSaveSelected}
              >
                Adicionar em Meus Produtos
              </Button>
            </div>
          </motion.div>
        )}

        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <RefreshCw size={32} className="animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-separate border-spacing-0">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="pb-3 px-4 pt-4 border-b border-slate-100 flex items-center justify-center h-full">
                    <button 
                      onClick={toggleSelectPage}
                      className={cn(
                        "transition-colors",
                        paginatedProducts.every(p => selectedIds.has(p.id)) && paginatedProducts.length > 0
                          ? "text-blue-600"
                          : "text-slate-400 hover:text-blue-600"
                      )}
                      title="Selecionar todos desta página"
                    >
                      {paginatedProducts.every(p => selectedIds.has(p.id)) && paginatedProducts.length > 0
                        ? <CheckSquare size={18} />
                        : <Square size={18} />
                      }
                    </button>
                  </th>
                  <th className="pb-3 px-4 pt-4 font-semibold text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-100 uppercase w-24">Código</th>
                  <th className="pb-3 px-4 pt-4 font-semibold text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-100 uppercase">Descrição do Produto</th>
                  <th className="pb-3 px-4 pt-4 font-semibold text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-100 uppercase">Categoria / Setor</th>
                  <th className="pb-3 px-4 pt-4 font-semibold text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-100 uppercase text-right">Estoque</th>
                  <th className="pb-3 px-4 pt-4 font-semibold text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-100 uppercase text-right">Preço</th>
                  <th className="pb-3 px-4 pt-4 font-semibold text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-100 uppercase text-center w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {paginatedProducts.map((p, idx) => {
                  const isSelected = selectedIds.has(p.id);
                  const saved = isSaved(p.id);
                  
                  return (
                    <tr 
                      key={`${p.id}-${p.code}-${idx}`} 
                      className={cn(
                        "group transition-all duration-200",
                        isSelected ? "bg-blue-50/40" : "hover:bg-slate-50/80"
                      )}
                    >
                      <td className="py-4 px-4 text-center">
                         <button 
                          onClick={() => toggleSelect(p.id)}
                          className={cn(
                            "transition-colors",
                            isSelected ? "text-blue-600" : "text-slate-300 group-hover:text-slate-400"
                          )}
                        >
                          {isSelected ? <CheckSquare size={18} /> : <Square size={18} />}
                        </button>
                      </td>
                      <td className="py-4 px-4 font-mono text-blue-600 font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-[100px]" title={p.id}>
                        {p.id}
                      </td>
                      <td className="py-4 px-4 max-w-md">
                        <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors uppercase">{p.description}</div>
                        {(p.code && p.code !== p.id) && <div className="text-[9px] text-slate-400 font-mono mt-0.5">Ref: {p.code}</div>}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
                            <Layers size={12} className="text-slate-400" />
                            {p.familyDescription || p.family}
                          </div>
                          <span className={cn(
                            "inline-flex w-fit items-center rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide",
                            p.sectorId ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-500"
                          )}>
                            {p.sectorId ? 'Setor Ativo' : 'Não Vinculado'}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className={cn(
                          "inline-flex flex-col items-end min-w-[60px] px-2 py-1 rounded border",
                          p.stock > 10 
                            ? "bg-emerald-50 border-emerald-100 text-emerald-700" 
                            : "bg-amber-50 border-amber-100 text-amber-700"
                        )}>
                          <span className="text-sm font-black">{p.stock}</span>
                          <span className="text-[9px] font-bold uppercase tracking-tighter">{p.unit || 'un'}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="text-sm font-bold text-slate-700">
                          {p.price ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(p.price) : '-'}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            saved ? removeProduct(p.id) : saveProduct(p);
                          }}
                          className={cn(
                            "p-2 rounded-lg transition-all",
                            saved 
                              ? "text-emerald-500 bg-emerald-50 shadow-inner" 
                              : "text-slate-300 hover:text-blue-600 hover:bg-white"
                          )}
                          title={saved ? "Remover de Meus Produtos" : "Salvar em Meus Produtos"}
                        >
                          {saved ? <BookmarkCheck size={18} /> : <BookmarkPlus size={18} />}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            
            {filteredProducts.length === 0 && (
              <div className="text-center py-20">
                <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                  <Box className="text-slate-300" size={32} />
                </div>
                <h3 className="text-slate-900 font-bold mb-1">Nenhum resultado</h3>
                <p className="text-slate-500 text-sm">Tente ajustar seus filtros ou busca.</p>
              </div>
            )}
          </div>
        )}

        {/* Paginação */}
        {!isLoading && totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-slate-100">
            <p className="text-xs font-medium text-slate-500">
              Mostrando <span className="text-slate-900">{paginatedProducts.length}</span> de <span className="text-slate-900">{totalItems}</span> produtos
            </p>
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-10 h-10 p-0 rounded-lg"
              >
                <ChevronLeft size={18} />
              </Button>
              
              <div className="flex items-center gap-1">
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  let pageNum = page;
                  if (page <= 3) pageNum = i + 1;
                  else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
                  else pageNum = page - 2 + i;
                  
                  if (pageNum <= 0 || pageNum > totalPages) return null;

                  return (
                    <Button
                      key={pageNum}
                      variant={page === pageNum ? 'secondary' : 'ghost'}
                      size="sm"
                      onClick={() => setPage(pageNum)}
                      className={cn(
                        "w-10 h-10 p-0 rounded-lg text-xs font-bold",
                        page === pageNum ? "bg-slate-900 text-white" : "text-slate-600"
                      )}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-10 h-10 p-0 rounded-lg"
              >
                <ChevronRight size={18} />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
