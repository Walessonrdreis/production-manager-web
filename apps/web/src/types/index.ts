export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'operator' | 'viewer';
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
