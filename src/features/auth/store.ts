import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, AuthState } from './types';

interface AuthActions {
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: {
        id: 'dev-user',
        name: 'Desenvolvedor (Acesso Liberado)',
        email: 'dev@prodmanager.com',
        role: 'admin'
      },
      token: 'dev-token-secret',
      isAuthenticated: true,
      setAuth: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: 'prod-manager-auth',
    }
  )
);
