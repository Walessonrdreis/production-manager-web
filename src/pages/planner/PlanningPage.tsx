import { useMyProducts } from '../../hooks/products/useMyProducts';
import { usePlanning } from '../../hooks/planner/usePlanning';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Search, Plus, Trash2, FileText, Download } from 'lucide-react';
import { useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { PlanningPDF } from './PlanningPDF';

export function PlanningPage() {
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  /**
   * REGRAS DE NEGÓCIO PARA FILTRAGEM DE PRODUTOS:
   * Atualmente, o planejamento utiliza a lista de 'Meus Produtos' (persisitidos localmente via useMyProducts).
   * 
   * QUANDO A API TIVER A LÓGICA DE PRODUTOS FILTRADOS POR USUÁRIO/CONTEXTO:
   * 1. Substituir 'useMyProducts' por um hook que consuma o endpoint da API (ex: useUserProducts).
   * 2. O endpoint deve retornar apenas os produtos vinculados ao usuário ou setor logado.
   * 3. Garantir que o 'useProducts' (hook original) permaneça no catálogo geral, enquanto esta page consome o filtro.
   */
  const { savedProducts } = useMyProducts();
  const { items, addItem, addBulkItems, removeItem, period, setPeriod, clearPlanning, updateQuantity } = usePlanning();
  
  const filteredProducts = savedProducts.filter(p => 
    p.description.toLowerCase().includes(search.toLowerCase()) || 
    p.id.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredProducts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredProducts.map(p => p.id));
    }
  };

  const handleBulkAdd = async () => {
    const productsToAdd = savedProducts.filter(p => selectedIds.includes(p.id));
    await addBulkItems(productsToAdd);
    setSelectedIds([]);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">Planejamento de Produção</h1>
          <p className="text-xs sm:text-sm text-zinc-500">Selecione produtos para gerar ordens de fabricação</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
           <select 
             className="h-10 rounded-xl border border-slate-200 px-3 text-sm font-bold bg-white focus:ring-2 focus:ring-blue-500 flex-1 sm:flex-none"
             value={period}
             onChange={(e) => setPeriod(e.target.value as any)}
           >
              <option value="daily">Diário</option>
              <option value="weekly">Semanal</option>
              <option value="monthly">Mensal</option>
           </select>
           
           <Button variant="outline" size="sm" onClick={clearPlanning} className="text-xs flex-1 sm:flex-none h-10 px-4">Limpar</Button>
           
           <PDFDownloadLink 
             document={<PlanningPDF items={items} period={period} />} 
             fileName={`planejamento-${period}-${new Date().toISOString().split('T')[0]}.pdf`}
             className="w-full sm:w-auto"
           >
             {({ loading }: { loading: boolean }) => (
                <Button disabled={items.length === 0 || loading} size="sm" className="w-full sm:w-auto text-xs h-10 px-6 font-bold">
                  <Download size={14} className="mr-2" />
                  {loading ? 'Gerando...' : 'Gerar PDF'}
                </Button>
              )}
           </PDFDownloadLink>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        <Card>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Adicionar Produtos</h2>
              <p className="text-sm text-slate-500">Busque pelo catálogo para planejar a produção.</p>
            </div>
            {selectedIds.length > 0 && (
              <Button 
                size="sm" 
                onClick={handleBulkAdd}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-9 px-4 rounded-lg animate-in fade-in slide-in-from-top-2"
              >
                <Plus size={16} className="mr-2" />
                Adicionar {selectedIds.length}
              </Button>
            )}
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input 
              placeholder="Digite a descrição ou Código..." 
              className="pl-10 h-11"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {filteredProducts.length > 0 && (
            <div className="mb-2 flex items-center gap-2 px-2">
              <input 
                type="checkbox" 
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                checked={selectedIds.length === filteredProducts.length && filteredProducts.length > 0}
                onChange={toggleSelectAll}
              />
              <span className="text-[10px] font-bold text-slate-500 uppercase">Selecionar Todos</span>
            </div>
          )}

          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
            {filteredProducts.map((p) => (
              <div key={p.id} className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  checked={selectedIds.includes(p.id)}
                  onChange={() => toggleSelect(p.id)}
                />
                
                <div className="flex-1 min-w-0 pr-2">
                    <div className="font-bold text-slate-900 uppercase text-xs truncate">{p.description}</div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                      <div className="text-[10px] text-blue-600 font-mono font-bold">ID: {p.id}</div>
                      {p.family && <div className="text-[10px] text-zinc-500 font-bold uppercase">Família: {p.family}</div>}
                      <div className="text-[10px] text-slate-500 font-bold uppercase">ESTOQUE: {p.stock} {p.unit}</div>
                      <div className="text-[10px] text-slate-900 font-bold">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(p.price)}
                      </div>
                    </div>
                </div>
                <Button size="sm" variant="ghost" onClick={() => addItem(p, 1)} className="hover:bg-blue-50 text-blue-600 shrink-0 h-8 w-8 p-0">
                    <Plus size={18} />
                </Button>
              </div>
            ))}
            {filteredProducts.length === 0 && (
              <div className="text-center py-10 text-slate-400 italic text-sm">
                {search.length > 0 ? 'Nenhum produto encontrado na busca' : 'Nenhum produto salvo em "Meus Produtos"'}
              </div>
            )}
          </div>
        </Card>

        <Card>
          <div className="mb-4">
            <h2 className="text-lg font-bold text-slate-900">Itens Selecionados</h2>
            <p className="text-sm text-slate-500">Estes itens farão parte do documento de produção.</p>
          </div>

          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-4 rounded-xl border border-blue-100 bg-blue-50/30">
                <div className="flex-1 min-w-0">
                    <div className="font-bold text-slate-900 uppercase text-xs truncate">{item.description}</div>
                    <div className="text-[10px] text-slate-500 font-mono italic">Cód: {item.id}</div>
                </div>
                <div className="w-20">
                    <Input 
                      type="number" 
                      className="text-center h-9 font-bold" 
                      value={item.plannedQuantity} 
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                    />
                </div>
                <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-50 h-9 w-9" onClick={() => removeItem(item.id)}>
                    <Trash2 size={16} />
                </Button>
              </div>
            ))}
            {items.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center text-slate-400">
                    <FileText size={40} className="mb-2 opacity-20" />
                    <p className="text-sm">Nenhum produto selecionado para planejamento.</p>
                </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
