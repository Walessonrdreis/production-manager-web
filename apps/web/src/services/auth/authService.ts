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
  // Initialize listener
  onAuthStateChanged(auth, (firebaseUser) => {
    if (firebaseUser) {
      set({
        user: {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || 'Usuário',
          email: firebaseUser.email || '',
          role: 'admin' // default
        },
        token: 'firebase-token',
        isAuthenticated: true,
        isLoading: false
      });
    } else {
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  });

  return {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
    setAuth: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),
    setLoading: (loading) => set({ isLoading: loading }),
    logout: async () => {
      await signOut(auth);
      set({ user: null, token: null, isAuthenticated: false });
    },
    login: async () => {
      const result = await loginWithGoogle();
      if (!result.success) throw result.error;
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
