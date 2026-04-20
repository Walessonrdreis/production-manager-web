import { useQuery } from '@tanstack/react-query';
import { ProductService, Product } from '../features/products/api';
import { usePlanningStore } from '../features/planning/store';
import { Card } from '../shared/ui/Card';
import { Button } from '../shared/ui/Button';
import { Input } from '../shared/ui/Input';
import { Search, Plus, Trash2, FileText, Download } from 'lucide-react';
import { useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { PlanningPDF } from '../features/planning/PlanningPDF';

export function PlanningPage() {
  const [search, setSearch] = useState('');
  const { items, addItem, removeItem, period, setPeriod, clear } = usePlanningStore();
  
  const { data: productsList, isLoading } = useQuery({
    queryKey: ['products-planning', search],
    queryFn: () => ProductService.getProducts({ search }),
    enabled: search.length > 2,
  });

  const products = productsList || [];

  return (
    <div className="space-y-6 sm:space-y-8">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">Planejamento de Produção</h1>
          <p className="text-xs sm:text-sm text-zinc-500">Selecione produtos para gerar ordens de fabricação</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
           <select 
             className="h-9 sm:h-auto rounded-md border border-slate-200 px-3 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-500 flex-1 sm:flex-none"
             value={period}
             onChange={(e) => setPeriod(e.target.value as any)}
           >
              <option value="daily">Diário</option>
              <option value="weekly">Semanal</option>
              <option value="monthly">Mensal</option>
           </select>
           
           <Button variant="outline" size="sm" onClick={clear} className="text-xs flex-1 sm:flex-none">Limpar</Button>
           
           <PDFDownloadLink 
             document={<PlanningPDF items={items} period={period} />} 
             fileName={`planejamento-${period}-${new Date().toISOString().split('T')[0]}.pdf`}
             className="w-full sm:w-auto"
           >
             {({ loading }: { loading: boolean }) => (
                <Button disabled={items.length === 0 || loading} size="sm" className="w-full sm:w-auto text-xs">
                  <Download size={14} className="mr-2" />
                  {loading ? 'Gerando...' : 'Gerar PDF'}
                </Button>
             )}
           </PDFDownloadLink>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Selector */}
        <Card title="Adicionar Produtos" description="Busque pelo catálogo para planejar a produção.">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input 
              placeholder="Digite a descrição ou Código..." 
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
            {isLoading ? (
              <div className="text-center py-4 text-slate-500">Carregando...</div>
            ) : products.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50">
                <div>
                    <div className="font-bold text-slate-900">{p.description}</div>
                    <div className="text-xs text-blue-600 font-mono font-medium">Cód: {p.id}</div>
                </div>
                <Button size="sm" variant="ghost" onClick={() => addItem(p, 1)}>
                    <Plus size={16} />
                </Button>
              </div>
            ))}
            {search.length <= 2 && <div className="text-center py-4 text-slate-400 italic text-sm">Digite ao menos 3 caracteres para buscar</div>}
          </div>
        </Card>

        {/* Selected List */}
        <Card title="Itens Selecionados" description="Estes itens farão parte do documento de produção.">
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-4 rounded-xl border border-blue-100 bg-blue-50/30">
                <div className="flex-1">
                    <div className="font-bold text-slate-900">{item.description}</div>
                    <div className="text-xs text-slate-500 font-mono italic">Cód: {item.id} - {item.family}</div>
                </div>
                <div className="w-20">
                    <Input 
                      type="number" 
                      className="text-right" 
                      value={item.plannedQuantity} 
                      onChange={() => {}} // TODO: Update quantity
                    />
                </div>
                <Button variant="ghost" size="icon" className="text-red-500" onClick={() => removeItem(item.id)}>
                    <Trash2 size={16} />
                </Button>
              </div>
            ))}
            {items.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center text-slate-400">
                    <FileText size={40} className="mb-2 opacity-20" />
                    <p>Nenhum produto selecionado para planejamento.</p>
                </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
