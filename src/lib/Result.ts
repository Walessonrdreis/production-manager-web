/**
 * Padrão Result para retornos de UseCases e Serviços.
 * Garante que erros de negócio sejam tratados como dados, não exceções.
 */
export type Result<T = void> = 
  | { success: true; data: T; error?: never }
  | { success: false; data?: never; error: string };

export const Result = {
  ok<T>(data: T): Result<T> {
    return { success: true, data };
  },
  
  fail<T = any>(error: string): Result<T> {
    return { success: false, error };
  },

  /**
   * Atalho para retornos vazios de sucesso.
   */
  success(): Result<void> {
    return { success: true, data: undefined };
  }
};
