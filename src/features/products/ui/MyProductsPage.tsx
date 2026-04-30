import { useMyProducts } from '../../../hooks/products/useMyProducts';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { EmptyState } from '../../../components/ui/EmptyState';
import { BookmarkCheck, Trash2, Package, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { MyProductsLogic } from '../domain/MyProductsLogic';

export function MyProductsPage() {
  const { savedProducts, removeProduct, clearAll } = useMyProducts();
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const filteredProducts = useMemo(() => {
    return MyProductsLogic.filterProducts(savedProducts, search);
  }, [savedProducts, search]);

  if (savedProducts.length === 0) {
    return (
      <EmptyState
        title="Nenhum produto salvo"
        description="Salve produtos do catálogo para acessá-los rapidamente aqui."
        actionLabel="Ir para o Catálogo"
        onAction={() => navigate('/products')}
        icon={<BookmarkCheck size={40} />}
      />
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Meus Produtos</h1>
          <p className="text-zinc-500 text-sm">Sua seleção personalizada de itens</p>
        </div>
        <Button variant="outline" size="sm" onClick={clearAll} className="text-red-500 hover:text-red-600 hover:bg-red-50 border-red-100">
          <Trash2 size={16} className="mr-2" />
          Limpar Tudo
        </Button>
      </header>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-slate-400" />
        </div>
        <input
          type="text"
          placeholder="Buscar nos meus produtos..."
          className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((p) => (
          <Card key={p.id} className="relative group">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                <Package size={24} />
              </div>
              <button 
                onClick={() => removeProduct(p.id)}
                className="p-1 text-slate-300 hover:text-red-500 transition-colors"
                title="Remover"
              >
                <Trash2 size={18} />
              </button>
            </div>
            
            <div className="space-y-2">
              <div className="text-[10px] font-bold text-blue-600 font-mono tracking-wider uppercase">
                {p.id}
              </div>
              <h3 className="font-bold text-slate-900 uppercase leading-tight line-clamp-2 min-h-[3rem]">
                {p.description}
              </h3>
              {p.family && (
                <div className="text-[10px] text-slate-400 font-bold uppercase mt-1">
                  Família: {p.family}
                </div>
              )}
              <div className="pt-4 flex items-center justify-between border-t border-slate-50">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Estoque</span>
                  <span className="font-bold text-slate-700">{p.stock} {p.unit}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Preço</span>
                  <span className="font-bold text-slate-900">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(p.price)}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
