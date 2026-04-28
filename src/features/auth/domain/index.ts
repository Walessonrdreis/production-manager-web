export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'operator' | 'viewer';
}

export interface AuthSession {
  user: AuthUser;
  token: string;
}
