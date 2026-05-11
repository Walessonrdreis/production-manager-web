import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Layers, 
  ShoppingCart, 
  CalendarRange, 
  LogOut,
  X,
  User,
  Users,
  Activity
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAuthStore } from '../../services/auth/authService';

const navItems = [
  { id: 'dashboard', label: 'Estatísticas', path: '/dashboard', icon: LayoutDashboard },
  { id: 'production-control', label: 'Controle de Produção', path: '/production-control', icon: Activity },
  { id: 'products', label: 'Produtos Omie', path: '/products', icon: Package },
  { id: 'stocks', label: 'Estoques', path: '/stocks', icon: Package },
  { id: 'collaborators', label: 'Colaboradores', path: '/collaborators', icon: Users },
  { id: 'sectors', label: 'Setores', path: '/sectors', icon: Layers },
  { id: 'orders', label: 'Ordens Pendentes', path: '/orders', icon: ShoppingCart },
  { id: 'planning', label: 'Gerador de Plano', path: '/planning', icon: CalendarRange },
  { id: 'goals', label: 'Metas', path: '/goals', icon: Activity },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export function Sidebar({ isOpen, onClose, onLogout }: SidebarProps) {
  const { user } = useAuthStore();

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
        isOpen ? "translate-x-0 w-64 shadow-xl" : "-translate-x-full w-64",
        "lg:sticky lg:translate-x-0 lg:w-[84px] lg:hover:w-64 lg:shadow-none"
      )}>
        <div className="flex flex-col h-full shrink-0 w-64">
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

          <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar pb-4 mt-2">
            {navItems.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                onClick={() => {
                  if (window.innerWidth < 1024) onClose();
                }}
                title={item.label}
                className={({ isActive }) => cn(
                  "flex items-center gap-4 px-3.5 py-3 rounded-xl transition-all duration-200 text-sm font-bold whitespace-nowrap",
                  isActive 
                    ? "bg-blue-600 text-white shadow-md shadow-blue-900/20" 
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                )}
              >
                <item.icon size={22} className="shrink-0" />
                <span className={cn(
                  "transition-opacity duration-300 flex-1",
                  "lg:opacity-0 lg:group-hover:opacity-100"
                )}>
                  {item.label}
                </span>
              </NavLink>
            ))}
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
