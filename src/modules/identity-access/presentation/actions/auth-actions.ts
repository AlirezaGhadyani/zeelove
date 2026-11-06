'use server';

import { createAppContainer } from '@/shared/infrastructure/container/app-container';
import { IDENTITY_TOKENS } from '../../infrastructure/container/register-identity-access';
import {
  getSessionToken,
  setSessionCookie,
  clearSessionCookie,
} from '../../infrastructure/http/session-cookie';

const container = createAppContainer();

export async function requestOtpAction(mobile: string) {
  const useCase = container.resolve(IDENTITY_TOKENS.RequestOtpUseCase);
  const result = await useCase.execute({ mobile });

  if (result.isErr) {
    return { ok: false, error: result.error.message };
  }

  return {
    ok: true,
    resendInSeconds: result.value.resendInSeconds,
    devCode: result.value.devCode,
  };
}

export async function verifyOtpAction(mobile: string, code: string) {
  const useCase = container.resolve(IDENTITY_TOKENS.VerifyOtpUseCase);
  const result = await useCase.execute({ mobile, code });

  if (result.isErr) {
    return { ok: false, error: result.error.message };
  }

  await setSessionCookie(result.value.sessionToken, result.value.expiresAt);

  return {
    ok: true,
    user: {
      id: result.value.user.id,
      mobile: result.value.user.mobile.value,
      role: result.value.user.role,
      name: result.value.user.name,
    },
  };
}

export async function logoutAction() {
  const token = await getSessionToken();
  if (token) {
    const useCase = container.resolve(IDENTITY_TOKENS.LogoutUseCase);
    await useCase.execute({ sessionToken: token });
  }
  await clearSessionCookie();
  return { ok: true };
}

export async function getCurrentUserAction() {
  const token = await getSessionToken();
  if (!token) return null;

  const useCase = container.resolve(IDENTITY_TOKENS.GetCurrentUserUseCase);
  const result = await useCase.execute({ sessionToken: token });

  if (result.isOk && result.value) {
    const u = result.value;
    return {
      id: u.id,
      mobile: u.mobile.value,
      role: u.role,
      name: u.name,
    };
  }
  return null;
}
