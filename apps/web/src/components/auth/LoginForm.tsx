import { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../ui/Toast';
import { LogIn, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuthStore } from '../../services/auth/authService';

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleLogin = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      await login();
      
      addToast({
        title: 'Sucesso',
        message: 'Login realizado com sucesso!',
        type: 'success'
      });
      
      navigate('/dashboard');
    } catch (err: any) {
      const message = err.message || 'Ocorreu um erro ao tentar entrar.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md"
    >
      <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 dark:border-slate-800">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
            <LogIn className="text-white" size={24} />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Acesse sua conta</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Faça login com sua conta do Google para gerenciar a produção</p>
        </div>

        <div className="space-y-5">
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="rounded-lg bg-red-50 border border-red-100 p-3 flex items-center gap-3 text-sm font-medium text-red-600"
            >
              <AlertCircle size={16} className="shrink-0" />
              {error}
            </motion.div>
          )}

          <Button 
            type="button" 
            onClick={handleLogin}
            className="w-full h-12 text-sm font-semibold mt-4 bg-slate-900 hover:bg-slate-800 text-white" 
            isLoading={isSubmitting}
          >
            Entrar com Google
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
