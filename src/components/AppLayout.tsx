import React from 'react';
import { Sidebar, LayoutDashboard, Settings, LogOut, Package, LayoutPanelLeft, ClipboardList, Calendar } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '../shared/lib/utils';
import { Button } from '../shared/ui/Button';
import { useAuthStore } from '../features/auth/store';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
  { icon: Package, label: 'Produtos', href: '/products' },
  { icon: LayoutPanelLeft, label: 'Setores', href: '/sectors' },
  { icon: ClipboardList, label: 'Ordens', href: '/orders' },
  { icon: Calendar, label: 'Planejamento', href: '/planning' },
  { icon: Settings, label: 'Configurações', href: '/settings' },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-200 bg-slate-950 p-6 flex flex-col">
        <div className="flex items-center gap-2 px-2 mb-8">
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
            M
          </div>
          <span className="text-xl font-bold tracking-tight text-white">MeuApp</span>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-blue-600/10 text-white border-l-4 border-blue-600 -ml-1 pl-4" 
                    : "text-slate-400 hover:bg-slate-900 hover:text-white"
                )}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-slate-800 pt-4">
          <div className="flex items-center gap-3 px-3 py-2 mb-4">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold uppercase">
              {user?.name.substring(0, 2)}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-white">{user?.name}</span>
              <span className="text-[10px] text-slate-400 truncate max-w-[120px]">{user?.email}</span>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full justify-start text-slate-400 hover:text-red-400 hover:bg-red-900/20"
            onClick={handleLogout}
          >
            <LogOut size={16} className="mr-2" />
            Sair
          </Button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-8">
          <h1 className="text-lg font-semibold text-slate-900">
            {navItems.find(i => i.href === location.pathname)?.label || 'Visão Geral'}
          </h1>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">Download PDF</Button>
            <Button size="sm">+ Nova Transação</Button>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
