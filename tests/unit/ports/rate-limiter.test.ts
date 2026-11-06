import { describe, it, expect } from 'vitest';
import { InMemoryRateLimiter } from '@/shared/infrastructure/rate-limiter/in-memory-rate-limiter.adapter';

describe('InMemoryRateLimiter', () => {
  it('allows requests within limit and rejects when exceeded', async () => {
    const limiter = new InMemoryRateLimiter();
    const key = 'ip:127.0.0.1';

    const first = await limiter.limit(key, 2, 60);
    expect(first.allowed).toBe(true);
    expect(first.remaining).toBe(1);

    const second = await limiter.limit(key, 2, 60);
    expect(second.allowed).toBe(true);
    expect(second.remaining).toBe(0);

    const third = await limiter.limit(key, 2, 60);
    expect(third.allowed).toBe(false);
    expect(third.remaining).toBe(0);
  });

  it('resets rate limit for a key', async () => {
    const limiter = new InMemoryRateLimiter();
    const key = 'ip:192.168.1.1';

    await limiter.limit(key, 1, 60);
    const blocked = await limiter.limit(key, 1, 60);
    expect(blocked.allowed).toBe(false);

    await limiter.reset(key);
    const afterReset = await limiter.limit(key, 1, 60);
    expect(afterReset.allowed).toBe(true);
  });
});
