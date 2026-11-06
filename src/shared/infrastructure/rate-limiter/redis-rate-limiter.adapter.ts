import type Redis from 'ioredis';
import type { RateLimiterPort, RateLimitResult } from '@/shared/ports/rate-limiter.port';

export class RedisRateLimiter implements RateLimiterPort {
  constructor(
    private readonly redis: Redis,
    private readonly prefix = 'zeelove:ratelimit:',
  ) {}

  public async limit(
    key: string,
    maxRequests: number,
    windowSeconds: number,
  ): Promise<RateLimitResult> {
    const qualifiedKey = `${this.prefix}${key}`;
    const now = Date.now();
    const windowMs = windowSeconds * 1000;
    const clearBefore = now - windowMs;

    const pipeline = this.redis.pipeline();
    pipeline.zremrangebyscore(qualifiedKey, 0, clearBefore);
    pipeline.zcard(qualifiedKey);
    pipeline.expire(qualifiedKey, windowSeconds);

    const results = await pipeline.exec();
    const currentCount = (results?.[1]?.[1] as number) ?? 0;

    const allowed = currentCount < maxRequests;
    if (allowed) {
      await this.redis.zadd(qualifiedKey, now, `${now}-${Math.random()}`);
    }

    const remaining = Math.max(0, maxRequests - (allowed ? currentCount + 1 : currentCount));
    const resetAt = new Date(now + windowMs);

    return {
      allowed,
      remaining,
      limit: maxRequests,
      resetAt,
    };
  }

  public async reset(key: string): Promise<void> {
    await this.redis.del(`${this.prefix}${key}`);
  }
}
