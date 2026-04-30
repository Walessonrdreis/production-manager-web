import axios from 'axios';
import { toast } from 'sonner';

const BASE_URL = '/api/proxy/';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token se necessário
apiClient.interceptors.request.use((config) => {
  try {
    const authData = localStorage.getItem('prod-manager-auth');
    if (authData) {
      const parsed = JSON.parse(authData);
      const token = parsed.state?.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch (e) {
    console.error('Erro ao recuperar token do localStorage', e);
  }
  return config;
});

// Interceptor para tratamento global de erros baseado em HTTP Status
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error?.response) {
      toast.error('Erro de Conexão', {
        description: 'Não foi possível conectar ao servidor. Verifique sua internet.'
      });
      return Promise.reject(error);
    }

    const { status } = error.response;

    const errorMessages: Record<number, { title: string, message: string }> = {
      400: { 
        title: 'Requisição Inválida', 
        message: 'Os dados enviados são inválidos. Verifique os campos.' 
      },
      401: { 
        title: 'Não Autorizado', 
        message: 'Sua sessão expirou. Por favor, faça login novamente.' 
      },
      403: { 
        title: 'Acesso Negado', 
        message: 'Você não tem permissão para realizar esta ação.' 
      },
      404: { 
        title: 'Não Encontrado', 
        message: 'O recurso solicitado não existe ou foi removido.' 
      },
      429: { 
        title: 'Limite Excedido', 
        message: 'Muitas requisições em pouco tempo. Tente novamente mais tarde.' 
      },
      500: { 
        title: 'Erro no Servidor', 
        message: 'Ocorreu um erro interno no servidor. Nossa equipe já foi notificada.' 
      },
      503: { 
        title: 'Serviço Indisponível', 
        message: 'O servidor está em manutenção. Tente novamente em instantes.' 
      }
    };

    const errorInfo = errorMessages[status] || { 
      title: `Erro ${status}`, 
      message: 'Ocorreu um erro inesperado na comunicação com a API.' 
    };

    toast.error(errorInfo.title, {
      description: errorInfo.message
    });

    if (status === 401) {
      localStorage.removeItem('prod-manager-auth');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);
