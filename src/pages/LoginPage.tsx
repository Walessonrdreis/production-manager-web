import { LoginForm } from '../features/auth/components/LoginForm';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../features/auth/store';
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
          <Layers size={32} className="text-blue-500" />
          <h1 className="text-2xl font-bold tracking-tight">Production Management</h1>
        </div>
        
        <LoginForm />
        
        <p className="mt-8 text-slate-400 text-xs font-medium uppercase tracking-widest">
          Versão 1.2.0 • 2026
        </p>
      </div>
    </div>
  );
}
