import { useAuthStore } from '../../services/auth/authService';

export function useAuth() {
  const { user, token, isAuthenticated, logout, setAuth } = useAuthStore();
  
  return {
    user,
    token,
    isAuthenticated,
    logout,
    setAuth
  };
}
