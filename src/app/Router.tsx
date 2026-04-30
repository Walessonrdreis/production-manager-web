import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/dashboard/HomePage';
import { CatalogPage } from '../pages/catalog/CatalogPage';
import { MyProductsPage } from '../pages/products/MyProductsPage';
import { SectorsPage } from '../pages/sectors/SectorsPage';
import { OrdersPage } from '../pages/orders/OrdersPage';
import { PlanningPage } from '../pages/planner/PlanningPage';
import { CustomersPage } from '../pages/customers/CustomersPage';
import { AuthGuard } from './AuthGuard';
import { AppLayout } from '../components/layout/AppLayout';

export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      <Route element={<AuthGuard><AppLayout /></AuthGuard>}>
        <Route path="/dashboard" element={<HomePage />} />
        <Route path="/products" element={<CatalogPage />} />
        <Route path="/my-products" element={<MyProductsPage />} />
        <Route path="/customers" element={<CustomersPage />} />
        <Route path="/sectors" element={<SectorsPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/planning" element={<PlanningPage />} />
        
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
