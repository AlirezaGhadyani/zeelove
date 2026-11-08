import type Redis from 'ioredis';
import type { CachePort } from '@/shared/ports/cache.port';
import { InMemoryCacheAdapter } from './in-memory-cache.adapter';

export class RedisCacheAdapter implements CachePort {
  private readonly fallback = new InMemoryCacheAdapter();

  constructor(
    private readonly redis: Redis,
    private readonly defaultPrefix = 'zeelove:cache:',
  ) {}

  private qualifyKey(key: string): string {
    return `${this.defaultPrefix}${key}`;
  }

  public async get<T>(key: string): Promise<T | null> {
    try {
      const raw = await this.redis.get(this.qualifyKey(key));
      if (!raw) {
        return null;
      }
      try {
        return JSON.parse(raw) as T;
      } catch {
        return raw as unknown as T;
      }
    } catch {
      return this.fallback.get<T>(key);
    }
  }

  public async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    try {
      const serialized = JSON.stringify(value);
      const qualified = this.qualifyKey(key);
      if (ttlSeconds && ttlSeconds > 0) {
        await this.redis.set(qualified, serialized, 'EX', ttlSeconds);
      } else {
        await this.redis.set(qualified, serialized);
      }
    } catch {
      await this.fallback.set(key, value, ttlSeconds);
    }
  }

  public async delete(key: string): Promise<void> {
    try {
      await this.redis.del(this.qualifyKey(key));
    } catch {
      await this.fallback.delete(key);
    }
  }

  public async clear(prefix?: string): Promise<void> {
    try {
      const searchPattern = prefix ? `${this.defaultPrefix}${prefix}*` : `${this.defaultPrefix}*`;
      const keys = await this.redis.keys(searchPattern);
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
    } catch {
      await this.fallback.clear(prefix);
    }
  }
}
