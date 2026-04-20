import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../shared/ui/Button';
import { Input } from '../shared/ui/Input';
import { Card } from '../shared/ui/Card';
import { useAuthStore } from '../features/auth/store';
import { useState } from 'react';

const settingsSchema = z.object({
  name: z.string().min(3, 'Nome muito curto'),
  email: z.string().email('E-mail inválido'),
  currentPassword: z.string().min(6, 'Senha atual é obrigatória para alterações'),
  newPassword: z.string().min(6, 'Nova senha opcional').optional().or(z.literal('')),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export function SettingsPage() {
  const user = useAuthStore((state) => state.user);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      name: user?.name,
      email: user?.email,
    },
  });

  const onSubmit = async (data: SettingsFormValues) => {
    console.log('Update settings:', data);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="max-w-2xl">
      <Card title="Perfil do Usuário" description="Gerencie suas informações pessoais e credenciais de acesso.">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Input
              label="Nome Completo"
              error={errors.name?.message}
              {...register('name')}
            />
            <Input
              label="E-mail Corporativo"
              type="email"
              error={errors.email?.message}
              {...register('email')}
            />
          </div>

          <hr className="border-zinc-100" />

          <div className="space-y-6">
            <h4 className="text-sm font-semibold text-zinc-900">Alterar Senha</h4>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
               <Input
                label="Senha Atual"
                type="password"
                error={errors.currentPassword?.message}
                {...register('currentPassword')}
              />
               <Input
                label="Nova Senha"
                type="password"
                error={errors.newPassword?.message}
                {...register('newPassword')}
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 pt-4">
            {success && (
              <span className="text-sm font-medium text-emerald-600">Configurações salvas com sucesso!</span>
            )}
            <div className="flex gap-4 ml-auto">
              <Button type="button" variant="outline">Cancelar</Button>
              <Button type="submit" isLoading={isSubmitting}>Salvar Alterações</Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}
