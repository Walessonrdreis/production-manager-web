import React, { useState } from 'react';
import { ProductionOrderV2 } from '../model/types';
import { OrderStatusBadge } from './OrderStatusBadge';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Package, Calendar, Beaker, Factory, CalendarClock, Edit2, Check, X, Trash2 } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { productionOrdersApi } from '../api/productionOrdersApi';

interface ProductionOrderCardProps {
  order: ProductionOrderV2;
  searchTerm?: string;
}

function highlightText(text: string, highlight?: string) {
  if (!highlight || highlight.trim() === '') return <>{text}</>;
  
  const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
  return (
    <>
      {parts.map((part, i) => 
        part.toLowerCase() === highlight.toLowerCase() ? (
          <span key={i} className="bg-yellow-200 text-yellow-900 rounded-sm px-0.5">{part}</span>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        )
      )}
    </>
  );
}

export function ProductionOrderCard({ order, searchTerm }: ProductionOrderCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [editBatch, setEditBatch] = useState(order.batch || '');
  const [editSector, setEditSector] = useState(order.sector || 'Temperagem');
  
  const queryClient = useQueryClient();

  const handleUpdate = async () => {
    try {
      await productionOrdersApi.updateOrder(order.id, {
        batch: editBatch,
        sector: editSector
      });
      queryClient.invalidateQueries({ queryKey: ['production-orders', 'opened'] });
      setIsEditing(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Deseja realmente excluir esta ordem de produção?")) return;
    setIsDeleting(true);
    try {
      await productionOrdersApi.deleteOrder(order.id);
      queryClient.invalidateQueries({ queryKey: ['production-orders', 'opened'] });
    } catch (e) {
      console.error(e);
      setIsDeleting(false);
    }
  };

  if (isDeleting) {
     return <div className="p-4 border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/10 rounded-lg animate-pulse text-red-600 dark:text-red-400">Excluindo OP #{order.id}...</div>;
  }

  return (
    <div className="border border-gray-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow group overflow-hidden">
      {/* Resumo da OP (Visão Fechada) */}
      <div 
        className="p-4 cursor-pointer flex flex-col md:grid md:grid-cols-[100px_minmax(0,1fr)_120px_100px_auto_auto] gap-4 md:items-center relative"
        onClick={() => {
            if (!isEditing) setIsOpen(!isOpen);
        }}
      >
        <div className="flex items-center gap-2">
            <span className="font-bold text-gray-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              #{highlightText(order.id, searchTerm)}
            </span>
        </div>

        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-900 dark:text-slate-100 line-clamp-1">
             {highlightText(order.item, searchTerm)}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
            <Factory className="w-3 h-3" /> 
            {isEditing ? (
                <select 
                   onClick={(e) => e.stopPropagation()}
                   value={editSector}
                   onChange={e => setEditSector(e.target.value)}
                   className="bg-transparent border-b border-gray-300 dark:border-slate-600 outline-none text-xs"
                >
                    <option value="Temperagem">Temperagem</option>
                    <option value="Usinagem">Usinagem</option>
                    <option value="Embalagem">Embalagem</option>
                </select>
            ) : (order.sector || 'Sem setor')}
          </span>
        </div>

        <div className="flex flex-col">
            <span className="text-xs text-gray-500 dark:text-slate-400">Lote</span>
            <span className="text-sm font-medium text-gray-700 dark:text-slate-300 line-clamp-1">
               {isEditing ? (
                   <input
                     autoFocus
                     onClick={(e) => e.stopPropagation()}
                     value={editBatch}
                     onChange={e => setEditBatch(e.target.value)}
                     className="w-full bg-transparent border-b border-gray-300 dark:border-slate-600 outline-none"
                   />
               ) : (order.batch || '-')}
            </span>
        </div>

        <div className="flex flex-col">
            <span className="text-xs text-gray-500 dark:text-slate-400">Quantidade</span>
            <span className="text-sm font-medium text-gray-700 dark:text-slate-300 flex items-center gap-1">
                <Package className="w-3.5 h-3.5 text-gray-400" /> {order.quantity}
            </span>
        </div>
        
        <div className="flex flex-col">
            <span className="text-xs text-gray-500 dark:text-slate-400">
                {order.expectedCompletionDate ? 'Previsão' : 'Criada em'}
            </span>
            <span className="text-sm font-medium text-gray-700 dark:text-slate-300 flex items-center gap-1">
                {order.expectedCompletionDate ? (
                   <CalendarClock className="w-3.5 h-3.5 text-blue-500" />
                ) : (
                   <Calendar className="w-3.5 h-3.5 text-gray-400" />
                )}
                {new Date(order.expectedCompletionDate || order.createdAt).toLocaleDateString()}
            </span>
        </div>

        <div className="flex items-center justify-between md:justify-end gap-2 mt-2 md:mt-0 pt-3 md:pt-0 border-t border-slate-100 md:border-none dark:border-slate-800">
            {isEditing ? (
                <div className="flex gap-1">
                    <button onClick={(e) => { e.stopPropagation(); handleUpdate(); }} className="p-1.5 bg-emerald-100 text-emerald-600 rounded hover:bg-emerald-200">
                        <Check className="w-4 h-4" />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); setIsEditing(false); setEditBatch(order.batch||''); setEditSector(order.sector||'');}} className="p-1.5 bg-gray-100 text-gray-600 rounded hover:bg-gray-200">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            ) : (
                <>
                    <OrderStatusBadge status={order.status} />
                    <div className="text-gray-400 group-hover:text-blue-500 bg-slate-50 dark:bg-slate-800 p-1.5 rounded-full transition-colors flex-shrink-0">
                        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                </>
            )}
        </div>
      </div>

      {/* Conteúdo Expandido */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-gray-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50"
          >
            <div className="p-4 md:p-6 flex flex-col space-y-6">
                {/* Estrutura / Consumo */}
                <div>
                   <h4 className="text-sm font-semibold text-gray-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                       <Beaker className="w-4 h-4 text-blue-500" /> Estrutura & Consumo de Estoque
                   </h4>
                   
                   {order.bom && order.bom.length > 0 ? (
                       <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-md overflow-hidden">
                           <div className="grid grid-cols-[minmax(0,1fr)_120px] border-b border-gray-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-2 text-xs font-semibold text-gray-500 dark:text-slate-400">
                               <span>Insumo</span>
                               <span className="text-right">Consumo Previsto</span>
                           </div>
                           <div className="divide-y divide-gray-100 dark:divide-slate-800/50">
                               {order.bom.map(item => (
                                   <div key={item.id} className="grid grid-cols-[minmax(0,1fr)_120px] p-2 items-center text-sm">
                                       <span className="text-gray-700 dark:text-slate-300 line-clamp-1 pr-2">{item.productName}</span>
                                       <span className="text-right font-medium text-gray-900 dark:text-slate-100">
                                            {item.quantity * order.quantity} {item.unit}
                                       </span>
                                   </div>
                               ))}
                           </div>
                       </div>
                   ) : (
                       <p className="text-sm text-gray-500 dark:text-slate-400 italic bg-white dark:bg-slate-800 p-3 rounded border border-gray-100 dark:border-slate-700">Esta OP não possui estrutura/consumo vinculada.</p>
                   )}
                </div>

                {/* Ações (futuras) */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-slate-800">
                    <button onClick={() => handleDelete()} className="text-sm px-4 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 font-medium rounded-md transition-colors border border-red-200 dark:border-red-500/30">
                        Excluir OP
                    </button>
                    <button onClick={() => setIsEditing(true)} className="text-sm px-4 py-2 bg-gray-50 hover:bg-gray-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 font-medium rounded-md transition-colors border border-gray-200 dark:border-slate-700">
                        Editar OP
                    </button>
                    <button className="text-sm px-4 py-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 font-medium rounded-md transition-colors border border-blue-200 dark:border-blue-500/30">
                        Detalhes Completos
                    </button>
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


