import { AuthAdapter } from '../../infrastructure/integrations/auth.adapter.js';

export class LoginUseCase {
  static async execute(data: any) {
    const result = await AuthAdapter.login(data);
    return { data: result };
  }
}
