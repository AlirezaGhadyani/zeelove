import { describe, it, expect, vi } from 'vitest';
import { RequestOtpUseCase } from '@/modules/identity-access/application/use-cases/request-otp.use-case';
import { VerifyOtpUseCase } from '@/modules/identity-access/application/use-cases/verify-otp.use-case';
import { LogoutUseCase } from '@/modules/identity-access/application/use-cases/logout.use-case';
import { GetCurrentUserUseCase } from '@/modules/identity-access/application/use-cases/get-current-user.use-case';
import { SystemClock } from '@/shared/infrastructure/clock/system-clock';
import { InMemoryRateLimiter } from '@/shared/infrastructure/rate-limiter/in-memory-rate-limiter.adapter';
import type { OtpChallenge } from '@/modules/identity-access/domain/otp-challenge.entity';
import type { User } from '@/modules/identity-access/domain/user.entity';
import type { Session } from '@/modules/identity-access/domain/session.entity';
import type { MobileNumber } from '@/modules/identity-access/domain/mobile-number.vo';

describe('Auth Use Cases', () => {
  const clock = new SystemClock();
  const rateLimiter = new InMemoryRateLimiter();

  const challenges = new Map<string, OtpChallenge>();
  const users = new Map<string, User>();
  const sessions = new Map<string, Session>();

  const fakeChallengeRepo = {
    create: async (c: OtpChallenge) => {
      challenges.set(c.mobile.value, c);
    },
    findLatestByMobile: async (m: MobileNumber) => challenges.get(m.value) ?? null,
    update: async (c: OtpChallenge) => {
      challenges.set(c.mobile.value, c);
    },
    deleteByMobile: async (m: MobileNumber) => {
      challenges.delete(m.value);
    },
  };

  const fakeUserRepo = {
    findById: async (id: string) => Array.from(users.values()).find((u) => u.id === id) ?? null,
    findByMobile: async (m: MobileNumber) => users.get(m.value) ?? null,
    create: async (u: User) => {
      users.set(u.mobile.value, u);
    },
    save: async (u: User) => {
      users.set(u.mobile.value, u);
    },
    countSuperAdmins: async () =>
      Array.from(users.values()).filter((u) => u.role === 'SUPER_ADMIN').length,
    list: async () => ({ items: Array.from(users.values()), total: users.size }),
  };

  const fakeSessionRepo = {
    create: async (s: Session) => {
      sessions.set(s.tokenHash, s);
    },
    findByTokenHash: async (h: string) => sessions.get(h) ?? null,
    updateExpiry: async (id: string, exp: Date) => {
      const s = Array.from(sessions.values()).find((x) => x.id === id);
      if (s) s.slide(14 * 24 * 3600);
    },
    deleteByTokenHash: async (h: string) => {
      sessions.delete(h);
    },
    deleteById: async (id: string) => {
      for (const [k, v] of sessions.entries()) {
        if (v.id === id) sessions.delete(k);
      }
    },
    listByUserId: async (uid: string) =>
      Array.from(sessions.values()).filter((s) => s.userId === uid),
    deleteAllByUserId: async () => {},
  };

  const fakeOtpSender = { send: vi.fn(async () => {}) };

  it('runs complete OTP authentication lifecycle', async () => {
    const requestUseCase = new RequestOtpUseCase(
      fakeChallengeRepo,
      fakeOtpSender,
      rateLimiter,
      clock,
      true, // devMode
    );

    const reqResult = await requestUseCase.execute({ mobile: '09120000000' });
    expect(reqResult.isOk).toBe(true);
    if (!reqResult.isOk) return;

    expect(reqResult.value.devCode).toBeDefined();
    const code = reqResult.value.devCode!;

    const verifyUseCase = new VerifyOtpUseCase(
      fakeUserRepo,
      fakeSessionRepo,
      fakeChallengeRepo,
      clock,
      '09120000000',
    );

    const verifyResult = await verifyUseCase.execute({
      mobile: '09120000000',
      code,
    });
    expect(verifyResult.isOk).toBe(true);
    if (!verifyResult.isOk) return;

    expect(verifyResult.value.user.role).toBe('SUPER_ADMIN');
    expect(verifyResult.value.sessionToken).toBeDefined();

    const getCurrentUser = new GetCurrentUserUseCase(fakeSessionRepo, fakeUserRepo, clock);
    const cur = await getCurrentUser.execute({
      sessionToken: verifyResult.value.sessionToken,
    });
    expect(cur.isOk).toBe(true);
    if (!cur.isOk) return;
    expect(cur.value?.role).toBe('SUPER_ADMIN');

    const logout = new LogoutUseCase(fakeSessionRepo);
    await logout.execute({ sessionToken: verifyResult.value.sessionToken });

    const afterLogout = await getCurrentUser.execute({
      sessionToken: verifyResult.value.sessionToken,
    });
    expect(afterLogout.isOk).toBe(true);
    if (!afterLogout.isOk) return;
    expect(afterLogout.value).toBeNull();
  });
});
