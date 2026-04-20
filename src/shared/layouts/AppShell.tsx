import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Layers, 
  ShoppingCart, 
  CalendarRange, 
  LogOut,
  Menu,
  X,
  User
} from 'lucide-react';
import { useAuthStore } from '../../features/auth/store';
import { cn } from '../lib/utils';
import { Button } from '../ui/Button';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { id: 'products', label: 'Produtos Omie', path: '/products', icon: Package },
  { id: 'my-products', label: 'Meus Produtos', path: '/my-products', icon: User },
  { id: 'sectors', label: 'Setores', path: '/sectors', icon: Layers },
  { id: 'orders', label: 'Ordens Pendentes', path: '/orders', icon: ShoppingCart },
  { id: 'planning', label: 'Gerador de Plano', path: '/planning', icon: CalendarRange },
];

export function AppShell() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden">
      {/* Sidebar - Sempre visível conforme solicitado */}
      <aside className="bg-slate-900 text-slate-300 w-64 flex-shrink-0 flex flex-col h-screen sticky top-0 z-50">
        <div className="flex flex-col h-full shrink-0">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                  <Layers className="text-white" size={20} />
                </div>
                <span className="font-bold text-lg text-white">ProdManager</span>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-4 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm font-medium",
                  isActive 
                    ? "bg-blue-600/10 text-blue-400" 
                    : "hover:bg-slate-800 hover:text-white"
                )}
              >
                <item.icon size={18} />
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-800">
            <div className="flex items-center gap-3 px-3 py-3 mb-2 rounded-lg bg-slate-800/50">
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white truncate">{user?.name || 'Usuário'}</p>
                <p className="text-[10px] text-slate-500 truncate">{user?.email || 'admin@admin.com'}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-colors text-xs font-medium text-left"
            >
              <LogOut size={16} />
              Sair do Sistema
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen">
        {/* Header - Sem o botão de Menu (hamburger) conforme solicitado */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sticky top-0 z-40 transition-all">
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <h1 className="font-semibold text-slate-900">Sistema de Gestão de Produção</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs font-medium text-slate-500">Unidade Matriz</span>
              <span className="text-[10px] text-emerald-600 font-bold uppercase">Online</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-8 bg-slate-50">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
