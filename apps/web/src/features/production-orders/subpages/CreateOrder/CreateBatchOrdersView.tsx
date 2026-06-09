import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQueryClient } from '@tanstack/react-query';
import { useOmieProducts } from '../../../../hooks/catalog/useOmieProducts';
import { productionOrdersApi } from '../../api/productionOrdersApi';
import { DevBadge } from '../../../../components/ui/DevBadge';

type ParsedOP = {
  id: string;
  originalText: string;
  productName: string;
  productId: string | null;
  batch: string;
  quantity: number;
  loss: number;
  createdAt: string;
  sector: string;
  status: 'pending' | 'creating' | 'success' | 'error';
  errorMessage?: string;
  matchScore: number;
};

export function CreateBatchOrdersView({ onSuccess }: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();
  const { data: products, isLoading: isProductsLoading } = useOmieProducts();
  
  const [pasteData, setPasteData] = useState('');
  const [parsedOps, setParsedOps] = useState<ParsedOP[]>([]);
  const [globalSector, setGlobalSector] = useState('tempering');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Progress states
  const [progressMode, setProgressMode] = useState(false);
  const [progressDetailsOpen, setProgressDetailsOpen] = useState(true);

  // Naive Levenshtein similarity for Smart Matching (Fuzzy text matcher)
  const calculateSimilarity = (str1: string, str2: string) => {
    const s1 = str1.toLowerCase().trim();
    const s2 = str2.toLowerCase().trim();
    if (s1 === s2) return 100;
    if (s1.includes(s2) || s2.includes(s1)) return 80;
    
    // Quick Jaccard based on words
    const w1 = s1.split(' ');
    const w2 = s2.split(' ');
    const intersection = w1.filter(x => w2.includes(x)).length;
    const union = new Set([...w1, ...w2]).size;
    return Math.round((intersection / union) * 100);
  };

  const findBestMatch = (productName: string) => {
    if (!products) return { id: null, score: 0 };
    
    let bestMatch = null;
    let maxScore = -1;
    
    for (const p of products) {
      const score = calculateSimilarity(productName, p.description);
      if (score > maxScore) {
        maxScore = score;
        bestMatch = p.id;
      }
    }
    
    // Only accept if score > 30%
    if (maxScore > 30) {
      return { id: bestMatch, score: maxScore };
    }
    return { id: null, score: 0 };
  };

  const handleParse = () => {
    if (!pasteData.trim()) return;
    
    // Assume Tab separated values: Produto, Lote, Qtde, Perda, Data Produção
    const lines = pasteData.split('\n').filter(l => l.trim().length > 0);
    
    const newOps: ParsedOP[] = lines.map((line, idx) => {
      // Divide by tabs
      const columns = line.split('\t');
      
      let col0 = (columns[0] || '').trim();
      let colQuantity = (columns[1] || '').trim();
      let colDate = (columns[2] || '').trim();

      // Handling the pattern -> "branco morango -254476-1 66B"
      // Remove trailing " 66B" or " 125B" completely to get "branco morango -254476-1"
      let col0Clean = col0.replace(/\s+\d+[a-zA-Z]*$/, '').trim(); 
      let productName = col0Clean;
      let batch = '';
      
      // Find the separator " -"
      const sepIndex = col0Clean.lastIndexOf(' -');
      if (sepIndex !== -1) {
          productName = col0Clean.substring(0, sepIndex).trim();
          batch = col0Clean.substring(sepIndex + 2).trim(); // keep "254476-1"
      }
      
      const quantity = parseInt(colQuantity) || 1;
      const loss = 0; // Not provided in new format
      
      let createdAt = new Date().toISOString().split('T')[0];
      const dateMatch = colDate.match(/(\d{2})\/(\d{2})\/(\d{4})/);
      if (dateMatch) {
          createdAt = `${dateMatch[3]}-${dateMatch[2]}-${dateMatch[1]}`;
      }
      
      const match = findBestMatch(productName);
      
      return {
        id: `op-draft-${idx}-${Date.now()}`,
        originalText: productName,
        productName: productName,
        productId: match.id,
        matchScore: match.score,
        batch: batch,
        quantity: quantity,
        loss: loss,
        createdAt: createdAt,
        sector: globalSector,
        status: 'pending'
      };
    });
    
    setParsedOps(newOps);
  };

  const handleCreateAll = async () => {
    if (parsedOps.length === 0) return;
    
    // Start Progress Mode
    setProgressMode(true);
    setIsProcessing(true);
    
    for (let i = 0; i < parsedOps.length; i++) {
        const op = parsedOps[i];
        if (op.status === 'success') continue; // Skip already created if trying again
        
        if (!op.productId) {
            setParsedOps(prev => prev.map(p => p.id === op.id ? { ...p, status: 'error', errorMessage: 'Produto não vinculado.' } : p));
            continue;
        }

        setParsedOps(prev => prev.map(p => p.id === op.id ? { ...p, status: 'creating' } : p));
        
        try {
            await productionOrdersApi.createOrder({
                items: [{ productId: op.productId, quantity: op.quantity }],
                notes: `Criado em lote (Staging). Produto original: ${op.originalText}`,
                batch: op.batch,
                sector: op.sector,
                expectedCompletionDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0], // Default 1 week
                createdAt: op.createdAt ? new Date(op.createdAt).toISOString() : undefined,
            });
            
            setParsedOps(prev => prev.map(p => p.id === op.id ? { ...p, status: 'success' } : p));
        } catch (error: any) {
             setParsedOps(prev => prev.map(p => p.id === op.id ? { ...p, status: 'error', errorMessage: error.message || 'Erro na integração.' } : p));
        }
    }
    
    queryClient.invalidateQueries({ queryKey: ['production-orders', 'opened'] });
    setIsProcessing(false);
  };

  const allSuccess = parsedOps.length > 0 && parsedOps.every(op => op.status === 'success');
  const countSuccess = parsedOps.filter(op => op.status === 'success').length;
  const countError = parsedOps.filter(op => op.status === 'error').length;

  return (
    <div className="space-y-6">
      {!progressMode ? (
         // STAGING AREA
        <div className="grid grid-cols-1 gap-6">
            <div className="bg-purple-50 dark:bg-purple-900/10 p-4 rounded-lg border border-purple-200 dark:border-purple-800/50">
                <h3 className="text-sm font-semibold text-purple-800 dark:text-purple-300 flex items-center mb-2">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Staging Area (Paste from Excel) 
                    <DevBadge id="ops.batch_staging" />
                </h3>
                <p className="text-xs text-purple-700 dark:text-purple-400 mb-4 whitespace-nowrap">
                   Copie e cole dados de uma planilha. Formato esperado (colunas): <br/>
                   <strong className="font-semibold">Produto -Lote | Quantidade | Data Produção</strong> (Ex: branco morango -254476-1 66B  66  06/01/2026 - 14:44:31)
                </p>
                <textarea 
                    className="w-full h-32 p-3 bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-800 rounded-md text-sm text-gray-800 dark:text-slate-200 placeholder-gray-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    placeholder="Cole aqui os dados do Excel (Ctrl+V)..."
                    value={pasteData}
                    onChange={(e) => setPasteData(e.target.value)}
                />
                <div className="mt-3 flex justify-end">
                    <button 
                        onClick={handleParse}
                        disabled={!pasteData.trim() || isProductsLoading}
                        className="px-4 py-2 bg-purple-600 outline-none text-white text-sm font-medium rounded-md hover:bg-purple-700 disabled:opacity-50 transition-colors"
                    >
                        Analisar Dados Colados
                    </button>
                </div>
            </div>

            {parsedOps.length > 0 && (
                <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg overflow-hidden">
                    <div className="p-4 border-b border-gray-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h4 className="font-semibold text-gray-800 dark:text-slate-100">Registros em Staging ({parsedOps.length})</h4>
                            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Verifique o mapeamento das OPs antes de enviar.</p>
                        </div>
                        <div className="flex items-center gap-3">
                             <div className="flex items-center gap-2">
                                <label className="text-xs font-medium text-emerald-900 dark:text-emerald-300">Setor Padrão <DevBadge domain="api2" /></label>
                                <select 
                                    className="p-1.5 text-xs bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded text-emerald-800 dark:text-emerald-200 outline-none"
                                    value={globalSector}
                                    onChange={(e) => {
                                        setGlobalSector(e.target.value);
                                        setParsedOps(prev => prev.map(p => ({ ...p, sector: e.target.value })));
                                    }}
                                >
                                    <option value="tempering">Temperagem / Preparação</option>
                                    <option value="manufacturing">Usinagem / Fabricação</option>
                                    <option value="packaging">Embalagem</option>
                                </select>
                             </div>
                        </div>
                    </div>
                    
                    <div className="overflow-x-auto hidden lg:block">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 dark:bg-slate-800/50 text-gray-500 dark:text-slate-400 text-xs uppercase font-semibold">
                                <tr>
                                    <th className="px-4 py-3">Produto Original</th>
                                    <th className="px-4 py-3">Produto Vinculado (Smart Match)</th>
                                    <th className="px-4 py-3">Lote</th>
                                    <th className="px-4 py-3">Qtde</th>
                                    <th className="px-4 py-3">Data</th>
                                    <th className="px-4 py-3">Ações / Ajuste</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-slate-800">
                                {parsedOps.map(op => (
                                    <tr key={op.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-4 py-3 font-medium text-gray-800 dark:text-slate-200">{op.originalText}</td>
                                        <td className="px-4 py-3">
                                            {op.productId ? (
                                                <div className="flex flex-col">
                                                    <span className="text-gray-900 dark:text-slate-100 truncate max-w-[200px]" title={products?.find(p => p.id === op.productId)?.description}>
                                                        {products?.find(p => p.id === op.productId)?.description}
                                                    </span>
                                                    <span className={`text-[10px] uppercase font-bold mt-0.5 ${op.matchScore >= 80 ? 'text-emerald-500' : 'text-amber-500'}`}>
                                                        {op.matchScore}% Similaridade
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-red-500 text-xs font-semibold">Não Encontrado. Cadastre ou vincule.</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-gray-600 dark:text-slate-400">
                                            <input 
                                                className="w-full bg-transparent border-b border-gray-300 dark:border-slate-700 outline-none focus:border-blue-500 dark:focus:border-blue-400"
                                                value={op.batch}
                                                onChange={(e) => setParsedOps(prev => prev.map(p => p.id === op.id ? { ...p, batch: e.target.value } : p))}
                                            />
                                        </td>
                                        <td className="px-4 py-3 text-gray-600 dark:text-slate-400">
                                            <input 
                                                type="number"
                                                className="w-16 bg-transparent border-b border-gray-300 dark:border-slate-700 outline-none focus:border-blue-500 dark:focus:border-blue-400"
                                                value={op.quantity}
                                                onChange={(e) => setParsedOps(prev => prev.map(p => p.id === op.id ? { ...p, quantity: parseInt(e.target.value) || 1 } : p))}
                                            />
                                        </td>
                                        <td className="px-4 py-3 text-gray-600 dark:text-slate-400">
                                            <input 
                                                type="date"
                                                className="w-full max-w-[130px] text-xs bg-transparent border-b border-gray-300 dark:border-slate-700 outline-none focus:border-blue-500 dark:focus:border-blue-400"
                                                value={op.createdAt}
                                                onChange={(e) => setParsedOps(prev => prev.map(p => p.id === op.id ? { ...p, createdAt: e.target.value } : p))}
                                            />
                                        </td>
                                        <td className="px-4 py-3">
                                            <select 
                                                className="w-full text-xs p-1.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded outline-none"
                                                value={op.productId || ''}
                                                onChange={(e) => setParsedOps(prev => prev.map(p => p.id === op.id ? { ...p, productId: e.target.value, matchScore: 100 } : p))}
                                            >
                                                <option value="" disabled>Selecionar vinculação manual...</option>
                                                {products?.map(p => (
                                                    <option key={p.id} value={p.id}>{p.description}</option>
                                                ))}
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile/Tablet Card Layout */}
                    <div className="lg:hidden flex flex-col divide-y divide-gray-200 dark:divide-slate-800">
                        {parsedOps.map(op => (
                            <div key={op.id} className="p-4 flex flex-col gap-3 hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors">
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase">Produto Original</span>
                                    <span className="font-medium text-gray-800 dark:text-slate-200">{op.originalText}</span>
                                </div>
                                
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase">Vinculação</span>
                                    {op.productId ? (
                                        <div className="flex flex-col">
                                            <span className="text-gray-900 dark:text-slate-100 text-sm">
                                                {products?.find(p => p.id === op.productId)?.description}
                                            </span>
                                            <span className={`text-[10px] uppercase font-bold mt-0.5 ${op.matchScore >= 80 ? 'text-emerald-500' : 'text-amber-500'}`}>
                                                {op.matchScore}% Similaridade
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="text-red-500 text-xs font-semibold">Não Encontrado. Cadastre ou vincule.</span>
                                    )}
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase">Lote</span>
                                        <input 
                                            className="w-full text-sm bg-transparent border-b border-gray-300 dark:border-slate-700 outline-none focus:border-blue-500 dark:focus:border-blue-400"
                                            value={op.batch}
                                            onChange={(e) => setParsedOps(prev => prev.map(p => p.id === op.id ? { ...p, batch: e.target.value } : p))}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase">Qtde</span>
                                        <input 
                                            type="number"
                                            className="w-full text-sm bg-transparent border-b border-gray-300 dark:border-slate-700 outline-none focus:border-blue-500 dark:focus:border-blue-400"
                                            value={op.quantity}
                                            onChange={(e) => setParsedOps(prev => prev.map(p => p.id === op.id ? { ...p, quantity: parseInt(e.target.value) || 1 } : p))}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase">Data</span>
                                        <input 
                                            type="date"
                                            className="w-full text-sm bg-transparent border-b border-gray-300 dark:border-slate-700 outline-none focus:border-blue-500 dark:focus:border-blue-400"
                                            value={op.createdAt}
                                            onChange={(e) => setParsedOps(prev => prev.map(p => p.id === op.id ? { ...p, createdAt: e.target.value } : p))}
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1 mt-1">
                                    <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase">Ajuste Manual de Produto</span>
                                    <select 
                                        className="w-full text-sm p-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded outline-none"
                                        value={op.productId || ''}
                                        onChange={(e) => setParsedOps(prev => prev.map(p => p.id === op.id ? { ...p, productId: e.target.value, matchScore: 100 } : p))}
                                    >
                                        <option value="" disabled>Selecionar vinculação manual...</option>
                                        {products?.map(p => (
                                            <option key={p.id} value={p.id}>{p.description}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-4 bg-gray-50 dark:bg-slate-800/50 flex justify-end gap-3 border-t border-gray-200 dark:border-slate-800">
                        <button 
                            className="px-6 py-2 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-200 font-medium rounded hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors"
                            onClick={() => setParsedOps([])}
                        >
                            Limpar
                        </button>
                        <button 
                            className="px-6 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition-colors shadow flex items-center"
                            onClick={handleCreateAll}
                            disabled={parsedOps.some(o => !o.productId)}
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            Confirmar & Criar Lote
                        </button>
                    </div>
                </div>
            )}
        </div>
      ) : (
         // PROGRESS BARS AREA
         <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-sm p-6 overflow-hidden">
             
             <div className="flex flex-col items-center justify-center py-6 mb-4">
                 {allSuccess ? (
                    <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </div>
                 ) : (
                    <div className="relative w-16 h-16 flex items-center justify-center mb-4">
                        <svg className="animate-spin absolute inset-0 text-gray-200 dark:text-slate-700" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-500 rounded-full flex items-center justify-center z-10">
                            {countSuccess} / {parsedOps.length}
                        </div>
                    </div>
                 )}
                 <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100">
                    {allSuccess ? 'Lote Concluído!' : 'Criando Lote de OPs...'}
                 </h2>
                 <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center max-w-sm">
                    {allSuccess 
                        ? 'Todas as ordens de produção foram criadas com sucesso e já estão na sua fila de trabalho.'
                        : 'Enviando solicitações de criação para o ERP. Por favor, aguarde.'}
                 </p>
                 
                 {(!isProcessing && countError > 0) && (
                     <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/50 rounded-lg text-sm text-red-700 dark:text-red-400 text-center flex items-center flex-col">
                        <span className="font-semibold block">{countError} OPs falharam na criação.</span>
                        <span className="opacity-80">Verifique a fila de detalhes abaixo para tentar novamente.</span>
                        <button onClick={handleCreateAll} className="mt-2 px-4 py-1.5 bg-red-600 text-white rounded text-xs font-semibold shadow outline-none hover:bg-red-700">Tentar Falhas Novamente</button>
                     </div>
                 )}

                 {allSuccess && onSuccess && (
                     <button onClick={onSuccess} className="mt-6 px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition shadow">
                         Ir para Fila de Trabalho
                     </button>
                 )}
                 {allSuccess && !onSuccess && (
                      <button onClick={() => { setProgressMode(false); setParsedOps([]); setPasteData(''); }} className="mt-6 px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition shadow">
                      Nova Importação
                    </button>
                 )}
             </div>

             <div className="border-t border-gray-100 dark:border-slate-800 pt-4">
                 <button 
                    className="flex justify-between items-center w-full focus:outline-none"
                    onClick={() => setProgressDetailsOpen(!progressDetailsOpen)}
                 >
                     <span className="font-semibold text-gray-700 dark:text-slate-300">Progresso Detalhado ({parsedOps.length})</span>
                     <svg className={`w-5 h-5 text-gray-400 transition-transform ${progressDetailsOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                 </button>
                 
                 <AnimatePresence>
                    {progressDetailsOpen && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                            <div className="mt-4 max-h-64 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                                {parsedOps.map(op => (
                                    <div key={op.id} className="p-3 border border-gray-100 dark:border-slate-800 rounded-lg flex items-center justify-between text-sm bg-gray-50 dark:bg-slate-800/30">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-gray-800 dark:text-slate-200">{op.originalText}</span>
                                            <span className="text-xs text-gray-500 dark:text-slate-400 truncate max-w-[200px]">Lote: {op.batch || 'S/L'} | Qtde: {op.quantity}</span>
                                        </div>
                                        <div>
                                            {op.status === 'pending' && <span className="px-2 py-1 bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-slate-400 text-xs rounded-full font-medium">Na Fila</span>}
                                            {op.status === 'creating' && <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs rounded-full font-medium flex items-center"><svg className="animate-spin w-3 h-3 mr-1" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Criando</span>}
                                            {op.status === 'success' && <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs rounded-full font-medium inline-flex items-center"><svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> OK</span>}
                                            {op.status === 'error' && (
                                                <div className="flex items-center gap-2">
                                                    <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs rounded-full font-medium inline-flex items-center" title={op.errorMessage}>
                                                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> 
                                                        Erro
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                 </AnimatePresence>
             </div>

         </motion.div>
      )}
    </div>
  );
}
