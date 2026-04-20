import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SectorService, Sector } from '../features/sectors/api';
import { Card } from '../shared/ui/Card';
import { Button } from '../shared/ui/Button';
import { Input } from '../shared/ui/Input';
import { Plus, Trash2, Edit2, LayoutPanelLeft } from 'lucide-react';
import { useState } from 'react';

export function SectorsPage() {
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  
  const { data: sectors, isLoading } = useQuery({
    queryKey: ['sectors'],
    queryFn: SectorService.getSectors,
  });

  const deleteMutation = useMutation({
    mutationFn: SectorService.deleteSector,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sectors'] }),
  });

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Setores de Produção</h1>
          <p className="text-zinc-500">Gerencie os departamentos responsáveis pela fabricação</p>
        </div>
        <Button onClick={() => setIsAdding(true)}>
          <Plus size={16} className="mr-2" />
          Novo Setor
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 bg-white animate-pulse rounded-xl border border-slate-200" />
          ))
        ) : (
          sectors?.map((s) => (
            <Card key={s.id} className="relative group overflow-hidden">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                    <LayoutPanelLeft size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{s.name}</h3>
                    <p className="text-xs text-slate-500">{s.description || 'Sem descrição'}</p>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Edit2 size={14} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => {
                        if(confirm('Tem certeza?')) deleteMutation.mutate(s.id);
                    }}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {sectors?.length === 0 && !isLoading && (
        <Card className="flex flex-col items-center justify-center p-12 text-center">
          <LayoutPanelLeft size={48} className="text-slate-300 mb-4" />
          <h3 className="text-lg font-bold text-slate-900">Nenhum setor cadastrado</h3>
          <p className="text-slate-500 mb-6">Comece adicionando os departamentos da sua fábrica.</p>
          <Button onClick={() => setIsAdding(true)}>Adicionar primeiro setor</Button>
        </Card>
      )}
    </div>
  );
}
