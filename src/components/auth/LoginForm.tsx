import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useAuthStore, authService } from '../../services/auth/authService';
import { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../ui/Toast';
import { LogIn, AlertCircle } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(4, 'A senha deve ter pelo menos 4 caracteres'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();
  const { addToast } = useToast();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setError(null);
      const response = await authService.login(data.email, data.password);
      
      setAuth(response.user, response.token);
      
      addToast({
        title: 'Sucesso',
        message: `Bem-vindo, ${response.user.name}!`,
        type: 'success'
      });
      
      navigate('/dashboard');
    } catch (err: any) {
      const message = err.message || 'Ocorreu um erro ao tentar entrar.';
      setError(message);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md"
    >
      <div className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
            <LogIn className="text-white" size={24} />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Acesse sua conta</h2>
          <p className="mt-2 text-sm text-slate-500">Insira suas credenciais para gerenciar a produção</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            label="E-mail de acesso"
            type="email"
            placeholder="seu@email.com"
            error={errors.email?.message}
            {...register('email')}
            autoComplete="email"
          />
          
          <Input
            label="Senha"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password')}
            autoComplete="current-password"
          />

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
            type="submit" 
            className="w-full h-11 text-sm font-semibold mt-4" 
            isLoading={isSubmitting}
            icon={<LogIn size={18} />}
          >
            Entrar no sistema
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-400">
            Esqueceu sua senha? Entre em contato com o suporte.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
