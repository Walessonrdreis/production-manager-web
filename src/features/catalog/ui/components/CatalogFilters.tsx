import { Search, ListFilter, ChevronDown, ChevronUp, Filter } from 'lucide-react';
import { Input } from '../../../../components/ui/Input';
import { Button } from '../../../../components/ui/Button';
import { cn } from '../../../../utils/cn';
import { motion, AnimatePresence } from 'motion/react';
import { Sector } from '../../../../types/api';

interface CatalogFiltersProps {
  search: string;
  onSearchChange: (val: string) => void;
  familyFilter: string;
  onFamilyChange: (val: string) => void;
  families: string[];
  showFilters: boolean;
  onToggleFilters: () => void;
  sectorFilter: string;
  onSectorChange: (val: string) => void;
  sectors: Sector[];
  stockLevel: 'all' | 'low' | 'normal';
  onStockLevelChange: (val: 'all' | 'low' | 'normal') => void;
}

export function CatalogFilters({
  search, onSearchChange,
  familyFilter, onFamilyChange, families,
  showFilters, onToggleFilters,
  sectorFilter, onSectorChange, sectors,
  stockLevel, onStockLevelChange
}: CatalogFiltersProps) {
  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-col lg:flex-row gap-3">
        <div className="relative flex-[2]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <Input 
            placeholder="Buscar por descrição ou código..." 
            className="pl-10 h-11 text-sm"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <div className="flex-1 min-w-[150px]">
            <div className="relative group">
              <ListFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <select 
                value={familyFilter || 'Todas'}
                onChange={(e) => onFamilyChange(e.target.value)}
                className="w-full h-11 pl-10 pr-8 rounded-xl border border-slate-200 bg-white text-sm appearance-none cursor-pointer focus:ring-2 focus:ring-blue-500/20 outline-none"
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
            onClick={onToggleFilters}
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
                  onChange={(e) => onSectorChange(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-xs outline-none focus:ring-2 focus:ring-blue-500/20"
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
                      onClick={() => onStockLevelChange(level)}
                      className={cn(
                        "flex-1 h-10 rounded-lg border text-[10px] font-bold uppercase transition-all",
                        stockLevel === level ? "bg-slate-900 border-slate-900 text-white shadow-sm" : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
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
  );
}
