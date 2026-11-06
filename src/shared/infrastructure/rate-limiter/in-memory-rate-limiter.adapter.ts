import type { RateLimiterPort, RateLimitResult } from '@/shared/ports/rate-limiter.port';

interface Bucket {
  tokens: number[];
}

export class InMemoryRateLimiter implements RateLimiterPort {
  private readonly store = new Map<string, Bucket>();

  public async limit(
    key: string,
    maxRequests: number,
    windowSeconds: number,
  ): Promise<RateLimitResult> {
    const now = Date.now();
    const windowMs = windowSeconds * 1000;
    const cutoff = now - windowMs;

    let bucket = this.store.get(key);
    if (!bucket) {
      bucket = { tokens: [] };
      this.store.set(key, bucket);
    }

    bucket.tokens = bucket.tokens.filter((timestamp) => timestamp > cutoff);

    const allowed = bucket.tokens.length < maxRequests;
    if (allowed) {
      bucket.tokens.push(now);
    }

    const remaining = Math.max(0, maxRequests - bucket.tokens.length);
    const oldestToken = bucket.tokens[0] ?? now;
    const resetAt = new Date(oldestToken + windowMs);

    return {
      allowed,
      remaining,
      limit: maxRequests,
      resetAt,
    };
  }

  public async reset(key: string): Promise<void> {
    this.store.delete(key);
  }
}
