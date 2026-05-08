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
  
  fail<T = any>(error: string | object | Error): Result<T> {
    const errorMsg = error instanceof Error ? error.message : typeof error === 'string' ? error : JSON.stringify(error);
    console.error('[Result.fail] Error:', errorMsg);
    if (error && typeof error === 'object' && 'stack' in error) {
      console.error('[Result.fail] Stack:', (error as Error).stack);
    }
    return { success: false, error: errorMsg };
  },

  /**
   * Atalho para retornos vazios de sucesso.
   */
  success(): Result<void> {
    return { success: true, data: undefined };
  }
};
