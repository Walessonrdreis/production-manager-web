import React, { useState } from 'react';
import { Target, Package, Users, LayoutGrid } from 'lucide-react';
import { ProductGoalsTab } from './components/ProductGoalsTab';
import { CollaboratorGoalsTab } from './components/CollaboratorGoalsTab';
import { SectorGoalsTab } from './components/SectorGoalsTab';

type MainTab = 'produtos' | 'colaboradores' | 'setores';

export function GoalsManagementPage() {
  const [mainTab, setMainTab] = useState<MainTab>('produtos');

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6" id="goals-page">
      <header className="mb-6">
        <h1 className="text-3xl flex items-center font-bold text-gray-900 dark:text-gray-100 gap-3">
          <Target className="w-8 h-8 text-indigo-600" />
          Metas e Objetivos
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Defina metas de produção por produto, colaborador ou setor para alimentar os indicadores de performance (Kpis).</p>
      </header>

      {/* Main Tabs */}
      <div className="flex space-x-1 p-1 bg-gray-100 rounded-xl mb-6 shadow-inner">
        <button
          onClick={() => setMainTab('produtos')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${mainTab === 'produtos' ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 hover:bg-gray-200/50'}`}
        >
          <Package className="w-4 h-4" />
          Por Produto
        </button>
        <button
          onClick={() => setMainTab('colaboradores')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${mainTab === 'colaboradores' ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 hover:bg-gray-200/50'}`}
        >
          <Users className="w-4 h-4" />
          Por Colaborador
        </button>
        <button
          onClick={() => setMainTab('setores')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${mainTab === 'setores' ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 hover:bg-gray-200/50'}`}
        >
          <LayoutGrid className="w-4 h-4" />
          Por Setor
        </button>
      </div>

      {mainTab === 'produtos' && <ProductGoalsTab />}
      {mainTab === 'colaboradores' && <CollaboratorGoalsTab />}
      {mainTab === 'setores' && <SectorGoalsTab />}
    </div>
  );
}
