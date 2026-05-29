import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/dashboard/HomePage';
import { CatalogPage } from '../pages/catalog/CatalogPage';
import { StocksPage } from '../pages/stocks/StocksPage';
import { SectorsPage } from '../pages/sectors/SectorsPage';
import { OrdersPage } from '../pages/orders/OrdersPage';
import { ProductionOrdersPage } from '../pages/orders/ProductionOrdersPage';
import { ProductionOrdersV2Page } from '../pages/orders/ProductionOrdersV2Page';
import { PlanningPage } from '../pages/planner/PlanningPage';
import { GoalsManagementPage } from '../features/goals/ui/GoalsManagementPage';
import { CollaboratorsPage } from '../features/collaborators/ui/CollaboratorsPage';
import { CustomersPage } from '../pages/customers/CustomersPage';
import { MonitoringPage } from '../pages/production/MonitoringPage';
import { AuthGuard } from './AuthGuard';
import { AppLayout } from '../components/layout/AppLayout';

export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      <Route element={<AuthGuard><AppLayout /></AuthGuard>}>
        <Route path="/dashboard" element={<HomePage />} />
        <Route path="/production-control" element={<MonitoringPage />} />
        <Route path="/products" element={<CatalogPage />} />
        <Route path="/stocks" element={<StocksPage />} />
        {/* <Route path="/customers" element={<CustomersPage />} /> */}
        <Route path="/sectors" element={<SectorsPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/production-orders" element={<ProductionOrdersPage />} />
        {/* Rota escondida para a nova feature isolada */}
        <Route path="/v2/production-orders" element={<ProductionOrdersV2Page />} />
        <Route path="/planning" element={<PlanningPage />} />
        <Route path="/goals" element={<GoalsManagementPage />} />
        <Route path="/collaborators" element={<CollaboratorsPage />} />
        
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
