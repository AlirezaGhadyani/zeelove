import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { prisma } from '@/shared/infrastructure/database/prisma';
import { createAppContainer } from '@/shared/infrastructure/container/app-container';
import { IDENTITY_TOKENS } from '@/modules/identity-access/infrastructure/container/register-identity-access';

describe('Auth Flow Integration Test against PostgreSQL', () => {
  beforeAll(async () => {
    await prisma.session.deleteMany();
    await prisma.otpChallenge.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.session.deleteMany();
    await prisma.otpChallenge.deleteMany();
    await prisma.$disconnect();
  });

  it('runs request-otp, verify-otp, session creation, and logout against real DB', async () => {
    const container = createAppContainer();
    const requestOtp = container.resolve(IDENTITY_TOKENS.RequestOtpUseCase);
    const verifyOtp = container.resolve(IDENTITY_TOKENS.VerifyOtpUseCase);
    const getCurrentUser = container.resolve(IDENTITY_TOKENS.GetCurrentUserUseCase);
    const logout = container.resolve(IDENTITY_TOKENS.LogoutUseCase);

    const testMobile = '09120000000'; // Matches SEED_SUPER_ADMIN_MOBILE

    // 1. Request OTP
    const reqRes = await requestOtp.execute({ mobile: testMobile });
    expect(reqRes.isOk).toBe(true);
    if (!reqRes.isOk) return;

    expect(reqRes.value.devCode).toBeDefined();
    const code = reqRes.value.devCode!;

    // Verify OTP record in DB
    const dbChallenge = await prisma.otpChallenge.findFirst({
      where: { mobile: testMobile },
    });
    expect(dbChallenge).not.toBeNull();

    // 2. Verify OTP
    const verifyRes = await verifyOtp.execute({ mobile: testMobile, code });
    expect(verifyRes.isOk).toBe(true);
    if (!verifyRes.isOk) return;

    expect(verifyRes.value.user.role).toBe('SUPER_ADMIN');
    const token = verifyRes.value.sessionToken;

    // Verify user and session records in DB
    const dbUser = await prisma.user.findUnique({
      where: { mobile: testMobile },
    });
    expect(dbUser).not.toBeNull();
    expect(dbUser?.role).toBe('SUPER_ADMIN');

    const dbSession = await prisma.session.findFirst({
      where: { userId: dbUser!.id },
    });
    expect(dbSession).not.toBeNull();

    // 3. Get Current User via session token
    const curRes = await getCurrentUser.execute({ sessionToken: token });
    expect(curRes.isOk).toBe(true);
    if (!curRes.isOk) return;
    expect(curRes.value?.id).toBe(dbUser!.id);

    // 4. Logout
    const logoutRes = await logout.execute({ sessionToken: token });
    expect(logoutRes.isOk).toBe(true);

    const afterLogout = await prisma.session.findFirst({
      where: { userId: dbUser!.id },
    });
    expect(afterLogout).toBeNull();
  }, 20000);
});
