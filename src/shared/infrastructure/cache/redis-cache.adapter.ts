import type Redis from 'ioredis';
import type { CachePort } from '@/shared/ports/cache.port';

export class RedisCacheAdapter implements CachePort {
  constructor(
    private readonly redis: Redis,
    private readonly defaultPrefix = 'zeelove:cache:',
  ) {}

  private qualifyKey(key: string): string {
    return `${this.defaultPrefix}${key}`;
  }

  public async get<T>(key: string): Promise<T | null> {
    const raw = await this.redis.get(this.qualifyKey(key));
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw) as T;
    } catch {
      return raw as unknown as T;
    }
  }

  public async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    const serialized = JSON.stringify(value);
    const qualified = this.qualifyKey(key);
    if (ttlSeconds && ttlSeconds > 0) {
      await this.redis.set(qualified, serialized, 'EX', ttlSeconds);
    } else {
      await this.redis.set(qualified, serialized);
    }
  }

  public async delete(key: string): Promise<void> {
    await this.redis.del(this.qualifyKey(key));
  }

  public async clear(prefix?: string): Promise<void> {
    const searchPattern = prefix ? `${this.defaultPrefix}${prefix}*` : `${this.defaultPrefix}*`;
    const keys = await this.redis.keys(searchPattern);
    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
  }
}
