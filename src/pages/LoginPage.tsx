import { LoginForm } from '../components/auth/LoginForm';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../services/auth/authService';
import { Layers } from 'lucide-react';

export function LoginPage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-slate-900 -skew-y-3 origin-top-left -translate-y-12" />
      
      <div className="relative z-10 w-full max-w-md flex flex-col items-center">
        <div className="flex items-center gap-3 mb-8 text-white">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Layers size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Production Management</h1>
        </div>
        
        <LoginForm />
        
        <p className="mt-8 text-slate-400 text-xs font-medium uppercase tracking-widest bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full border border-white/5">
          Versão 1.2.0 • 2026
        </p>
      </div>
    </div>
  );
}
