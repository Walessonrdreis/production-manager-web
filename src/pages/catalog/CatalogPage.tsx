import { useState, useMemo } from 'react';
import { useProducts } from '../../hooks/api/useProducts';
import { useSectors } from '../../hooks/api/useSectors';
import { useMyProducts } from '../../hooks/products/useMyProducts';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';
import { 
  Search, RefreshCw, Box, Layers, Filter, 
  ChevronDown, ChevronUp, ChevronLeft, ChevronRight,
  CheckSquare, Square, BookmarkPlus, BookmarkCheck,
  ListFilter
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { motion, AnimatePresence } from 'motion/react';

export function CatalogPage() {
  const { addToast } = useToast();
  const { products, isLoading, isError, error, isFetching, refetchProducts, syncWithOmie } = useProducts();
  const { sectors } = useSectors();
  const { saveProduct, isSaved, removeProduct } = useMyProducts();
  
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage] = useState(20);
  const [sectorFilter, setSectorFilter] = useState('');
  const [stockLevel, setStockLevel] = useState<'all' | 'low' | 'normal'>('all');
  const [familyFilter, setFamilyFilter] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = !search || 
        p.description.toLowerCase().includes(search.toLowerCase()) || 
        p.code.toLowerCase().includes(search.toLowerCase()) ||
        p.id.toLowerCase().includes(search.toLowerCase()) ||
        p.family.toLowerCase().includes(search.toLowerCase());
      
      const matchesFamily = !familyFilter || familyFilter === 'Todas' || p.family === familyFilter;
      const matchesSector = !sectorFilter || (sectorFilter === 'none' ? !p.sectorId : p.sectorId === sectorFilter);
      const matchesStock = stockLevel === 'all' || (stockLevel === 'low' ? p.stock <= 10 : p.stock > 10);
      
      return matchesSearch && matchesFamily && matchesSector && matchesStock;
    });
  }, [products, search, familyFilter, sectorFilter, stockLevel]);

  const totalPages = Math.ceil(filteredProducts.length / perPage);
  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * perPage;
    return filteredProducts.slice(start, start + perPage);
  }, [filteredProducts, page, perPage]);

  const families = useMemo(() => {
    const unique = new Set(products.map(p => p.family).filter(Boolean));
    return ['Todas', ...Array.from(unique).sort()];
  }, [products]);

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.add(id);
    setSelectedIds(newSelected);
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

  if (isError) {
    return (
      <div className="p-8 text-center">
        <div className="bg-red-50 p-6 rounded-xl border border-red-100 max-w-sm mx-auto">
          <p className="text-red-700 font-mono text-sm mb-6">Erro: {(error as any)?.message}</p>
          <Button onClick={() => refetchProducts()} variant="outline" size="sm" className="w-full">Tentar novamente</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">Catálogo de Produtos</h1>
          <p className="text-zinc-500 text-xs sm:text-sm">
            {isFetching ? 'Atualizando catálogo...' : `Exibindo ${products.length} produtos sincronizados`}
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button 
            onClick={() => syncWithOmie.mutate()} 
            isLoading={syncWithOmie.isPending}
            variant="outline"
            size="sm"
            className="flex-1 sm:flex-none text-xs"
          >
            <RefreshCw size={14} className="mr-2" />
            Sincronizar
          </Button>
        </div>
      </header>

      <Card>
        <div className="space-y-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="relative flex-[2]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <Input 
                placeholder="Buscar por descrição ou código..." 
                className="pl-10 h-11 text-sm"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              <div className="flex-1 min-w-[150px]">
                <div className="relative group">
                  <ListFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <select 
                    value={familyFilter || 'Todas'}
                    onChange={(e) => {
                      setFamilyFilter(e.target.value === 'Todas' ? '' : e.target.value);
                      setPage(1);
                    }}
                    className="w-full h-11 pl-10 pr-8 rounded-xl border border-slate-200 bg-white text-sm appearance-none cursor-pointer"
                  >
                    {families.map(f => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
                </div>
              </div>

              <Button 
                variant={showFilters ? 'secondary' : 'outline'} 
                onClick={() => setShowFilters(!showFilters)}
                className="flex gap-2 h-11 px-4 text-sm"
              >
                <Filter size={18} />
                <span>Filtros</span>
                {showFilters ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </Button>
            </div>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Setor</label>
                    <select 
                      value={sectorFilter}
                      onChange={(e) => {
                        setSectorFilter(e.target.value);
                        setPage(1);
                      }}
                      className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-xs"
                    >
                      <option value="">Todos os Setores</option>
                      {sectors?.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                      <option value="none">Não Vinculado</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Disponibilidade</label>
                    <div className="flex gap-1">
                      {(['all', 'low', 'normal'] as const).map((level) => (
                        <button
                          key={level}
                          onClick={() => {
                            setStockLevel(level);
                            setPage(1);
                          }}
                          className={cn(
                            "flex-1 h-10 rounded-lg border text-[10px] font-bold uppercase transition-all",
                            stockLevel === level ? "bg-slate-900 border-slate-900 text-white" : "bg-white border-slate-200 text-slate-500"
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

        {selectedIds.size > 0 && (
          <div className="flex items-center justify-between p-3 mb-4 bg-blue-600 rounded-xl text-white shadow-lg">
            <span className="text-sm font-bold ml-2">{selectedIds.size} selecionados</span>
            <Button size="sm" className="bg-white text-blue-600 hover:bg-blue-50 font-bold" onClick={handleSaveSelected}>
              <BookmarkPlus size={14} className="mr-1" />
              Salvar Seleção
            </Button>
          </div>
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
                  <th className="pb-3 px-4 pt-4 border-b border-slate-100 text-center w-12">
                    <button onClick={() => {
                      const pageIds = paginatedProducts.map(p => p.id);
                      const allPageSelected = pageIds.every(id => selectedIds.has(id));
                      const newSelected = new Set(selectedIds);
                      if (allPageSelected) pageIds.forEach(id => newSelected.delete(id));
                      else pageIds.forEach(id => newSelected.add(id));
                      setSelectedIds(newSelected);
                    }} className="text-slate-400">
                      {paginatedProducts.length > 0 && paginatedProducts.every(p => selectedIds.has(p.id)) ? <CheckSquare size={18} /> : <Square size={18} />}
                    </button>
                  </th>
                  <th className="pb-3 px-4 pt-4 font-semibold text-slate-500 uppercase text-[10px] border-b border-slate-100 w-28">Cód.</th>
                  <th className="pb-3 px-4 pt-4 font-semibold text-slate-500 uppercase text-[10px] border-b border-slate-100">Produto</th>
                  <th className="pb-3 px-4 pt-4 font-semibold text-slate-500 uppercase text-[10px] border-b border-slate-100 text-right w-24">Estoque</th>
                  <th className="pb-3 px-4 pt-4 font-semibold text-slate-500 uppercase text-[10px] border-b border-slate-100 text-right w-32">Preço</th>
                  <th className="pb-3 px-4 pt-4 border-b border-slate-100 w-12"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {paginatedProducts.map((p) => {
                  const saved = isSaved(p.id);
                  return (
                    <tr key={p.id} className={cn("group transition-colors", selectedIds.has(p.id) ? "bg-blue-50/40" : "hover:bg-slate-50/80")}>
                      <td className="py-4 px-4 text-center">
                        <button onClick={() => toggleSelect(p.id)} className={cn(selectedIds.has(p.id) ? "text-blue-600" : "text-slate-300")}>
                          {selectedIds.has(p.id) ? <CheckSquare size={18} /> : <Square size={18} />}
                        </button>
                      </td>
                      <td className="py-4 px-4 font-mono text-blue-600 text-[11px] truncate max-w-[90px]">{p.code || p.id}</td>
                      <td className="py-2.5 px-4">
                        <div className="max-w-[200px] sm:max-w-[250px] lg:max-w-[300px]">
                          <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors uppercase leading-tight text-xs sm:text-sm break-words whitespace-normal">
                            {p.description}
                          </div>
                          <div className="text-[10px] text-slate-400 uppercase mt-0.5">{p.family}</div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className={cn("px-2 py-1 rounded text-xs font-bold", p.stock > 10 ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700")}>
                          {p.stock} {p.unit || 'un'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right font-bold text-slate-700">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(p.price)}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <button 
                          onClick={() => saved ? removeProduct(p.id) : saveProduct(p)}
                          className={cn("p-2 rounded-lg transition-all", saved ? "text-emerald-500 bg-emerald-50" : "text-slate-300 hover:text-blue-600")}
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
                <Box className="text-slate-300 mx-auto mb-4" size={48} />
                <h3 className="text-slate-900 font-bold">Nenhum resultado</h3>
                <p className="text-slate-500 text-sm">Tente ajustar seus filtros.</p>
              </div>
            )}
          </div>
        )}

        {!isLoading && totalPages > 1 && (
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
            <p className="text-xs text-slate-500">Total: {filteredProducts.length} itens</p>
            <div className="flex items-center gap-1.5">
              <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="w-10 p-0"><ChevronLeft size={18} /></Button>
              <span className="text-xs font-bold px-4">{page} / {totalPages}</span>
              <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="w-10 p-0"><ChevronRight size={18} /></Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
