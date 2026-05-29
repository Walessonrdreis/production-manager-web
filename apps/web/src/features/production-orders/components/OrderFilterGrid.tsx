import React from 'react';

export interface OrderFilterState {
  search: string;
  status: string;
  dateRange: string;
}

interface OrderFilterGridProps {
  filters: OrderFilterState;
  onFilterChange: (newFilters: Partial<OrderFilterState>) => void;
}

export function OrderFilterGrid({ filters, onFilterChange }: OrderFilterGridProps) {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ search: e.target.value });
  };

  const clearFilters = () => {
    onFilterChange({ search: '', status: 'ALL', dateRange: 'ALL' });
  };

  const smartChips = ['ALL', 'OPENED', 'REVIEW', 'CANCELLED'];
  const hasActiveFilters = filters.search !== '' || filters.status !== 'ALL' || filters.dateRange !== 'ALL';

  return (
    <div className="flex flex-col space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input 
            type="text" 
            placeholder="Buscar por nome do produto ou número da OP..." 
            value={filters.search}
            onChange={handleSearchChange}
            className="w-full pl-10 p-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 rounded-lg focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50 focus:border-blue-400 dark:focus:border-blue-500 outline-none transition-colors" 
          />
        </div>
        
        <select 
          value={filters.status}
          onChange={(e) => onFilterChange({ status: e.target.value })}
          className="p-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50 focus:border-blue-400 dark:focus:border-blue-500 outline-none cursor-pointer transition-colors"
        >
          <option value="ALL">Status: Todos</option>
          <option value="OPENED">Aberto</option>
          <option value="REVIEW">Revisão</option>
          <option value="CANCELLED">Cancelado</option>
        </select>
        
        <select
          value={filters.dateRange}
          onChange={(e) => onFilterChange({ dateRange: e.target.value })}
          className="p-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50 focus:border-blue-400 dark:focus:border-blue-500 outline-none cursor-pointer transition-colors"
        >
          <option value="ALL">Data: Todas</option>
          <option value="TODAY">Hoje</option>
          <option value="LAST_7_DAYS">Últimos 7 dias</option>
          <option value="OLDER">Mais antigos</option>
        </select>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-gray-500 dark:text-gray-400 mr-2 font-medium">Filtros Rápidos:</span>
        {smartChips.map((chip) => {
          const isActive = filters.status === chip;
          return (
            <button
              key={chip}
              onClick={() => onFilterChange({ status: chip })}
              className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors border ${
                isActive 
                ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800/50' 
                : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700'
              }`}
            >
              {chip === 'ALL' ? 'Todos' : chip === 'OPENED' ? 'Abertos' : chip === 'REVIEW' ? 'Em Revisão' : 'Cancelados'}
            </button>
          );
        })}
        {hasActiveFilters && (
          <button 
            onClick={clearFilters}
            className="ml-auto text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium"
          >
            Limpar Filtros
          </button>
        )}
      </div>
    </div>
  );
}
