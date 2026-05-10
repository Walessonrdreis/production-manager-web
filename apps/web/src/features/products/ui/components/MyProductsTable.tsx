import { Product } from '../../../../types/api';
import { Package, Trash2, Edit, AlertTriangle, FilePlus2, Layers } from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { useSectors } from '../../../../hooks/sectors/useSectors';

interface MyProductsTableProps {
  products: Product[];
  demandMap?: Record<string, number>;
  onRemoveProduct: (id: string) => void;
  onViewDetails: (product: Product) => void;
  onPlanProduct?: (product: Product) => void;
}

export function MyProductsTable({ products, demandMap = {}, onRemoveProduct, onViewDetails, onPlanProduct }: MyProductsTableProps) {
  const { data: sectors = [] } = useSectors();

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-bold">
              <th className="px-6 py-4 font-bold text-slate-500">Cód / SKU</th>
              <th className="px-6 py-4 font-bold text-slate-500">Produto</th>
              <th className="px-6 py-4 font-bold text-slate-500 text-right w-32">Demanda / Estoque</th>
              <th className="px-6 py-4 font-bold text-slate-500 text-right">Preço</th>
              <th className="px-6 py-4 font-bold text-slate-500 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((p) => {
              const productCode = String(p.code || p.id || p.description);
              const demand = demandMap[productCode] || 0;
              const stock = p.stock || 0;
              const deficit = stock - demand;
              
              const minStock = p.minStock || 0;
              const isCritical = deficit < 0;
              const isWarning = !isCritical && ((stock <= minStock && minStock > 0) || (demand > 0 && deficit <= minStock));
              
              return (
                <tr 
                  key={p.id} 
                  className={`transition-colors cursor-pointer group ${isCritical ? 'bg-red-50 hover:bg-red-100' : isWarning ? 'bg-amber-50 hover:bg-amber-100' : 'hover:bg-slate-50'}`}
                  onClick={() => onViewDetails(p)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-xs font-mono font-bold px-2 py-1 rounded ${isCritical ? 'text-red-700 bg-red-100' : isWarning ? 'text-amber-700 bg-amber-100' : 'text-blue-600 bg-blue-50'}`}>
                      {p.code || p.id}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2" title={isCritical ? "Demanda supera o estoque atual!" : isWarning ? "Estoque no limite de segurança." : undefined}>
                       <span className="text-sm font-bold text-slate-900 line-clamp-2 uppercase">
                        {p.description}
                      </span>
                      {isCritical && <AlertTriangle size={16} className="text-red-500 shrink-0" />}
                      {isWarning && <AlertTriangle size={16} className="text-amber-500 shrink-0" />}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {p.family && (
                        <span className="text-[10px] font-medium text-slate-500 uppercase inline-block">
                          Família: {p.family}
                        </span>
                      )}
                      {(p.sectorIds || []).length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {(p.sectorIds || []).map(sId => {
                            const sectorName = sectors.find(s => s.id === sId)?.name || sId;
                            return (
                              <span key={sId} className="flex items-center text-[9px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 uppercase px-1.5 py-0.5 rounded">
                                <Layers size={10} className="mr-1" />
                                {sectorName}
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex flex-col items-end">
                      {demand > 0 && (
                        <span className={`text-xs font-bold mb-1 ${isCritical ? 'text-red-600' : 'text-amber-600'}`} title="Demanda Pendente">
                          - {demand} pdto.
                        </span>
                      )}
                      <div className="flex items-baseline space-x-1">
                        <span className={`text-sm font-bold ${isCritical ? 'text-red-900' : 'text-slate-900'}`}>{stock}</span>
                        <span className="text-[10px] uppercase text-slate-500 font-bold">{p.unit}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-slate-900">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(p.price)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      {onPlanProduct && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-slate-400 group-hover:text-amber-600 hover:bg-amber-50"
                          title="Planejar Produção"
                          onClick={(e) => {
                            e.stopPropagation();
                            onPlanProduct(p);
                          }}
                        >
                          <FilePlus2 size={16} />
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 text-slate-400 hover:text-red-600 hover:bg-red-50"
                        title="Remover produto"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveProduct(p.id);
                        }}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-500 text-sm">
                  Nenhum produto encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
