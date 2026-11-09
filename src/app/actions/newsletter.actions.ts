'use server';

import { appContainer } from '@/shared/infrastructure/container/app-container';
import { CONTENT_TOKENS } from '@/modules/content/infrastructure/container/register-content';

export async function subscribeNewsletterAction(identifier: string) {
  try {
    const useCase = appContainer.resolve(CONTENT_TOKENS.SubscribeNewsletterUseCase);
    const result = await useCase.execute({ identifier });

    if (result.isOk) {
      return { success: true, message: result.value.message };
    }
    return { success: false, message: result.error };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'خطای ناشناخته رخ داده است';
    return { success: false, message };
  }
}
