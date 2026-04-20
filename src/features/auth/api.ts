import { apiClient } from '../../shared/api/client';
import { ENDPOINTS } from '../../shared/api/endpoints';
import { AuthResponse } from './types';

export const AuthService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    // Note: The apiClient will automatically route through the proxy if configured
    const { data } = await apiClient.post<AuthResponse>(ENDPOINTS.AUTH.LOGIN, { email, password });
    return data;
  }
};
