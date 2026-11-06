import { describe, it, expect } from 'vitest';
import { createHash } from 'node:crypto';
import { OtpChallenge } from '@/modules/identity-access/domain/otp-challenge.entity';
import { MobileNumber } from '@/modules/identity-access/domain/mobile-number.vo';

describe('OtpChallenge Entity', () => {
  const plainCode = '123456';
  const codeHash = createHash('sha256').update(plainCode).digest('hex');

  const makeChallenge = (overrides = {}) => {
    const now = new Date();
    return new OtpChallenge({
      id: 'chal-1',
      mobile: MobileNumber.create('09123456789'),
      codeHash,
      attempts: 0,
      maxAttempts: 5,
      expiresAt: new Date(now.getTime() + 120 * 1000),
      resendAllowedAt: new Date(now.getTime() + 60 * 1000),
      createdAt: now,
      ...overrides,
    });
  };

  it('verifies code with constant-time equality check', () => {
    const challenge = makeChallenge();
    expect(challenge.verify('123456')).toBe(true);
    expect(challenge.attempts).toBe(1);
  });

  it('rejects incorrect code and increments attempts', () => {
    const challenge = makeChallenge();
    expect(challenge.verify('000000')).toBe(false);
    expect(challenge.attempts).toBe(1);
  });

  it('locks challenge after 5 failed attempts', () => {
    const challenge = makeChallenge({ attempts: 4 });
    expect(challenge.isLocked()).toBe(false);

    expect(challenge.verify('999999')).toBe(false);
    expect(challenge.attempts).toBe(5);
    expect(challenge.isLocked()).toBe(true);

    // Any subsequent attempt must fail even if code is correct!
    expect(challenge.verify(plainCode)).toBe(false);
  });

  it('detects expiration properly', () => {
    const past = new Date(Date.now() - 5000);
    const expired = makeChallenge({ expiresAt: past });
    expect(expired.isExpired()).toBe(true);
    expect(expired.verify(plainCode)).toBe(false);
  });
});
