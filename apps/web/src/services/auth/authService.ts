import { create } from 'zustand';
import { User, AuthState } from '../../types';
import { auth, loginWithGoogle } from '../../lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

interface AuthActions {
  setAuth: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => Promise<void>;
  login: () => Promise<void>;
}

type AuthStore = AuthState & AuthActions & { isLoading: boolean };

export const useAuthStore = create<AuthStore>((set) => {
  // Temporary bypass for auth
  setTimeout(() => {
    set({
      user: {
        id: 'mock-user-123',
        name: 'Usuário (Bypass)',
        email: 'mock@example.com',
        role: 'admin'
      },
      token: 'mock-token',
      isAuthenticated: true,
      isLoading: false
    });
  }, 100);

  return {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
    setAuth: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),
    setLoading: (loading) => set({ isLoading: loading }),
    logout: async () => {
      set({ user: null, token: null, isAuthenticated: false });
    },
    login: async () => {
      set({
        user: {
          id: 'mock-user-123',
          name: 'Usuário (Bypass)',
          email: 'mock@example.com',
          role: 'admin'
        },
        token: 'mock-token',
        isAuthenticated: true,
        isLoading: false
      });
    }
  };
});

export const authService = {
  getToken: () => useAuthStore.getState().token,
  getUser: () => useAuthStore.getState().user,
  isAuthenticated: () => useAuthStore.getState().isAuthenticated,
  logout: async () => {
    await useAuthStore.getState().logout();
  },
  login: async () => {
    await useAuthStore.getState().login();
  }
};
