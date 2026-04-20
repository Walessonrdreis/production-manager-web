import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '../../pages/LoginPage';
import { DashboardPage } from '../../pages/DashboardPage';
import { ProductsPage } from '../../pages/ProductsPage';
import { SectorsPage } from '../../pages/SectorsPage';
import { OrdersPage } from '../../pages/OrdersPage';
import { PlanningPage } from '../../pages/PlanningPage';
import { AuthGuard } from '../../features/auth/components/AuthGuard';
import { AppShell } from '../../shared/layouts/AppShell';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      <Route element={<AuthGuard><AppShell /></AuthGuard>}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/my-products" element={<div className="p-8"><h1 className="text-2xl font-bold">Em breve: Meus Produtos</h1></div>} />
        <Route path="/sectors" element={<SectorsPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/planning" element={<PlanningPage />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
