import { AuthSession } from '../domain';

/**
 * UseCase: Realiza a autenticação do usuário
 * @param email E-mail do usuário
 * @param password Senha do usuário
 */
export async function login(email: string, password: string): Promise<AuthSession> {
  // Simulação de login - Futuramente integrará com o repositório ou API
  await new Promise((resolve) => setTimeout(resolve, 800));
  
  if (password === 'admin' || password === 'prodmanager') {
    return {
      user: {
        id: 'dev-user',
        name: 'Desenvolvedor (Acesso Liberado)',
        email: email,
        role: 'admin'
      },
      token: 'dev-token-' + Math.random().toString(36).substring(7)
    };
  }
  
  throw new Error('E-mail ou senha inválidos.');
}
