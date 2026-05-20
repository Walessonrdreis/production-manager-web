import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Layers, 
  ShoppingCart, 
  ClipboardList,
  CalendarRange, 
  LogOut,
  X,
  User,
  Users,
  Activity,
  ChevronDown,
  ChevronRight,
  PieChart,
  Factory,
  Box,
  ShieldCheck
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAuthStore } from '../../services/auth/authService';

const menuCategories = [
  {
    title: 'Visão Geral',
    icon: PieChart,
    items: [
      { id: 'dashboard', label: 'Estatísticas', path: '/dashboard', icon: LayoutDashboard },
      { id: 'goals', label: 'Metas', path: '/goals', icon: Activity },
    ]
  },
  {
    title: 'Produção',
    icon: Factory,
    items: [
      { id: 'production-control', label: 'Controle de Produção', path: '/production-control', icon: Activity },
      { id: 'orders', label: 'Pedidos', path: '/orders', icon: ShoppingCart },
      { id: 'production-orders', label: 'Ordens de Produção', path: '/production-orders', icon: ClipboardList },
      { id: 'planning', label: 'Gerador de Plano', path: '/planning', icon: CalendarRange },
    ]
  },
  {
    title: 'Inventário',
    icon: Box,
    items: [
      { id: 'stocks', label: 'Estoques', path: '/stocks', icon: Package },
      { id: 'products', label: 'Produtos Omie', path: '/products', icon: Package },
    ]
  },
  {
    title: 'Administração',
    icon: ShieldCheck,
    items: [
      { id: 'collaborators', label: 'Colaboradores', path: '/collaborators', icon: Users },
      { id: 'sectors', label: 'Setores', path: '/sectors', icon: Layers },
    ]
  }
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export function Sidebar({ isOpen, onClose, onLogout }: SidebarProps) {
  const { user } = useAuthStore();
  const location = useLocation();
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>(() => {
    const initialState: Record<string, boolean> = {
      'Visão Geral': false,
      'Produção': false,
      'Inventário': false,
      'Administração': false,
    };
    
    menuCategories.forEach(category => {
      if (category.items.some(item => location.pathname.startsWith(item.path))) {
        initialState[category.title] = true;
      }
    });
    
    return initialState;
  });

  const toggleCategory = (title: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[55] lg:hidden animate-in fade-in duration-200"
          onClick={onClose}
        />
      )}

      <aside className={cn(
        "group bg-slate-900 text-slate-300 flex-shrink-0 flex flex-col h-screen fixed inset-y-0 left-0 z-[60] transition-all duration-300 ease-in-out overflow-hidden border-r border-slate-800",
        isOpen ? "translate-x-0 w-72 shadow-xl" : "-translate-x-full w-72",
        "lg:sticky lg:translate-x-0 lg:w-[84px] lg:hover:w-72 lg:shadow-none"
      )}>
        <div className="flex flex-col h-full shrink-0 w-72">
          <div className="px-6 py-8 flex items-center justify-between">
            <div className="flex items-center gap-4 whitespace-nowrap">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shrink-0 shadow-sm">
                <Layers className="text-white" size={20} />
              </div>
              <span className={cn(
                "font-black text-xl text-white tracking-tight transition-opacity duration-300",
                "lg:opacity-0 lg:group-hover:opacity-100"
              )}>ProdManager</span>
            </div>
            <button 
              onClick={onClose}
              className="lg:hidden p-2 -mr-2 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar pb-4 mt-2">
            {menuCategories.map((category) => {
              const isExpanded = expandedCategories[category.title];
              
              return (
                <div key={category.title} className="flex flex-col space-y-1">
                  <button
                    onClick={() => toggleCategory(category.title)}
                    className={cn(
                      "w-full flex items-center gap-4 px-3.5 py-2.5 rounded-xl transition-colors duration-200 group/cat",
                      isExpanded ? "text-slate-200" : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-300"
                    )}
                    title={category.title}
                  >
                    <category.icon size={22} className="shrink-0 opacity-80" />
                    <div className={cn(
                      "flex flex-1 items-center justify-between transition-opacity duration-300",
                      "lg:opacity-0 lg:group-hover:opacity-100"
                    )}>
                      <span className="text-[13px] font-bold uppercase tracking-wider">
                        {category.title}
                      </span>
                      {isExpanded ? (
                        <ChevronDown size={16} className="text-slate-500" />
                      ) : (
                        <ChevronRight size={16} className="text-slate-500" />
                      )}
                    </div>
                  </button>

                  <div className={cn(
                    "grid transition-all ease-in-out",
                    isExpanded ? "duration-500 grid-rows-[1fr] mt-1" : "duration-1000 grid-rows-[0fr]",
                    "ml-[24px] border-l-2 border-slate-800/50",
                    "lg:ml-0 lg:border-transparent lg:group-hover:ml-[24px] lg:group-hover:border-slate-800/50"
                  )}>
                    <div className={cn(
                      "flex flex-col space-y-1 overflow-hidden",
                      "pl-3 lg:pl-0 lg:group-hover:pl-3"
                    )}>
                      {category.items.map((item) => (
                      <NavLink
                        key={item.id}
                        to={item.path}
                        onClick={() => {
                          if (window.innerWidth < 1024) onClose();
                          setExpandedCategories(prev => {
                            const newState: Record<string, boolean> = {};
                            menuCategories.forEach(c => {
                              newState[c.title] = c.title === category.title;
                            });
                            return newState;
                          });
                        }}
                        title={item.label}
                        className={({ isActive }) => cn(
                          "flex items-center gap-4 py-2.5 rounded-xl transition-all duration-200 text-sm font-bold whitespace-nowrap",
                          "px-3.5 lg:group-hover:px-3",
                          isActive 
                            ? "bg-blue-600 text-white shadow-md shadow-blue-900/20" 
                            : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                        )}
                      >
                        <item.icon size={20} className="shrink-0" />
                        <span className={cn(
                          "transition-opacity duration-300 flex-1 ml-1",
                          "lg:opacity-0 lg:group-hover:opacity-100"
                        )}>
                          {item.label}
                        </span>
                      </NavLink>
                    ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </nav>

          <div className="p-4 border-t border-slate-800">
            <div className="flex items-center gap-3 px-2 py-2 mb-3 rounded-xl bg-slate-800/50 whitespace-nowrap">
              <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-sm font-bold text-white shrink-0 shadow-sm border border-slate-600">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className={cn(
                "flex-1 min-w-0 transition-opacity duration-300",
                "lg:opacity-0 lg:group-hover:opacity-100"
              )}>
                <p className="text-sm font-bold text-white leading-tight truncate">{user?.name || 'Usuário'}</p>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5 truncate">{user?.email || 'admin@admin.com'}</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-4 px-3.5 py-3 rounded-xl hover:bg-rose-500/10 hover:text-rose-400 text-slate-400 transition-colors text-sm font-bold text-left whitespace-nowrap"
              title="Sair do Sistema"
            >
              <LogOut size={22} className="shrink-0" />
              <span className={cn(
                "transition-opacity duration-300",
                "lg:opacity-0 lg:group-hover:opacity-100"
              )}>
                Sair do Sistema
              </span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
