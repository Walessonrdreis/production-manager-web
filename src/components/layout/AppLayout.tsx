import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { PageContainer } from './PageContainer';
import { useAuthStore } from '../../services/auth/authService';

export function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden relative">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={closeSidebar} 
        onLogout={handleLogout} 
      />

      <div className="flex-1 flex flex-col min-w-0 h-screen">
        <Topbar onToggleSidebar={toggleSidebar} title="Gestão de Produção" />
        <PageContainer>
          <Outlet />
        </PageContainer>
      </div>
    </div>
  );
}
